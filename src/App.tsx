/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchScanner } from './components/SearchScanner';
import { ReportView } from './components/ReportView';
import { UrlDeobfuscator } from './components/UrlDeobfuscator';
import { PermissionsSimulator } from './components/PermissionsSimulator';
import { RecentScans } from './components/RecentScans';
import { SafetyCategory, SafetyReport } from './types';
import { ShieldCheck, AlertOctagon, HelpCircle } from 'lucide-react';

const STORAGE_KEY = 'safety_inspector_recent_scans_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'deobfuscator' | 'permissions'>('scanner');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SafetyCategory>('all');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [report, setReport] = useState<SafetyReport | null>(null);
  const [recentScans, setRecentScans] = useState<SafetyReport[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load saved scans
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentScans(parsed);
          if (parsed.length > 0 && !report) {
            setReport(parsed[0]);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load local scans', e);
    }
  }, []);

  // Save scans to localStorage
  const saveScan = (newReport: SafetyReport) => {
    setRecentScans((prev) => {
      const filtered = prev.filter((item) => item.query.toLowerCase() !== newReport.query.toLowerCase());
      const updated = [newReport, ...filtered].slice(0, 15);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save scan to localStorage', e);
      }
      return updated;
    });
  };

  const handleClearScans = () => {
    setRecentScans([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear scans', e);
    }
  };

  const executeScan = async (targetQuery?: string, targetCategory?: SafetyCategory) => {
    const q = (targetQuery || query).trim();
    const cat = targetCategory || category;

    if (!q) {
      setError('Please provide a website URL, app name, game title, or link to inspect.');
      return;
    }

    setError(null);
    setLoading(true);
    setActiveTab('scanner');

    // Stage progression feedback
    const stages = [
      'Querying global domain & security certificate registries...',
      'Checking known phishing, scam, and typosquatting signatures...',
      'Analyzing app permissions, tracker networks & payload heuristics...',
      'Synthesizing multi-vector cybersecurity intelligence report...'
    ];

    let stageIdx = 0;
    setLoadingStage(stages[0]);
    const interval = setInterval(() => {
      stageIdx = (stageIdx + 1) % stages.length;
      setLoadingStage(stages[stageIdx]);
    }, 700);

    try {
      const response = await fetch('/api/analyze-safety', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: q,
          category: cat,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: SafetyReport = await response.json();
      setReport(data);
      saveScan(data);
    } catch (err: any) {
      console.error('Inspection failed:', err);
      setError('An error occurred during safety inspection. Please check your internet connection and try again.');
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingStage('');
    }
  };

  // Run initial scan on first visit if no report exists
  useEffect(() => {
    if (!report && recentScans.length === 0) {
      executeScan('wikipedia.org', 'website');
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-slate-900 selection:text-white">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        recentCount={recentScans.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start space-x-2.5 shadow-xs">
            <AlertOctagon className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">Inspection Notice</span>
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-rose-600 hover:text-rose-900 font-bold ml-2 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Switcher */}
        {activeTab === 'scanner' && (
          <>
            <SearchScanner
              query={query}
              setQuery={setQuery}
              category={category}
              setCategory={setCategory}
              onSearch={executeScan}
              loading={loading}
              loadingStage={loadingStage}
            />

            {recentScans.length > 0 && (
              <RecentScans
                scans={recentScans}
                onSelectScan={(selected) => {
                  setReport(selected);
                  setQuery(selected.query);
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                onClearScans={handleClearScans}
              />
            )}

            {report && <ReportView report={report} />}
          </>
        )}

        {activeTab === 'deobfuscator' && <UrlDeobfuscator />}

        {activeTab === 'permissions' && <PermissionsSimulator />}

        {/* Informational Guidance Footer Banner */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700 flex-shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">
                About the Multi-Layer Safety Engine
              </h4>
              <p className="leading-relaxed">
                The Web & App Safety Inspector evaluates threats using a hybrid approach: heuristic syntactic breakdown (SSL/TLS checks, suspicious high-abuse TLDs, raw IP targets, and punycode homoglyph spoofing) combined with intelligence reasoning. Always confirm safety certificates and never enter credentials on unverified third-party platforms.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-slate-700">Web & App Safety Inspector</span>
            <span>•</span>
            <span>Digital Consumer Cyber Defense</span>
          </div>
          <div>
            <span>Protecting against phishing, trojans, predatory microtransactions & scams.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
