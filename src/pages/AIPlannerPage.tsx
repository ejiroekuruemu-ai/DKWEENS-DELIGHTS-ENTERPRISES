import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface StructuredPlan {
  recommendedPackageId?: string | null;
  recommendedPackageName?: string | null;
  recommendedServices?: {
    serviceId: string;
    quantity: number;
    selectedOption?: string;
  }[];
  estimatedPricedTotal?: number;
  travelNotice?: string | null;
  summary?: string;
}

export const AIPlannerPage: React.FC = () => {
  const { settings, packages, services, navigateToBookingWithPlan } = useApp();

  // Planning Form State
  const [eventType, setEventType] = useState('Wedding Afterparty');
  const [eventDate, setEventDate] = useState('2026-12-19');
  const [location, setLocation] = useState('Warri, Delta State');
  const [isOutsideArea, setIsOutsideArea] = useState(false);
  const [guestCount, setGuestCount] = useState<number>(250);
  const [budget, setBudget] = useState<number>(1200000);
  const [theme, setTheme] = useState('Black & Gold Royalty');
  const [specialNotes, setSpecialNotes] = useState('Looking for dynamic hype entry, synchronized bottle service, and discreet executive security.');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Welcome to **DKWEENS DELIGHTS Event Planning Assistant**! 👑\n\nI am connected directly to our real database of official afterparty packages (ranging from ₦400,000 to ₦1,000,000) and verified hospitality staff. Serving Warri, Effurun, Udu, Ughelli, Asaba, Bayelsa, Port Harcourt, and clients nationwide across Nigeria. Tell me about your celebration, guest count, and budget, or click **"Generate Custom Plan"** below to analyze your parameters.`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activePlan, setActivePlan] = useState<StructuredPlan | null>(null);

  const presets = [
    {
      label: 'Warri Luxury Wedding (₦1.5M)',
      type: 'Luxury Wedding Afterparty',
      budget: 1500000,
      location: 'KFT Place / PTI Hall, Warri',
      outside: false,
      guests: 350,
      theme: 'All-Gold Elegance'
    },
    {
      label: '30th Birthday Bash (₦600k)',
      type: '30th Milestone Birthday',
      budget: 600000,
      location: 'Airport Road, Effurun-Warri',
      outside: false,
      guests: 120,
      theme: 'Neon Glow Cyber'
    },
    {
      label: 'Asaba Event (Outside Warri Area)',
      type: 'High Society Anniversary',
      budget: 1000000,
      location: 'Grand Hotel, Asaba, Delta State',
      outside: true,
      guests: 200,
      theme: 'Royal Regalia'
    }
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setEventType(preset.type);
    setBudget(preset.budget);
    setLocation(preset.location);
    setIsOutsideArea(preset.outside);
    setGuestCount(preset.guests);
    setTheme(preset.theme);
  };

  const handleConsult = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputMessage || 'Please generate a tailored package and service recommendation based on my event details.';
    
    // Add user message to chat
    const updatedHistory: ChatMessage[] = [
      ...messages,
      { role: 'user', content: promptToSend }
    ];
    setMessages(updatedHistory);
    setInputMessage('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/ai/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          eventDate,
          location,
          isOutsideServiceArea: isOutsideArea,
          guestCount,
          budget,
          theme,
          specialNotes,
          conversationHistory: updatedHistory,
          message: promptToSend
        })
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([
          ...updatedHistory,
          { role: 'assistant', content: data.reply }
        ]);
        if (data.structuredPlan) {
          setActivePlan(data.structuredPlan);
        }
      } else {
        setMessages([
          ...updatedHistory,
          { role: 'assistant', content: 'We received your plan request. Please feel free to adjust your parameters or ask any specific package comparisons!' }
        ]);
      }
    } catch (err) {
      console.error('Failed to query AI planner:', err);
      setMessages([
        ...updatedHistory,
        { role: 'assistant', content: 'Our AI concierge is momentarily busy, but our standard package rules apply: Package 1 (₦1,000,000) through Package 6 (₦400,000) are available.' }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleApplyToBooking = () => {
    if (!activePlan) return;
    navigateToBookingWithPlan({
      packageId: activePlan.recommendedPackageId || undefined,
      services: activePlan.recommendedServices || [],
      budget: budget
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-xs font-bold text-[#F3E5AB] border border-[#D4AF37]/35">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>Gemini 3.8 Flash Concierge</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          AI Event Planner &amp; Package Advisor
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
          Get transparent, database-grounded recommendations tailored to your exact budget. Compare packages, configure staff, and automatically prepare your booking request.
        </p>
      </div>

      {/* Main Grid: Parameters Form (Left) & Chat Assistant / Plan (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: EVENT PARAMETERS */}
        <div className="lg:col-span-5 bg-[#14161C] border border-[#D4AF37]/30 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-bold text-white text-base">Your Event Parameters</h2>
            </div>
            <button 
              onClick={() => {
                setEventType('Wedding Afterparty');
                setBudget(1000000);
                setLocation('Lagos');
                setIsOutsideArea(false);
              }}
              className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Quick Scenario Presets */}
          <div className="space-y-2">
            <span className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
              Quick Test Scenarios:
            </span>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(p)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#F3E5AB] border border-white/10 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Event Type & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Event Type</label>
                <input
                  type="text"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Target Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Location & Outside Area Switch */}
            <div className="space-y-2">
              <label className="block text-neutral-300 font-semibold">Venue / City Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Lekki, Ikeja, Ibadan..."
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1 bg-white/5 p-2 rounded-xl border border-white/5">
                <input
                  type="checkbox"
                  checked={isOutsideArea}
                  onChange={(e) => setIsOutsideArea(e.target.checked)}
                  className="rounded text-[#D4AF37] focus:ring-0"
                />
                <span className="text-[11px] text-neutral-300">
                  Location is outside our normal Warri service area (Events outside our normal Warri service area are subject to a separate travel, accommodation, and logistics assessment)
                </span>
              </label>
            </div>

            {/* Budget & Guest Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Budget (₦ NGN)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37] font-bold">₦</span>
                  <input
                    type="number"
                    step="50000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full bg-black/60 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-white font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Estimated Guests</label>
                <div className="relative">
                  <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Theme & Notes */}
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Theme &amp; Vibe</label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g. All-White Euphoria, Cyberpunk, Royal Velvet"
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Special Requirements</label>
              <textarea
                rows={2}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Specific entry timings, cake cutting hype, VIP security filtering..."
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
              />
            </div>
          </div>

          <button
            onClick={() => handleConsult()}
            disabled={isThinking}
            className="w-full py-3.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA820A] hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isThinking ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Gemini Analyzing Pricing Database...</span>
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Custom Event Blueprint</span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: AI CONVERSATION & RECOMMENDED BLUEPRINT */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Blueprint Summary Card (if generated) */}
          {activePlan && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1E2117] via-[#201C12] to-[#1E2117] border border-[#D4AF37] shadow-2xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-extrabold text-white text-base">
                    AI Recommended Blueprint
                  </span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#D4AF37] text-black">
                  Ready to Book
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-black/50 p-4 rounded-xl border border-white/10">
                  <span className="text-neutral-400 block mb-1">Recommended Package</span>
                  <span className="text-base font-bold text-white block">
                    {activePlan.recommendedPackageName || 'Custom Configuration'}
                  </span>
                  <span className="text-[11px] text-[#D4AF37]">
                    Includes verified mascot, lighting &amp; props
                  </span>
                </div>

                <div className="bg-black/50 p-4 rounded-xl border border-white/10">
                  <span className="text-neutral-400 block mb-1">Configured Subtotal</span>
                  <span className="text-xl font-black text-[#D4AF37] block">
                    ₦{activePlan.estimatedPricedTotal?.toLocaleString() || 'Calculated in Form'}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Remaining Budget Cushion: ₦{Math.max(0, budget - (activePlan.estimatedPricedTotal || 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              {activePlan.travelNotice && (
                <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-200">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{activePlan.travelNotice}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <p className="text-xs text-neutral-300">
                  {activePlan.summary || 'Click below to transfer all recommended packages and staffing directly to the booking form.'}
                </p>
                <button
                  onClick={handleApplyToBooking}
                  className="w-full sm:w-auto shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#F3E5AB] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Apply Plan to Booking Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Interactive Chat Stream */}
          <div className="bg-[#14161C] border border-white/10 rounded-2xl flex flex-col h-[520px] shadow-xl overflow-hidden">
            {/* Chat header */}
            <div className="px-5 py-3.5 bg-black/60 border-b border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white">DKWEENS DELIGHTS Planning Assistant Session</span>
              </div>
              <span className="text-neutral-400">Official Database Grounded</span>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 text-[#D4AF37]">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#D4AF37] text-black font-medium'
                        : 'bg-[#1C1F28] border border-white/10 text-neutral-200'
                    }`}
                  >
                    <div className="whitespace-pre-line prose-invert">
                      {msg.content}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-white">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="flex gap-3 justify-start items-center text-xs text-[#D4AF37]">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-[#1C1F28] border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                    <span>Gemini is comparing database packages &amp; calculating totals...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex gap-2 overflow-x-auto text-[11px]">
              <button
                onClick={() => handleConsult('Compare Package 1 (Premium) vs Package 2 (Deluxe) for my budget.')}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 shrink-0"
              >
                Compare Pkg 1 vs 2
              </button>
              <button
                onClick={() => handleConsult('How many ushers and bouncers do you recommend for 250 guests?')}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 shrink-0"
              >
                Staffing for 250 guests?
              </button>
              <button
                onClick={() => handleConsult('Explain how travel costs work for events outside Lagos.')}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 shrink-0"
              >
                Outside Lagos Travel Policy
              </button>
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-black/80 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about packages, prices, or tailored suggestions..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (inputMessage.trim()) handleConsult();
                  }
                }}
                className="flex-1 bg-[#12141A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                onClick={() => handleConsult()}
                disabled={!inputMessage.trim() || isThinking}
                className="p-2.5 rounded-xl bg-[#D4AF37] text-black hover:bg-[#F3E5AB] transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
