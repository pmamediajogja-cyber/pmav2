import { useState, useEffect } from "react";
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

  // Smooth mouse-move parallax handler to set CSS variables
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth - 0.5) * 20; // range: -10 to 10px
      const yPercent = (clientY / window.innerHeight - 0.5) * 20;
      
      document.documentElement.style.setProperty("--mouse-x", `${xPercent}px`);
      document.documentElement.style.setProperty("--mouse-y", `${yPercent}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Pure Web Audio API Synthesizer - 0 byte download, instantaneous loading!
  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, audioCtx.currentTime); // Crisp futuristic sound note
      
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
    <div className="min-h-screen text-slate-200 overflow-x-hidden selection:bg-cyber-cyan selection:text-cyber-bg relative">
      {/* Frosted Glass Theme Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 cyber-bg transition-transform duration-300 ease-out" />
      <div className="fixed inset-0 pointer-events-none z-0 grid-pattern transition-transform duration-300 ease-out" />

      {/* Main App Layout */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <Navbar
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          playClick={playClickSound}
        />

        <main className="flex-1">
          {/* Section 1: Parallax Hero & Terminal Command Center */}
          <ParallaxSection speed={15} id="home">
            <ParallaxHero
              playClick={playClickSound}
              soundEnabled={soundEnabled}
            />
          </ParallaxSection>

          {/* Section 2: Personal Profile & Competency Pillars */}
          <ParallaxSection speed={25} id="about">
            <AboutSection playClick={playClickSound} />
          </ParallaxSection>

          {/* Section 3: Professional Chronology Timeline */}
          <ParallaxSection speed={35} id="experience">
            <ExperienceEducation playClick={playClickSound} />
          </ParallaxSection>

          {/* Section 4: Web Cyber Tools Integration */}
          <ParallaxSection speed={25} id="tools">
            <CyberToolsSection
              playClick={playClickSound}
              soundEnabled={soundEnabled}
            />
          </ParallaxSection>

          {/* Section 5: Real-time SIEM Log Analyzer & Compliance */}
          <ParallaxSection speed={30} id="siem">
            <SecurityLogAnalyzer
              playClick={playClickSound}
              soundEnabled={soundEnabled}
            />
          </ParallaxSection>

          {/* Section 6: Secured Contact form */}
          <ParallaxSection speed={20} id="contact">
            <ContactSection
              playClick={playClickSound}
              soundEnabled={soundEnabled}
            />
          </ParallaxSection>
        </main>

        <Footer playClick={playClickSound} />
      </div>
    </div>
  );
}
