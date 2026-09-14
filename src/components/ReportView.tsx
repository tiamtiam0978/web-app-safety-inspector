import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Globe,
  Smartphone,
  Gamepad2,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  Check,
  FileText,
  HelpCircle
} from 'lucide-react';
import { SafetyReport } from '../types';

interface ReportViewProps {
  report: SafetyReport;
}

export const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  const [copied, setCopied] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return { stroke: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    if (score >= 70) return { stroke: '#0284c7', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' };
    if (score >= 50) return { stroke: '#d97706', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    if (score >= 30) return { stroke: '#ea580c', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
    return { stroke: '#e11d48', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
  };

  const scoreTheme = getScoreColor(report.trustScore);

  const handleCopyReport = () => {
    const text = `Web & App Safety Inspection Report:
Target: ${report.query}
Category: ${report.category.toUpperCase()}
Trust Score: ${report.trustScore}/100 (${report.riskLevel.toUpperCase()})
Verdict: ${report.verdict}
Summary: ${report.summary}
Scanned on: ${new Date(report.analyzedAt).toLocaleString()}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const circumference = 2 * Math.PI * 44;
  const strokeDashoffset = circumference - (report.trustScore / 100) * circumference;

  return (
    <div id="safety-report-container" className="space-y-6 animate-fadeIn">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2.5 mb-1.5">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                {report.detectedType}
              </span>
              <span className="text-xs text-slate-400">
                Scanned {new Date(report.analyzedAt).toLocaleTimeString()}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 break-all">
              {report.query}
            </h2>
          </div>

          {/* Action Bar */}
          <div className="flex items-center space-x-2">
            <button
              id="copy-report-summary-btn"
              type="button"
              onClick={handleCopyReport}
              className="inline-flex items-center px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  <span>Share Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Score & Verdict Row */}
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Trust Score Ring */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50/70 rounded-xl border border-slate-100">
            <div className="relative w-32 h-32 flex items-center justify-center mb-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="text-slate-200 stroke-current"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke={scoreTheme.stroke}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {report.trustScore}
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-400">
                  Trust Score
                </span>
              </div>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${scoreTheme.bg} ${scoreTheme.text} ${scoreTheme.border}`}>
              Risk Level: {report.riskLevel}
            </div>
          </div>

          {/* Verdict and Summary Text */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            <div className="flex items-center space-x-2 mb-2">
              {report.riskLevel === 'safe' || report.riskLevel === 'low' ? (
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              ) : report.riskLevel === 'moderate' ? (
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-rose-600 flex-shrink-0" />
              )}
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {report.verdict}
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {report.summary}
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                SSL/TLS: {report.technicalChecks.sslTlsStatus.toUpperCase()}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                Reputation: {report.technicalChecks.domainAgeReputation.replace('_', ' ').toUpperCase()}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                Typosquatting Risk: {report.technicalChecks.typosquattingRisk.toUpperCase()}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                Data Harvest: {report.technicalChecks.dataCollectionRating.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Threat Pillars Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {report.threatFactors.map((factor, idx) => {
          const isDanger = factor.status === 'danger';
          const isWarning = factor.status === 'warning';
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">
                    {factor.name}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      isDanger
                        ? 'bg-rose-100 text-rose-700'
                        : isWarning
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {factor.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-normal mb-3">
                  {factor.details}
                </p>
              </div>

              {/* Threat Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1">
                  <span>Threat Factor</span>
                  <span className="text-slate-700 font-semibold">{factor.score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isDanger ? 'bg-rose-600' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, factor.score))}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Red Flags & Positive Signals Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Red Flags Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-slate-900 text-base">
              Identified Threat Warnings & Red Flags ({report.redFlags.length})
            </h3>
          </div>

          {report.redFlags.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p>No critical red flags or malicious signatures detected for this target.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {report.redFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    flag.severity === 'critical'
                      ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                      : flag.severity === 'high'
                      ? 'bg-orange-50/70 border-orange-200 text-orange-950'
                      : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">{flag.title}</span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/70">
                      {flag.severity}
                    </span>
                  </div>
                  <p className="opacity-90">{flag.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Positive Signals Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Verified Trust Signals & Safety Baselines
            </h3>
          </div>

          {report.positiveSignals.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              <p>No verified reputation records confirmed in public databases.</p>
            </div>
          ) : (
            <ul className="space-y-2.5 text-xs text-slate-600">
              {report.positiveSignals.map((signal, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{signal}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Specialized Section: App Permissions Analysis if present */}
      {report.permissionsAnalysis && report.permissionsAnalysis.length > 0 && (
        <div className="bg-white rounded-2xl border border-purple-200 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <Smartphone className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-base">
              App Permissions & Privilege Audit
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Analysis of sensitive device permissions requested by this application and potential misuse vectors:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.permissionsAnalysis.map((p, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-800">{p.permission}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      p.risk === 'critical'
                        ? 'bg-rose-100 text-rose-700'
                        : p.risk === 'high'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    Risk: {p.risk}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{p.whyDangerous}</p>
                <div className="mt-2 text-[11px] text-slate-400">
                  Expected for this app type: {p.isStandardForType ? 'Yes (Normal)' : 'No (Abnormal/Excessive)'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specialized Section: Game Safety & Monetization if present */}
      {report.gameSpecific && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <Gamepad2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Game Safety, Monetization & Parental Assessment
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-1">Monetization Model</span>
              <span className="font-semibold text-slate-800">{report.gameSpecific.monetizationStyle}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-1">Age Suitability</span>
              <span className="font-semibold text-slate-800">{report.gameSpecific.ageSuitability}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-1">Unmoderated Chat Risk</span>
              <span className="font-semibold text-slate-800 uppercase">{report.gameSpecific.unmoderatedChatRisk}</span>
            </div>
          </div>

          {report.gameSpecific.darkPatternsDetected && report.gameSpecific.darkPatternsDetected.length > 0 && (
            <div className="text-xs">
              <span className="font-semibold text-slate-700 block mb-1.5">
                Gaming Dark Patterns or Psychological Hooks Detected:
              </span>
              <div className="flex flex-wrap gap-2">
                {report.gameSpecific.darkPatternsDetected.map((dp, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800">
                    {dp}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Protective Safety Checklist */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <FileText className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-base">
            Recommended Action Plan & Safety Precautions
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-4">
          Follow these critical steps before interacting with, downloading, or registering on this service:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {report.safetyGuidelines.map((guide, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                {idx + 1}
              </span>
              <span className="text-slate-200 leading-relaxed">{guide}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
