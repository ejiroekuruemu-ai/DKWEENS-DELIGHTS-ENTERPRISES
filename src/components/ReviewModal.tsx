import React, { useState } from 'react';
import { Star, X, CheckCircle2, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { PackageItem, StandardServiceItem } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
  packages: PackageItem[];
  services: StandardServiceItem[];
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onReviewSubmitted,
  packages,
  services,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [serviceUsed, setServiceUsed] = useState('');
  const [customService, setCustomService] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [bookingReference, setBookingReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const finalService = serviceUsed === 'other' ? customService.trim() : serviceUsed;

    if (!customerName.trim()) {
      setErrorMessage('Please enter your name or preferred display name.');
      return;
    }
    if (!finalService) {
      setErrorMessage('Please select or specify the service, package, or rental you experienced.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setErrorMessage('Please select a star rating from 1 to 5.');
      return;
    }
    if (!reviewText.trim() || reviewText.trim().length < 8) {
      setErrorMessage('Please write a brief review describing your experience (at least 8 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          serviceUsed: finalService,
          rating,
          reviewText: reviewText.trim(),
          bookingReference: bookingReference.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSubmittedSuccess(true);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCustomerName('');
    setServiceUsed('');
    setCustomService('');
    setRating(5);
    setReviewText('');
    setBookingReference('');
    setSubmittedSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#12141A] border border-[#D4AF37]/50 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-neutral-200">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedSuccess ? (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Review Submitted!</h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-[#D4AF37]">{customerName}</strong>! Your review has been recorded with initial status{' '}
                <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-xs">
                  Pending Approval
                </span>.
              </p>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                To maintain authentic feedback standards, our team reviews each submission. It will appear on our public reviews showcase once approved.
              </p>
            </div>
            <button
              onClick={handleResetAndClose}
              className="mt-4 px-8 py-3 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:brightness-110 transition-all cursor-pointer"
            >
              Done &amp; Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[11px] font-bold border border-[#D4AF37]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>DKWEENS Client Feedback</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Share Your Event Experience</h3>
              <p className="text-xs text-neutral-400">
                Tell us about your celebration in Warri or beyond. Your feedback helps future celebrants plan with confidence.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Star Rating Picker */}
            <div className="space-y-1.5 bg-black/40 p-4 rounded-2xl border border-white/5">
              <label className="block text-xs font-semibold text-neutral-300">Overall Rating (1 to 5 Stars) *</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating ?? rating)
                          ? 'fill-[#D4AF37] text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                          : 'text-neutral-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-bold text-[#F3E5AB]">
                  {rating === 5 && 'Outstanding (5/5)'}
                  {rating === 4 && 'Very Good (4/5)'}
                  {rating === 3 && 'Average (3/5)'}
                  {rating === 2 && 'Needs Improvement (2/5)'}
                  {rating === 1 && 'Unsatisfactory (1/5)'}
                </span>
              </div>
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Your Name or Preferred Display Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chief & Mrs. Adeleke or Chidinma E."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            {/* Service or Package Used */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Service, Package, or Rental Item Used *
              </label>
              <select
                value={serviceUsed}
                onChange={(e) => setServiceUsed(e.target.value)}
                required
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              >
                <option value="">-- Select Service or Package --</option>
                <optgroup label="Official Afterparty Packages">
                  {packages.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} (₦{p.price.toLocaleString()})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Staffing & Event Services">
                  <option value="Professional Event Ushers">Professional Event Ushers</option>
                  <option value="Champagne Girls & Bottle Girls">Champagne Girls & Bottle Girls</option>
                  <option value="Executive Event Bouncers & Security">Executive Event Bouncers & Security</option>
                </optgroup>
                <optgroup label="Serving Accessories & Rentals">
                  <option value="Gold-Coloured Serving Bowls with Chilled Drinks">Gold-Coloured Serving Bowls with Chilled Drinks</option>
                  <option value="Silver Serving Bowls">Silver Serving Bowls</option>
                  <option value="King Kong Hype Gorilla Mascot">King Kong Hype Gorilla Mascot</option>
                  <option value="Costumes & Uniform Rentals">Costumes & Uniform Rentals</option>
                  <option value="Illuminated LED Drink Carrier Board">Illuminated LED Drink Carrier Board</option>
                  <option value="Crown-Crested Hype Video Board">Crown-Crested Hype Video Board</option>
                </optgroup>
                <option value="other">Other / Custom Service</option>
              </select>

              {serviceUsed === 'other' && (
                <input
                  type="text"
                  placeholder="Specify custom service or rental item"
                  value={customService}
                  onChange={(e) => setCustomService(e.target.value)}
                  className="mt-2 w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              )}
            </div>

            {/* Written Review */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Your Review &amp; Experience *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Describe how DKWEENS DELIGHTS served your event — usher professionalism, mascot hype, bowl presentation, punctuality, or guest impressions..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
              />
            </div>

            {/* Optional Booking Reference */}
            <div className="bg-[#181a22] p-3.5 rounded-xl border border-white/5 space-y-1">
              <label className="block text-xs font-semibold text-neutral-300">
                Optional Booking Reference (For Transaction Verification)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. DK-2026-9041"
                  value={bookingReference}
                  onChange={(e) => setBookingReference(e.target.value.toUpperCase())}
                  className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
                <span className="text-[10px] text-neutral-400 px-2">
                  Auto-verifies your completed booking
                </span>
              </div>
              <p className="text-[10px] text-neutral-400">
                Your reference code and private contact info are never displayed publicly.
              </p>
            </div>

            {/* Submission Notice */}
            <div className="flex items-start gap-2 text-[11px] text-neutral-400 bg-black/30 p-2.5 rounded-lg border border-white/5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>
                To prevent spam and uphold authenticity, all submissions require administrator approval prior to public display.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA820A] hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Review'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
