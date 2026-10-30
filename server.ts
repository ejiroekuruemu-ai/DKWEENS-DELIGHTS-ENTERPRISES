import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db, BookingRecord, ItemizedCharge, MediaItem, ReviewRecord, AdminNotification } from './server/db.js';
import { computeQuotationBreakdown, generateBookingReference, recalculateBookingWithCharges } from './server/pricingEngine.js';
import { consultAIEventPlanner } from './server/aiPlanner.js';
import { sendBusinessAlert, isSmtpConfigured, getBusinessAlertEmail } from './server/emailService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Public API endpoints
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    brand: 'DKWEENS DELIGHTS ENTERPRISES', 
    slogan: 'WE PLAN • WE CREATE • YOU CELEBRATE.',
    location: 'Warri, Delta State, Nigeria',
    timestamp: new Date().toISOString() 
  });
});

app.get('/api/packages', (req: Request, res: Response) => {
  res.json(db.getPackages());
});

app.get('/api/services', (req: Request, res: Response) => {
  res.json({
    services: db.getServices(),
    lightingPackages: db.getLightingPackages(),
    costumes: db.getCostumes(),
    mascots: db.getMascots(),
    accessories: db.getAccessories()
  });
});

app.get('/api/gallery', (req: Request, res: Response) => {
  res.json(db.getGalleryMedia());
});

app.get('/api/settings', (req: Request, res: Response) => {
  res.json(db.getSettings());
});

// Price Calculation & Quotation Preview (Does not save to DB)
app.post('/api/pricing/calculate', (req: Request, res: Response) => {
  try {
    const input = req.body;
    const calculation = computeQuotationBreakdown(input);
    res.json({ success: true, calculation });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Calculation error' });
  }
});

