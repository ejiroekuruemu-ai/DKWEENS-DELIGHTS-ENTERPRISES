import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  EyeOff, 
  Eye, 
  Trash2, 
  Check, 
  Clock, 
  Filter, 
  Search, 
  AlertCircle,
  MessageSquare,
  Award
} from 'lucide-react';
import { ReviewRecord } from '../types';

interface AdminReviewsManagerProps {
  adminToken: string;
}

export const AdminReviewsManager: React.FC<AdminReviewsManagerProps> = ({ adminToken }) => {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/reviews', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [adminToken]);

  const handleUpdateReview = async (id: string, updates: Partial<ReviewRecord>, successMsg: string) => {
    try {
      setProcessingId(id);
      setActionMessage(null);
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update review');
      }
      setActionMessage({ text: successMsg, type: 'success' });
      await fetchReviews();
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error updating review', type: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this customer review?')) return;
    try {
      setProcessingId(id);
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete review');
      }
      setActionMessage({ text: 'Review permanently removed.', type: 'success' });
      await fetchReviews();
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error deleting review', type: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  // Stats calculation
  const totalCount = reviews.length;
  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const approvedCount = reviews.filter(r => r.status === 'approved').length;
  const verifiedCount = reviews.filter(r => r.isVerified).length;

  const filteredReviews = reviews.filter(r => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = r.customerName.toLowerCase().includes(q);
      const matchService = r.serviceUsed.toLowerCase().includes(q);
      const matchText = r.reviewText.toLowerCase().includes(q);
      const matchRef = r.bookingReference?.toLowerCase().includes(q);
      if (!matchName && !matchService && !matchText && !matchRef) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* HEADER & METRIC SUMMARY */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
            <span>Customer Reviews Moderation ({totalCount})</span>
          </h2>
          <p className="text-xs text-neutral-400">
            Moderate, verify, approve or reject customer testimonials before they appear publicly.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 transition-colors self-start sm:self-auto cursor-pointer"
        >
          Refresh Reviews
        </button>
      </div>

      {actionMessage && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/40 border border-red-500/40 text-red-300'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* STATS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#14161C] border border-white/5">
          <span className="text-neutral-400 block text-[11px]">Total Reviews</span>
          <span className="text-xl font-bold text-white">{totalCount}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#14161C] border border-amber-500/25">
          <span className="text-amber-400 block text-[11px] font-semibold">Pending Approval</span>
          <span className="text-xl font-bold text-amber-300">{pendingCount}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#14161C] border border-emerald-500/25">
          <span className="text-emerald-400 block text-[11px] font-semibold">Publicly Approved</span>
          <span className="text-xl font-bold text-emerald-300">{approvedCount}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#14161C] border border-[#D4AF37]/25">
          <span className="text-[#D4AF37] block text-[11px] font-semibold">Verified Bookings</span>
          <span className="text-xl font-bold text-[#F3E5AB]">{verifiedCount}</span>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#14161C] p-3 rounded-2xl border border-white/5 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'pending', 'approved', 'rejected', 'hidden'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-[#D4AF37] text-black font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {st === 'pending' ? `Pending (${pendingCount})` : st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* REVIEWS LIST */}
      {loading ? (
        <div className="p-8 text-center text-xs text-neutral-400 bg-[#14161C] rounded-2xl">
          Loading customer reviews...
        </div>
      ) : filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-5 rounded-2xl bg-[#14161C] border space-y-4 text-xs transition-all ${
                rev.status === 'pending'
                  ? 'border-amber-500/40 bg-amber-950/10'
                  : rev.status === 'approved'
                  ? 'border-emerald-500/30'
                  : 'border-white/10 opacity-75'
              }`}
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-sm">{rev.customerName}</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-neutral-700'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-[11px] font-bold text-[#F3E5AB]">({rev.rating}/5)</span>
                  </div>

                  {rev.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Booking</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      rev.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : rev.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                        : rev.status === 'rejected'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                    }`}
                  >
                    {rev.status === 'pending' ? 'Pending Approval' : rev.status}
                  </span>
                  <span className="text-neutral-500 text-[11px] font-mono">
                    {new Date(rev.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Service & Reference */}
              <div className="flex flex-wrap items-center gap-3 text-[11px]">
                <span className="text-[#D4AF37] font-semibold">Service: {rev.serviceUsed}</span>
                {rev.bookingReference ? (
                  <span className="text-neutral-400 font-mono bg-black/40 px-2 py-0.5 rounded border border-white/5">
                    Ref: {rev.bookingReference}
                  </span>
                ) : (
                  <span className="text-neutral-500 italic">No booking ref provided</span>
                )}
                {rev.approvedAt && (
                  <span className="text-neutral-500">
                    Approved: {new Date(rev.approvedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Review Text */}
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 text-neutral-200 leading-relaxed italic">
                "{rev.reviewText}"
              </div>

              {/* Internal Admin Verification Notes */}
              {rev.adminNotes && (
                <div className="text-[11px] text-neutral-400 bg-neutral-900/60 p-2 rounded-lg border border-white/5">
                  <strong className="text-neutral-300">Admin Notes:</strong> {rev.adminNotes}
                </div>
              )}

              {/* Action Toolbar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/5">
                {/* Toggle Verified Status */}
                <button
                  type="button"
                  disabled={processingId === rev.id}
                  onClick={() =>
                    handleUpdateReview(
                      rev.id,
                      { isVerified: !rev.isVerified },
                      rev.isVerified ? 'Marked as unverified.' : 'Marked as verified booking!'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{rev.isVerified ? 'Revoke Verified Badge' : 'Grant Verified Badge'}</span>
                </button>

                {/* Moderation Controls */}
                <div className="flex items-center gap-2">
                  {rev.status !== 'approved' && (
                    <button
                      type="button"
                      disabled={processingId === rev.id}
                      onClick={() =>
                        handleUpdateReview(
                          rev.id,
                          { status: 'approved' },
                          'Review approved! It will now appear on the public website.'
                        )
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#F3E5AB] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve &amp; Publish</span>
                    </button>
                  )}

                  {rev.status === 'approved' && (
                    <button
                      type="button"
                      disabled={processingId === rev.id}
                      onClick={() =>
                        handleUpdateReview(
                          rev.id,
                          { status: 'hidden' },
                          'Review hidden from public display.'
                        )
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide from Public</span>
                    </button>
                  )}

                  {rev.status === 'hidden' && (
                    <button
                      type="button"
                      disabled={processingId === rev.id}
                      onClick={() =>
                        handleUpdateReview(
                          rev.id,
                          { status: 'approved' },
                          'Review unhidden and restored to public display.'
                        )
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Unhide</span>
                    </button>
                  )}

                  {rev.status !== 'rejected' && (
                    <button
                      type="button"
                      disabled={processingId === rev.id}
                      onClick={() =>
                        handleUpdateReview(
                          rev.id,
                          { status: 'rejected' },
                          'Review rejected.'
                        )
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={processingId === rev.id}
                    onClick={() => handleDeleteReview(rev.id)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-neutral-400 bg-[#14161C] rounded-2xl border border-white/5">
          No customer reviews match your filter criteria.
        </div>
      )}
    </div>
  );
};
