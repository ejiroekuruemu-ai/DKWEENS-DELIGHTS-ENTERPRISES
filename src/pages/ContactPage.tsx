import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertTriangle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !message) {
      setError('Please provide your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/25">
          <Mail className="w-3.5 h-3.5" />
          <span>Connect With DKWEENS DELIGHTS ENTERPRISES</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Contact &amp; Custom Enquiries
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
          Have bespoke event specifications, out-of-state logistics questions, or rental requests? Our Warri-based event concierge is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Direct Info & Service Area Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#14161C] border border-white/10 space-y-6">
            <h2 className="text-lg font-bold text-white">Direct Communication Channels</h2>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 text-neutral-300">
                <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Official Phone &amp; WhatsApp</span>
                  <span className="text-[#D4AF37] font-bold text-sm block">09061453586</span>
                  <span className="block text-[11px] text-neutral-400 mt-0.5">Direct line to DKWEENS DELIGHTS management</span>
                  <a
                    href="https://wa.me/2349061453586?text=Hello%20DKWEENS%20DELIGHTS%20ENTERPRISES%2C%20I%20would%20like%20to%20inquire%20about%20event%20booking"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors font-semibold"
                  >
                    <span>Chat on WhatsApp (09061453586)</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-neutral-300">
                <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Official Operations Email</span>
                  <span>{settings?.adminEmail || 'admin@dkweensdelights.ng'}</span>
                  <span className="block text-[11px] text-neutral-500 mt-0.5">Quotations, vendor partnerships &amp; invoices</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-neutral-300">
                <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Headquarters &amp; Service Coverage</span>
                  <span className="text-white font-medium">Warri, Delta State, Nigeria</span>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                    Serving Warri, Effurun, Udu, Ughelli, Asaba, Bayelsa, Port Harcourt, and clients nationwide across Nigeria.
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed bg-white/5 p-2 rounded-lg border border-white/5">
                    Events outside our normal Warri service area are subject to a separate travel, accommodation, and logistics assessment. Any applicable charges will be communicated transparently before booking confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ note */}
          <div className="p-6 rounded-2xl bg-[#12141A] border border-[#D4AF37]/20 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-sm font-bold text-[#F3E5AB]">
              <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
              <span>How Fast Do We Respond?</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Standard booking quotations are reviewed within 4 to 12 business hours. Events outside our normal Warri service area are subject to a separate travel, accommodation, and logistics assessment. Any applicable charges will be communicated transparently before booking confirmation.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 bg-[#14161C] border border-[#D4AF37]/30 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white">Send A Message To Our Team</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Your inquiry is logged directly into the DKWEENS DELIGHTS operations portal and monitored by our management.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-[#1C2018] border border-emerald-500/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Enquiry Successfully Recorded</h3>
              <p className="text-xs text-neutral-300 max-w-md mx-auto">
                Thank you for reaching out to DKWEENS DELIGHTS ENTERPRISES. Our event coordinator will inspect your enquiry and reply via phone or email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Your Name <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chukwuma Obi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Email Address <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +234 809 111 2233"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Message Details <span className="text-[#D4AF37]">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about your event requirements, venue location, or specific questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA820A] hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Saving to Database...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Enquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
