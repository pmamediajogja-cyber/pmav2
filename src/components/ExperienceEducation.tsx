import { Calendar, Briefcase, MapPin, CheckSquare, ShieldCheck, Award } from "lucide-react";
import { ExperienceItem } from "../types";

interface TimelineProps {
  playClick: () => void;
}

export default function ExperienceEducation({ playClick }: TimelineProps) {
  const experiences: ExperienceItem[] = [
    {
      id: "exp-1",
      role: "IT Support & Administrasi Legal",
      organization: "Notaris & PPAT Endri Purwani, S.H., M.Kn.",
      location: "Sleman, DI Yogyakarta",
      period: "2020 – Sekarang",
      category: "mixed",
      description: [
        "IT Support & Infrastruktur Sistem: Bertanggung jawab atas stabilitas hardware, software, dan LAN/WLAN kantor. Memperketat enkripsi database lokal untuk melindungi kerentanan data digital milik klien.",
        "Administrasi PPAT & Pertanahan: Memproses legalitas pertanahan komprehensif (peralihan hak, pecah lahan, pengeringan/IPPT) dan mengintegrasikan pemetaan spasial tanah ke pengarsipan database digital.",
        "Eksekusi Legal Perbankan (Fidusia): Mengelola registrasi jaminan fidusia perbankan end-to-end, merancang draf akta, hingga mencetak sertifikat fidusia, mencapai rekor volume 1,500+ akta per bulan tanpa cacat hukum.",
      ],
    },
    {
      id: "exp-2",
      role: "Konsultan Perizinan & Regulasi",
      organization: "PMA Media",
      location: "Sleman, DI Yogyakarta",
      period: "2020 – Sekarang",
      category: "legal",
      description: [
        "Konsultasi Teknis Perizinan: Menyediakan pendampingan legalitas perizinan usaha terintegrasi melalui sistem OSS RBA (Risk-Based Approach).",
        "Aktivasi NPWP & Regulasi Bangunan: Membantu pengurusan NPWP Badan/Pribadi serta administrasi PBG (Persetujuan Bangunan Gedung) melalui portal kementerian SIMBG.",
        "Kepatuhan Hukum UMKM & Korporasi: Memberikan konsultasi strategis bagi puluhan pelaku bisnis mikro dan korporasi lokal demi menjamin kepatuhan absolut terhadap standar regulasi operasional pemerintah.",
      ],
    },
    {
      id: "exp-3",
      role: "IT & Digital Marketing Specialist",
      organization: "Omah Kopi Mrisen",
      location: "Sleman, DI Yogyakarta",
      period: "2021 – Sekarang",
      category: "marketing",
      description: [
        "Infrastruktur IT & Jaringan Toko: Mengelola operasional IT harian, termasuk optimalisasi Point of Sale (POS) cloud, pemeliharaan router LAN/WLAN toko, dan troubleshooting hardware.",
        "HR Operations & Sistem Absensi: Merancang dan mengotomasi sistem rekapitulasi data kehadiran karyawan berbasis Spreadsheet (Google Sheets) terintegrasi formula otomatis untuk penunjang payroll bulanan pemilik bisnis.",
        "Digital Marketing & Visual Kreatif: Memproduksi materi pemasaran digital multimedia (desain grafis, fotografi/videografi sinematik) untuk meningkatkan conversion rate dan brand awareness mingguan.",
      ],
    },
    {
      id: "exp-4",
      role: "Desain Grafis",
      organization: "PT. INDOKOM",
      location: "Sleman, DI Yogyakarta",
      period: "2013 – 2014",
      category: "design",
      description: [
        "Produksi Aset Visual: Merancang dan membuat aset grafis digital beresolusi tinggi (high-definition) untuk mendukung kampanye branding produk korporat.",
        "Multi-channel Marketing Design: Mematangkan materi visual pemasaran digital yang didistribusikan di berbagai kanal publikasi dan media sosial perusahaan.",
      ],
    },
  ];

  return (
    <section id="experience" className="relative py-24 bg-[#07070d] border-t border-gray-900 overflow-hidden">
      {/* Background Grids */}
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />

      {/* Floating Orbs */}
      <div className="absolute top-1/3 right-1/10 w-80 h-80 bg-cyber-cyan/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/10 w-80 h-80 bg-cyber-magenta/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-cyber font-black text-2xl sm:text-4xl tracking-wider text-white uppercase flex items-center justify-center space-x-2">
            <span className="text-cyber-magenta">&lt;</span>
            <span>RIWAYAT OPERASIONAL &amp; KARIER</span>
            <span className="text-cyber-magenta">&gt;</span>
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-cyber-magenta to-cyber-cyan mx-auto mt-4"></div>
          <p className="mt-4 text-gray-400 font-sans text-sm uppercase tracking-widest font-medium">
            Rekam Jejak Eksekusi Nyata Dalam Dunia IT dan Kepatuhan Hukum
          </p>
        </div>

        {/* Chronological Timeline */}
        <div className="relative border-l border-gray-800 md:border-l-0 md:grid md:grid-cols-9 md:gap-x-8 max-w-5xl mx-auto">
          
          {/* Vertical axis line for desktop */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gray-850"></div>

          {experiences.map((exp, index) => {
            const isEven = index % 2 === 0;

            // Accent colors based on category
            const isMixed = exp.category === "mixed";
            const borderCol = isMixed 
              ? "hover:border-cyber-cyan/60 border-cyber-cyan/20" 
              : exp.category === "legal" 
              ? "hover:border-cyber-cyan/50 border-gray-800"
              : exp.category === "marketing"
              ? "hover:border-cyber-magenta/50 border-gray-800"
              : "hover:border-cyber-yellow/50 border-gray-800";
            
            const badgeBg = isMixed
              ? "bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/20"
              : exp.category === "legal"
              ? "bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/20"
              : exp.category === "marketing"
              ? "bg-cyber-magenta/10 text-cyber-magenta border-cyber-magenta/20"
              : "bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow/20";

            return (
              <div 
                key={exp.id} 
                onClick={playClick}
                className="relative mb-12 md:mb-16 md:contents cursor-pointer group"
              >
                {/* Timeline node dot */}
                <div className="absolute left-[-5px] md:left-1/2 md:transform md:-translate-x-1/2 top-1.5 h-3.5 w-3.5 rounded-full bg-[#07070d] border-2 border-cyber-cyan z-20 group-hover:bg-cyber-magenta group-hover:scale-125 transition-all shadow-[0_0_8px_#00f0ff] group-hover:shadow-[0_0_12px_#ff007f]"></div>

                {/* Left side column for desktop (shows either content or placeholder) */}
                <div className={`pl-6 md:pl-0 md:col-span-4 ${isEven ? "md:text-right" : "md:order-last md:text-left"}`}>
                  <div className={`bg-cyber-card/50 p-6 rounded-xl border ${borderCol} transition-all duration-300 backdrop-blur-sm relative`}>
                    
                    {/* Floating Glow Indicator on Hover */}
                    <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-cyber-cyan/0 to-cyber-magenta/0 group-hover:from-cyber-cyan/5 group-hover:to-cyber-magenta/5 pointer-events-none transition-all duration-300"></div>

                    {/* Meta Info Header */}
                    <div className={`flex flex-wrap items-center gap-2 mb-3 ${isEven ? "md:justify-end" : "md:justify-start"}`}>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border uppercase tracking-wider ${badgeBg}`}>
                        {exp.category === "mixed" ? "IT_SUPPORT & LEGAL" : exp.category.toUpperCase()}
                      </span>
                      <span className="inline-flex items-center text-xs text-gray-500 font-mono">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{exp.period}</span>
                      </span>
                    </div>

                    <h3 className="font-cyber font-bold text-white text-base tracking-wide uppercase group-hover:text-cyber-cyan transition-colors">
                      {exp.role}
                    </h3>

                    <h4 className="font-sans font-medium text-cyber-magenta text-xs mt-1 uppercase tracking-wider">
                      {exp.organization}
                    </h4>

                    <div className={`flex items-center text-gray-550 text-[11px] mt-2 font-mono ${isEven ? "md:justify-end" : "md:justify-start"}`}>
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{exp.location}</span>
                    </div>

                    {/* Bullet Points with Icons */}
                    <ul className={`mt-4 space-y-2.5 text-xs text-gray-400 font-sans leading-relaxed text-left`}>
                      {exp.description.map((bullet, bIdx) => {
                        // Bold first segment
                        const splitIdx = bullet.indexOf(":");
                        const hasHeader = splitIdx !== -1;
                        const header = hasHeader ? bullet.substring(0, splitIdx + 1) : "";
                        const rest = hasHeader ? bullet.substring(splitIdx + 1) : bullet;

                        return (
                          <li key={bIdx} className="flex items-start space-x-2">
                            <ShieldCheck className="h-4 w-4 text-cyber-cyan shrink-0 mt-0.5" />
                            <span>
                              {hasHeader && <strong className="text-white font-medium">{header}</strong>}
                              {rest}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Grid gap column for desktop axis spacing */}
                <div className="hidden md:block md:col-span-1"></div>

                {/* Right side empty column placeholder */}
                <div className="hidden md:block md:col-span-4"></div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
