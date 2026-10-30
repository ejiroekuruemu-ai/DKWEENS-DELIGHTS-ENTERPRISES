import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BookingRecord } from '../types';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Printer, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Crown, 
  Layers, 
  FileText,
  DollarSign,
  ArrowRight
} from 'lucide-react';

export const StatusTrackerPage: React.FC = () => {
  const { activeBookingReference, setCurrentPage } = useApp();
  const [searchReference, setSearchReference] = useState(activeBookingReference || 'DK-2026-9041');
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooking = async (ref: string) => {
    if (!ref.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${ref.trim().toUpperCase()}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `No booking found for reference ${ref}`);
      }
      setBooking(data.booking);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error fetching booking status.');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeBookingReference) {
      setSearchReference(activeBookingReference);
      fetchBooking(activeBookingReference);
    } else {
      fetchBooking('DK-2026-9041');
    }
  }, [activeBookingReference]);

  const getStatusBadge = (status: BookingRecord['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Quotation Sent':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Awaiting Quotation':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Under Review':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Completed':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'Rejected':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      default:
        return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/25">
          <Search className="w-3.5 h-3.5" />
          <span>Real-Time Status &amp; Quotation Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Track Booking &amp; Quotation Slip
        </h1>
        <p className="text-sm text-neutral-300 font-light">
          Enter your unique DKWEENS DELIGHTS Booking Reference (e.g. <strong>DK-2026-9041</strong> or <strong>DK-2026-4820</strong>) to view official snapshots, quotation approval status, and itemized travel assessments.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto bg-[#14161C] border border-[#D4AF37]/40 p-2 rounded-2xl flex items-center gap-2 shadow-xl no-print">
        <Search className="w-5 h-5 text-neutral-400 ml-3" />
        <input
          type="text"
          placeholder="Enter Booking Reference (DK-2026-XXXX)"
          value={searchReference}
          onChange={(e) => setSearchReference(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === 'Enter') fetchBooking(searchReference);
          }}
          className="flex-1 bg-transparent border-none text-white text-sm font-bold uppercase tracking-wider focus:outline-none placeholder:normal-case placeholder:font-normal placeholder:text-neutral-500"
        />
        <button
          onClick={() => fetchBooking(searchReference)}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#F3E5AB] transition-colors cursor-pointer"
        >
          {loading ? 'Searching...' : 'Lookup'}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 text-center max-w-xl mx-auto">
          {error}
        </div>
      )}

      {/* Booking Details Card */}
      {booking && (
        <div className="bg-[#14161C] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 print:bg-white print:text-black print:border-black">
          {/* Top Header of Slip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 print:border-black">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/aistudio/my_logo_f5406092.jpeg" 
                alt="DKWEENS DELIGHTS ENTERPRISES Logo" 
                className="h-14 w-14 rounded-full border-2 border-[#D4AF37]/50 object-cover shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-white print:text-black block tracking-tight">
                    DKWEENS DELIGHTS ENTERPRISES
                  </span>
                </div>
                <span className="text-[10px] text-[#D4AF37] font-semibold tracking-wider block">
                  WE PLAN • WE CREATE • YOU CELEBRATE • WARRI, DELTA STATE
                </span>
                <p className="text-xs font-mono text-[#D4AF37] mt-1 font-bold">
                  Reference: {booking.reference}
                </p>
                <p className="text-[11px] text-neutral-400 print:text-neutral-600">
                  Created: {new Date(booking.createdAt).toLocaleString()} • Tel: 09061453586
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 no-print">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusBadge(booking.status)}`}>
                Status: {booking.status}
              </span>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Quotation</span>
              </button>
            </div>
          </div>

          {/* Customer & Event Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-black/40 p-5 rounded-2xl border border-white/5 print:bg-neutral-100 print:border-neutral-300">
            <div>
              <span className="text-neutral-400 block mb-0.5 print:text-neutral-600">Client Name</span>
              <span className="font-bold text-white print:text-black">{booking.customerName}</span>
            </div>
            <div>
              <span className="text-neutral-400 block mb-0.5 print:text-neutral-600">Contact Details</span>
              <span className="font-medium text-neutral-200 block truncate print:text-black">{booking.customerEmail}</span>
              <span className="text-neutral-400 print:text-neutral-600">{booking.customerPhone}</span>
            </div>
            <div>
              <span className="text-neutral-400 block mb-0.5 print:text-neutral-600">Event &amp; Date</span>
              <span className="font-bold text-white print:text-black block">{booking.eventType}</span>
              <span className="text-[#D4AF37] font-semibold">{booking.eventDate} ({booking.guestCount} guests)</span>
            </div>
            <div>
              <span className="text-neutral-400 block mb-0.5 print:text-neutral-600">Venue &amp; Location</span>
              <span className="font-medium text-white print:text-black block">{booking.venueName}</span>
              <span className="text-neutral-400 print:text-neutral-600">{booking.destinationCity}</span>
              {booking.isOutsideServiceArea && (
                <span className="text-[10px] text-amber-400 block font-bold mt-0.5">
                  ⚠️ Outside Service Area
                </span>
              )}
            </div>
          </div>

          {/* Official Package Snapshot */}
          {booking.selectedPackageName ? (
            <div className="p-5 rounded-2xl bg-[#1A1D24] border border-[#D4AF37]/40 space-y-3 print:bg-white print:border-neutral-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-bold text-white print:text-black text-sm">
                    {booking.selectedPackageName} (Preserved Price Snapshot)
                  </span>
                </div>
                <span className="font-black text-[#D4AF37] text-base">
                  ₦{booking.packagePriceSnapshot?.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 print:text-neutral-600">
                Inclusions ({booking.packageInclusionsSnapshot.length}):{' '}
                <span className="text-neutral-200 print:text-black">
                  {booking.packageInclusionsSnapshot.join(', ')}
                </span>
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white/5 text-xs text-neutral-400 italic">
              No afterparty package selected. Custom staffing &amp; rentals only.
            </div>
          )}

          {/* Selected Services & Quantities Table */}
          <div className="space-y-3">
            <h3 className="font-bold text-white print:text-black text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D4AF37]" />
              <span>Configured Services &amp; Rental Line Items</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-white/10 print:border-neutral-300">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-black/60 print:bg-neutral-200 text-neutral-400 print:text-neutral-700 border-b border-white/10 print:border-neutral-300">
                    <th className="p-3">Service / Rental Item</th>
                    <th className="p-3 text-center">Category</th>
                    <th className="p-3 text-center">Quantity</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-neutral-200 text-neutral-300 print:text-black">
                  {booking.selectedServices.map((svc, i) => (
                    <tr key={i} className="hover:bg-white/5">
                      <td className="p-3 font-medium text-white print:text-black">
                        {svc.serviceName}
                        {svc.selectedOption && (
                          <span className="block text-[11px] text-[#D4AF37] font-normal">
                            Option: {svc.selectedOption}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center capitalize text-neutral-400">{svc.category}</td>
                      <td className="p-3 text-center font-bold">{svc.quantity}</td>
                      <td className="p-3 text-right">
                        {svc.unitPrice !== null ? `₦${svc.unitPrice.toLocaleString()}` : 'Custom Quote'}
                      </td>
                      <td className="p-3 text-right font-black text-white print:text-black">
                        {svc.lineTotal !== null ? `₦${svc.lineTotal.toLocaleString()}` : 'Pending'}
                      </td>
                    </tr>
                  ))}
                  {booking.selectedServices.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-neutral-400 italic">
                        No additional staffing or individual rentals added.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Logistics, Travel & Itemized Charges Section */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4 print:bg-neutral-100 print:border-neutral-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-bold text-white print:text-black text-xs uppercase tracking-wider">
                  Logistics, Travel &amp; Accommodation Assessment
                </span>
              </div>
              <span className="text-xs font-semibold text-neutral-300">
                {booking.isOutsideServiceArea ? (
                  booking.travelStatus === 'assessed' ? (
                    <span className="text-emerald-400">Assessed by Administrator</span>
                  ) : (
                    <span className="text-amber-400">Pending Review</span>
                  )
                ) : (
                  <span className="text-neutral-300">Normal Warri Service Area</span>
                )}
              </span>
            </div>

            {booking.isOutsideServiceArea && booking.travelStatus === 'pending_assessment' && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                ⚠️ Events outside our normal Warri service area are subject to a separate travel, accommodation, and logistics assessment. Any applicable charges will be communicated transparently before booking confirmation.
              </div>
            )}

            {/* List Itemized Charges if added */}
            {booking.itemizedCharges && booking.itemizedCharges.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <span className="font-semibold text-neutral-300 block">Itemized Additional Fees:</span>
                {booking.itemizedCharges.map((chg) => (
                  <div key={chg.id} className="flex justify-between text-neutral-300">
                    <span>• {chg.description} ({chg.category})</span>
                    <span className="font-bold text-white print:text-black">₦{chg.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grand Total Summary */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171A21] to-[#12141A] border border-[#D4AF37]/50 space-y-3 print:bg-neutral-200 print:border-black">
            <div className="flex justify-between text-xs text-neutral-300 print:text-black">
              <span>Catalog Subtotal (Priced Components):</span>
              <span className="font-bold text-white print:text-black">₦{booking.subtotalPricedItems.toLocaleString()}</span>
            </div>
            {booking.totalItemizedCharges > 0 && (
              <div className="flex justify-between text-xs text-neutral-300 print:text-black">
                <span>Itemized Logistics &amp; Travel Surcharges:</span>
                <span className="font-bold text-white print:text-black">₦{booking.totalItemizedCharges.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-3 border-t border-white/10 print:border-black flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold text-white print:text-black block">Grand Quotation Total:</span>
                <span className="text-[11px] text-neutral-400 print:text-neutral-600">
                  {booking.isQuotationComplete 
                    ? 'Official Verified Amount' 
                    : 'Quotation Incomplete (Pending Assessment)'}
                </span>
              </div>
              <span className="text-3xl font-black text-[#D4AF37] print:text-black">
                {booking.grandTotal !== null ? `₦${booking.grandTotal.toLocaleString()}` : 'Pending Confirmation'}
              </span>
            </div>
          </div>

          {/* Admin Review Notes & Authorization */}
          <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-neutral-400 print:text-neutral-600">
              <span>Operations Review Notes:</span>
              <span>Reviewed By: {booking.reviewedBy || 'Pending Operations Review'}</span>
            </div>
            <p className="text-neutral-300 print:text-black font-mono">
              "{booking.adminNotes || 'Awaiting initial operations verification.'}"
            </p>
          </div>

          {/* Capstone & Security Notice */}
          <div className="text-[11px] text-neutral-500 text-center space-y-1">
            <p>Official DKWEENS DELIGHTS ENTERPRISES quotation snapshot sealed at database creation timestamp.</p>
            <p>For questions or modifications, contact your event coordinator at <strong>09061453586</strong> with reference: <strong>{booking.reference}</strong>.</p>
          </div>
        </div>
      )}
    </div>
  );
};
