import { useState, useEffect } from "react";
import { Shield, Menu, X, Terminal, Volume2, VolumeX } from "lucide-react";

interface NavbarProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playClick: () => void;
}

export default function Navbar({ soundEnabled, setSoundEnabled, playClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Sistem & Regulasi", href: "#about" },
    { name: "Riwayat", href: "#experience" },
    { name: "Cyber Tools", href: "#tools" },
    { name: "Analisis Log", href: "#logs" },
    { name: "Kontak", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Determine active section based on viewport
      const scrollPosition = window.scrollY + 120;
      for (const link of navLinks) {
        const el = document.querySelector(link.href);
        if (el) {
          const top = (el as HTMLElement).offsetTop;
          const height = (el as HTMLElement).offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.href.replace("#", ""));
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    playClick();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      id="main-nav"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#07070d]/90 backdrop-blur-md border-b border-cyber-cyan/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => handleLinkClick("#home")}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan to-cyber-magenta rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-cyber-card p-2 rounded-lg border border-cyber-cyan/30 flex items-center justify-center">
                <Shield className="h-5 w-5 text-cyber-cyan group-hover:text-cyber-magenta transition-colors" />
              </div>
            </div>
            <div>
              <span className="font-cyber font-bold text-lg tracking-wider text-white flex items-center">
                IMAM<span className="text-cyber-cyan font-light ml-1">FALAHI</span>
              </span>
              <div className="text-[9px] font-mono text-gray-500 flex items-center space-x-1 uppercase tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-cyber-green inline-block animate-ping"></span>
                <span>SEC_OPS_ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.href)}
                  className={`relative px-3 py-1.5 text-xs font-cyber tracking-widest transition-all duration-200 cursor-pointer uppercase ${
                    isActive
                      ? "text-cyber-cyan neon-glow-cyan"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyber-cyan shadow-[0_0_8px_#00f0ff]"></span>
                  )}
                </button>
              );
            })}

            {/* Audio Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                setTimeout(() => playClick(), 50);
              }}
              className={`ml-4 p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                soundEnabled
                  ? "border-cyber-green/40 text-cyber-green hover:bg-cyber-green/10"
                  : "border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-500"
              }`}
              title={soundEnabled ? "Nonaktifkan audio SFX" : "Aktifkan audio SFX"}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                setTimeout(() => playClick(), 50);
              }}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                soundEnabled
                  ? "border-cyber-green/40 text-cyber-green"
                  : "border-gray-700 text-gray-500"
              }`}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => {
                playClick();
                setIsOpen(!isOpen);
              }}
              className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-cyber-cyan transition-colors"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#07070d]/95 backdrop-blur-lg border-b border-cyber-cyan/20">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.href)}
                  className={`block w-full text-left px-4 py-3 rounded-md text-sm font-cyber uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-cyber-cyan/10 text-cyber-cyan border-l-2 border-cyber-cyan font-bold"
                      : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
