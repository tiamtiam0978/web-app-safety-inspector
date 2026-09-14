import React from 'react';
import { ShieldCheck, Lock, Activity } from 'lucide-react';

interface HeaderProps {
  activeTab: 'scanner' | 'deobfuscator' | 'permissions';
  setActiveTab: (tab: 'scanner' | 'deobfuscator' | 'permissions') => void;
  recentCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, recentCount }) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-900 text-base sm:text-lg tracking-tight">
                  Web & App Safety Inspector
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Active Shield
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Real-time threat evaluation for URLs, websites, mobile apps, games & scam links
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center space-x-1 sm:space-x-2" aria-label="Tools">
            <button
              id="tab-btn-scanner"
              type="button"
              onClick={() => setActiveTab('scanner')}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'scanner'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Safety Scanner
              {recentCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full bg-slate-700 text-slate-200">
                  {recentCount}
                </span>
              )}
            </button>

            <button
              id="tab-btn-deobfuscator"
              type="button"
              onClick={() => setActiveTab('deobfuscator')}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center space-x-1.5 ${
                activeTab === 'deobfuscator'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>URL Decoder</span>
            </button>

            <button
              id="tab-btn-permissions"
              type="button"
              onClick={() => setActiveTab('permissions')}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center space-x-1.5 ${
                activeTab === 'permissions'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Permission Matrix</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
