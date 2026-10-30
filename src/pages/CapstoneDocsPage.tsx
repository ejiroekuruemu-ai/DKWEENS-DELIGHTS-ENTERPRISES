import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  Code, 
  Sparkles, 
  Database, 
  FileText, 
  Printer, 
  Crown,
  Calendar,
  Layers,
  Zap,
  ArrowRight
} from 'lucide-react';

export const CapstoneDocsPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-xs font-bold text-[#F3E5AB] border border-[#D4AF37]/30 mb-2">
            <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
            <span>AI Fundamentals Capstone Project</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            Project Documentation &amp; Evaluation Guide
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Official Capstone Presentation Date: <strong>November 5, 2026</strong> • Candidate: <strong>Ejiro Ekuruemu</strong>
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Evaluation Dossier</span>
        </button>
      </div>

      {/* SECTION 1: EXECUTIVE PROJECT SUMMARY */}
      <div className="p-8 rounded-3xl bg-[#14161C] border border-white/10 space-y-4 text-xs leading-relaxed text-neutral-300">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Crown className="w-5 h-5 text-[#D4AF37]" />
          <span>1. Project Purpose &amp; Scope</span>
        </h2>
        <p>
          <strong>DKWEENS DELIGHTS ENTERPRISES — Event Services, Staffing &amp; Rentals Management System</strong> was built as a capstone project to demonstrate enterprise-grade full-stack architecture, database-driven pricing integrity, and generative AI workflow orchestration for an authentic Nigerian event enterprise based in Warri, Delta State.
        </p>
        <p>
          It addresses real problems in the Nigerian event industry: customers face opaque, fluctuating charges for afterparty packages and party rentals, while event management companies struggle with uncoordinated booking requests, unpriced custom requests, and out-of-corridor logistics confusion.
        </p>
      </div>

      {/* SECTION 2: THE 6 OFFICIAL AFTERPARTY PACKAGES TEST SPECIFICATION */}
      <div className="p-8 rounded-3xl bg-[#14161C] border border-white/10 space-y-4 text-xs leading-relaxed text-neutral-300">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
          <span>2. Official Packages &amp; Pricing Rules Verification</span>
        </h2>
        <p>
          The system strictly implements the required six packages with exact prices and database-verified inclusions:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="bg-black/50 p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="font-bold text-white block">Package 1 — Premium Experience: ₦1,000,000</span>
            <span className="text-[11px] text-neutral-400">
              Couples mix, gorilla, power bike, fire dancer, LED costumes, afterparty props, board, lights, and bottle girls.
            </span>
          </div>
          <div className="bg-black/50 p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="font-bold text-white block">Package 2 — Deluxe Experience: ₦800,000</span>
            <span className="text-[11px] text-neutral-400">
              Couples mix, gorilla, fire dancer, LED costumes, afterparty props, board, lights, and bottle girls.
            </span>
          </div>
          <div className="bg-black/50 p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="font-bold text-white block">Package 3 — Gold Experience: ₦750,000</span>
            <span className="text-[11px] text-neutral-400">
              Gorilla, fire dancer, LED costumes, afterparty props, board, lights, and bottle girls.
            </span>
          </div>
          <div className="bg-black/50 p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="font-bold text-white block">Package 4 — Silver Experience: ₦550,000</span>
            <span className="text-[11px] text-neutral-400">
              Gorilla, LED costumes, afterparty props, board, lights, and bottle girls.
            </span>
          </div>
          <div className="bg-black/50 p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="font-bold text-white block">Package 5 — Classic Experience: ₦500,000</span>
            <span className="text-[11px] text-neutral-400">
              Gorilla, LED costumes, board, lights, and bottle girls.
            </span>
          </div>
          <div className="bg-black/50 p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="font-bold text-white block">Package 6 — Essential Experience: ₦400,000</span>
            <span className="text-[11px] text-neutral-400">
              LED costumes, board, lights, drink carriers, and bottle girls.
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 space-y-1.5 text-[11px]">
          <span className="font-bold text-[#D4AF37] block">Pricing Engine Invariants:</span>
          <div>• Inclusions already in a selected package are NEVER added twice.</div>
          <div>• Ushers: ₦17,000 per person • Champagne Girls: ₦17,000 per person • Bouncers: ₦30,000 per bouncer.</div>
          <div>• Serving Bowls: Silver Serving Bowls (₦2,000 each) &amp; Gold-Coloured Serving Bowls with Chilled Drinks (₦2,500 each). Never describe serving bowls as boats.</div>
          <div>• Quotations preserve immutable price snapshots so future catalog updates do not mutate historic records.</div>
        </div>
      </div>

      {/* SECTION 3: TRAVEL ASSESSMENT POLICY */}
      <div className="p-8 rounded-3xl bg-[#14161C] border border-white/10 space-y-4 text-xs leading-relaxed text-neutral-300">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
          <span>3. Transportation, Accommodation &amp; Logistics Rules</span>
        </h2>
        <p>
          Per the project prompt rules, travel, transportation, accommodation, and logistics are <strong>never advertised as free</strong>.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Approved Service Coverage:</strong> Serving Warri, Effurun, Udu, Ughelli, Asaba, Bayelsa, Port Harcourt, and clients nationwide across Nigeria.</li>
          <li>For events within our normal Warri service area, standard package rates apply directly.</li>
          <li><strong>Logistics Policy:</strong> Events outside our normal Warri service area are subject to a separate travel, accommodation, and logistics assessment. Any applicable charges will be communicated transparently before booking confirmation.</li>
          <li>The system <strong>never invents a fictitious transportation surcharge</strong> or automatically adds unapproved charges.</li>
          <li>Travel charges remain pending until the administrator enters or approves itemized charges in the dashboard.</li>
          <li>If required charges are pending, the quotation is explicitly labelled <strong>"Incomplete (Pending Travel Assessment)"</strong> rather than presenting an unconfirmed total.</li>
        </ul>
      </div>

      {/* SECTION 4: AI PROMPTING & GEMINI ARCHITECTURE */}
      <div className="p-8 rounded-3xl bg-[#14161C] border border-white/10 space-y-4 text-xs leading-relaxed text-neutral-300">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <span>4. Gemini AI Concierge &amp; Prompt Engineering</span>
        </h2>
        <p>
          The AI event planner runs on the server side using Google's modern <code>@google/genai</code> SDK and model <code>gemini-3.8-flash</code> with <code>User-Agent: 'aistudio-build'</code>.
        </p>
        <div className="bg-black/60 p-4 rounded-xl border border-white/5 font-mono text-[11px] space-y-2">
          <div className="text-neutral-400">// Grounding Ingestion:</div>
          <div>The system prompt dynamically injects live database records for all 6 packages and catalog items.</div>
          <div className="text-neutral-400">// Strict Anti-Hallucination Directives:</div>
          <div>1. Never invent missing prices or discounts.</div>
          <div>2. Always distinguish confirmed prices from pending logistics assessments.</div>
          <div>3. Return structured recommendations allowing 1-click customer transfer into the booking form.</div>
        </div>
      </div>

      {/* SECTION 5: STEP-BY-STEP CAPSTONE PRESENTATION SCRIPT */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#171A21] via-[#1B1912] to-[#171A21] border border-[#D4AF37]/50 space-y-6 text-xs text-neutral-300 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#D4AF37]" />
            <span>5. Capstone Presentation Demo Script (For Nov 5, 2026)</span>
          </h2>
          <span className="text-[11px] font-bold text-[#D4AF37]">5-Minute Flow</span>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-1">
            <span className="font-bold text-white block">Step 1 (Minute 1): Homepage &amp; Package Matrix</span>
            <p>
              Navigate to <strong>Packages</strong>. Point out Package 1 (₦1M) down to Package 6 (₦400k) and scroll to the side-by-side Inclusions Matrix showing component differences.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-1">
            <span className="font-bold text-white block">Step 2 (Minute 2): Gemini AI Planner in Action</span>
            <p>
              Navigate to <strong>AI Planner</strong>. Click the preset <em>"Warri Luxury Wedding (₦1.5M)"</em>. Ask the AI to recommend an optimal package. Highlight that Gemini selects Package 1 or 2, adds ushers and gold-coloured serving bowls, stays under budget, and produces a structured blueprint. Click <strong>"Apply Plan to Booking Request"</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-1">
            <span className="font-bold text-white block">Step 3 (Minute 3): Travel Policy &amp; Booking Submission</span>
            <p>
              In the Booking Form, check the box: <em>"Event requires travel outside our normal Warri service area"</em> (e.g. Asaba). Show how the quotation summary immediately updates to <strong>"Pending Assessment"</strong> and <strong>"Incomplete"</strong>. Click <strong>"Submit Booking Request"</strong> and show the generated reference (DK-2026-XXXX).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-1">
            <span className="font-bold text-white block">Step 4 (Minute 4): Admin Operations &amp; Travel Surcharges</span>
            <p>
              Click <strong>Admin Portal</strong> at the top right (use 1-Click Demo Login). Find the new booking. Open the review modal, add an itemized travel surcharge (e.g. ₦80,000 for Interstate Performers Van), set status to <strong>"Approved"</strong>, and save.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-1">
            <span className="font-bold text-white block">Step 5 (Minute 5): Verification &amp; Audit Logs</span>
            <p>
              Switch back to <strong>Check Status</strong> with the booking reference: show the updated status, the newly approved grand total, and the itemized travel charge. Finally, show the <strong>Notification Audit Log</strong> in Admin proving customer acknowledgements and alerts were recorded.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-xl text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#F3E5AB] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Return to Live Website</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