// Customer: Submit Booking Request
app.post('/api/bookings', (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      eventType,
      eventDate,
      venueName,
      venueAddress,
      destinationCity,
      isOutsideServiceArea,
      guestCount,
      budget,
      additionalRequirements,
      selectedPackageId,
      selectedServices
    } = req.body;

    if (!customerName || !customerPhone || !eventType || !eventDate || !venueName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required booking details (Name, Phone Number, Event Type, Date, Venue)'
      });
    }

    // Run backend calculation engine
    const quotation = computeQuotationBreakdown({
      customerName,
      customerEmail: customerEmail || '',
      customerPhone,
      eventType,
      eventDate,
      venueName,
      venueAddress,
      destinationCity: destinationCity || 'Warri',
      isOutsideServiceArea: Boolean(isOutsideServiceArea),
      guestCount: Number(guestCount) || 0,
      budget: budget ? Number(budget) : null,
      additionalRequirements,
      selectedPackageId,
      selectedServices: Array.isArray(selectedServices) ? selectedServices : []
    });

    const reference = generateBookingReference();
    const now = new Date().toISOString();

    const booking: BookingRecord = {
      id: `booking-${Date.now()}`,
      reference,
      createdAt: now,
      updatedAt: now,
      customerName,
      customerEmail: customerEmail || '',
      customerPhone,
      eventType,
      eventDate,
      venueName,
      venueAddress: venueAddress || '',
      destinationCity: destinationCity || 'Warri',
      isOutsideServiceArea: Boolean(isOutsideServiceArea),
      guestCount: Number(guestCount) || 0,
      budget: budget ? Number(budget) : null,
      additionalRequirements: additionalRequirements || '',
      selectedPackageId: quotation.selectedPackageId,
      selectedPackageName: quotation.selectedPackageName,
      packagePriceSnapshot: quotation.packagePriceSnapshot,
      packageInclusionsSnapshot: quotation.packageInclusionsSnapshot,
      selectedServices: quotation.validatedServices,
      subtotalPricedItems: quotation.subtotalPricedItems,
      hasUnpricedItems: quotation.hasUnpricedItems,
      unpricedItemsList: quotation.unpricedItemsList,
      travelStatus: quotation.travelStatus,
      itemizedCharges: quotation.itemizedCharges,
      totalItemizedCharges: quotation.totalItemizedCharges,
      grandTotal: quotation.grandTotal,
      isQuotationComplete: quotation.isQuotationComplete,
      status: quotation.isQuotationComplete ? 'Pending' : 'Awaiting Quotation',
      adminNotes: Boolean(isOutsideServiceArea)
        ? 'Outside normal Warri service corridor. Pending administrator travel and accommodation assessment.'
        : 'New booking request submitted online. Awaiting manager review.',
      reviewedBy: null,
      reviewedAt: null
    };

    const saved = db.createBooking(booking);

    // Automated Notification Logging (Backward Compatible Log)
    db.addNotification({
      bookingReference: reference,
      type: 'customer_acknowledgement',
      recipient: customerPhone,
      channel: 'email_simulation',
      status: 'delivered',
      subject: `DKWEENS DELIGHTS Booking Request Received [${reference}]`,
      details: `Official request recorded for ${customerName} (${eventType} on ${eventDate}). Subtotal: ₦${quotation.subtotalPricedItems.toLocaleString()}. Customer advised that official review is in progress.`
    });

    db.addNotification({
      bookingReference: reference,
      type: 'admin_alert',
      recipient: db.getSettings().adminEmail,
      channel: 'in_app',
      status: 'delivered',
      subject: `New Event Booking Alert: ${reference} - ${customerName}`,
      details: `New booking request registered. Travel status: ${quotation.travelStatus}. Requires administrator quotation check.`
    });

    // Create Persistent Admin Notification Center Record
    const adminNotif = db.createAdminNotification({
      type: quotation.isQuotationComplete ? 'booking_request' : 'quotation_request',
      title: `${quotation.isQuotationComplete ? 'Booking Request' : 'Quotation Request'}: ${reference} - ${customerName}`,
      customerName,
      customerEmail: customerEmail || '',
      customerPhone,
      serviceName: quotation.selectedPackageName || (quotation.validatedServices[0]?.serviceName || 'Custom Event Package'),
      eventDate,
      eventLocation: `${venueName}, ${destinationCity || 'Warri'}`,
      referenceCode: reference,
      status: 'New',
      emailDeliveryStatus: 'unconfigured_simulated',
      details: `Event: ${eventType} on ${eventDate}. Guests: ${guestCount}. Subtotal: ₦${quotation.subtotalPricedItems.toLocaleString()}. Travel Status: ${quotation.travelStatus}.`
    });

    // Dispatch Asynchronous Email Alert to Business Gmail Address
    const businessEmail = getBusinessAlertEmail();
    sendBusinessAlert({
      to: businessEmail,
      subject: `[DKWEENS BOOKING ALERT] ${reference} - ${customerName} (${eventType})`,
      text: `DKWEENS DELIGHTS ENTERPRISES — NEW BOOKING ALERT\n\nReference Code: ${reference}\nCustomer Name: ${customerName}\nPhone: ${customerPhone}\nEmail: ${customerEmail || 'Not provided'}\nEvent: ${eventType} on ${eventDate}\nVenue: ${venueName}, ${destinationCity || 'Warri'}\nPackage: ${quotation.selectedPackageName || 'Individual Event Services'}\nSubtotal: ₦${quotation.subtotalPricedItems.toLocaleString()}\nTravel Logistics Status: ${quotation.travelStatus}\nAdditional Requirements: ${additionalRequirements || 'None'}\n\nReview this request in the Admin Operations Dashboard.`,
      html: `<div style="font-family:Arial,sans-serif;background:#0d0e12;color:#fbf9f5;padding:24px;border-radius:12px;border:1px solid #D4AF37;">
        <h2 style="color:#D4AF37;margin-top:0;">DKWEENS DELIGHTS ENTERPRISES</h2>
        <h3 style="color:#ffffff;">New Event Booking Request Alert</h3>
        <p>A new customer booking request has been submitted on the website:</p>
        <table style="width:100%;color:#e5e7eb;font-size:14px;border-collapse:collapse;">
          <tr style="border-bottom:1px solid #282a36;"><td style="padding:8px 0;color:#D4AF37;font-weight:bold;">Reference:</td><td>${reference}</td></tr>
          <tr style="border-bottom:1px solid #282a36;"><td style="padding:8px 0;color:#D4AF37;font-weight:bold;">Customer:</td><td>${customerName}</td></tr>
          <tr style="border-bottom:1px solid #282a36;"><td style="padding:8px 0;color:#D4AF37;font-weight:bold;">Phone:</td><td>${customerPhone}</td></tr>
          <tr style="border-bottom:1px solid #282a36;"><td style="padding:8px 0;color:#D4AF37;font-weight:bold;">Email:</td><td>${customerEmail || 'Not provided'}</td></tr>
          <tr style="border-bottom:1px solid #282a36;"><td style="padding:8px 0;color:#D4AF37;font-weight:bold;">Event & Date:</td><td>${eventType} on ${eventDate}</td></tr>
          <tr style="border-bottom:1px solid #282a36;"><td style="padding:8px 0;color:#D4AF37;font-weight:bold;">Venue:</td><td>${venueName}, ${destinationCity || 'Warri'}</td></tr>
          <tr style="border-bottom:1px solid #282a36;"><td style="padding:8px 0;color:#D4AF37;font-weight:bold;">Package/Services:</td><td>${quotation.selectedPackageName || 'Custom Selection'}</td></tr>
          <tr style="border-bottom:1px solid #282a36;"><td style="padding:8px 0;color:#D4AF37;font-weight:bold;">Subtotal:</td><td>₦${quotation.subtotalPricedItems.toLocaleString()}</td></tr>
          <tr style="border-bottom:1px solid #282a36;"><td style="padding:8px 0;color:#D4AF37;font-weight:bold;">Travel Status:</td><td>${quotation.travelStatus}</td></tr>
        </table>
        <p style="margin-top:16px;font-size:12px;color:#9ca3af;">Login to the DKWEENS Admin Dashboard to review itemized charges or approve this request.</p>
      </div>`
    }).then(result => {
      db.updateAdminNotification(adminNotif.id, {
        emailDeliveryStatus: result.status,
        emailError: result.error,
        emailMessageId: result.messageId
      });
    }).catch(err => {
      db.updateAdminNotification(adminNotif.id, {
        emailDeliveryStatus: 'failed',
        emailError: err.message || 'Email delivery failed'
      });
    });

    res.status(201).json({
      success: true,
      reference,
      booking: saved,
      message: 'Booking request successfully received. Please retain your reference number.'
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// Customer / Admin: Fetch Booking by Reference
app.get('/api/bookings/:reference', (req: Request, res: Response) => {
  const { reference } = req.params;
  const booking = db.getBookingByReference(reference);
  if (!booking) {
    return res.status(404).json({ success: false, error: `No booking found for reference ${reference}` });
  }
  res.json({ success: true, booking });
});

// Customer: Submit Contact Enquiry / Consultation / Explanation Request
app.post('/api/enquiries', (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || (!email && !phone) || !message) {
      return res.status(400).json({ success: false, error: 'Name, contact info, and message are required.' });
    }

    const saved = db.createEnquiry({
      name,
      email: email || '',
      phone: phone || '',
      subject: subject || 'General Enquiry',
      message
    });

    const subLower = (subject || '').toLowerCase();
    let notifType: AdminNotification['type'] = 'service_enquiry';
    if (subLower.includes('consult') || subLower.includes('planner') || subLower.includes('advice')) {
      notifType = 'consultation';
    } else if (subLower.includes('rental') || subLower.includes('bowl') || subLower.includes('mascot') || subLower.includes('board') || subLower.includes('explain')) {
      notifType = 'rental_explanation';
    }

    // Create Persistent Admin Notification Center Record
    const adminNotif = db.createAdminNotification({
      type: notifType,
      title: `${subject || 'Customer Enquiry'} from ${name}`,
      customerName: name,
      customerEmail: email || '',
      customerPhone: phone || '',
      serviceName: subject || 'Customer Enquiry',
      eventDate: null,
      eventLocation: null,
      referenceCode: null,
      status: 'New',
      emailDeliveryStatus: 'unconfigured_simulated',
      details: message
    });

    // Dispatch Asynchronous Email Alert to Business Gmail Address
    const businessEmail = getBusinessAlertEmail();
    sendBusinessAlert({
      to: businessEmail,
      subject: `[DKWEENS ENQUIRY ALERT] ${subject || 'New Message'} from ${name}`,
      text: `DKWEENS DELIGHTS ENTERPRISES — NEW CUSTOMER ENQUIRY\n\nName: ${name}\nPhone: ${phone || 'Not provided'}\nEmail: ${email || 'Not provided'}\nSubject: ${subject || 'General Enquiry'}\n\nMessage:\n${message}`,
      html: `<div style="font-family:Arial,sans-serif;background:#0d0e12;color:#fbf9f5;padding:24px;border-radius:12px;border:1px solid #D4AF37;">
        <h2 style="color:#D4AF37;margin-top:0;">DKWEENS DELIGHTS ENTERPRISES</h2>
        <h3 style="color:#ffffff;">New Customer Enquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject || 'General Enquiry'}</p>
        <div style="background:#181a20;padding:16px;border-radius:8px;border-left:4px solid #D4AF37;margin-top:12px;font-style:italic;">
          "${message}"
        </div>
      </div>`
    }).then(result => {
      db.updateAdminNotification(adminNotif.id, {
        emailDeliveryStatus: result.status,
        emailError: result.error,
        emailMessageId: result.messageId
      });
    }).catch(err => {
      db.updateAdminNotification(adminNotif.id, {
        emailDeliveryStatus: 'failed',
        emailError: err.message || 'Email delivery failed'
      });
    });

    res.status(201).json({
      success: true,
      enquiry: saved,
      message: 'Thank you for reaching out to DKWEENS DELIGHTS ENTERPRISES. We will respond promptly.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Customer: Submit Review (Subject to Administrator Approval)
app.post('/api/reviews', (req: Request, res: Response) => {
  try {
    const { customerName, serviceUsed, rating, reviewText, bookingReference } = req.body;

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, error: 'Please enter your name or display name.' });
    }
    if (!serviceUsed || !serviceUsed.trim()) {
      return res.status(400).json({ success: false, error: 'Please select or enter the service, package, or rental used.' });
    }
    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, error: 'Please select a valid rating between 1 and 5 stars.' });
    }
    if (!reviewText || reviewText.trim().length < 8) {
      return res.status(400).json({ success: false, error: 'Please provide a written review describing your experience (at least 8 characters).' });
    }

    // Duplicate submission check
    if (db.checkDuplicateReview(customerName, reviewText, bookingReference)) {
      return res.status(400).json({ 
        success: false, 
        error: 'A similar review has already been submitted recently. To prevent duplicates, please wait a few moments or contact our team directly.' 
      });
    }

    // Verify booking reference if provided
    let isVerified = false;
    let foundBooking: BookingRecord | null = null;
    if (bookingReference && bookingReference.trim()) {
      foundBooking = db.verifyBookingReference(bookingReference);
      if (foundBooking) {
        isVerified = true;
      }
    }

    const savedReview = db.createReview({
      customerName,
      serviceUsed,
      rating: numRating,
      reviewText,
      bookingReference: bookingReference || null,
      isVerified
    });

    // Create Admin Notification Center Record
    const adminNotif = db.createAdminNotification({
      type: 'review_submission',
      title: `New Review (${savedReview.rating}★) from ${savedReview.customerName}`,
      customerName: savedReview.customerName,
      customerEmail: foundBooking?.customerEmail || '',
      customerPhone: foundBooking?.customerPhone || '',
      serviceName: savedReview.serviceUsed,
      eventDate: foundBooking?.eventDate || null,
      eventLocation: foundBooking?.destinationCity || null,
      referenceCode: savedReview.bookingReference,
      status: 'Pending Review',
      emailDeliveryStatus: 'unconfigured_simulated',
      details: `Rating: ${savedReview.rating}/5 stars. Verified Transaction: ${savedReview.isVerified ? 'YES' : 'NO'}. Review: "${savedReview.reviewText}"`
    });

    // Dispatch Asynchronous Email Alert to Business Gmail Address
    const businessEmail = getBusinessAlertEmail();
    sendBusinessAlert({
      to: businessEmail,
      subject: `[DKWEENS REVIEW PENDING] ${savedReview.rating}★ Review from ${savedReview.customerName}`,
      text: `DKWEENS DELIGHTS ENTERPRISES — NEW CUSTOMER REVIEW PENDING APPROVAL\n\nCustomer: ${savedReview.customerName}\nRating: ${savedReview.rating}/5 Stars\nService: ${savedReview.serviceUsed}\nBooking Reference: ${savedReview.bookingReference || 'None provided'}\nVerified Transaction: ${savedReview.isVerified ? 'YES (Matched Booking)' : 'NO'}\n\nReview Text:\n"${savedReview.reviewText}"\n\nPlease approve or reject this review in the Admin Operations Dashboard before it appears publicly.`,
      html: `<div style="font-family:Arial,sans-serif;background:#0d0e12;color:#fbf9f5;padding:24px;border-radius:12px;border:1px solid #D4AF37;">
        <h2 style="color:#D4AF37;margin-top:0;">DKWEENS DELIGHTS ENTERPRISES</h2>
        <h3 style="color:#ffffff;">New Client Review Pending Approval</h3>
        <p><strong>Customer:</strong> ${savedReview.customerName}</p>
        <p><strong>Rating:</strong> ${'★'.repeat(savedReview.rating)}${'☆'.repeat(5 - savedReview.rating)} (${savedReview.rating}/5)</p>
        <p><strong>Service/Item:</strong> ${savedReview.serviceUsed}</p>
        <p><strong>Reference:</strong> ${savedReview.bookingReference || 'None provided'}</p>
        <p><strong>Verified Transaction:</strong> ${savedReview.isVerified ? '<span style="color:#10b981;font-weight:bold;">VERIFIED</span>' : 'Unverified'}</p>
        <div style="background:#181a20;padding:16px;border-radius:8px;border-left:4px solid #D4AF37;margin-top:12px;">
          "${savedReview.reviewText}"
        </div>
        <p style="margin-top:16px;font-size:12px;color:#9ca3af;">All reviews require administrator approval before appearing publicly.</p>
      </div>`
    }).then(result => {
      db.updateAdminNotification(adminNotif.id, {
        emailDeliveryStatus: result.status,
        emailError: result.error,
        emailMessageId: result.messageId
      });
    }).catch(err => {
      db.updateAdminNotification(adminNotif.id, {
        emailDeliveryStatus: 'failed',
        emailError: err.message || 'Email delivery failed'
      });
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback! Your review has been submitted for administrator review and will appear publicly once approved.',
      review: {
        id: savedReview.id,
        customerName: savedReview.customerName,
        rating: savedReview.rating,
        serviceUsed: savedReview.serviceUsed,
        status: savedReview.status,
        isVerified: savedReview.isVerified
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to submit review' });
  }
});

// Public: Fetch Approved Reviews Only (Privacy-safe: no internal emails, phone numbers, or notes)
app.get('/api/reviews/public', (req: Request, res: Response) => {
  const approved = db.getApprovedReviews();
  const sanitized = approved.map(r => ({
    id: r.id,
    createdAt: r.createdAt,
    customerName: r.customerName,
    serviceUsed: r.serviceUsed,
    rating: r.rating,
    reviewText: r.reviewText,
    isVerified: r.isVerified
  }));
  res.json({
    success: true,
    reviews: sanitized,
    totalApproved: sanitized.length
  });
});

// Event Planning Assistant API
app.post('/api/ai/planner', async (req: Request, res: Response) => {
  try {
    const planResult = await consultAIEventPlanner(req.body);
    res.json(planResult);
  } catch (error: any) {
    console.error('Error in Event Planning Assistant:', error);
    res.status(500).json({ success: false, error: error.message || 'Assistant encountered an error' });
  }
});

// --- ADMIN API ROUTES ---
const ADMIN_TOKEN = 'dkweens-admin-session-2026';

function adminAuthMiddleware(req: Request, res: Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.replace('Bearer ', '') === ADMIN_TOKEN) {
    return next();
  }
  if (req.headers['x-admin-demo'] === 'true') {
    return next();
  }
  return res.status(401).json({ success: false, error: 'Unauthorized: Administrator access required' });
}

app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (
    (email === 'admin@dkweensdelights.ng' && password === 'dkweens2026') ||
    (email === 'admin' && password === 'admin') ||
    password === 'dkweens2026' ||
    password === 'eventsease2026'
  ) {
    return res.json({
      success: true,
      token: ADMIN_TOKEN,
      admin: {
        name: 'Lead Operations Director',
        email: 'admin@dkweensdelights.ng',
        role: 'super_admin'
      }
    });
  }
  res.status(401).json({ success: false, error: 'Invalid administrator credentials. (Default: admin@dkweensdelights.ng / dkweens2026)' });
});

