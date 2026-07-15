import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import ParallaxHero from "./components/ParallaxHero";
import AboutSection from "./components/AboutSection";
import ExperienceEducation from "./components/ExperienceEducation";
import CyberToolsSection from "./components/CyberToolsSection";
import SecurityLogAnalyzer from "./components/SecurityLogAnalyzer";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import ParallaxSection from "./components/ParallaxSection";

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // Referensi untuk menyimpan antrean frame animasi agar tidak menumpuk
  const requestRef = useRef<number | null>(null);

  // 1. Mencegah Restorasi Scroll & Menstabilkan Layout
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // Paksa posisi ke atas sesaat sebelum browser melakukan paint pertama
    window.scrollTo(0, 0);
  }, []);

  // 2. Optimasi Parallax Handler dengan requestAnimationFrame
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Jika masih ada kalkulasi frame sebelumnya yang belum selesai, batalkan.
      // Ini mencegah "Forced reflow" dan penumpukan beban di CPU.
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      
      // Sinkronkan pembaruan variabel CSS dengan siklus render native browser (60fps)
      requestRef.current = requestAnimationFrame(() => {
        const { clientX, clientY } = e;
        const xPercent = (clientX / window.innerWidth - 0.5) * 20; 
        const yPercent = (clientY / window.innerHeight - 0.5) * 20;
        
        document.documentElement.style.setProperty("--mouse-x", `${xPercent}px`);
        document.documentElement.style.setProperty("--mouse-y", `${yPercent}px`);
      });
    };

    // Tambahkan passive: true agar browser tahu event ini tidak akan memblokir scroll
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Pure Web Audio API Synthesizer
  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
      
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      console.warn("Web Audio API not yet initialized by user gesture.");
    }
  };

  return (
    <div className="min-h-screen text-slate-200 overflow-x-hidden selection:bg-cyber-cyan selection:text-cyber-bg relative scroll-smooth">
      {/* 3. Hardware Acceleration (will-change-transform) 
        Mendorong elemen statis ini ke memori GPU agar tidak ikut di-reflow saat terjadi interaksi
      */}
      <div className="fixed inset-0 pointer-events-none z-0 cyber-bg transition-transform duration-300 ease-out will-change-transform" />
      <div className="fixed inset-0 pointer-events-none z-0 grid-pattern transition-transform duration-300 ease-out will-change-transform" />

      {/* Main App Layout */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <Navbar
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          playClick={playClickSound}
        />

        <main className="flex-1">
          <ParallaxSection speed={15} id="home">
            <ParallaxHero playClick={playClickSound} soundEnabled={soundEnabled} />
          </ParallaxSection>

          <ParallaxSection speed={25} id="about">
            <AboutSection playClick={playClickSound} />
          </ParallaxSection>

          <ParallaxSection speed={35} id="experience">
            <ExperienceEducation playClick={playClickSound} />
          </ParallaxSection>

          <ParallaxSection speed={25} id="tools">
            <CyberToolsSection playClick={playClickSound} soundEnabled={soundEnabled} />
          </ParallaxSection>

          <ParallaxSection speed={30} id="siem">
            <SecurityLogAnalyzer playClick={playClickSound} soundEnabled={soundEnabled} />
          </ParallaxSection>

          <ParallaxSection speed={20} id="contact">
            <ContactSection playClick={playClickSound} soundEnabled={soundEnabled} />
          </ParallaxSection>
        </main>

        <Footer playClick={playClickSound} />
      </div>
    </div>
  );
}