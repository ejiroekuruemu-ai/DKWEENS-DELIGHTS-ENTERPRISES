import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Package, 
  Check, 
  X, 
  Crown, 
  ShieldCheck, 
  CalendarCheck, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export const PackagesPage: React.FC = () => {
  const { packages, navigateToBookingWithPackage, setCurrentPage } = useApp();
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>(['pkg-1', 'pkg-2', 'pkg-3', 'pkg-4', 'pkg-5', 'pkg-6']);

  // All distinct official inclusions to display on matrix
  const allInclusionKeys = [
    'Couples mix',
    'Gorilla',
    'Power bike',
    'Fire dancer',
    'LED costumes',
    'Afterparty props',
    'Board',
    'Lights',
    'Drink carriers',
    'Bottle girls'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/25">
          <Crown className="w-3.5 h-3.5" />
          <span>DKWEENS DELIGHTS ENTERPRISES Official Collections</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          The 6 Official Afterparty Packages
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
          Engineered for unforgettable party climaxes in Warri and across Delta State. Prices are stored and managed directly in our central database. Component elements included in your package are never double-charged.
        </p>
      </div>

      {/* Package Pricing Rules Box */}
      <div className="p-6 rounded-2xl bg-[#12141A] border border-[#D4AF37]/30 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#F3E5AB]">
          <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
          <span>Official Package Pricing Rules &amp; Business Policies</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-neutral-300 pt-2">
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
            <span className="font-semibold text-white block mb-1">1. Service Coverage &amp; Logistics</span>
            Serving Warri, Effurun, Udu, Ughelli, Asaba, Bayelsa, Port Harcourt, and clients nationwide across Nigeria. Events outside our normal Warri service area are subject to a separate travel, accommodation, and logistics assessment. Any applicable charges will be communicated transparently before booking confirmation.
          </div>
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
            <span className="font-semibold text-white block mb-1">2. Zero Double-Counting Guarantee</span>
            When you select a package, all included components (e.g. Gorilla mascot, LED costumes, lights, boards) are fully covered. You only pay for additional staff or separate items requested.
          </div>
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
            <span className="font-semibold text-white block mb-1">3. Immutable Price Snapshots</span>
            Once a booking quotation is submitted, its itemized price snapshot is permanently sealed in the database so future catalog updates do not alter past quotations.
          </div>
        </div>
      </div>

      {/* 6 Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg, idx) => (
          <div
            key={pkg.id}
            className={`rounded-2xl bg-gradient-to-b from-[#181B22] to-[#101216] border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/10 ${
              pkg.highlight
                ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/40 shadow-xl shadow-[#D4AF37]/15'
                : 'border-white/10 hover:border-[#D4AF37]/40'
            }`}
          >
            {pkg.imageUrl && (
              <div className="relative h-48 w-full overflow-hidden bg-black">
                <img 
                  src={pkg.imageUrl} 
                  alt={pkg.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181B22] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 rounded-full text-[11px] font-bold text-[#D4AF37] border border-[#D4AF37]/30">
                  Package {idx + 1}
                </div>
                {pkg.highlight && (
                  <div className="absolute top-3 right-3 bg-[#D4AF37] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                    POPULAR
                  </div>
                )}
              </div>
            )}

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">{pkg.name}</h2>
                <p className="text-xs text-neutral-400 mb-6 leading-relaxed min-h-[36px]">
                  {pkg.description}
                </p>

                <div className="p-4 rounded-xl bg-black/50 border border-white/10 mb-6">
                  <span className="text-[11px] text-neutral-400 font-medium">Configured Package Investment</span>
                  <div className="text-3xl font-extrabold text-[#D4AF37] mt-1">
                    ₦{pkg.price.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    Subject to administrator confirmation
                  </div>
                </div>

                {/* Inclusions list */}
                <div className="space-y-3 mb-8">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                    Guaranteed Inclusions ({pkg.inclusions.length}):
                  </div>
                  <ul className="space-y-2.5">
                    {pkg.inclusions.map((inc, i) => (
                      <li key={i} className="text-xs text-neutral-200 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-[#D4AF37]" />
                        </div>
                        <span className="font-medium">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <button
                  onClick={() => navigateToBookingWithPackage(pkg.id)}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    pkg.highlight
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black hover:brightness-110 shadow-lg shadow-[#D4AF37]/20'
                      : 'bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black'
                  }`}
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Select &amp; Request Quotation</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* COMPREHENSIVE COMPARISON MATRIX */}
      <section className="space-y-6 pt-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Side-By-Side Inclusions Matrix
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Compare all 10 component elements across the six official afterparty packages.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#12141A]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/60 text-neutral-300">
                <th className="p-4 font-bold text-white sticky left-0 bg-[#12141A] z-10 min-w-[160px]">
                  Package Component
                </th>
                {packages.map((pkg, idx) => (
                  <th key={pkg.id} className="p-4 text-center min-w-[130px]">
                    <div className="font-bold text-white">Pkg {idx + 1}</div>
                    <div className="text-[11px] text-[#D4AF37]">₦{(pkg.price / 1000).toLocaleString()}k</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {allInclusionKeys.map((item) => (
                <tr key={item} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-semibold text-white sticky left-0 bg-[#12141A] z-10 border-r border-white/5">
                    {item}
                  </td>
                  {packages.map((pkg) => {
                    const hasItem = pkg.inclusions.some(
                      inc => inc.toLowerCase().includes(item.toLowerCase())
                    );
                    return (
                      <td key={pkg.id} className="p-4 text-center">
                        {hasItem ? (
                          <div className="inline-flex w-6 h-6 rounded-full bg-[#D4AF37]/20 items-center justify-center text-[#D4AF37]">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="inline-flex w-6 h-6 rounded-full bg-white/5 items-center justify-center text-neutral-600">
                            <X className="w-3 h-3" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Action row */}
              <tr className="bg-black/40">
                <td className="p-4 font-bold text-[#D4AF37] sticky left-0 bg-[#12141A] z-10 border-r border-white/5">
                  Select Package
                </td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center">
                    <button
                      onClick={() => navigateToBookingWithPackage(pkg.id)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#D4AF37] text-black hover:bg-[#F3E5AB] transition-colors cursor-pointer"
                    >
                      Choose
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* AI Assistance Promo */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-[#171A21] to-[#121419] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
            <Sparkles className="w-4 h-4" />
            <span>Need Tailored Advice for Your Budget?</span>
          </div>
          <h3 className="text-xl font-bold text-white">Let Gemini AI Compare Packages For You</h3>
          <p className="text-xs text-neutral-300 max-w-xl">
            Input your guest count, party theme, and exact budget. The assistant matches the most fitting official package and complementary services without inventing prices.
          </p>
        </div>
        <button
          onClick={() => {
            setCurrentPage('planner');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="shrink-0 px-6 py-3 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 cursor-pointer"
        >
          <span>Ask AI Concierge</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