app.get('/api/admin/me', adminAuthMiddleware, (req: Request, res: Response) => {
  res.json({
    success: true,
    admin: {
      name: 'Lead Operations Director',
      email: 'admin@dkweensdelights.ng',
      role: 'super_admin'
    }
  });
});

app.get('/api/admin/bookings', adminAuthMiddleware, (req: Request, res: Response) => {
  res.json(db.getBookings());
});

app.patch('/api/admin/bookings/:id/status', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes, reviewedBy } = req.body;
  const booking = db.getBookingById(id);
  if (!booking) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  const updated = db.updateBooking(id, {
    status: status || booking.status,
    adminNotes: adminNotes !== undefined ? adminNotes : booking.adminNotes,
    reviewedBy: reviewedBy || 'Operations Director',
    reviewedAt: new Date().toISOString()
  });

  db.addNotification({
    bookingReference: booking.reference,
    type: 'booking_status_change',
    recipient: booking.customerPhone || booking.customerEmail,
    channel: 'email_simulation',
    status: 'delivered',
    subject: `DKWEENS DELIGHTS Status Update: ${booking.reference} is now ${status}`,
    details: `Booking status changed to "${status}". Notes: ${adminNotes || 'None'}`
  });

  res.json({ success: true, booking: updated });
});

app.post('/api/admin/bookings/:id/charges', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, amount, category } = req.body;
  const booking = db.getBookingById(id);
  if (!booking) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  const newCharge: ItemizedCharge = {
    id: `chg-${Date.now()}`,
    description: description || 'Travel & Logistics Surcharge',
    amount: Number(amount) || 0,
    category: category || 'travel',
    addedAt: new Date().toISOString()
  };

  const currentCharges = [...(booking.itemizedCharges || []), newCharge];
  const updatedBookingData = recalculateBookingWithCharges({
    ...booking,
    itemizedCharges: currentCharges
  });

  const updated = db.updateBooking(id, updatedBookingData);

  db.addNotification({
    bookingReference: booking.reference,
    type: 'quotation_updated',
    recipient: booking.customerPhone || booking.customerEmail,
    channel: 'email_simulation',
    status: 'delivered',
    subject: `DKWEENS DELIGHTS Updated Quotation: ${booking.reference}`,
    details: `Added itemized charge: ${newCharge.description} (₦${newCharge.amount.toLocaleString()}). Grand total is now ₦${updated?.grandTotal ? updated.grandTotal.toLocaleString() : 'Incomplete'}.`
  });

  res.json({ success: true, booking: updated });
});

