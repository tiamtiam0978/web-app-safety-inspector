import React from 'react';
import { Search, Globe, Smartphone, Gamepad2, AlertTriangle, Sparkles, X, ArrowRight } from 'lucide-react';
import { SafetyCategory, PresetSample } from '../types';
import { PRESET_SAMPLES } from '../data/presets';

interface SearchScannerProps {
  query: string;
  setQuery: (val: string) => void;
  category: SafetyCategory;
  setCategory: (cat: SafetyCategory) => void;
  onSearch: (customQuery?: string, customCategory?: SafetyCategory) => void;
  loading: boolean;
  loadingStage: string;
}

export const SearchScanner: React.FC<SearchScannerProps> = ({
  query,
  setQuery,
  category,
  setCategory,
  onSearch,
  loading,
  loadingStage,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch();
  };

  const handleSelectPreset = (sample: PresetSample) => {
    setQuery(sample.query);
    setCategory(sample.category);
    onSearch(sample.query, sample.category);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Inspect Any Website, App, Game, or Link for Safety
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Analyze phishing risk, trojan payloads, spyware permissions, predatory in-game mechanics, and suspicious lookalike domains in seconds.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4" role="tablist">
          <button
            id="cat-pill-all"
            type="button"
            onClick={() => setCategory('all')}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              category === 'all'
                ? 'bg-slate-900 text-white ring-2 ring-slate-900 ring-offset-1'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            All Categories
          </button>
          <button
            id="cat-pill-website"
            type="button"
            onClick={() => setCategory('website')}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              category === 'website'
                ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-1'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 mr-1.5" />
            Websites & URLs
          </button>
          <button
            id="cat-pill-app"
            type="button"
            onClick={() => setCategory('app')}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              category === 'app'
                ? 'bg-purple-600 text-white ring-2 ring-purple-600 ring-offset-1'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 mr-1.5" />
            Apps & APKs
          </button>
          <button
            id="cat-pill-game"
            type="button"
            onClick={() => setCategory('game')}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              category === 'game'
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-600 ring-offset-1'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 mr-1.5" />
            Online Games
          </button>
          <button
            id="cat-pill-risky"
            type="button"
            onClick={() => setCategory('risky_link')}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              category === 'risky_link'
                ? 'bg-rose-600 text-white ring-2 ring-rose-600 ring-offset-1'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
            Risky / Scam Links
          </button>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSubmit} className="relative mb-5">
          <div className="flex items-center border-2 border-slate-300 focus-within:border-slate-800 rounded-xl bg-slate-50/50 p-1.5 transition-all shadow-sm">
            <div className="pl-3 pr-2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="safety-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                category === 'website'
                  ? 'Enter URL or domain (e.g., example.com or https://...)'
                  : category === 'app'
                  ? 'Enter app name or APK file name (e.g., Duolingo, WhatsApp Mod APK)'
                  : category === 'game'
                  ? 'Enter game name or gaming portal (e.g., Roblox, Free Robux Generator)'
                  : category === 'risky_link'
                  ? 'Paste suspicious link or URL to check'
                  : 'Enter website URL, app title, game, or link to inspect...'
              }
              className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none py-2 px-1"
              disabled={loading}
            />
            {query && !loading && (
              <button
                id="clear-search-btn"
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors mr-1"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              id="submit-scan-btn"
              type="submit"
              disabled={loading || !query.trim()}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Scanning...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <span>Run Safety Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Loading Progress State */}
        {loading && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6 text-center animate-pulse">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{loadingStage || 'Performing multi-vector threat inspection...'}</span>
            </div>
          </div>
        )}

        {/* Presets Grid */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Try Preset Test Scenarios
            </span>
            <span className="text-[11px] text-slate-500">
              Click to evaluate real-world examples
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_SAMPLES.map((sample) => {
              const isDanger = sample.expectedRisk === 'dangerous';
              const isWarning = sample.expectedRisk === 'risky';
              return (
                <button
                  id={`preset-btn-${sample.id}`}
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectPreset(sample)}
                  disabled={loading}
                  className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 transition-all text-xs group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800 truncate group-hover:text-blue-600">
                      {sample.label}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                        isDanger
                          ? 'bg-rose-100 text-rose-700'
                          : isWarning
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {sample.expectedRisk}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {sample.query}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
