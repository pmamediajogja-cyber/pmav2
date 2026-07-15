import React, { useEffect, useRef, useState } from "react";
import { Terminal, ShieldCheck, FileCheck, Code2, AlertTriangle, Play, HelpCircle } from "lucide-react";

interface HeroProps {
  playClick: () => void;
  soundEnabled: boolean;
}

export default function ParallaxHero({ playClick, soundEnabled }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "SEC_CORE_SYS INIT_SUCCESS",
    "DECRYPT_CREDENTIALS: IMAM_FALAHI_PROFILE",
    "S.Kom (Informatics Graduate, IPK 3.82 / Cum Laude)",
    "Status: System Administrator & Compliance Enforcer",
    "Type 'help' for available terminal operations.",
  ]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Responsive Matrix digital rain using ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let columns = 0;
    let drops: number[] = [];
    const fontSize = 14;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        canvas.width = width;
        canvas.height = height;

        columns = Math.floor(width / fontSize);
        drops = Array(columns).fill(1);
      }
    });

    resizeObserver.observe(container);

    const alphabets = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*+-/=";
    const draw = () => {
      // Semi-transparent black to create trailing fade effect
      ctx.fillStyle = "rgba(7, 7, 13, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyan-magenta hybrid color coding for futuristic aesthetic
      ctx.fillStyle = "rgba(0, 240, 255, 0.4)";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Highlighting some characters with pink or green glow
        if (Math.random() > 0.98) {
          ctx.fillStyle = "#ff007f"; // Cyber Pink
        } else if (Math.random() > 0.95) {
          ctx.fillStyle = "#39ff14"; // Cyber Green
        } else {
          ctx.fillStyle = "rgba(0, 240, 255, 0.55)"; // Cyber Cyan
        }

        const text = alphabets[Math.floor(Math.random() * alphabets.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      resizeObserver.disconnect();
    };
  }, []);

  // Scroll down indicator helper
  const scrollNext = () => {
    playClick();
    const aboutSec = document.querySelector("#about");
    if (aboutSec) {
      aboutSec.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Interactive CLI commands
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();

    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    let response: string[] = [];

    switch (cmd) {
      case "help":
        response = [
          `> ${cmd}`,
          "--- OPERASI UTAMA TERMINAL ---",
          "whoami     : Deskripsi spesialisasi Imam Falahi",
          "skills     : List kemampuan inti Legal & IT",
          "stats      : Metrik performa dan pencapaian",
          "compliance : Status kepatuhan & standar regulasi",
          "clear      : Bersihkan layar terminal",
        ];
        break;
      case "whoami":
        response = [
          `> ${cmd}`,
          "PROFIL: IMAM FALAHI, S.Kom",
          "Spesialisasi ganda di persimpangan IT Operations dan Legal Compliance.",
          "Membantu industri memperketat keamanan data siber, merawat infrastruktur IT,",
          "dan memastikan kepatuhan regulasi hukum (OSS RBA, SIMBG, Jaminan Fidusia) tetap 100% aman.",
        ];
        break;
      case "skills":
        response = [
          `> ${cmd}`,
          "IT: Linux/Windows SysAdmin, LAN/WLAN, DB Encryption, Web Dev, IoT ESP32.",
          "LEGAL: Sistem OSS RBA, SIMBG (PBG), Jaminan Fidusia, Pertanahan & Agraria.",
          "CREATIVE: Fotografi, Videografi, Adobe Creative Suite, CorelDraw, Canva.",
        ];
        break;
      case "stats":
        response = [
          `> ${cmd}`,
          "KINERJA & PENCAPAIAN:",
          "- IPK: 3.82 (Predikat Pujian / Cum Laude) Universitas Siber Muhammadiyah",
          "- Dokumen Legal: Rata-rata 300+ dokumen per bulan diproses",
          "- Jaminan Fidusia: Rekor volume tinggi 1,500+ akta/bulan tanpa cacat hukum",
          "- Akurasi: 99% pada alur kerja administrasi terotomatisasi",
        ];
        break;
      case "compliance":
        response = [
          `> ${cmd}`,
          "SISTEM REGULASI TERPADU:",
          "✔ OSS RBA (Online Single Submission Risk-Based Approach)",
          "✔ SIMBG (Sistem Informasi Manajemen Bangunan Gedung) - PBG",
          "✔ NPWP Badan & Aktivasi Kepatuhan Pajak Korporasi",
          "✔ Enkripsi database lokal dan keamanan arsip klien Notaris",
        ];
        break;
      case "clear":
        setTerminalLogs([]);
        setTerminalInput("");
        return;
      default:
        response = [
          `> ${cmd}`,
          `Sistem: Perintah '${cmd}' tidak dikenali.`,
          "Ketik 'help' untuk daftar perintah yang tersedia.",
        ];
        break;
    }

    setTerminalLogs((prev) => [...prev, ...response]);
    setTerminalInput("");
  };

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-[#07070d] scanline"
    >
      {/* Background Matrix Rain */}
      <canvas ref={canvasRef} className="absolute inset-0 block z-0" />

      {/* Cyber Grid Layer for depth */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none z-10" />

      {/* Floating Ambient Neon Lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-cyan/10 rounded-full filter blur-[120px] pointer-events-none z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-magenta/10 rounded-full filter blur-[120px] pointer-events-none z-10" />

      {/* Hero Content Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        {/* Left Column: Glitch Titles & Profile Pitch */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2 bg-cyber-card border border-cyber-cyan/30 px-3 py-1 rounded-full backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-cyber-cyan animate-pulse"></span>
            <span className="font-mono text-xs text-cyber-cyan uppercase tracking-widest">
              SecOps & Legal Compliance Portal
            </span>
          </div>

          {/* Glitched Name & Title */}
          <div className="space-y-2">
            <h1 className="font-cyber font-black text-4xl sm:text-6xl lg:text-7xl tracking-wider text-white select-none leading-none">
              IMAM <span className="text-cyber-cyan hover:text-cyber-magenta transition-colors duration-300">FALAHI</span>
            </h1>
            <p className="font-cyber font-medium text-lg sm:text-xl text-cyber-magenta uppercase tracking-widest animate-neon-pulse">
              IT Operations & Legal Compliance Specialist
            </p>
          </div>

          <p className="text-gray-400 font-sans text-sm sm:text-base leading-relaxed max-w-xl">
            Lulusan Sarjana Informatika (S.Kom, Cum Laude) yang menguasai sinergi unik antara
            <strong className="text-white"> IT Infrastructure, Cyber Operations, dan Legal Compliance</strong>. Ahli dalam otomatisasi sistem administrasi, pengamanan arsip digital, dan regulasi kepatuhan hukum nasional (OSS RBA, SIMBG, Fidusia).
          </p>

          {/* Core Metrics Bento Cards */}
          <div className="grid grid-cols-3 gap-3 max-w-lg">
            <div className="bg-[#0e0e1a]/80 p-3 rounded-lg border border-gray-800 hover:border-cyber-cyan/40 transition-all duration-300 backdrop-blur-sm">
              <div className="text-cyber-cyan font-cyber font-black text-xl sm:text-2xl">3.82</div>
              <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">IPK / Cum Laude</div>
            </div>
            <div className="bg-[#0e0e1a]/80 p-3 rounded-lg border border-gray-800 hover:border-cyber-magenta/40 transition-all duration-300 backdrop-blur-sm">
              <div className="text-cyber-magenta font-cyber font-black text-xl sm:text-2xl">1.5k+</div>
              <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">Akta/Bulan Terproses</div>
            </div>
            <div className="bg-[#0e0e1a]/80 p-3 rounded-lg border border-gray-800 hover:border-cyber-green/40 transition-all duration-300 backdrop-blur-sm">
              <div className="text-cyber-green font-cyber font-black text-xl sm:text-2xl">99%</div>
              <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">Akurasi Legalitas</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => {
                playClick();
                document.querySelector("#tools")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3 rounded-lg bg-cyber-cyan text-cyber-bg font-cyber font-bold text-xs uppercase tracking-widest hover:bg-cyber-cyan/80 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.7)] flex items-center space-x-2"
            >
              <Terminal className="h-4 w-4" />
              <span>Buka Cyber Tools</span>
            </button>
            <button
              onClick={() => {
                playClick();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3 rounded-lg bg-transparent text-white font-cyber font-bold text-xs uppercase tracking-widest border border-gray-700 hover:border-cyber-magenta hover:text-cyber-magenta transition-all cursor-pointer flex items-center space-x-2"
            >
              <span>Hubungi Saya</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Cyber Command CLI Console */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-[#07070d]/90 rounded-xl border border-cyber-cyan/30 shadow-[0_0_30px_rgba(0,240,255,0.15)] overflow-hidden flex flex-col h-[350px] font-mono text-xs backdrop-blur-md">
            {/* Console Header bar */}
            <div className="bg-[#0e0e1a] px-4 py-2 border-b border-cyber-cyan/20 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
              </div>
              <span className="text-gray-500 font-cyber font-bold text-[10px] tracking-widest uppercase flex items-center space-x-1">
                <Terminal className="h-3 w-3 text-cyber-cyan animate-pulse mr-1" />
                <span>SEC_CORE_SYS@FALAHI_OS</span>
              </span>
              <span className="text-[10px] text-cyber-cyan font-bold">1.0.4-LTS</span>
            </div>

            {/* Console Log outputs */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2 text-left select-text scrollbar-thin scrollbar-thumb-gray-800">
              {terminalLogs.map((log, index) => {
                let colorClass = "text-gray-400";
                if (log.startsWith(">")) colorClass = "text-cyber-cyan font-bold";
                else if (log.startsWith("PROFIL:") || log.startsWith("---") || log.startsWith("KINERJA") || log.startsWith("SISTEM")) colorClass = "text-cyber-magenta font-bold";
                else if (log.includes("INIT_SUCCESS") || log.includes("✔") || log.includes("IPK")) colorClass = "text-cyber-green";
                else if (log.includes("Sistem:")) colorClass = "text-cyber-yellow";

                return (
                  <div key={index} className={`${colorClass} leading-relaxed break-all`}>
                    {log}
                  </div>
                );
              })}
              <div ref={terminalBottomRef} />
            </div>

            {/* Console CLI Input Form */}
            <form
              onSubmit={handleCommandSubmit}
              className="bg-[#0d0d16] border-t border-cyber-cyan/20 px-4 py-3 flex items-center space-x-2"
            >
              <span className="text-cyber-cyan font-bold animate-pulse">&gt;</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Ketik 'help' untuk instruksi..."
                className="flex-1 bg-transparent text-white border-none outline-none focus:ring-0 placeholder-gray-600 font-mono text-xs"
              />
              <button
                type="submit"
                className="p-1 rounded bg-cyber-cyan/15 hover:bg-cyber-cyan/30 text-cyber-cyan transition-colors"
                title="Kirim perintah"
              >
                <Play className="h-3 w-3" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Down arrow indicator with styling */}
      <button
        onClick={scrollNext}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center group cursor-pointer focus:outline-none"
      >
        <span className="font-cyber text-[10px] text-gray-500 uppercase tracking-widest group-hover:text-cyber-cyan transition-colors duration-300">
          Scroll Down
        </span>
        <div className="mt-2 w-6 h-10 border-2 border-gray-700 group-hover:border-cyber-cyan rounded-full flex justify-center p-1 transition-colors duration-300">
          <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce"></div>
        </div>
      </button>
    </section>
  );
}
