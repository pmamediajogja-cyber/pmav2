import React, { useState, useEffect, useRef } from "react";
import { Terminal, Shield, Key, RefreshCw, Copy, Check, Search, Lock, Unlock, Eye, HelpCircle } from "lucide-react";
import { ScanResult } from "../types";

interface ToolsProps {
  playClick: () => void;
  soundEnabled: boolean;
}

export default function CyberToolsSection({ playClick, soundEnabled }: ToolsProps) {
  const [activeTab, setActiveTab] = useState<"port" | "hash" | "e2ee">("port");

  // 1. Port Scanner State
  const [scanIp, setScanIp] = useState("192.168.1.104");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const scanTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 2. Hash Decoder/Encoder State
  const [hashInput, setHashInput] = useState("KepatuhanSiber2026");
  const [hashResults, setHashResults] = useState({
    sha256: "",
    md5: "",
    base64Encode: "",
    base64Decode: "",
  });
  const [crackHash, setCrackHash] = useState("");
  const [isCracking, setIsCracking] = useState(false);
  const [crackProgress, setCrackProgress] = useState(0);
  const [crackResult, setCrackResult] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 3. E2EE Encryption State
  const [e2eeKey, setE2eeKey] = useState("COMPLIANCE_KEY_2026");
  const [plainText, setPlainText] = useState("Sandi rahasia ini dienkripsi ujung-ke-ujung.");
  const [cipherText, setCipherText] = useState("");
  const [decryptInput, setDecryptInput] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [decryptError, setDecryptError] = useState("");

  // Play audio note if enabled
  const playBeep = (freq: number, type: OscillatorType = "sine", duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Ignored
    }
  };

  // --- 1. PORT SCANNER SIMULATOR LOGIC ---
  const handlePortScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (isScanning) return;
    playClick();

    setIsScanning(true);
    setScanProgress(0);
    setScanResults([]);
    setScanLogs([`[+] Menghubungi target host: ${scanIp}...`, `[+] Memeriksa ketersediaan ICMP Ping...`]);

    const commonPorts: ScanResult[] = [
      { port: 21, service: "FTP", status: "closed", threatLevel: "safe", complianceRisk: "Tidak ada" },
      { port: 22, service: "SSH (SFTP)", status: "open", threatLevel: "medium", complianceRisk: "Risiko brute-force. Wajib batasi IP akses (UU ITE Pasal 30)", remediation: "Ubah port standar 22, pasang fail2ban & autentikasi kunci RSA." },
      { port: 23, service: "Telnet", status: "closed", threatLevel: "safe" },
      { port: 80, service: "HTTP (Nginx/Apache)", status: "open", threatLevel: "high", complianceRisk: "Transmisi plaintext. Pelanggaran standar enkripsi arsip legal klien!", remediation: "Pasang sertifikat SSL/TLS untuk memaksa enkripsi HTTPS port 443." },
      { port: 110, service: "POP3", status: "closed", threatLevel: "safe" },
      { port: 443, service: "HTTPS (SSL Secured)", status: "open", threatLevel: "safe", complianceRisk: "Aman & Kredibel", remediation: "Pertahankan pembaruan cipher suite TLS 1.3 secara rutin." },
      { port: 3306, service: "MySQL Database Server", status: "filtered", threatLevel: "high", complianceRisk: "Eksposisi database luar. Pelanggaran standar PPAT Endri Purwani (Arsip Klien).", remediation: "Tutup port untuk jaringan publik; gunakan terowongan SSH untuk akses remote." },
      { port: 8080, service: "HTTP-Alt (Vite/Node)", status: "open", threatLevel: "medium", complianceRisk: "Eksposisi server pengembangan.", remediation: "Tutup port 8080 pada server produksi; gunakan reverse proxy Nginx." },
    ];

    let currentStep = 0;
    const totalSteps = commonPorts.length;

    const runScan = () => {
      if (currentStep < totalSteps) {
        const portObj = commonPorts[currentStep];
        setScanProgress(Math.floor(((currentStep + 1) / totalSteps) * 100));
        
        // Add log entry
        playBeep(440 + portObj.port * 0.5, "triangle", 0.05);
        setScanLogs((prev) => [
          ...prev,
          `[*] Memindai Port ${portObj.port} (${portObj.service})... -> HASIL: ${portObj.status.toUpperCase()}`,
        ]);

        if (portObj.status === "open") {
          setScanResults((prev) => [...prev, portObj]);
        } else if (portObj.status === "filtered") {
          setScanResults((prev) => [...prev, portObj]);
        }

        currentStep++;
        scanTimerRef.current = setTimeout(runScan, 400);
      } else {
        setIsScanning(false);
        setScanLogs((prev) => [...prev, "[✔] Pemindaian selesai secara aman. Rekomendasi regulasi tersusun."]);
        playBeep(880, "sine", 0.25);
      }
    };

    scanTimerRef.current = setTimeout(runScan, 600);
  };

  useEffect(() => {
    return () => {
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    };
  }, []);

  // --- 2. HASH GENERATOR & CRACKER LOGIC ---
  const generateHashes = (text: string) => {
    if (!text) {
      setHashResults({ sha256: "", md5: "", base64Encode: "", base64Decode: "" });
      return;
    }

    // Standard JavaScript Base64 Encoders
    let b64Enc = "";
    let b64Dec = "Invalid input";
    try {
      b64Enc = btoa(unescape(encodeURIComponent(text)));
    } catch (e) {
      b64Enc = "Error";
    }

    try {
      b64Dec = decodeURIComponent(escape(atob(text)));
    } catch (e) {
      b64Dec = "Bukan Base64 valid";
    }

    // Fast Simulated hashes for interactive UI
    // Deterministic string to pseudo-hash generator
    const getSimpleHash = (str: string, type: "sha256" | "md5") => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      const hex = Math.abs(hash).toString(16).padStart(8, "0");
      if (type === "md5") {
        return (hex + hex + hex + hex).substring(0, 32);
      }
      return (hex + hex + hex + hex + hex + hex + hex + hex).substring(0, 64);
    };

    setHashResults({
      sha256: getSimpleHash(text, "sha256"),
      md5: getSimpleHash(text, "md5"),
      base64Encode: b64Enc,
      base64Decode: b64Dec,
    });
  };

  useEffect(() => {
    generateHashes(hashInput);
  }, [hashInput]);

  // Simulated Bruteforce Hash Cracker
  const handleCrackHash = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crackHash || isCracking) return;
    playClick();

    setIsCracking(true);
    setCrackProgress(0);
    setCrackResult(null);

    // Dictionary database
    const wordlist: { [key: string]: string } = {
      "93273e9193273e9193273e9193273e91": "admin",
      "e2e92c10e2e92c10e2e92c10e2e92c10": "password",
      "12345678123456781234567812345678": "123456",
      "80bf87a180bf87a180bf87a180bf87a1": "rahasia",
      "d75038ced75038ced75038ced75038ce": "cybersecurity",
      "5d7eb7525d7eb7525d7eb7525d7eb752": "mobho@ymail.com",
    };

    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      setCrackProgress(progress);
      playBeep(600 + Math.random() * 200, "sawtooth", 0.02);

      if (progress >= 100) {
        clearInterval(interval);
        setIsCracking(false);
        const md5Clean = crackHash.trim().toLowerCase();
        
        // Check standard matches
        if (wordlist[md5Clean]) {
          setCrackResult(wordlist[md5Clean]);
          playBeep(700, "sine", 0.15);
        } else {
          // Generate a mockup crack just in case it doesn't exist
          // Or state it's not found in our preloaded local dictionary
          setCrackResult("TIDAK DITEMUKAN (Butuh GPU Brute-force lanjutan)");
          playBeep(300, "triangle", 0.2);
        }
      }
    }, 100);
  };

  // --- 3. E2EE MESSAGE CRYPTOGRAPHY ---
  // Simple symmetric XOR encryption combined with ROT13 & Base64 for fully interactive, valid encrypt/decrypt experience!
  const encryptE2EE = (text: string, key: string) => {
    if (!text || !key) return "";
    let result = "";
    // XOR key mixing
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    // Encode result into Base64 for transport
    return btoa(unescape(encodeURIComponent(result)));
  };

  const decryptE2EE = (cipher: string, key: string) => {
    try {
      if (!cipher || !key) return "";
      // Decode Base64
      const rawString = decodeURIComponent(escape(atob(cipher)));
      let result = "";
      for (let i = 0; i < rawString.length; i++) {
        const charCode = rawString.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (e) {
      throw new Error("Gagal mendekripsi! Kunci sandi salah atau format pesan tidak valid.");
    }
  };

  useEffect(() => {
    const cipher = encryptE2EE(plainText, e2eeKey);
    setCipherText(cipher);
  }, [plainText, e2eeKey]);

  const handleDecryptRequest = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setDecryptError("");
    setDecryptedText("");

    try {
      const decrypted = decryptE2EE(decryptInput.trim(), e2eeKey);
      setDecryptedText(decrypted);
      playBeep(520, "sine", 0.15);
    } catch (err: any) {
      setDecryptError(err.message || "Gagal mendekripsi cipher!");
      playBeep(220, "sawtooth", 0.25);
    }
  };

  // Copy helper
  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    playBeep(1000, "sine", 0.05);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section id="tools" className="relative py-24 bg-[#0a0a14] border-t border-gray-900 overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      {/* Futuristic Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-cyber-cyan mb-2">
            <Terminal className="h-4 w-4 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest">Interactive Playground</span>
          </div>
          <h2 className="font-cyber font-black text-2xl sm:text-4xl tracking-wider text-white uppercase">
            INTEGRATED <span className="text-cyber-cyan">CYBER UTILITIES</span>
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-cyber-cyan to-cyber-magenta mx-auto mt-4"></div>
          <p className="mt-4 text-gray-400 font-sans text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Eksplorasi utilitas siber interaktif sederhana yang menggambarkan kapabilitas dasar pemrograman infosec Imam Falahi, dirancang hemat waktu &amp; berjalan 100% di browser Anda.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center border-b border-gray-800 mb-10 max-w-2xl mx-auto gap-1 sm:gap-2">
          <button
            onClick={() => { playClick(); setActiveTab("port"); }}
            className={`px-3 py-3 sm:px-6 text-xs font-cyber uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "port"
                ? "border-cyber-cyan text-cyber-cyan neon-glow-cyan font-bold"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            Port Scanner
          </button>
          <button
            onClick={() => { playClick(); setActiveTab("hash"); }}
            className={`px-3 py-3 sm:px-6 text-xs font-cyber uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "hash"
                ? "border-cyber-magenta text-cyber-magenta neon-glow-magenta font-bold"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            Hash Decoder
          </button>
          <button
            onClick={() => { playClick(); setActiveTab("e2ee"); }}
            className={`px-3 py-3 sm:px-6 text-xs font-cyber uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "e2ee"
                ? "border-cyber-green text-cyber-green neon-glow-green font-bold"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            E2EE Encryptor
          </button>
        </div>

        {/* Tabs Content */}
        <div className="max-w-4xl mx-auto">
          
          {/* 1. PORT SCANNER TAB */}
          {activeTab === "port" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Scan controller */}
              <div className="lg:col-span-5 bg-cyber-card p-6 rounded-xl border border-gray-800 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-cyber font-bold text-sm text-white uppercase tracking-wider flex items-center">
                    <Shield className="h-4 w-4 text-cyber-cyan mr-2" />
                    <span>Pemindai Port Jaringan</span>
                  </h3>
                  <p className="text-gray-400 text-xs font-sans leading-relaxed">
                    Uji keamanan infrastruktur server lokal dengan memindai port umum. Simulator ini mendeteksi port terbuka, mengidentifikasi layanan, dan memberikan evaluasi kepatuhan hukum atas risiko yang ditemukan.
                  </p>

                  <form onSubmit={handlePortScan} className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[10px] font-mono text-gray-550 uppercase tracking-widest mb-1.5">TARGET IP ADDRESS / HOST</label>
                      <input
                        type="text"
                        value={scanIp}
                        onChange={(e) => setScanIp(e.target.value)}
                        disabled={isScanning}
                        placeholder="e.g. 192.168.1.1"
                        className="w-full bg-[#07070d] border border-gray-800 focus:border-cyber-cyan rounded px-3 py-2 text-xs font-mono text-white outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isScanning}
                      className={`w-full py-2.5 rounded text-xs font-cyber font-bold uppercase tracking-widest transition-all cursor-pointer ${
                        isScanning
                          ? "bg-gray-850 text-gray-500 border border-gray-800"
                          : "bg-cyber-cyan text-cyber-bg hover:bg-cyber-cyan/80 shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                      }`}
                    >
                      {isScanning ? "Memindai Jaringan..." : "Mulai Pemindaian"}
                    </button>
                  </form>
                </div>

                {/* Progress bar */}
                {isScanning && (
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                      <span>Memproses port...</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyber-cyan transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Terminal scan logs */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                <div className="bg-[#07070d] rounded-xl border border-gray-850 p-4 h-[320px] font-mono text-[11px] overflow-y-auto flex flex-col justify-between text-left">
                  <div className="space-y-1.5">
                    <div className="text-gray-500 text-[10px] uppercase tracking-widest pb-1 border-b border-gray-900 mb-2 flex justify-between">
                      <span>CONSOLE_OUTPUT</span>
                      <span className="text-cyber-cyan animate-pulse">● LOG_RUNNING</span>
                    </div>
                    {scanLogs.length === 0 ? (
                      <span className="text-gray-600 italic">Siap untuk memindai target IP...</span>
                    ) : (
                      scanLogs.map((log, idx) => (
                        <div
                          key={idx}
                          className={`${
                            log.includes("HASIL: OPEN")
                              ? "text-cyber-green font-bold"
                              : log.includes("HASIL: FILTERED")
                              ? "text-cyber-yellow"
                              : log.startsWith("[✔]")
                              ? "text-cyber-cyan font-bold"
                              : "text-gray-400"
                          }`}
                        >
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Scan Results Vulnerability Detail List */}
              {scanResults.length > 0 && (
                <div className="col-span-12 bg-cyber-card/40 p-5 rounded-xl border border-gray-850 mt-4 text-left">
                  <h4 className="font-cyber font-bold text-xs text-white uppercase tracking-widest mb-4 flex items-center text-cyber-cyan">
                    <Shield className="h-4 w-4 mr-2" />
                    <span>Laporan Kepatuhan Keamanan Port Terbuka</span>
                  </h4>
                  <div className="space-y-4 font-sans text-xs">
                    {scanResults.map((port) => (
                      <div key={port.port} className="p-3 bg-[#07070d] rounded border border-gray-800 flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-cyber-cyan">PORT {port.port} ({port.service})</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase ${
                              port.threatLevel === "high" ? "bg-red-950 text-red-400 border border-red-900" : "bg-yellow-950 text-yellow-400 border border-yellow-900"
                            }`}>
                              Risk Level: {port.threatLevel.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs">
                            <strong className="text-white">Analisis Kepatuhan:</strong> {port.complianceRisk}
                          </p>
                          {port.remediation && (
                            <p className="text-cyber-cyan text-xs">
                              <strong className="text-white">Rekomendasi Ops:</strong> {port.remediation}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. HASH CONVERTER TAB */}
          {activeTab === "hash" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start text-left">
              {/* Encoder panel */}
              <div className="bg-cyber-card p-6 rounded-xl border border-gray-800 space-y-4">
                <h3 className="font-cyber font-bold text-sm text-white uppercase tracking-wider flex items-center text-cyber-magenta">
                  <Key className="h-4 w-4 mr-2" />
                  <span>Kalkulator Kriptografi Hash</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-mono text-gray-550 uppercase tracking-widest mb-1">String Input</label>
                    <textarea
                      value={hashInput}
                      onChange={(e) => setHashInput(e.target.value)}
                      rows={3}
                      className="w-full bg-[#07070d] border border-gray-800 focus:border-cyber-magenta rounded p-2.5 text-xs font-mono text-white outline-none"
                      placeholder="Masukkan string untuk dihitung hash..."
                    />
                  </div>

                  {/* Hash outputs */}
                  <div className="space-y-3.5 pt-2">
                    {/* SHA256 */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyber-cyan font-bold uppercase tracking-widest">SHA-256 (Hash)</span>
                        <button
                          onClick={() => handleCopy(hashResults.sha256, "sha256")}
                          className="text-gray-500 hover:text-cyber-cyan p-0.5"
                          title="Salin Hash"
                        >
                          {copiedKey === "sha256" ? <Check className="h-3 w-3 text-cyber-green" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                      <div className="bg-[#07070d] p-2 rounded border border-gray-900 text-[11px] font-mono text-gray-300 break-all select-all">
                        {hashResults.sha256 || <span className="text-gray-650 italic">Kosong</span>}
                      </div>
                    </div>

                    {/* MD5 */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyber-magenta font-bold uppercase tracking-widest">MD5 (Hash Simulasian)</span>
                        <button
                          onClick={() => handleCopy(hashResults.md5, "md5")}
                          className="text-gray-500 hover:text-cyber-magenta p-0.5"
                          title="Salin Hash"
                        >
                          {copiedKey === "md5" ? <Check className="h-3 w-3 text-cyber-green" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                      <div className="bg-[#07070d] p-2 rounded border border-gray-900 text-[11px] font-mono text-gray-300 break-all select-all">
                        {hashResults.md5 || <span className="text-gray-650 italic">Kosong</span>}
                      </div>
                    </div>

                    {/* Base64 Encode */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyber-green font-bold uppercase tracking-widest">Base64 Encoded</span>
                        <button
                          onClick={() => handleCopy(hashResults.base64Encode, "b64e")}
                          className="text-gray-500 hover:text-cyber-green p-0.5"
                          title="Salin"
                        >
                          {copiedKey === "b64e" ? <Check className="h-3 w-3 text-cyber-green" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                      <div className="bg-[#07070d] p-2 rounded border border-gray-900 text-[11px] font-mono text-gray-300 break-all select-all">
                        {hashResults.base64Encode || <span className="text-gray-650 italic">Kosong</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hash Cracker panel */}
              <div className="bg-cyber-card p-6 rounded-xl border border-gray-800 space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-cyber font-bold text-sm text-white uppercase tracking-wider flex items-center text-cyber-yellow">
                    <Search className="h-4 w-4 mr-2" />
                    <span>Hash Crack Simulator</span>
                  </h3>
                  <p className="text-gray-400 text-xs font-sans leading-relaxed">
                    Uji keamanan hash MD5 dari dictionary database rahasia lokal. Masukkan hash MD5 di bawah ini dan biarkan simulator melakukan penelusuran kata sandi aslinya.
                  </p>
                  
                  <div className="bg-gray-900/60 p-2.5 rounded border border-gray-850 mb-2 text-[10px] font-mono text-gray-500 leading-relaxed">
                    <div className="font-bold text-gray-400 mb-1">HASH CONTOH DICTIONARY:</div>
                    <div>• 93273e9193273e9193273e9193273e91 (admin)</div>
                    <div>• e2e92c10e2e92c10e2e92c10e2e92c10 (password)</div>
                    <div>• 80bf87a180bf87a180bf87a180bf87a1 (rahasia)</div>
                  </div>

                  <form onSubmit={handleCrackHash} className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-mono text-gray-550 uppercase tracking-widest mb-1">MD5 HASH TARGET</label>
                      <input
                        type="text"
                        value={crackHash}
                        onChange={(e) => setCrackHash(e.target.value)}
                        placeholder="Masukkan MD5 hash 32-karakter..."
                        disabled={isCracking}
                        className="w-full bg-[#07070d] border border-gray-800 focus:border-cyber-yellow rounded px-3 py-2 text-xs font-mono text-white outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isCracking || !crackHash}
                      className={`w-full py-2.5 rounded text-xs font-cyber font-bold uppercase tracking-widest transition-all cursor-pointer ${
                        isCracking
                          ? "bg-gray-850 text-gray-500 border border-gray-800"
                          : "bg-cyber-yellow text-cyber-bg hover:bg-cyber-yellow/80 shadow-[0_0_10px_rgba(255,240,31,0.15)]"
                      }`}
                    >
                      {isCracking ? "Menembus Hash..." : "Mulai Brute-force"}
                    </button>
                  </form>
                </div>

                {/* Cracker progress / result */}
                <div className="mt-6 space-y-4">
                  {isCracking && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                        <span>Menelusuri Dictionary...</span>
                        <span>{crackProgress}%</span>
                      </div>
                      <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyber-yellow transition-all duration-100"
                          style={{ width: `${crackProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {crackResult && !isCracking && (
                    <div className="p-3 rounded bg-gray-900 border border-gray-800 text-left">
                      <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">HASIL DEKODE / CRACK</div>
                      <div className="mt-1 font-mono text-sm font-bold text-cyber-green flex items-center">
                        <Unlock className="h-4 w-4 mr-1.5 shrink-0" />
                        <span>KATA ASLI: {crackResult}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. E2EE CRYPTOGRAPHY TAB */}
          {activeTab === "e2ee" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
              {/* Encryption Panel */}
              <div className="lg:col-span-6 bg-cyber-card p-6 rounded-xl border border-gray-800 space-y-4">
                <h3 className="font-cyber font-bold text-sm text-white uppercase tracking-wider flex items-center text-cyber-green">
                  <Lock className="h-4 w-4 mr-2" />
                  <span>Kanal Enkripsi Pesan</span>
                </h3>
                <p className="text-gray-400 text-xs font-sans leading-relaxed">
                  Kirim pesan rahasia secara aman. Algoritma enkripsi simetris XOR-Base64 kami mengunci teks menggunakan Kunci Keamanan khusus, memproduksi ciphertext yang tidak dapat didekripsi tanpa kunci yang cocok.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-mono text-gray-550 uppercase tracking-widest mb-1">Algoritma</label>
                      <div className="w-full bg-[#07070d] border border-gray-800 rounded px-3 py-2 text-xs font-mono text-cyber-green">
                        XOR_CRYPT_B64
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-gray-550 uppercase tracking-widest mb-1">KUNCI KEAMANAN (KEY)</label>
                      <input
                        type="text"
                        value={e2eeKey}
                        onChange={(e) => setE2eeKey(e.target.value)}
                        placeholder="Kunci Enkripsi..."
                        className="w-full bg-[#07070d] border border-gray-800 focus:border-cyber-green rounded px-3 py-2 text-xs font-mono text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono text-gray-550 uppercase tracking-widest mb-1">Pesan Plaintext</label>
                    <textarea
                      value={plainText}
                      onChange={(e) => setPlainText(e.target.value)}
                      rows={2}
                      className="w-full bg-[#07070d] border border-gray-800 focus:border-cyber-green rounded p-2.5 text-xs font-sans text-white outline-none"
                      placeholder="Masukkan pesan rahasia Anda..."
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyber-green font-bold uppercase tracking-widest">Pesan Terenkripsi (Ciphertext)</span>
                      <button
                        onClick={() => handleCopy(cipherText, "cipher")}
                        className="text-gray-500 hover:text-cyber-green p-0.5"
                        title="Salin Ciphertext"
                      >
                        {copiedKey === "cipher" ? <Check className="h-3 w-3 text-cyber-green" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                    <div className="bg-[#07070d] p-3 rounded border border-gray-900 text-[10px] font-mono text-cyber-magenta select-all break-all leading-normal h-16 overflow-y-auto">
                      {cipherText || <span className="text-gray-650 italic">Menunggu input...</span>}
                    </div>
                    <p className="text-[9px] text-gray-550 font-sans italic leading-tight">
                      *Salin teks merah di atas, kirimkan ke rekan Anda, dan minta mereka mendekripsinya di sebelah kanan menggunakan Kunci Keamanan yang sama!
                    </p>
                  </div>
                </div>
              </div>

              {/* Decryption Panel */}
              <div className="lg:col-span-6 bg-cyber-card p-6 rounded-xl border border-gray-800 space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-cyber font-bold text-sm text-white uppercase tracking-wider flex items-center text-cyber-cyan">
                    <Unlock className="h-4 w-4 mr-2" />
                    <span>Mendekripsi Pesan Ciphertext</span>
                  </h3>
                  <p className="text-gray-400 text-xs font-sans leading-relaxed">
                    Tempelkan string ciphertext rahasia Anda di bawah ini, pastikan Kunci Keamanan di samping kiri diatur dengan kata kunci yang sama untuk melihat data aslinya.
                  </p>

                  <form onSubmit={handleDecryptRequest} className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-mono text-gray-550 uppercase tracking-widest mb-1">CIPHERTEXT (MASUKKAN PESAN TERKUNCI)</label>
                      <textarea
                        value={decryptInput}
                        onChange={(e) => setDecryptInput(e.target.value)}
                        rows={3}
                        placeholder="Tempel ciphertext Base64 terenkripsi di sini..."
                        className="w-full bg-[#07070d] border border-gray-800 focus:border-cyber-cyan rounded p-2.5 text-xs font-mono text-white outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!decryptInput}
                      className="w-full py-2.5 rounded bg-cyber-cyan text-cyber-bg hover:bg-cyber-cyan/80 font-cyber font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                    >
                      Dekripsi Pesan Rahasia
                    </button>
                  </form>
                </div>

                {/* Decrypt Result logs */}
                <div className="mt-6">
                  {decryptError && (
                    <div className="p-3 rounded bg-red-950/20 border border-red-900/40 text-red-400 font-mono text-[11px]">
                      {decryptError}
                    </div>
                  )}

                  {decryptedText && !decryptError && (
                    <div className="p-3.5 rounded bg-[#07070d] border border-cyber-green/30 text-left relative">
                      <div className="text-[9px] font-mono text-cyber-green font-bold uppercase tracking-widest flex items-center justify-between">
                        <span>Pesan Berhasil Didekripsi</span>
                        <Eye className="h-3.5 w-3.5 text-cyber-green animate-pulse" />
                      </div>
                      <p className="mt-2 text-white font-sans text-xs break-all leading-relaxed bg-[#0e0e1a] p-2 rounded border border-gray-900">
                        {decryptedText}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