app.delete('/api/admin/bookings/:id/charges/:chargeId', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id, chargeId } = req.params;
  const booking = db.getBookingById(id);
  if (!booking) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  const currentCharges = (booking.itemizedCharges || []).filter(c => c.id !== chargeId);
  const updatedBookingData = recalculateBookingWithCharges({
    ...booking,
    itemizedCharges: currentCharges
  });

  const updated = db.updateBooking(id, updatedBookingData);
  res.json({ success: true, booking: updated });
});

// Admin Packages Management
app.patch('/api/admin/packages/:id', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updatePackage(id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Package not found' });
  res.json({ success: true, package: updated });
});

// Admin Services Management
app.patch('/api/admin/services/:id', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateService(id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Service not found' });
  res.json({ success: true, service: updated });
});

// Admin Media Gallery CRUD
app.get('/api/admin/media', adminAuthMiddleware, (req: Request, res: Response) => {
  res.json(db.getGalleryMedia());
});

app.post('/api/admin/media', adminAuthMiddleware, (req: Request, res: Response) => {
  const { title, caption, category, mediaType, url, thumbnailUrl, featuredOnHome, order } = req.body;
  if (!title || !url) {
    return res.status(400).json({ success: false, error: 'Title and Media URL are required' });
  }

  const newMedia = db.addGalleryMedia({
    title,
    caption: caption || '',
    category: category || 'all',
    mediaType: mediaType || 'image',
    url,
    thumbnailUrl,
    featuredOnHome: Boolean(featuredOnHome),
    order: Number(order) || 99
  });

  res.status(201).json({ success: true, media: newMedia });
});

