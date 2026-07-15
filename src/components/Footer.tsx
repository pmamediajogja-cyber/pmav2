import { Shield, ArrowUp, Github, Linkedin, Mail } from "lucide-react";

interface FooterProps {
  playClick: () => void;
}

export default function Footer({ playClick }: FooterProps) {
  const scrollToTop = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#07070c] border-t border-gray-900 py-12 overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-900/60">
          
          {/* Left: Branding */}
          <div className="text-left md:text-left space-y-1">
            <span className="font-cyber font-black text-sm tracking-widest text-white">
              IMAM<span className="text-cyber-cyan font-light ml-0.5">FALAHI</span>
            </span>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              IT Operations &amp; Legal Compliance Specialist • S.Kom
            </p>
          </div>

          {/* Center: Social Icons */}
          <div className="flex items-center space-x-4">
            <a
              href="https://linkedin.com/in/tugelanboto"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              className="p-2 rounded-lg bg-[#0e0e1a] border border-gray-800 hover:border-cyber-cyan text-gray-400 hover:text-cyber-cyan transition-all"
              title="LinkedIn Profile"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="mailto:mobho@ymail.com"
              onClick={playClick}
              className="p-2 rounded-lg bg-[#0e0e1a] border border-gray-800 hover:border-cyber-magenta text-gray-400 hover:text-cyber-magenta transition-all"
              title="Send Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>

          {/* Right: Scroll to top */}
          <button
            onClick={scrollToTop}
            className="group flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-gray-800 hover:border-cyber-cyan hover:text-cyber-cyan transition-all font-cyber text-[10px] uppercase tracking-wider cursor-pointer"
          >
            <span>Kembali Ke Atas</span>
            <ArrowUp className="h-3 w-3 group-hover:animate-bounce" />
          </button>
        </div>

        {/* Lower footer info & licensing */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4 text-[10px] font-mono text-gray-550">
          <div className="text-center sm:text-left space-y-1">
            <p>© {new Date().getFullYear()} Imam Falahi. All rights reserved.</p>
            <p className="text-[9px] text-gray-600">Built using React, TypeScript &amp; Tailwind CSS v4. Managed under full-stack Node.js Express Container.</p>
          </div>
          <div className="flex items-center space-x-2 text-[9px] bg-gray-950 px-3 py-1.5 rounded border border-gray-900 text-gray-500 uppercase tracking-widest">
            <Shield className="h-3.5 w-3.5 text-cyber-green animate-pulse mr-1" />
            <span>SECURE_CONNECTION_CONFIRMED (SSL/TLS)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
