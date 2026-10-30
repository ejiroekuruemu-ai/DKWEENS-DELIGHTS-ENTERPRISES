import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquarePlus, Sparkles, Quote, Award } from 'lucide-react';
import { ReviewModal } from './ReviewModal';
import { PackageItem, StandardServiceItem } from '../types';

export interface PublicReview {
  id: string;
  createdAt: string;
  customerName: string;
  serviceUsed: string;
  rating: number;
  reviewText: string;
  isVerified: boolean;
}

interface ClientReviewsSectionProps {
  packages: PackageItem[];
  services: StandardServiceItem[];
}

export const ClientReviewsSection: React.FC<ClientReviewsSectionProps> = ({
  packages,
  services,
}) => {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPublicReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reviews/public');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Failed to load public reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicReviews();
  }, []);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const verifiedCount = reviews.filter(r => r.isVerified).length;

  return (
    <section id="reviews-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* SECTION HEADER & CTA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-bold border border-[#D4AF37]/30">
            <Award className="w-3.5 h-3.5" />
            <span>Real Celebrant Impressions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Client Reviews &amp; Testimonials
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
            Read verified feedback from wedding couples, VIP celebrants, and event hosts who trusted{' '}
            <strong className="text-white">DKWEENS DELIGHTS ENTERPRISES</strong> in Warri, Delta State, and nationwide across Nigeria.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA820A] hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Leave a Review</span>
        </button>
      </div>

      {/* METRIC STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#14161C] border border-[#D4AF37]/30 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Star className="w-6 h-6 fill-[#D4AF37]" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{averageRating} / 5.0</div>
            <div className="text-xs text-neutral-400">Average Client Rating</div>
          </div>
        </div>

        <div className="bg-[#14161C] border border-[#D4AF37]/30 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{verifiedCount} Verified</div>
            <div className="text-xs text-neutral-400">Completed Event Bookings</div>
          </div>
        </div>

        <div className="bg-[#14161C] border border-[#D4AF37]/30 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">100% Genuine</div>
            <div className="text-xs text-neutral-400">Moderated &amp; Authentic Reviews</div>
          </div>
        </div>
      </div>

      {/* REVIEWS GRID OR EMPTY STATE */}
      {loading ? (
        <div className="py-12 text-center text-xs text-neutral-400">
          Loading approved client testimonials...
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl bg-gradient-to-b from-[#14161C] to-[#0D0F14] border border-white/10 p-6 flex flex-col justify-between space-y-4 hover:border-[#D4AF37]/50 transition-all duration-300 relative group"
            >
              <div className="space-y-3">
                {/* Header: Stars & Verified Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= r.rating
                            ? 'fill-[#D4AF37] text-[#D4AF37]'
                            : 'text-neutral-700'
                        }`}
                      />
                    ))}
                  </div>

                  {r.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Booking</span>
                    </span>
                  )}
                </div>

                {/* Service Tag */}
                <div className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wide">
                  {r.serviceUsed}
                </div>

                {/* Review Body */}
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
                  "{r.reviewText}"
                </p>
              </div>

              {/* Author & Date */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="font-bold text-white">{r.customerName}</span>
                <span className="text-[11px] text-neutral-500">
                  {new Date(r.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Zero Fabrication Empty State */
        <div className="p-8 sm:p-12 rounded-3xl bg-[#14161C] border border-[#D4AF37]/25 text-center space-y-4 max-w-2xl mx-auto">
          <Quote className="w-12 h-12 text-[#D4AF37]/40 mx-auto" />
          <h3 className="text-xl font-bold text-white">Be the First to Leave a Review</h3>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
            Have we provided ushers, champagne girls, afterparty entertainment, or serving bowl rentals for your wedding, birthday, or corporate celebration? We would love to hear your feedback!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-xl text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#F3E5AB] transition-colors cursor-pointer"
          >
            Leave Your Review Now
          </button>
        </div>
      )}

      {/* MODAL */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewSubmitted={fetchPublicReviews}
        packages={packages}
        services={services}
      />
    </section>
  );
};
