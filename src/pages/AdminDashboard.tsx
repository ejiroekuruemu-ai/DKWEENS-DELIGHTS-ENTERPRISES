import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BookingRecord, EnquiryRecord, NotificationLog, SystemSettings, PackageItem } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Filter, 
  Search, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Users, 
  Crown, 
  Layers, 
  Bell, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  FileText,
  Edit2,
  RefreshCw,
  Eye,
  Check,
  Image as ImageIcon,
  Film,
  Star
} from 'lucide-react';
import { AdminReviewsManager } from '../components/AdminReviewsManager';
import { AdminNotificationCenter } from '../components/AdminNotificationCenter';

export const AdminDashboard: React.FC = () => {
  const { 
    adminToken, 
    adminUser, 
    loginAdmin, 
    logoutAdmin, 
    packages, 
    services, 
    lightingPackages, 
    costumes, 
    mascots, 
    galleryMedia,
    settings, 
    refreshCatalog 
  } = useApp();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@dkweensdelights.ng');
  const [loginPassword, setLoginPassword] = useState('dkweens2026');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Dashboard Tab state
  const [activeTab, setActiveTab] = useState<'bookings' | 'packages' | 'services' | 'media' | 'settings' | 'enquiries' | 'notifications' | 'reviews' | 'analytics'>('bookings');

  // Media Manager state
  const [mediaFilter, setMediaFilter] = useState<string>('all');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaType, setNewMediaType] = useState<'photo' | 'video'>('photo');
  const [newMediaCategory, setNewMediaCategory] = useState<'ushers' | 'champagne_girls' | 'costumes' | 'mascots' | 'boards' | 'bowls' | 'afterparty_crew'>('ushers');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaCaption, setNewMediaCaption] = useState('');
  const [newMediaFeatured, setNewMediaFeatured] = useState(false);
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [mediaActionMsg, setMediaActionMsg] = useState<string | null>(null);

  // Bookings state
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [bookingFilter, setBookingFilter] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Booking detail modal edits
  const [modalStatus, setModalStatus] = useState<BookingRecord['status']>('Pending');
  const [modalAdminNotes, setModalAdminNotes] = useState('');
  const [newChargeDesc, setNewChargeDesc] = useState('');
  const [newChargeAmount, setNewChargeAmount] = useState<number | ''>('');
  const [newChargeCategory, setNewChargeCategory] = useState<'travel' | 'accommodation' | 'logistics' | 'equipment'>('travel');
  const [isUpdatingBooking, setIsUpdatingBooking] = useState(false);

  // Enquiries & Notifications
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);

  // Settings form
  const [settingsArea, setSettingsArea] = useState(settings?.baseServiceArea || '');
  const [settingsAreaDesc, setSettingsAreaDesc] = useState(settings?.serviceAreaDescription || '');
  const [settingsPhone, setSettingsPhone] = useState(settings?.contactPhone || '');
  const [settingsEmail, setSettingsEmail] = useState(settings?.adminEmail || '');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // Package editor
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [editingPackagePrice, setEditingPackagePrice] = useState<number>(0);
  const [editingPackageDesc, setEditingPackageDesc] = useState<string>('');

  // Fetch admin data
  const fetchAdminData = async () => {
    if (!adminToken) return;
    try {
      setLoadingBookings(true);
      const headers = {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      };

      const [bRes, eRes, nRes] = await Promise.all([
        fetch('/api/admin/bookings', { headers }),
        fetch('/api/admin/enquiries', { headers }),
        fetch('/api/admin/notifications', { headers })
      ]);

      if (bRes.ok) {
        const bData = await bRes.json();
        setBookings(bData);
      }
      if (eRes.ok) {
        const eData = await eRes.json();
        setEnquiries(eData);
      }
      if (nRes.ok) {
        const nData = await nRes.json();
        setNotifications(nData);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchAdminData();
    }
  }, [adminToken]);

  useEffect(() => {
    if (settings) {
      setSettingsArea(settings.baseServiceArea);
      setSettingsAreaDesc(settings.serviceAreaDescription);
      setSettingsPhone(settings.contactPhone);
      setSettingsEmail(settings.adminEmail);
    }
  }, [settings]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }
      loginAdmin(data.token, data.admin);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setLoginEmail('admin@dkweensdelights.ng');
    setLoginPassword('dkweens2026');
    handleLogin();
  };

  // Media Manager Handlers
  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaTitle || !newMediaUrl) {
      setMediaActionMsg('Please provide both title and media URL/path.');
      return;
    }
    setIsAddingMedia(true);
    setMediaActionMsg(null);
    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newMediaTitle,
          type: newMediaType,
          category: newMediaCategory,
          url: newMediaUrl,
          caption: newMediaCaption,
          featuredOnHome: newMediaFeatured
        })
      });
      const data = await res.json();
      if (data.success) {
        setMediaActionMsg('New media item registered in live database!');
        setNewMediaTitle('');
        setNewMediaUrl('');
        setNewMediaCaption('');
        setNewMediaFeatured(false);
        await refreshCatalog();
      } else {
        setMediaActionMsg(data.error || 'Failed to add media');
      }
    } catch (err: any) {
      setMediaActionMsg(err.message || 'Error adding media asset');
    } finally {
      setIsAddingMedia(false);
    }
  };

  const handleToggleFeaturedMedia = async (id: string, currentFeatured: boolean) => {
    try {
      await fetch(`/api/admin/media/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ featuredOnHome: !currentFeatured })
      });
      await refreshCatalog();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this media asset?')) return;
    try {
      await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      await refreshCatalog();
    } catch (err) {
      console.error(err);
    }
  };

  const openBookingModal = (b: BookingRecord) => {
    setSelectedBooking(b);
    setModalStatus(b.status);
    setModalAdminNotes(b.adminNotes || '');
    setNewChargeDesc('');
    setNewChargeAmount('');
  };

  const handleSaveBookingStatus = async () => {
    if (!selectedBooking) return;
    setIsUpdatingBooking(true);
    try {
      const res = await fetch(`/api/admin/bookings/${selectedBooking.id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: modalStatus,
          adminNotes: modalAdminNotes,
          reviewedBy: adminUser?.name || 'Administrator'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedBooking(data.booking);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingBooking(false);
    }
  };

  const handleAddCharge = async () => {
    if (!selectedBooking || !newChargeAmount || Number(newChargeAmount) <= 0) return;
    setIsUpdatingBooking(true);
    try {
      const res = await fetch(`/api/admin/bookings/${selectedBooking.id}/charges`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: newChargeDesc || 'Out-of-corridor Travel Surcharge',
          amount: Number(newChargeAmount),
          category: newChargeCategory
        })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedBooking(data.booking);
        setNewChargeDesc('');
        setNewChargeAmount('');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingBooking(false);
    }
  };

  const handleDeleteCharge = async (chargeId: string) => {
    if (!selectedBooking) return;
    setIsUpdatingBooking(true);
    try {
      const res = await fetch(`/api/admin/bookings/${selectedBooking.id}/charges/${chargeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success) {
        setSelectedBooking(data.booking);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingBooking(false);
    }
  };

  const handleUpdatePackage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          price: editingPackagePrice,
          description: editingPackageDesc
        })
      });
      const data = await res.json();
      if (data.success) {
        setEditingPackageId(null);
        refreshCatalog();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSavedSuccess(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          baseServiceArea: settingsArea,
          serviceAreaDescription: settingsAreaDesc,
          contactPhone: settingsPhone,
          adminEmail: settingsEmail
        })
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSavedSuccess(true);
        refreshCatalog();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Filtered bookings
  const filteredBookings = bookings.filter(b => {
    const matchesFilter = bookingFilter === 'all' || b.status.toLowerCase() === bookingFilter.toLowerCase();
    const matchesSearch = 
      b.reference.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.destinationCity.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // KPI Metrics
  const totalBookings = bookings.length;
  const pendingQuotations = bookings.filter(b => b.status === 'Pending' || b.status === 'Awaiting Quotation').length;
  const approvedBookings = bookings.filter(b => b.status === 'Approved' || b.status === 'Completed').length;
  const totalPipeline = bookings.reduce((sum, b) => sum + (b.grandTotal || b.subtotalPricedItems || 0), 0);

  // If NOT logged in, show secure admin login card
  if (!adminToken) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-[#D4AF37] to-[#AA820A] mx-auto shadow-2xl overflow-hidden">
            <img 
              src="/assets/aistudio/my_logo_f5406092.jpeg" 
              alt="DKWEENS DELIGHTS ENTERPRISES" 
              className="w-full h-full object-cover rounded-full" 
            />
          </div>
          <h1 className="text-2xl font-black text-white">
            DKWEENS DELIGHTS Operations Portal
          </h1>
          <p className="text-xs text-neutral-400">
            Protected management engine for bookings, pricing controls, media gallery, travel surcharges, and inventory in Warri.
          </p>
        </div>

        <div className="bg-[#14161C] border border-[#D4AF37]/35 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          {loginError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Admin Email
              </label>
              <input
                type="text"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Security Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA820A] hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{loggingIn ? 'Authenticating...' : 'Sign In as Administrator'}</span>
            </button>
          </form>

          {/* Quick Demo Access Button for Capstone Grading */}
          <div className="pt-4 border-t border-white/10 text-center space-y-2">
            <span className="text-[11px] text-neutral-400 block font-medium">
              Authorized Management Sign-In:
            </span>
            <button
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#D4AF37] bg-white/5 hover:bg-[#D4AF37]/15 border border-[#D4AF37]/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>1-Click Management Sign-In</span>
            </button>
            <p className="text-[10px] text-neutral-500">
              Default credentials: admin@dkweensdelights.ng / dkweens2026
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              DKWEENS DELIGHTS ENTERPRISES — Operations Control
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold border border-[#D4AF37]/30">
              Administrator
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Logged in as <strong>{adminUser?.name || 'Lead Event Director'}</strong> ({adminUser?.email}) • Base: Warri, Delta State
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAdminData}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
          <button
            onClick={logoutAdmin}
            className="px-3.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#14161C] border border-white/10 space-y-1">
          <div className="text-neutral-400 text-xs font-semibold flex items-center justify-between">
            <span>Total Bookings</span>
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-2xl font-black text-white">{totalBookings}</div>
          <div className="text-[11px] text-neutral-500">Live Database Records</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#14161C] border border-white/10 space-y-1">
          <div className="text-neutral-400 text-xs font-semibold flex items-center justify-between">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{pendingQuotations}</div>
          <div className="text-[11px] text-neutral-500">Awaiting travel/approval</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#14161C] border border-white/10 space-y-1">
          <div className="text-neutral-400 text-xs font-semibold flex items-center justify-between">
            <span>Approved / Active</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{approvedBookings}</div>
          <div className="text-[11px] text-neutral-500">Confirmed Events</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#14161C] border border-white/10 space-y-1">
          <div className="text-neutral-400 text-xs font-semibold flex items-center justify-between">
            <span>Pipeline Value</span>
            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-2xl font-black text-[#D4AF37]">₦{(totalPipeline / 1000000).toFixed(2)}M</div>
          <div className="text-[11px] text-neutral-500">Gross Stated Demand</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {[
          { id: 'bookings', label: 'Bookings & Quotations', count: bookings.length },
          { id: 'notifications', label: 'Notification Center', count: null },
          { id: 'reviews', label: 'Customer Reviews', count: null },
          { id: 'packages', label: 'Package Pricing', count: packages.length },
          { id: 'services', label: 'Services & Rentals', count: null },
          { id: 'media', label: 'Media Manager', count: galleryMedia.length },
          { id: 'settings', label: 'Service Area & Policies', count: null },
          { id: 'enquiries', label: 'Customer Enquiries', count: enquiries.length },
          { id: 'analytics', label: 'Capstone Demo Guide', count: null },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === tab.id ? 'bg-black text-white' : 'bg-white/10 text-neutral-300'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: BOOKINGS & QUOTATIONS */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {['all', 'Pending', 'Under Review', 'Awaiting Quotation', 'Quotation Sent', 'Approved', 'Completed', 'Rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setBookingFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    bookingFilter.toLowerCase() === status.toLowerCase()
                      ? 'bg-white text-black font-bold'
                      : 'bg-white/5 text-neutral-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search reference or client..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full bg-[#14161C] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#14161C]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-black/60 text-neutral-400 border-b border-white/10">
                  <th className="p-4">Reference</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Event &amp; Date</th>
                  <th className="p-4">Package</th>
                  <th className="p-4">Area / Destination</th>
                  <th className="p-4 text-right">Subtotal</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#D4AF37]">{b.reference}</td>
                    <td className="p-4 font-semibold text-white">
                      <div>{b.customerName}</div>
                      <div className="text-[11px] text-neutral-500 font-normal">{b.customerPhone}</div>
                    </td>
                    <td className="p-4">
                      <div>{b.eventType}</div>
                      <div className="text-[11px] text-neutral-400">{b.eventDate}</div>
                    </td>
                    <td className="p-4 text-white">
                      {b.selectedPackageName ? b.selectedPackageName.split('—')[0] : 'Custom Only'}
                    </td>
                    <td className="p-4">
                      <span className={b.isOutsideServiceArea ? 'text-amber-400 font-bold' : 'text-neutral-400'}>
                        {b.destinationCity} {b.isOutsideServiceArea ? '(Outside)' : '(Base)'}
                      </span>
                    </td>
                    <td className="p-4 text-right font-black text-white">
                      ₦{b.subtotalPricedItems.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                        b.status === 'Awaiting Quotation' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-white/10 text-neutral-300'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => openBookingModal(b)}
                        className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#F3E5AB] hover:text-black font-bold transition-colors cursor-pointer"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-neutral-400">
                      No bookings matching current search or status filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PACKAGES PRICE MANAGER */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Official Afterparty Packages Catalog</h2>
              <p className="text-xs text-neutral-400">
                Update prices, descriptions, and active status. Changes apply immediately to new quotations while preserving past quotation snapshots.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const isEditing = editingPackageId === pkg.id;
              return (
                <div key={pkg.id} className="p-6 rounded-2xl bg-[#14161C] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D4AF37] uppercase">{pkg.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                      {pkg.isAvailable ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base">{pkg.name}</h3>

                  {isEditing ? (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-neutral-400 mb-1">Package Price (₦ NGN)</label>
                        <input
                          type="number"
                          value={editingPackagePrice}
                          onChange={(e) => setEditingPackagePrice(Number(e.target.value))}
                          className="w-full bg-black/60 border border-white/20 rounded-lg p-2 text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={editingPackageDesc}
                          onChange={(e) => setEditingPackageDesc(e.target.value)}
                          className="w-full bg-black/60 border border-white/20 rounded-lg p-2 text-white text-xs"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdatePackage(pkg.id)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-[#D4AF37] text-black"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingPackageId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs bg-white/10 text-neutral-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-black text-white">
                        ₦{pkg.price.toLocaleString()}
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {pkg.description}
                      </p>
                      <div className="text-xs text-neutral-300">
                        <span className="font-semibold text-[#D4AF37] block mb-1">Inclusions:</span>
                        <div className="text-[11px] text-neutral-400 leading-relaxed">
                          {pkg.inclusions.join(', ')}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditingPackageId(pkg.id);
                          setEditingPackagePrice(pkg.price);
                          setEditingPackageDesc(pkg.description);
                        }}
                        className="w-full py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Price &amp; Description</span>
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES & RENTALS MANAGER */}
      {activeTab === 'services' && (
        <div className="space-y-8">
          {/* Standard Staff Services */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Staff &amp; Serving Bowls Unit Prices</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((svc) => (
                <div key={svc.id} className="p-5 rounded-2xl bg-[#14161C] border border-white/10 space-y-2">
                  <span className="text-[10px] font-bold text-[#D4AF37] uppercase">{svc.category}</span>
                  <h3 className="font-bold text-white text-sm">{svc.name}</h3>
                  <div className="text-xl font-black text-white">
                    ₦{svc.unitPrice.toLocaleString()} <span className="text-xs font-normal text-neutral-400">/ {svc.unit}</span>
                  </div>
                  {svc.options && (
                    <div className="text-[11px] text-neutral-400 pt-1 border-t border-white/5">
                      {svc.options.map(o => `${o.label}: ₦${o.price}`).join(' | ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Lighting Rigs Catalog */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Configured Lighting Catalog ({lightingPackages.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {lightingPackages.map((l) => (
                <div key={l.id} className="p-4 rounded-xl bg-[#14161C] border border-white/10 space-y-2">
                  <span className="text-xs font-bold text-white block">{l.name}</span>
                  <span className="text-sm font-black text-[#D4AF37]">
                    {l.price ? `₦${l.price.toLocaleString()}` : 'Custom Quotation Required'}
                  </span>
                  <p className="text-[11px] text-neutral-400 line-clamp-2">{l.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mascots Catalog */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Hype Mascots Catalog ({mascots.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mascots.map((m) => (
                <div key={m.id} className="p-4 rounded-xl bg-[#14161C] border border-white/10 space-y-2">
                  <span className="text-xs font-bold text-white block">{m.name}</span>
                  <span className="text-sm font-black text-[#D4AF37]">
                    {m.rentalPrice ? `₦${m.rentalPrice.toLocaleString()}` : 'Quotation Required'}
                  </span>
                  <p className="text-[11px] text-neutral-400 line-clamp-2">{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB MEDIA: MEDIA & ASSET MANAGER */}
      {activeTab === 'media' && (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">DKWEENS DELIGHTS Media &amp; Asset Manager</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Manage your real business photographs and videos. Control captions, categories, and which items are featured on the homepage.
              </p>
            </div>
            <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1.5 rounded-xl border border-[#D4AF37]/25">
              {galleryMedia.length} Registered Media Assets
            </span>
          </div>

          {/* Add Media Form */}
          <div className="p-6 rounded-3xl bg-[#14161C] border border-[#D4AF37]/40 shadow-xl space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Register New Photograph or Video Asset</span>
            </div>

            {mediaActionMsg && (
              <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-[#F3E5AB]">
                {mediaActionMsg}
              </div>
            )}

            <form onSubmit={handleAddMedia} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Asset Title</label>
                <input
                  type="text"
                  placeholder="e.g. Ushers in Ankara Skirts"
                  value={newMediaTitle}
                  onChange={(e) => setNewMediaTitle(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Media Type</label>
                <select
                  value={newMediaType}
                  onChange={(e) => setNewMediaType(e.target.value as any)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="photo">Photo (JPEG / PNG)</option>
                  <option value="video">Video (MP4 / WebM)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Category</label>
                <select
                  value={newMediaCategory}
                  onChange={(e) => setNewMediaCategory(e.target.value as any)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="ushers">Ushers &amp; Greeters</option>
                  <option value="champagne_girls">Champagne Hostesses</option>
                  <option value="costumes">Costumes &amp; Outfits</option>
                  <option value="mascots">Hype Mascots</option>
                  <option value="boards">Video &amp; LED Boards</option>
                  <option value="bowls">Serving Bowls</option>
                  <option value="afterparty_crew">Afterparty Troupe</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-neutral-300 font-semibold mb-1">
                  Asset File Path or URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. /assets/aistudio/my_new_photo.jpeg"
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                />
                <span className="text-[10px] text-neutral-500 block mt-0.5">
                  Path in public assets (e.g. /assets/aistudio/file_name.jpeg) or web URL
                </span>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Caption / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Event day presentation in Warri"
                  value={newMediaCaption}
                  onChange={(e) => setNewMediaCaption(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheckbox"
                  checked={newMediaFeatured}
                  onChange={(e) => setNewMediaFeatured(e.target.checked)}
                  className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="featuredCheckbox" className="text-neutral-300 cursor-pointer">
                  Feature this item on Homepage Highlights
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isAddingMedia}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#F3E5AB] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isAddingMedia ? 'Registering...' : 'Add to Media Library'}
                </button>
              </div>
            </form>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
            {[
              { id: 'all', label: 'All Media' },
              { id: 'ushers', label: 'Ushers' },
              { id: 'champagne_girls', label: 'Champagne Girls' },
              { id: 'bowls', label: 'Serving Bowls' },
              { id: 'boards', label: 'Illuminated Boards' },
              { id: 'costumes', label: 'Costumes' },
              { id: 'mascots', label: 'Mascots' },
              { id: 'afterparty_crew', label: 'Afterparty Crew' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setMediaFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  mediaFilter === tab.id
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryMedia
              .filter(m => mediaFilter === 'all' || m.category === mediaFilter)
              .map(item => (
                <div 
                  key={item.id}
                  className="rounded-2xl bg-[#14161C] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all"
                >
                  <div className="relative aspect-video bg-black overflow-hidden">
                    {(item.mediaType === 'video' || item.type === 'video') ? (
                      <video 
                        src={item.url} 
                        controls 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full h-full object-cover" 
                      />
                    )}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-white capitalize">
                        {item.mediaType || item.type || 'photo'}
                      </span>
                      <span className="bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-[#D4AF37] capitalize">
                        {item.category.replace('_', ' ')}
                      </span>
                    </div>

                    {item.featuredOnHome && (
                      <div className="absolute top-2.5 right-2.5 bg-[#D4AF37] text-black px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Homepage</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{item.caption}</p>
                      <div className="text-[10px] text-neutral-500 font-mono mt-2 truncate">
                        {item.url}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleFeaturedMedia(item.id, !!item.featuredOnHome)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          item.featuredOnHome
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#D4AF37]/30'
                            : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${item.featuredOnHome ? 'fill-[#D4AF37]' : ''}`} />
                        <span>{item.featuredOnHome ? 'Featured' : 'Make Featured'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteMedia(item.id)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete Media Asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: SERVICE AREA & POLICIES SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-[#14161C] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Logistics &amp; Service Area Configuration</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Configure the normal coverage corridor. Outside locations trigger mandatory administrator travel cost assessments.
            </p>
          </div>

          {settingsSavedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>System policies and service area settings updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Base Service Area Name
              </label>
              <input
                type="text"
                value={settingsArea}
                onChange={(e) => setSettingsArea(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Service Area Corridor Description &amp; Travel Policy
              </label>
              <textarea
                rows={4}
                value={settingsAreaDesc}
                onChange={(e) => setSettingsAreaDesc(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Public Contact Phone
                </label>
                <input
                  type="text"
                  value={settingsPhone}
                  onChange={(e) => setSettingsPhone(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Operations Admin Email
                </label>
                <input
                  type="email"
                  value={settingsEmail}
                  onChange={(e) => setSettingsEmail(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSavingSettings}
              className="px-6 py-3 rounded-xl text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#F3E5AB] transition-colors cursor-pointer"
            >
              {isSavingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: CUSTOMER ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Customer Enquiries Log ({enquiries.length})</h2>
          <div className="space-y-3">
            {enquiries.map((enq) => (
              <div key={enq.id} className="p-5 rounded-2xl bg-[#14161C] border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{enq.name} ({enq.email})</span>
                  <span className="text-neutral-500">{new Date(enq.createdAt).toLocaleString()}</span>
                </div>
                <div className="font-semibold text-[#D4AF37]">{enq.subject}</div>
                <p className="text-neutral-300 leading-relaxed font-mono bg-black/40 p-3 rounded-xl border border-white/5">
                  "{enq.message}"
                </p>
                {enq.phone && <div className="text-neutral-400">Phone: {enq.phone}</div>}
              </div>
            ))}
            {enquiries.length === 0 && (
              <div className="p-8 text-center text-neutral-400 bg-[#14161C] rounded-2xl">
                No customer enquiries yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: NOTIFICATION CENTER */}
      {activeTab === 'notifications' && (
        <div className="space-y-8">
          <AdminNotificationCenter
            adminToken={adminToken!}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
          />

          {/* Historical Audit Trail */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-neutral-300">
              Historical Automated Booking Audit Trail ({notifications.length} Logged Events)
            </h3>
            <div className="space-y-2">
              {notifications.map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3 text-xs">
                  <div className="p-1.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] shrink-0 mt-0.5">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{n.subject}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {new Date(n.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-[11px]">{n.details}</p>
                    <div className="flex items-center gap-3 text-[10px] text-neutral-500">
                      <span>Recipient: {n.recipient}</span>
                      <span>•</span>
                      <span>Ref: {n.bookingReference}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold uppercase">{n.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: CUSTOMER REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <AdminReviewsManager adminToken={adminToken!} />
      )}

      {/* TAB 7: CAPSTONE ANALYTICS & DEMO GUIDE */}
      {activeTab === 'analytics' && (
        <div className="p-8 rounded-3xl bg-[#14161C] border border-[#D4AF37]/40 space-y-6 text-xs text-neutral-300">
          <div className="flex items-center gap-2 text-base font-bold text-white">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            <span>Capstone Defense Walkthrough Guide (Nov 5, 2026)</span>
          </div>

          <div className="space-y-3 leading-relaxed">
            <p>
              When presenting the DKWEENS DELIGHTS ENTERPRISES operations system to evaluators, follow this exact demonstration sequence:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Brand Authenticity &amp; Original Media:</strong> Show the original client emblem logo, slogan <em>“WE PLAN • WE CREATE • YOU CELEBRATE.”</em>, and genuine videos of the Gold Serving Bowls and Gorilla Mascot.
              </li>
              <li>
                <strong>Serving Bowls Standard:</strong> Highlight that the enterprise strictly uses Serving Bowls (Silver Serving Bowls ₦2,000 / Gold-Coloured Serving Bowls with Chilled Drinks ₦2,500) and dedicated rentals catalog.
              </li>
              <li>
                <strong>AI Event Planning Assistant:</strong> Input a budget of ₦1,200,000 in Warri, show how it grounds recommendations against official database packages, and click "Apply Plan to Booking Request".
              </li>
              <li>
                <strong>Service Coverage &amp; Travel Policy:</strong> Explain that DKWEENS DELIGHTS serves Warri, Effurun, Udu, Ughelli, Asaba, Bayelsa, Port Harcourt, and clients nationwide across Nigeria. Events outside our normal Warri service area are subject to a separate travel, accommodation, and logistics assessment rather than fabricating surcharges.
              </li>
              <li>
                <strong>Booking Submission:</strong> Submit the request and show the generated reference code (DK-2026-XXXX) and instant quotation breakdown.
              </li>
              <li>
                <strong>Media Manager:</strong> Demonstrate the dedicated Media Manager tab to inspect, add, feature, or delete media items dynamically.
              </li>
              <li>
                <strong>Admin Review &amp; Itemized Charge Addition:</strong> Sign into the Operations Portal, find the booking, add an itemized travel surcharge, update status to "Approved", and show how the grand total recalculates transparently and logs an audit notification!
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* BOOKING REVIEW & CHARGES MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#14161C] border border-[#D4AF37]/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">
                  Booking Operations Review
                </span>
                <h3 className="text-xl font-bold text-white font-mono">
                  {selectedBooking.reference} — {selectedBooking.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-neutral-400 hover:text-white text-xs font-bold px-3 py-1 bg-white/10 rounded-lg"
              >
                Close
              </button>
            </div>

            {/* Quick Summary */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-black/40 p-4 rounded-xl border border-white/5">
              <div>
                <span className="text-neutral-400 block">Event &amp; Venue</span>
                <span className="font-semibold text-white">{selectedBooking.eventType} on {selectedBooking.eventDate}</span>
                <span className="block text-neutral-400">{selectedBooking.venueName} ({selectedBooking.destinationCity})</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Travel Status</span>
                <span className={selectedBooking.isOutsideServiceArea ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {selectedBooking.isOutsideServiceArea ? 'Outside Service Area (Assessment Required)' : 'Normal Warri Service Area'}
                </span>
              </div>
            </div>

            {/* Status & Notes Form */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Booking Status</label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value as any)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Awaiting Quotation">Awaiting Quotation</option>
                    <option value="Quotation Sent">Quotation Sent</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Catalog Subtotal</label>
                  <div className="p-2.5 bg-black/60 border border-white/5 rounded-xl font-bold text-[#D4AF37]">
                    ₦{selectedBooking.subtotalPricedItems.toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Operations Notes</label>
                <textarea
                  rows={2}
                  value={modalAdminNotes}
                  onChange={(e) => setModalAdminNotes(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                onClick={handleSaveBookingStatus}
                disabled={isUpdatingBooking}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#D4AF37] text-black hover:bg-[#F3E5AB] transition-colors"
              >
                Save Status &amp; Notes
              </button>
            </div>

            {/* Itemized Charges Section (Travel, Accommodation, Logistics) */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-4 text-xs">
              <span className="font-bold text-white block">
                Itemized Travel, Accommodation &amp; Logistics Surcharges
              </span>

              {/* Existing charges list */}
              {selectedBooking.itemizedCharges && selectedBooking.itemizedCharges.length > 0 ? (
                <div className="space-y-2">
                  {selectedBooking.itemizedCharges.map((chg) => (
                    <div key={chg.id} className="flex items-center justify-between bg-white/5 p-2.5 rounded-lg border border-white/5">
                      <div>
                        <span className="font-semibold text-white block">{chg.description}</span>
                        <span className="text-[10px] text-neutral-400 capitalize">{chg.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-[#D4AF37]">₦{chg.amount.toLocaleString()}</span>
                        <button
                          onClick={() => handleDeleteCharge(chg.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                          title="Remove charge"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 text-[11px] italic">
                  No separate travel or logistics charges added yet.
                </p>
              )}

              {/* Add New Charge Form */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[11px] font-semibold text-neutral-300 block">
                  Add Separate Itemized Charge:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Ibadan Vehicle Transport"
                    value={newChargeDesc}
                    onChange={(e) => setNewChargeDesc(e.target.value)}
                    className="sm:col-span-1 bg-black/60 border border-white/10 rounded-lg p-2 text-white"
                  />
                  <input
                    type="number"
                    placeholder="Amount (₦)"
                    value={newChargeAmount}
                    onChange={(e) => setNewChargeAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="bg-black/60 border border-white/10 rounded-lg p-2 text-white font-bold"
                  />
                  <select
                    value={newChargeCategory}
                    onChange={(e) => setNewChargeCategory(e.target.value as any)}
                    className="bg-black/60 border border-white/10 rounded-lg p-2 text-white"
                  >
                    <option value="travel">Travel</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="logistics">Logistics</option>
                    <option value="equipment">Equipment</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddCharge}
                  disabled={!newChargeAmount || isUpdatingBooking}
                  className="w-full py-2 rounded-lg text-xs font-bold bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Surcharge to Quotation</span>
                </button>
              </div>

              {/* Updated Grand Total in Modal */}
              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                <span className="font-bold text-white">Current Grand Total:</span>
                <span className="text-lg font-black text-[#D4AF37]">
                  {selectedBooking.grandTotal !== null ? `₦${selectedBooking.grandTotal.toLocaleString()}` : 'Incomplete (Pending Travel)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
