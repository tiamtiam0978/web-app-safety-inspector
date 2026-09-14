export type SafetyCategory = 'all' | 'website' | 'app' | 'game' | 'risky_link';

export type RiskLevel = 'safe' | 'low' | 'moderate' | 'high' | 'critical';

export interface ThreatFactor {
  name: string;
  score: number; // 0 (safest) to 100 (highest danger)
  status: 'safe' | 'warning' | 'danger';
  details: string;
}

export interface RedFlag {
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
}

export interface PermissionAnalysis {
  permission: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  whyDangerous: string;
  isStandardForType: boolean;
}

export interface GameSafetyDetails {
  monetizationStyle: string;
  ageSuitability: string;
  unmoderatedChatRisk: 'none' | 'low' | 'medium' | 'high';
  darkPatternsDetected: string[];
}

export interface TechnicalChecks {
  sslTlsStatus: 'secure' | 'insecure' | 'not_applicable' | 'suspicious';
  domainAgeReputation: 'established' | 'new_or_unregistered' | 'flagged' | 'unknown';
  typosquattingRisk: 'none' | 'possible' | 'high_impersonation';
  dataCollectionRating: 'minimal' | 'standard' | 'aggressive' | 'excessive';
  downloadSafety: 'clean' | 'caution' | 'dangerous_executables' | 'not_applicable';
}

export interface SafetyReport {
  id: string;
  query: string;
  category: 'website' | 'app' | 'game' | 'risky_link';
  trustScore: number; // 0 (pure danger) to 100 (super safe)
  riskLevel: RiskLevel;
  verdict: string;
  summary: string;
  detectedType: string;
  technicalChecks: TechnicalChecks;
  threatFactors: ThreatFactor[];
  redFlags: RedFlag[];
  positiveSignals: string[];
  safetyGuidelines: string[];
  permissionsAnalysis?: PermissionAnalysis[];
  gameSpecific?: GameSafetyDetails;
  analyzedAt: string;
}

export interface PresetSample {
  id: string;
  label: string;
  query: string;
  category: 'website' | 'app' | 'game' | 'risky_link';
  tag: string;
  expectedRisk: 'safe' | 'risky' | 'dangerous';
  description: string;
}
