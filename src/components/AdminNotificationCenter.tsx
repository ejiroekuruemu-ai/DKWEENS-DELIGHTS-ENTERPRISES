import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  RefreshCw, 
  Send, 
  AlertTriangle, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Trash2, 
  Filter, 
  Search,
  ExternalLink,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { AdminNotification } from '../types';

interface AdminNotificationCenterProps {
  adminToken: string;
  onNavigateTab?: (tab: 'bookings' | 'enquiries' | 'reviews') => void;
}

export const AdminNotificationCenter: React.FC<AdminNotificationCenterProps> = ({
  adminToken,
  onNavigateTab
}) => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [alertEmail, setAlertEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const fetchNotificationCenter = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/notifications-center', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
        setSmtpConfigured(Boolean(data.smtpConfigured));
        setAlertEmail(data.businessAlertEmail || 'ejiroekuruemu@gmail.com');
      }
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationCenter();
  }, [adminToken]);

  const handleUpdateStatus = async (id: string, status: AdminNotification['status']) => {
    try {
      const res = await fetch(`/api/admin/notifications-center/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setActionNotice({ text: `Notification status set to "${status}".`, type: 'info' });
        await fetchNotificationCenter();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/admin/notifications-center/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isRead: !currentRead })
      });
      if (res.ok) {
        await fetchNotificationCenter();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/admin/notifications-center/mark-all-read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        setActionNotice({ text: 'All notifications marked as read.', type: 'success' });
        await fetchNotificationCenter();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRetryEmail = async (id: string) => {
    try {
      setRetryingId(id);
      setActionNotice(null);
      const res = await fetch(`/api/admin/notifications-center/${id}/retry-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice({ text: `Email successfully delivered to ${alertEmail}!`, type: 'success' });
      } else {
        setActionNotice({
          text: data.message || 'Email delivery attempt completed with notice.',
          type: data.emailResult?.status === 'unconfigured_simulated' ? 'info' : 'error'
        });
      }
      await fetchNotificationCenter();
    } catch (err: any) {
      setActionNotice({ text: err.message || 'Error executing email retry', type: 'error' });
    } finally {
      setRetryingId(null);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!window.confirm('Delete this notification record from the log?')) return;
    try {
      const res = await fetch(`/api/admin/notifications-center/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        setActionNotice({ text: 'Notification record removed.', type: 'info' });
        await fetchNotificationCenter();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered logic
  const filtered = notifications.filter(n => {
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    if (statusFilter !== 'all' && n.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchCust = n.customerName.toLowerCase().includes(q);
      const matchService = n.serviceName.toLowerCase().includes(q);
      const matchRef = n.referenceCode?.toLowerCase().includes(q);
      const matchDetails = n.details.toLowerCase().includes(q);
      if (!matchTitle && !matchCust && !matchService && !matchRef && !matchDetails) return false;
    }
    return true;
  });

  const getTypeBadgeStyle = (type: AdminNotification['type']) => {
    switch (type) {
      case 'booking_request':
        return 'bg-[#D4AF37]/20 text-[#F3E5AB] border-[#D4AF37]/40';
      case 'quotation_request':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'consultation':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'rental_explanation':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'review_submission':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'service_enquiry':
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  const formatTypeName = (type: AdminNotification['type']) => {
    switch (type) {
      case 'booking_request': return 'Booking Request';
      case 'quotation_request': return 'Quotation Request';
      case 'consultation': return 'Consultation Request';
      case 'rental_explanation': return 'Rental Explanation';
      case 'review_submission': return 'Review Submission';
      case 'service_enquiry': default: return 'Customer Enquiry';
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <div className="relative">
              <Bell className="w-5 h-5 text-[#D4AF37]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            <span>Operations Notification Center</span>
            <span className="text-xs font-normal text-neutral-400">
              ({unreadCount} Unread • {notifications.length} Total)
            </span>
          </h2>
          <p className="text-xs text-neutral-400">
            Real-time incoming alerts for bookings, quotations, consultations, enquiries, and client reviews.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            onClick={fetchNotificationCenter}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* SMTP DELIVERY STATUS BANNER */}
      <div className="p-4 rounded-2xl bg-[#14161C] border border-white/10 space-y-2 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-bold text-white">Automated Business Email Alert Gateway:</span>
            <span className="font-mono text-[#D4AF37]">{alertEmail}</span>
          </div>

          <div className="flex items-center gap-2">
            {smtpConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>SMTP Live Transport Connected</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] font-bold text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>In-App Alerts Active (SMTP Unconfigured in Environment)</span>
              </span>
            )}
          </div>
        </div>

        <p className="text-[11px] text-neutral-400 leading-relaxed">
          {smtpConfigured
            ? `Real outbound notifications are transmitted immediately to ${alertEmail} upon booking or review submissions via live SMTP.`
            : `All customer bookings, enquiries, and reviews are persistently logged below with complete customer details. Once SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) are populated in .env, clicking "Retry Dispatch" will immediately deliver the email alert.`}
        </p>
      </div>

      {actionNotice && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            actionNotice.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
              : actionNotice.type === 'error'
              ? 'bg-red-950/40 border border-red-500/40 text-red-300'
              : 'bg-blue-950/40 border border-blue-500/40 text-blue-300'
          }`}
        >
          <Info className="w-4 h-4 shrink-0" />
          <span>{actionNotice.text}</span>
        </div>
      )}

      {/* FILTER & SEARCH STRIP */}
      <div className="bg-[#14161C] p-3.5 rounded-2xl border border-white/5 space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Type filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider mr-1">
              Type:
            </span>
            {[
              { id: 'all', label: 'All' },
              { id: 'booking_request', label: 'Bookings' },
              { id: 'quotation_request', label: 'Quotations' },
              { id: 'service_enquiry', label: 'Enquiries' },
              { id: 'consultation', label: 'Consultations' },
              { id: 'rental_explanation', label: 'Rentals' },
              { id: 'review_submission', label: 'Reviews' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  typeFilter === t.id
                    ? 'bg-[#D4AF37] text-black font-bold'
                    : 'text-neutral-400 hover:text-white bg-white/5'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Responded To">Responded To</option>
              <option value="Completed">Completed</option>
              <option value="Pending Review">Pending Review</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, reference code, service, or event details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* NOTIFICATIONS LIST */}
      {loading ? (
        <div className="p-8 text-center text-xs text-neutral-400 bg-[#14161C] rounded-2xl">
          Loading notification logs...
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl bg-[#14161C] border space-y-3.5 text-xs transition-all ${
                !item.isRead
                  ? 'border-[#D4AF37]/50 shadow-md shadow-[#D4AF37]/5 bg-[#171920]'
                  : 'border-white/5 opacity-85'
              }`}
            >
              {/* Top Row: Type, Status, Timestamp */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getTypeBadgeStyle(
                      item.type
                    )}`}
                  >
                    {formatTypeName(item.type)}
                  </span>

                  {!item.isRead && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase tracking-wider">
                      Unread
                    </span>
                  )}

                  {item.referenceCode && (
                    <span className="font-mono text-[#D4AF37] font-bold text-[11px] bg-black/40 px-2 py-0.5 rounded border border-white/5">
                      {item.referenceCode}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                  </span>
                </div>
              </div>

              {/* Title & Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm">{item.title}</h3>
                  <div className="text-[11px] text-[#D4AF37] font-semibold">
                    Requested: {item.serviceName}
                  </div>
                </div>

                {/* Contact Strip */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <div className="font-bold text-white">{item.customerName}</div>
                  {item.customerPhone && (
                    <a
                      href={`tel:${item.customerPhone}`}
                      className="text-neutral-300 hover:text-[#D4AF37] flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-[#D4AF37]" />
                      <span>{item.customerPhone}</span>
                    </a>
                  )}
                  {item.customerEmail && (
                    <a
                      href={`mailto:${item.customerEmail}`}
                      className="text-neutral-300 hover:text-[#D4AF37] flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3 text-[#D4AF37]" />
                      <span>{item.customerEmail}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Event Date & Location (if provided) */}
              {(item.eventDate || item.eventLocation) && (
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-300">
                  {item.eventDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Event Date: <strong>{item.eventDate}</strong></span>
                    </span>
                  )}
                  {item.eventLocation && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Venue: <strong>{item.eventLocation}</strong></span>
                    </span>
                  )}
                </div>
              )}

              {/* Details Content Box */}
              <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-neutral-300 leading-relaxed font-sans text-xs">
                {item.details}
              </div>

              {/* Email Delivery Status Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 font-semibold">Email Dispatch:</span>
                  {item.emailDeliveryStatus === 'sent' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Delivered via SMTP {item.emailMessageId ? `(${item.emailMessageId})` : ''}</span>
                    </span>
                  ) : item.emailDeliveryStatus === 'unconfigured_simulated' ? (
                    <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Simulated In-App (SMTP Unconfigured)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-400 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Failed: {item.emailError || 'Dispatch error'}</span>
                    </span>
                  )}

                  {/* Retry Button */}
                  {item.emailDeliveryStatus !== 'sent' && (
                    <button
                      type="button"
                      disabled={retryingId === item.id}
                      onClick={() => handleRetryEmail(item.id)}
                      className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold text-[#D4AF37] hover:text-black hover:bg-[#D4AF37] border border-[#D4AF37]/40 transition-colors cursor-pointer"
                      title="Attempt outbound email dispatch now"
                    >
                      {retryingId === item.id ? 'Sending...' : 'Retry Dispatch'}
                    </button>
                  )}
                </div>

                {/* Quick tab jump link */}
                {onNavigateTab && (
                  <div>
                    {item.type.includes('booking') || item.type.includes('quotation') ? (
                      <button
                        onClick={() => onNavigateTab('bookings')}
                        className="text-[#D4AF37] hover:underline flex items-center gap-1 text-xs font-semibold cursor-pointer"
                      >
                        <span>View in Bookings Tab</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : item.type === 'review_submission' ? (
                      <button
                        onClick={() => onNavigateTab('reviews')}
                        className="text-[#D4AF37] hover:underline flex items-center gap-1 text-xs font-semibold cursor-pointer"
                      >
                        <span>View in Reviews Tab</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onNavigateTab('enquiries')}
                        className="text-[#D4AF37] hover:underline flex items-center gap-1 text-xs font-semibold cursor-pointer"
                      >
                        <span>View in Enquiries Tab</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Status & Processing Action Controls */}
              <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 font-semibold text-[11px]">Processing Status:</span>
                  <select
                    value={item.status}
                    onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
                    className="bg-black/80 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Responded To">Responded To</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending Review">Pending Review</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleRead(item.id, item.isRead)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {item.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteNotification(item.id)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-neutral-400 bg-[#14161C] rounded-2xl border border-white/5">
          No notifications found matching your filter criteria.
        </div>
      )}
    </div>
  );
};
