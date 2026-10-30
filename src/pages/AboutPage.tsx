import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Crown, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Users, 
  Tv, 
  Wine, 
  ArrowRight,
  Database,
  Cpu,
  GraduationCap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [showTechnicalSpecs, setShowTechnicalSpecs] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Brand Hero */}
      <div className="text-center space-y-5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-xs font-bold text-[#F3E5AB]">
          <Crown className="w-4 h-4 text-[#D4AF37]" />
          <span>Warri, Delta State, Nigeria</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          About <span className="gold-gradient-text">DKWEENS DELIGHTS ENTERPRISES</span>
        </h1>
        <p className="text-base sm:text-lg text-[#F3E5AB] font-serif italic tracking-wide">
          “WE PLAN • WE CREATE • YOU CELEBRATE.”
        </p>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
          DKWEENS DELIGHTS ENTERPRISES is an established event services, entertainment, staffing, and rental business 
          based in Warri, Delta State. We specialize in transforming weddings, celebrations, and corporate functions into luxury, unforgettable experiences.
        </p>
      </div>

      {/* Brand Story & Visual Collage */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#171A21] via-[#1A1813] to-[#12141A] border border-[#D4AF37]/40 shadow-2xl space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
            <div className="relative w-44 h-44 rounded-full p-1 bg-gradient-to-b from-[#D4AF37] to-[#886915] shadow-2xl shadow-[#D4AF37]/20">
              <img 
                src="/assets/aistudio/my_logo_f5406092.jpeg" 
                alt="DKWEENS DELIGHTS ENTERPRISES Original Logo" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">DKWEENS DELIGHTS ENTERPRISES</h2>
              <p className="text-xs text-[#D4AF37] font-semibold mt-1">Official Event Services &amp; Staffing</p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-300 mt-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Warri, Delta State, Nigeria</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-300 mt-1">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>09061453586</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
            <h3 className="text-xl font-bold text-white">Our Heritage &amp; Mission</h3>
            <p>
              Born in Warri, Delta State, <strong>DKWEENS DELIGHTS ENTERPRISES</strong> was founded with one clear passion: 
              to provide seamless event execution, impeccably groomed personnel, and show-stopping afterparty entertainment that leaves celebrants and guests in awe.
            </p>
            <p>
              From royal traditional weddings and corporate galas to late-night afterparties, we combine traditional Nigerian hospitality with modern visual spectacles. 
              Our uniformed ushers, champagne hostesses, executive bouncers, hype mascots, fire dancers, and illuminated hardware work synchronously to deliver pure celebration perfection.
            </p>
            <p>
              With DKWEENS DELIGHTS, you never have to worry about erratic pricing, disorganized staff, or underwhelming climaxes. We provide upfront, transparent quotations, reliable contracts, and a passionate team on the ground.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Excellence */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">The DKWEENS Standard</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Why Clients Across Delta State Trust Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#14161C] border border-white/10 space-y-3 hover:border-[#D4AF37]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Vetted Hospitality Staff</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Professionally trained ushers in bespoke Ankara skirts or formal corporate waistcoats, champagne hostesses, and physical security bouncers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#14161C] border border-white/10 space-y-3 hover:border-[#D4AF37]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
              <Wine className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Serving Bowls &amp; Hardware</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Gold-Coloured Serving Bowls with Chilled Drinks (₦2,500 each) and Silver Serving Bowls (₦2,000 each) designed for synchronized VIP table delivery and elegant refreshment chilling.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#14161C] border border-white/10 space-y-3 hover:border-[#D4AF37]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
              <Tv className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Illuminated Hype Displays</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Crown-crested handheld video screens and glowing LED brand drink carrier boards that command total attention during celebratory toasts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#14161C] border border-white/10 space-y-3 hover:border-[#D4AF37]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Pricing &amp; Contract Integrity</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No hidden surcharges or double charges. All package inclusions are guaranteed, and quotations are sealed permanently in our central database.
            </p>
          </div>
        </div>
      </div>

      {/* Real Photo Showcase Gallery Preview */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">In The Field</span>
            <h2 className="text-xl font-bold text-white">Real Event Moments by DKWEENS DELIGHTS</h2>
          </div>
          <button
            onClick={() => setCurrentPage('gallery')}
            className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Complete Gallery ({17}) →</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl overflow-hidden h-48 bg-black border border-white/10">
            <img 
              src="/assets/aistudio/5_ushers_76d2682c.jpeg" 
              alt="Ushers in Ankara Skirts" 
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div className="rounded-2xl overflow-hidden h-48 bg-black border border-white/10">
            <img 
              src="/assets/aistudio/white_champagne_gown_standing_506b0fbc.jpeg" 
              alt="Champagne Girls" 
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div className="rounded-2xl overflow-hidden h-48 bg-black border border-white/10">
            <img 
              src="/assets/aistudio/afterparty_team_ac9b2157.jpeg" 
              alt="Afterparty Troupe" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div className="rounded-2xl overflow-hidden h-48 bg-black border border-white/10">
            <img 
              src="/assets/aistudio/silver_bowl_3f2e880f.jpeg" 
              alt="Silver Serving Bowls" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
            />
          </div>
        </div>
      </div>

      {/* Collapsible Technical Specifications for Academic Review */}
      <div className="rounded-2xl bg-[#12141A] border border-white/10 overflow-hidden">
        <button
          onClick={() => setShowTechnicalSpecs(!showTechnicalSpecs)}
          className="w-full p-5 flex items-center justify-between text-left text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <span className="text-xs font-bold text-white block">
                Technical Architecture &amp; Capstone Project Specification
              </span>
              <span className="text-[11px] text-neutral-400">
                Click to inspect backend pricing engine, database snapshots, and Gemini AI integration details.
              </span>
            </div>
          </div>
          {showTechnicalSpecs ? (
            <ChevronUp className="w-4 h-4 text-[#D4AF37]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          )}
        </button>

        {showTechnicalSpecs && (
          <div className="p-6 border-t border-white/10 space-y-6 text-xs text-neutral-300 bg-black/40">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                <span className="text-neutral-400 block font-semibold">Project Title</span>
                <span className="text-white font-bold block">DKWEENS DELIGHTS ENTERPRISES System</span>
                <span className="text-[11px] text-neutral-400">Full-Stack Event Booking &amp; Operations</span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                <span className="text-neutral-400 block font-semibold">Presentation Date</span>
                <span className="text-[#D4AF37] font-bold block">November 5, 2026</span>
                <span className="text-[11px] text-neutral-400">AI Fundamentals Capstone Assessment</span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                <span className="text-neutral-400 block font-semibold">Core Technology</span>
                <span className="text-white font-bold block">React 19, TypeScript, Express, Gemini 3.8 Flash</span>
                <span className="text-[11px] text-neutral-400">Server-authoritative database &amp; pricing engine</span>
              </div>
            </div>

            <p className="leading-relaxed">
              This system solves real-world challenges in Nigerian event hospitality: preventing unauthorized price manipulation, 
              guaranteeing immutable quotation records, formalizing travel logistics outside Warri/Delta State, and enabling real-time administrative auditing.
            </p>
          </div>
        )}
      </div>

      {/* Call to action */}
      <div className="text-center p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#171A21] via-[#1F1C12] to-[#171A21] border border-[#D4AF37]/40 space-y-4 shadow-2xl">
        <h3 className="text-2xl font-black text-white">Let Us Plan Your Next Grand Occasion</h3>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed font-light">
          Serving Warri, Effurun, Udu, Ughelli, Asaba, Bayelsa, Port Harcourt, and clients nationwide across Nigeria.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setCurrentPage('packages');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-xl text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#F3E5AB] transition-colors shadow-lg shadow-[#D4AF37]/20 cursor-pointer"
          >
            Explore 6 Afterparty Packages
          </button>
          <button
            onClick={() => {
              setCurrentPage('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
          >
            Contact Warri Office (09061453586)
          </button>
        </div>
      </div>
    </div>
  );
};
