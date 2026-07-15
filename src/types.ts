export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  description: string[];
  category: "it" | "legal" | "mixed" | "marketing" | "design";
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  details: string[];
}

export interface SkillGroup {
  category: string;
  skills: string[];
  icon: string;
}

export interface ScanResult {
  port: number;
  service: string;
  status: "open" | "closed" | "filtered";
  threatLevel: "low" | "medium" | "high" | "safe";
  complianceRisk?: string;
  remediation?: string;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  sourceIP: string;
  service: string;
  payload: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  threatDetected: string | null;
  complianceViolation: string | null;
  lawReferenced: string | null;
  status: "unresolved" | "mitigated";
}

export interface EncryptedMessage {
  id: string;
  sender: string;
  recipient: string;
  ciphertext: string;
  algorithm: string;
  timestamp: string;
  decryptedText?: string;
  isCustom?: boolean;
}
