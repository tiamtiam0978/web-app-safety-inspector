import React from 'react';
import { History, Trash2, ArrowRight, Globe, Smartphone, Gamepad2, AlertTriangle } from 'lucide-react';
import { SafetyReport } from '../types';

interface RecentScansProps {
  scans: SafetyReport[];
  onSelectScan: (report: SafetyReport) => void;
  onClearScans: () => void;
}

export const RecentScans: React.FC<RecentScansProps> = ({
  scans,
  onSelectScan,
  onClearScans,
}) => {
  if (scans.length === 0) return null;

  const getScoreBadge = (score: number) => {
    if (score >= 85) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score >= 70) return 'bg-sky-100 text-sky-800 border-sky-200';
    if (score >= 50) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (score >= 30) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-rose-100 text-rose-800 border-rose-200';
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'app':
        return <Smartphone className="w-3.5 h-3.5 text-purple-600" />;
      case 'game':
        return <Gamepad2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'risky_link':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-slate-500" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
            Recent Inspections ({scans.length})
          </h3>
        </div>
        <button
          id="clear-recent-scans-btn"
          type="button"
          onClick={onClearScans}
          className="text-xs text-slate-400 hover:text-rose-600 flex items-center space-x-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {scans.slice(0, 6).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectScan(item)}
            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 bg-slate-50/60 hover:bg-white text-left transition-all group"
          >
            <div className="flex items-center space-x-2 min-w-0 pr-2">
              <div className="p-1 rounded bg-white shadow-2xs border border-slate-100">
                {getCategoryIcon(item.category)}
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600">
                  {item.query}
                </span>
                <span className="block text-[10px] text-slate-400">
                  {new Date(item.analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 flex-shrink-0">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getScoreBadge(item.trustScore)}`}>
                {item.trustScore}/100
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
