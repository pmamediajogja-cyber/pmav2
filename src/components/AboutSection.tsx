import { Shield, FileText, Cpu, Palette, Award, BookOpen, Fingerprint } from "lucide-react";
import { SkillGroup } from "../types";

interface AboutProps {
  playClick: () => void;
}

export default function AboutSection({ playClick }: AboutProps) {
  const skillGroups: SkillGroup[] = [
    {
      category: "Legal & Administrasi",
      icon: "FileText",
      skills: [
        "OSS RBA (Online Single Submission)",
        "SIMBG (PBG - Izin Bangunan)",
        "Registrasi Jaminan Fidusia",
        "Regulasi & Sertifikasi Pertanahan",
        "Pajak Korporasi & Pengurusan NPWP",
        "Pemetaan Lahan & Verifikasi Legalitas",
        "Manajemen Kontrak & PDF Editor",
      ],
    },
    {
      category: "IT & Infrastruktur",
      icon: "Cpu",
      skills: [
        "IT Technical Support & Troubleshooting",
        "Network Maintenance (LAN/WLAN/Routing)",
        "Unix / Linux / macOS / Windows Server",
        "Keamanan Database Lokal & Enkripsi",
        "Web Development (TS, React, Node)",
        "Sistem POS (Point of Sale) Integration",
        "AutoCAD (Legal Mapping Layouts)",
      ],
    },
    {
      category: "IoT & Inovasi Kerja",
      icon: "Fingerprint",
      skills: [
        "IoT Development (ESP32 Microcontrollers)",
        "Sensor Integration & Data Pipelines",
        "Automated Excel / Sheets Reports (JS/VBA)",
        "Otomatisasi Alur Kerja Administrasi",
        "Hardware Preventative Maintenance",
      ],
    },
    {
      category: "Digital & Media Kreatif",
      icon: "Palette",
      skills: [
        "Digital Marketing Strategy & Ads",
        "Adobe Creative Suite (Photoshop, Illustrator)",
        "CorelDRAW & Vector Graphic Design",
        "Professional Photography & Color Grading",
        "Cinematic Videography & Video Editing",
      ],
    },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "FileText":
        return <FileText className="h-5 w-5 text-cyber-cyan" />;
      case "Cpu":
        return <Cpu className="h-5 w-5 text-cyber-magenta" />;
      case "Fingerprint":
        return <Fingerprint className="h-5 w-5 text-cyber-green" />;
      case "Palette":
        return <Palette className="h-5 w-5 text-cyber-yellow" />;
      default:
        return <Shield className="h-5 w-5 text-cyber-cyan" />;
    }
  };

  return (
    <section id="about" className="relative py-24 bg-[#0a0a14] border-t border-gray-900 overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 cyber-grid-magenta opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-cyber font-black text-2xl sm:text-4xl tracking-wider text-white uppercase flex items-center justify-center space-x-2">
            <span className="text-cyber-cyan">&lt;</span>
            <span>PILAR REGULASI &amp; SISTEM INFORMATIKA</span>
            <span className="text-cyber-cyan">&gt;</span>
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-cyber-cyan to-cyber-magenta mx-auto mt-4"></div>
          <p className="mt-4 text-gray-400 font-sans text-sm uppercase tracking-widest font-medium">
            Sinergi Keahlian IT Operations dan Kepatuhan Regulasi Hukum
          </p>
        </div>

        {/* Dual Core Pillar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Pillar 1: IT & Systems Operations */}
          <div className="bg-cyber-card/60 p-6 sm:p-8 rounded-xl border border-cyber-magenta/20 hover:border-cyber-magenta/50 transition-all duration-300 backdrop-blur-md group relative">
            <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-cyber-magenta/40 group-hover:text-cyber-magenta/80 transition-colors">
              CORE_MODULE_01
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-cyber-magenta/10 p-3 rounded-lg border border-cyber-magenta/30">
                <Cpu className="h-6 w-6 text-cyber-magenta animate-pulse" />
              </div>
              <div className="space-y-3">
                <h3 className="font-cyber font-bold text-lg text-white uppercase tracking-wider">
                  IT Operations &amp; Infrastruktur
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Menjamin ketersediaan, stabilitas, dan keamanan sistem IT harian. Berpengalaman melestarikan infrastruktur hardware, arsitektur jaringan lokal (LAN/WLAN), manajemen perangkat Point of Sale (POS), serta memperketat database lokal menggunakan sistem enkripsi terjamin untuk proteksi kerentanan arsip legal klien.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2 py-0.5 rounded bg-cyber-magenta/10 text-cyber-magenta text-[10px] font-mono border border-cyber-magenta/20">SYS_ADMIN</span>
                  <span className="px-2 py-0.5 rounded bg-cyber-magenta/10 text-cyber-magenta text-[10px] font-mono border border-cyber-magenta/20">DB_SECURITY</span>
                  <span className="px-2 py-0.5 rounded bg-cyber-magenta/10 text-cyber-magenta text-[10px] font-mono border border-cyber-magenta/20">NETWORK_MAIN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 2: Legal Compliance & Regulation */}
          <div className="bg-cyber-card/60 p-6 sm:p-8 rounded-xl border border-cyber-cyan/20 hover:border-cyber-cyan/50 transition-all duration-300 backdrop-blur-md group relative">
            <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-cyber-cyan/40 group-hover:text-cyber-cyan/80 transition-colors">
              CORE_MODULE_02
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-cyber-cyan/10 p-3 rounded-lg border border-cyber-cyan/30">
                <Shield className="h-6 w-6 text-cyber-cyan animate-pulse" />
              </div>
              <div className="space-y-3">
                <h3 className="font-cyber font-bold text-lg text-white uppercase tracking-wider">
                  Legal Compliance &amp; Regulasi
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Menjembatani inovasi teknologi dengan kepatuhan hukum korporasi yang ketat. Menguasai alur legalitas perizinan usaha terintegrasi (OSS RBA), verifikasi pertanahan, perizinan gedung PBG (SIMBG), dan pendaftaran jaminan Fidusia perbankan dengan rekor volume penyelesaian 1,500 dokumen per bulan secara konsisten bebas cacat hukum.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2 py-0.5 rounded bg-cyber-cyan/10 text-cyber-cyan text-[10px] font-mono border border-cyber-cyan/20">OSS_RBA</span>
                  <span className="px-2 py-0.5 rounded bg-cyber-cyan/10 text-cyber-cyan text-[10px] font-mono border border-cyber-cyan/20">SIMBG_PBG</span>
                  <span className="px-2 py-0.5 rounded bg-cyber-cyan/10 text-cyber-cyan text-[10px] font-mono border border-cyber-cyan/20">FIDUSIA_REG</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Education Credentials Brief */}
        <div className="bg-gradient-to-r from-cyber-bg to-[#121224] p-6 rounded-xl border border-gray-800 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="bg-cyber-green/10 p-3 rounded-full border border-cyber-green/20 shrink-0">
              <BookOpen className="h-6 w-6 text-cyber-green" />
            </div>
            <div className="text-left">
              <h4 className="font-cyber font-bold text-white uppercase tracking-wider text-sm sm:text-base">
                Sarjana Informatika (S.Kom)
              </h4>
              <p className="text-xs text-cyber-green font-mono uppercase tracking-widest mt-1">
                Universitas Siber Muhammadiyah | 2022 - 2026
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                Lulus dengan IPK <strong className="text-white">3.82 (Predikat Pujian / Cum Laude)</strong>. Fokus riset akhir pada optimalisasi strategi keputusan bisnis memanfaatkan algoritma pertambangan data <strong className="text-white">Association Rule Mining</strong>.
              </p>
            </div>
          </div>
          <div className="bg-[#0e0e1a] px-4 py-3 rounded-lg border border-gray-850 shrink-0 flex items-center space-x-3 text-left w-full md:w-auto">
            <Award className="h-5 w-5 text-cyber-cyan" />
            <div>
              <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">PRO_SPECIALTY</div>
              <div className="text-white font-cyber text-xs font-bold uppercase tracking-widest">IT OPERATIONS &amp; LEGAL</div>
            </div>
          </div>
        </div>

        {/* Skills Bento Grid */}
        <div className="text-left mb-6">
          <h4 className="font-cyber font-bold text-sm text-gray-400 uppercase tracking-widest mb-6 flex items-center space-x-2">
            <Fingerprint className="h-4 w-4 text-cyber-cyan" />
            <span>KEMAMPUAN TEKNIS &amp; MANAJEMEN</span>
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              onClick={playClick}
              className="bg-[#0e0e1a]/70 p-5 rounded-xl border border-gray-800 hover:border-cyber-cyan/30 transition-all duration-300 relative group cursor-pointer"
            >
              {/* Corner accent */}
              <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gray-800 group-hover:border-cyber-cyan transition-colors" />
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-1.5 rounded-md bg-gray-900 border border-gray-850 group-hover:bg-[#07070d] transition-colors">
                  {getIcon(group.icon)}
                </div>
                <h5 className="font-cyber font-bold text-xs text-white uppercase tracking-wider group-hover:text-cyber-cyan transition-colors">
                  {group.category}
                </h5>
              </div>
              
              <ul className="space-y-2">
                {group.skills.map((skill, index) => (
                  <li key={index} className="text-gray-400 text-xs font-sans flex items-start space-x-1.5">
                    <span className="text-cyber-cyan font-bold leading-none select-none mt-0.5">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
