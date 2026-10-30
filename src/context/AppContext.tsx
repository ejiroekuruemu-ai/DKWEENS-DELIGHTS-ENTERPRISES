import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PackageItem, 
  StandardServiceItem, 
  LightingPackageItem, 
  CostumeRentalItem, 
  MascotItem, 
  AccessoryRentalItem,
  MediaItem,
  SystemSettings, 
  PageRoute
} from '../types';

interface BookingDraft {
  selectedPackageId?: string | null;
  selectedServices?: {
    serviceId: string;
    quantity: number;
    selectedOption?: string;
  }[];
  eventType?: string;
  budget?: number;
  isOutsideServiceArea?: boolean;
}

interface AppContextType {
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;
  packages: PackageItem[];
  services: StandardServiceItem[];
  lightingPackages: LightingPackageItem[];
  costumes: CostumeRentalItem[];
  mascots: MascotItem[];
  accessories: AccessoryRentalItem[];
  galleryMedia: MediaItem[];
  settings: SystemSettings | null;
  loading: boolean;
  error: string | null;
  bookingDraft: BookingDraft | null;
  setBookingDraft: (draft: BookingDraft | null) => void;
  activeBookingReference: string | null;
  setActiveBookingReference: (ref: string | null) => void;
  adminToken: string | null;
  adminUser: { name: string; email: string; role: string } | null;
  loginAdmin: (token: string, user: { name: string; email: string; role: string }) => void;
  logoutAdmin: () => void;
  refreshCatalog: () => Promise<void>;
  navigateToBookingWithPackage: (packageId: string) => void;
  navigateToBookingWithPlan: (plan: { packageId?: string; services?: { serviceId: string; quantity: number; selectedOption?: string }[]; budget?: number }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [services, setServices] = useState<StandardServiceItem[]>([]);
  const [lightingPackages, setLightingPackages] = useState<LightingPackageItem[]>([]);
  const [costumes, setCostumes] = useState<CostumeRentalItem[]>([]);
  const [mascots, setMascots] = useState<MascotItem[]>([]);
  const [accessories, setAccessories] = useState<AccessoryRentalItem[]>([]);
  const [galleryMedia, setGalleryMedia] = useState<MediaItem[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bookingDraft, setBookingDraft] = useState<BookingDraft | null>(null);
  const [activeBookingReference, setActiveBookingReference] = useState<string | null>(null);

  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('dkweens_admin_token') || localStorage.getItem('eventsease_admin_token');
  });
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    const saved = localStorage.getItem('dkweens_admin_user') || localStorage.getItem('eventsease_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const refreshCatalog = async () => {
    try {
      setLoading(true);
      const [pkgsRes, srvRes, galRes, setRes] = await Promise.all([
        fetch('/api/packages'),
        fetch('/api/services'),
        fetch('/api/gallery'),
        fetch('/api/settings')
      ]);

      if (pkgsRes.ok) {
        const pkgs = await pkgsRes.json();
        setPackages(pkgs);
      }
      if (srvRes.ok) {
        const srvData = await srvRes.json();
        setServices(srvData.services || []);
        setLightingPackages(srvData.lightingPackages || []);
        setCostumes(srvData.costumes || []);
        setMascots(srvData.mascots || []);
        setAccessories(srvData.accessories || []);
      }
      if (galRes.ok) {
        const gal = await galRes.json();
        setGalleryMedia(gal || []);
      }
      if (setRes.ok) {
        const sets = await setRes.json();
        setSettings(sets);
      }
    } catch (err: any) {
      console.error('Failed to load catalog data:', err);
      setError('Could not load catalog. Please verify server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCatalog();
  }, []);

  const loginAdmin = (token: string, user: { name: string; email: string; role: string }) => {
    setAdminToken(token);
    setAdminUser(user);
    localStorage.setItem('dkweens_admin_token', token);
    localStorage.setItem('dkweens_admin_user', JSON.stringify(user));
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('dkweens_admin_token');
    localStorage.removeItem('dkweens_admin_user');
    localStorage.removeItem('eventsease_admin_token');
    localStorage.removeItem('eventsease_admin_user');
  };

  const navigateToBookingWithPackage = (packageId: string) => {
    setBookingDraft({
      selectedPackageId: packageId,
      selectedServices: []
    });
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToBookingWithPlan = (plan: {
    packageId?: string;
    services?: { serviceId: string; quantity: number; selectedOption?: string }[];
    budget?: number;
  }) => {
    setBookingDraft({
      selectedPackageId: plan.packageId || null,
      selectedServices: plan.services || [],
      budget: plan.budget
    });
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        packages,
        services,
        lightingPackages,
        costumes,
        mascots,
        accessories,
        galleryMedia,
        settings,
        loading,
        error,
        bookingDraft,
        setBookingDraft,
        activeBookingReference,
        setActiveBookingReference,
        adminToken,
        adminUser,
        loginAdmin,
        logoutAdmin,
        refreshCatalog,
        navigateToBookingWithPackage,
        navigateToBookingWithPlan
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
