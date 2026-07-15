import React, { useState, useEffect } from "react";
import { Mail, ShieldCheck, Send, User, MessageSquare, AlertCircle, RefreshCw, Key, Unlock, CheckCircle } from "lucide-react";

interface ContactProps {
  playClick: () => void;
  soundEnabled: boolean;
}

interface SavedMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

export default function ContactSection({ playClick, soundEnabled }: ContactProps) {
  // Form input states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Validation / status states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  // Admin decrypted inbox states
  const [adminKey, setAdminKey] = useState("");
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminMessages, setAdminMessages] = useState<SavedMessage[]>([]);
  const [adminError, setAdminError] = useState("");
  const [isFetchingInbox, setIsFetchingInbox] = useState(false);

  // Play audio note helper
  const playBeep = (freq: number, type: OscillatorType = "sine", duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Ignored
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Client-side JavaScript form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Nama lengkap wajib diisi!";
    if (!formData.subject.trim()) newErrors.subject = "Subjek pesan wajib diisi!";
    if (!formData.message.trim()) newErrors.message = "Konten pesan tidak boleh kosong!";

    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      newErrors.email = "Alamat email wajib diisi!";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        newErrors.email = "Format alamat email tidak valid!";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setSubmitStatus(null);
    setStatusMessage("");

    if (!validateForm()) {
      playBeep(220, "sawtooth", 0.2);
      return;
    }

    setIsSubmitting(true);
    playBeep(440, "sine", 0.1);

    try {
      // Real Fetch POST to our Express Backend API `/api/contact`
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        setStatusMessage(result.message || "Pesan berhasil dikirim!");
        playBeep(880, "sine", 0.3);
        // Clear form
        setFormData({ name: "", email: "", subject: "", message: "" });
        
        // If admin inbox is currently unlocked, refresh the list automatically!
        if (isAdminUnlocked) {
          fetchInboxMessages();
        }
      } else {
        setSubmitStatus("error");
        setStatusMessage(result.message || "Gagal mengirim pesan.");
        playBeep(220, "sawtooth", 0.25);
      }
    } catch (err) {
      setSubmitStatus("error");
      setStatusMessage("Gagal menghubungi server. Pastikan koneksi server aktif.");
      playBeep(220, "sawtooth", 0.25);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch submitted messages from node backend securely
  const fetchInboxMessages = async () => {
    setIsFetchingInbox(true);
    setAdminError("");

    try {
      const response = await fetch("/api/messages", {
        headers: {
          Authorization: `Bearer ${adminKey.trim()}`,
        },
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setAdminMessages(result.data || []);
        setIsAdminUnlocked(true);
        playBeep(659.3, "sine", 0.15); // E5 note
      } else {
        setAdminError(result.message || "Kunci akses administratif tidak sah!");
        setIsAdminUnlocked(false);
        playBeep(220, "sawtooth", 0.25);
      }
    } catch (err) {
      setAdminError("Gagal terhubung ke terminal inbox.");
      setIsAdminUnlocked(false);
    } finally {
      setIsFetchingInbox(false);
    }
  };

  const handleAdminAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    if (!adminKey.trim()) return;
    fetchInboxMessages();
  };

  return (
    <section id="contact" className="relative py-24 bg-[#0a0a14] border-t border-gray-900 overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      {/* Neon glowing light */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-cyber-cyan/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-cyber-cyan mb-2">
            <Mail className="h-4 w-4 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest">SECURE LINK FOR INQUIRIES</span>
          </div>
          <h2 className="font-cyber font-black text-2xl sm:text-4xl tracking-wider text-white uppercase">
            HUBUNGI <span className="text-cyber-cyan">IMAM FALAHI</span>
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-cyber-cyan to-cyber-magenta mx-auto mt-4"></div>
          <p className="mt-4 text-gray-400 font-sans text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Kirimkan penawaran kolaborasi, proyek infrastruktur IT, audit kepatuhan regulasi, atau sapaan hangat melalui saluran komunikasi terenkripsi di bawah.
          </p>
        </div>

        {/* Contact Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-start">
          
          {/* Left Column: Direct encrypted channel Form */}
          <div className="lg:col-span-7 bg-[#0e0e1a]/80 p-6 sm:p-8 rounded-xl border border-gray-850 backdrop-blur-md text-left">
            <h3 className="font-cyber font-bold text-sm text-white uppercase tracking-wider mb-6 flex items-center text-cyber-cyan">
              <ShieldCheck className="h-4 w-4 mr-2" />
              <span>Formulir Kontak Terenkripsi</span>
            </h3>

            {/* Status notifications */}
            {submitStatus === "success" && (
              <div className="mb-6 p-4 rounded bg-cyber-green/10 border border-cyber-green/30 text-cyber-green text-xs font-sans flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <div>
                  <strong className="block font-semibold">Berhasil Terkirim!</strong>
                  <span>{statusMessage}</span>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-6 p-4 rounded bg-red-950/20 border border-red-900/40 text-red-400 text-xs font-sans flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div>
                  <strong className="block font-semibold">Pengiriman Gagal!</strong>
                  <span>{statusMessage}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Nama Lengkap</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-600"><User className="h-4 w-4" /></span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Falahi Recruiter"
                      className={`w-full bg-[#07070d] border ${errors.name ? "border-red-500/50" : "border-gray-800 focus:border-cyber-cyan"} rounded pl-10 pr-3 py-2 text-xs font-sans text-white outline-none transition-colors`}
                    />
                  </div>
                  {errors.name && <p className="text-red-400 text-[10px] mt-1 font-mono">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Email Pengirim</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-600"><Mail className="h-4 w-4" /></span>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. hr@company.com"
                      className={`w-full bg-[#07070d] border ${errors.email ? "border-red-500/50" : "border-gray-800 focus:border-cyber-cyan"} rounded pl-10 pr-3 py-2 text-xs font-sans text-white outline-none transition-colors`}
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-[10px] mt-1 font-mono">{errors.email}</p>}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Subjek Hubungan</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-600"><MessageSquare className="h-4 w-4" /></span>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g. Kerja Sama Audit IT &amp; Legal Compliance"
                    className={`w-full bg-[#07070d] border ${errors.subject ? "border-red-500/50" : "border-gray-800 focus:border-cyber-cyan"} rounded pl-10 pr-3 py-2 text-xs font-sans text-white outline-none transition-colors`}
                  />
                </div>
                {errors.subject && <p className="text-red-400 text-[10px] mt-1 font-mono">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Pesan Rahasia</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Ketikkan detail pesan penawaran atau pertanyaan Anda secara rahasia di sini..."
                  className={`w-full bg-[#07070d] border ${errors.message ? "border-red-500/50" : "border-gray-800 focus:border-cyber-cyan"} rounded p-3 text-xs font-sans text-white outline-none transition-colors`}
                />
                {errors.message && <p className="text-red-400 text-[10px] mt-1 font-mono">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 rounded font-cyber font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  isSubmitting
                    ? "bg-gray-850 text-gray-500 border border-gray-800"
                    : "bg-cyber-cyan text-cyber-bg hover:bg-cyber-cyan/80 shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>MENGIRIM PESAN SECURE...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>KIRIM PESAN SECURE</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Direct Info Cards & Secure Decrypted Recruiter Inbox */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Info Board */}
            <div className="bg-[#0e0e1a]/50 p-5 rounded-xl border border-gray-850 text-left">
              <h4 className="font-cyber font-bold text-xs text-white uppercase tracking-widest mb-3">
                HUBUNGAN UTAMA
              </h4>
              <div className="space-y-3.5 font-sans text-xs">
                <div>
                  <div className="text-[9px] font-mono text-gray-550 uppercase tracking-widest">EMAIL RESPONDEN</div>
                  <a href="mailto:pma.media.jogja@gmail.com" className="text-cyber-cyan font-mono hover:underline font-medium block mt-0.5 break-all">pma.media.jogja@gmail.com</a>
                  <a href="mailto:mobho@ymail.com" className="text-cyber-magenta font-mono hover:underline font-medium block mt-0.5 break-all">mobho@ymail.com</a>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-gray-550 uppercase tracking-widest">TELEPON / WHATSAPP</div>
                  <span className="text-white font-mono block mt-0.5">+62 878-8878-0999</span>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-gray-550 uppercase tracking-widest">LOKASI DINAS</div>
                  <span className="text-gray-400 block mt-0.5">Sleman, DI Yogyakarta, Indonesia</span>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-gray-550 uppercase tracking-widest">PROFIL SOSIAL</div>
                  <a href="https://linkedin.com/in/tugelanboto" target="_blank" rel="noopener noreferrer" className="text-cyber-cyan hover:underline font-mono font-medium block mt-0.5">linkedin.com/in/tugelanboto</a>
                </div>
              </div>
            </div>

            {/* Recruiter secured decrypted Inbox dashboard */}
            <div className="bg-[#0e0e1a]/80 p-5 rounded-xl border border-gray-850 text-left space-y-4">
              <h4 className="font-cyber font-bold text-xs text-white uppercase tracking-widest flex items-center text-cyber-magenta">
                <Key className="h-4 w-4 mr-2" />
                <span>Secure Recruiter Inbox</span>
              </h4>
              <p className="text-gray-400 text-xs font-sans leading-relaxed">
                Terminal inbox rahasia yang terhubung langsung ke database in-memory server. Masukkan kunci otorisasi di bawah untuk menguji keandalan transmisi backend dan membaca pesan terkirim secara langsung.
              </p>
              
              <div className="bg-gray-900/60 p-2.5 rounded border border-gray-850 text-[10px] font-mono text-gray-500 leading-normal">
                <span className="font-bold text-gray-400 block mb-0.5">KUNCI AKSES DEMO:</span>
                <span>CYBER_COMPLIANCE_KEY_2026</span>
              </div>

              <form onSubmit={handleAdminAccessSubmit} className="space-y-2 flex items-center space-x-2">
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Kunci Otorisasi..."
                  disabled={isFetchingInbox}
                  className="flex-1 bg-[#07070d] border border-gray-800 focus:border-cyber-magenta rounded px-3 py-2 text-xs font-mono text-white outline-none"
                />
                <button
                  type="submit"
                  disabled={isFetchingInbox || !adminKey}
                  className="px-4 py-2 rounded bg-cyber-magenta text-white hover:bg-cyber-magenta/80 font-cyber font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_8px_rgba(255,0,127,0.2)] shrink-0"
                >
                  {isFetchingInbox ? "Decrypting..." : "Decrypt"}
                </button>
              </form>

              {adminError && (
                <p className="text-red-400 text-[10px] font-mono mt-1">{adminError}</p>
              )}

              {/* Unlocked Messages list */}
              {isAdminUnlocked && (
                <div className="space-y-3 pt-2 h-44 overflow-y-auto scrollbar-thin border-t border-gray-900 mt-2">
                  <div className="text-[9px] font-mono text-cyber-green font-bold uppercase tracking-widest flex items-center mb-2">
                    <Unlock className="h-3.5 w-3.5 mr-1.5 animate-pulse" />
                    <span>AKSES TERBUKA: {adminMessages.length} PESAN DI DEKRIPSI</span>
                  </div>
                  {adminMessages.length === 0 ? (
                    <p className="text-gray-600 text-xs italic">Belum ada pesan terkirim di database server.</p>
                  ) : (
                    adminMessages.map((msg) => (
                      <div key={msg.id} className="p-2.5 bg-gray-950 rounded border border-gray-900 text-xs font-sans space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-white text-[11px]">{msg.name}</strong>
                          <span className="text-[8px] font-mono text-gray-550">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="text-[9px] font-mono text-cyber-cyan break-all">{msg.email}</div>
                        <div className="text-gray-400 text-[11px] leading-relaxed pt-1 border-t border-gray-900/40 mt-1 select-text">
                          <strong className="text-gray-200">Subjek:</strong> {msg.subject}<br />
                          <strong className="text-gray-200">Isi:</strong> {msg.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