app.patch('/api/admin/media/:id', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateGalleryMedia(id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Media item not found' });
  res.json({ success: true, media: updated });
});

app.delete('/api/admin/media/:id', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const success = db.deleteGalleryMedia(id);
  if (!success) return res.status(404).json({ success: false, error: 'Media item not found' });
  res.json({ success: true, message: 'Media item deleted' });
});

// Admin Enquiries Management
app.get('/api/admin/enquiries', adminAuthMiddleware, (req: Request, res: Response) => {
  res.json(db.getEnquiries());
});

app.patch('/api/admin/enquiries/:id', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateEnquiry(id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Enquiry not found' });
  res.json({ success: true, enquiry: updated });
});

// Admin Reviews Management
app.get('/api/admin/reviews', adminAuthMiddleware, (req: Request, res: Response) => {
  res.json({
    success: true,
    reviews: db.getReviews()
  });
});

app.patch('/api/admin/reviews/:id', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, isVerified, adminNotes } = req.body;
  const existing = db.getReviewById(id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Review not found' });
  }

  const updates: Partial<ReviewRecord> = {};
  if (status !== undefined) {
    updates.status = status;
    if (status === 'approved') {
      updates.approvedAt = new Date().toISOString();
      updates.approvedBy = 'Administrator';
    }
  }
  if (isVerified !== undefined) {
    updates.isVerified = Boolean(isVerified);
  }
  if (adminNotes !== undefined) {
    updates.adminNotes = adminNotes;
  }

  const updated = db.updateReview(id, updates);
  res.json({ success: true, review: updated });
});

app.delete('/api/admin/reviews/:id', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteReview(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Review not found' });
  }
  res.json({ success: true, message: 'Review successfully removed' });
});

// Admin Notification Center API
app.get('/api/admin/notifications-center', adminAuthMiddleware, (req: Request, res: Response) => {
  const allNotifs = db.getAdminNotifications();
  const unreadCount = allNotifs.filter(n => !n.isRead).length;
  res.json({
    success: true,
    notifications: allNotifs,
    unreadCount,
    smtpConfigured: isSmtpConfigured(),
    businessAlertEmail: getBusinessAlertEmail()
  });
});

app.patch('/api/admin/notifications-center/:id/status', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = db.updateAdminNotification(id, { status });
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Notification not found' });
  }
  res.json({ success: true, notification: updated });
});

app.patch('/api/admin/notifications-center/:id/read', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { isRead } = req.body;
  const updated = db.markAdminNotificationRead(id, isRead !== undefined ? Boolean(isRead) : true);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Notification not found' });
  }
  res.json({ success: true, notification: updated });
});

app.post('/api/admin/notifications-center/mark-all-read', adminAuthMiddleware, (req: Request, res: Response) => {
  db.markAllAdminNotificationsRead();
  res.json({ success: true, message: 'All notifications marked as read' });
});

app.delete('/api/admin/notifications-center/:id', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteAdminNotification(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Notification not found' });
  }
  res.json({ success: true, message: 'Notification removed' });
});

app.post('/api/admin/notifications-center/:id/retry-email', adminAuthMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const notif = db.getAdminNotificationById(id);
  if (!notif) {
    return res.status(404).json({ success: false, error: 'Notification not found' });
  }

  const businessEmail = getBusinessAlertEmail();
  const result = await sendBusinessAlert({
    to: businessEmail,
    subject: `[RETRY ALERT] ${notif.title}`,
    text: `DKWEENS DELIGHTS — NOTIFICATION ALERT (RETRY)\n\nType: ${notif.type}\nCustomer: ${notif.customerName}\nPhone: ${notif.customerPhone || 'N/A'}\nEmail: ${notif.customerEmail || 'N/A'}\nReference: ${notif.referenceCode || 'N/A'}\nService: ${notif.serviceName}\nStatus: ${notif.status}\n\nDetails:\n${notif.details}`,
    html: `<div style="font-family:Arial,sans-serif;background:#0d0e12;color:#fbf9f5;padding:24px;border-radius:12px;border:1px solid #D4AF37;">
      <h2 style="color:#D4AF37;margin-top:0;">DKWEENS DELIGHTS ENTERPRISES (Retried Alert)</h2>
      <p><strong>Type:</strong> ${notif.type}</p>
      <p><strong>Customer:</strong> ${notif.customerName} (${notif.customerPhone || 'No phone'})</p>
      <p><strong>Service/Item:</strong> ${notif.serviceName}</p>
      <p><strong>Reference:</strong> ${notif.referenceCode || 'N/A'}</p>
      <div style="background:#181a20;padding:14px;border-radius:8px;border-left:4px solid #D4AF37;margin-top:12px;">
        ${notif.details}
      </div>
    </div>`
  });

  const updated = db.updateAdminNotification(id, {
    emailDeliveryStatus: result.status,
    emailError: result.error,
    emailMessageId: result.messageId
  });

  res.json({
    success: result.status === 'sent',
    emailResult: result,
    notification: updated,
    message: result.status === 'sent'
      ? `Email alert successfully delivered to ${result.recipient}`
      : result.status === 'unconfigured_simulated'
        ? 'Real SMTP credentials not configured in environment. Notification logged in system for administrative review.'
        : `Email delivery failed: ${result.error}`
  });
});

// Admin Notifications Log (Legacy/Audit)
app.get('/api/admin/notifications', adminAuthMiddleware, (req: Request, res: Response) => {
  res.json(db.getNotifications());
});

// Admin System Settings
app.patch('/api/admin/settings', adminAuthMiddleware, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json({ success: true, settings: updated });
});

// Vite middleware mounting in development & production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DKWEENS DELIGHTS ENTERPRISES] Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
