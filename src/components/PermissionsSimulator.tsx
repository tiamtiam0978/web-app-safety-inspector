import React, { useState } from 'react';
import { Smartphone, AlertTriangle, ShieldCheck, ShieldAlert, Check } from 'lucide-react';

interface PermissionDef {
  id: string;
  name: string;
  category: 'System' | 'Privacy' | 'Finance / Identity';
  baseRisk: number; // 0 - 40
  severity: 'critical' | 'high' | 'medium';
  whyMalwareUsesIt: string;
  realWorldTrojanExample: string;
}

const PERMISSION_DATABASE: PermissionDef[] = [
  {
    id: 'accessibility',
    name: 'Accessibility Services (BIND_ACCESSIBILITY_SERVICE)',
    category: 'System',
    baseRisk: 40,
    severity: 'critical',
    whyMalwareUsesIt: 'The #1 privilege sought by modern banking trojans. Allows full control: reading whatever is displayed on screen, clicking buttons autonomously, granting further permissions without user interaction, and logging keystrokes.',
    realWorldTrojanExample: 'SharkBot, TeaBot, FluBot (Financial Stealers)',
  },
  {
    id: 'notification_listener',
    name: 'Notification Listener (BIND_NOTIFICATION_LISTENER_SERVICE)',
    category: 'Finance / Identity',
    baseRisk: 30,
    severity: 'critical',
    whyMalwareUsesIt: 'Can read push notification previews from banking, PayPal, WhatsApp, and email apps, silently intercepting 2FA verification codes even if SMS permission is blocked.',
    realWorldTrojanExample: 'Alien / ERMAC Banking Trojans',
  },
  {
    id: 'sms',
    name: 'Read & Send SMS (RECEIVE_SMS / SEND_SMS)',
    category: 'Finance / Identity',
    baseRisk: 30,
    severity: 'high',
    whyMalwareUsesIt: 'Intercepts one-time banking passcodes (OTP), deletes the incoming notification so the victim does not notice unauthorized transfers, and sends premium-rate SMS to drain mobile credit.',
    realWorldTrojanExample: 'FluBot / Joker Spyware',
  },
  {
    id: 'overlay',
    name: 'Display Over Other Apps (SYSTEM_ALERT_WINDOW)',
    category: 'System',
    baseRisk: 25,
    severity: 'high',
    whyMalwareUsesIt: 'Detects when you open a legitimate banking or crypto wallet app and instantly projects an identical transparent spoofed login box directly over it to steal your credentials.',
    realWorldTrojanExample: 'Godfather / Cerberus Malware',
  },
  {
    id: 'device_admin',
    name: 'Device Administrator (BIND_DEVICE_ADMIN)',
    category: 'System',
    baseRisk: 35,
    severity: 'critical',
    whyMalwareUsesIt: 'Prevents the user from uninstalling the application, allows the app to remotely lock or wipe the device, and forces screen lock pin changes.',
    realWorldTrojanExample: 'SLocker Ransomware',
  },
  {
    id: 'install_unknown',
    name: 'Install Unknown Apps (REQUEST_INSTALL_PACKAGES)',
    category: 'System',
    baseRisk: 25,
    severity: 'high',
    whyMalwareUsesIt: 'Turns the app into a "dropper". Even if the original app looked harmless, it silently downloads and installs secondary malicious APK payloads in the background.',
    realWorldTrojanExample: 'Anatsa / Dropper Campaigns',
  },
  {
    id: 'location_bg',
    name: 'Background Location (ACCESS_BACKGROUND_LOCATION)',
    category: 'Privacy',
    baseRisk: 15,
    severity: 'medium',
    whyMalwareUsesIt: 'Silently tracks your real-time physical coordinates 24/7 without opening the app, frequently sold to shadowy data broker networks.',
    realWorldTrojanExample: 'Predatory SDKs & Stalkerware',
  },
  {
    id: 'contacts_call',
    name: 'Read Contacts & Call Logs (READ_CONTACTS)',
    category: 'Privacy',
    baseRisk: 20,
    severity: 'high',
    whyMalwareUsesIt: 'Harvests your entire phonebook. Often used in predatory payday loan app scams (loan sharks) to harass and blackmail family members.',
    realWorldTrojanExample: 'SpyLoan / Extortion Scam Apps',
  },
  {
    id: 'camera_mic',
    name: 'Record Audio & Camera (RECORD_AUDIO / CAMERA)',
    category: 'Privacy',
    baseRisk: 20,
    severity: 'medium',
    whyMalwareUsesIt: 'Used by state-sponsored and commercial spyware to turn your smartphone into a covert ambient listening bug and spy device.',
    realWorldTrojanExample: 'Pegasus / FinFisher Surveillance',
  },
];

export const PermissionsSimulator: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['accessibility', 'sms', 'overlay']);

  const togglePermission = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((p) => p !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Calculate danger score (0 - 100)
  const totalRawRisk = selectedIds.reduce((acc, id) => {
    const item = PERMISSION_DATABASE.find((p) => p.id === id);
    return acc + (item ? item.baseRisk : 0);
  }, 0);

  const dangerScore = Math.min(100, totalRawRisk);

  const getDangerLevel = (score: number) => {
    if (score >= 70) return { label: 'Extremely Lethal (Banking Trojan Profile)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    if (score >= 40) return { label: 'High Threat (Adware / Sideloading Trap)', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    if (score >= 20) return { label: 'Moderate Concern (Excessive Privileges)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Standard / Low Exposure', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };

  const dangerLevel = getDangerLevel(dangerScore);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center space-x-2.5">
        <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            App Permission Risk Simulator & Trojan Vector Analyzer
          </h2>
          <p className="text-xs text-slate-500">
            Select permissions requested by an unfamiliar APK or mobile game to see how cybercriminals exploit them.
          </p>
        </div>
      </div>

      {/* Danger Gauge Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Simulated App Privileges Risk
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${dangerLevel.color}`}>
              {dangerLevel.label}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {selectedIds.length} permission(s) granted. Notice how a simple flashlight or modded game with Accessibility + Overlay can control your entire phone.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-800/90 px-4 py-2.5 rounded-xl border border-slate-700">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Threat Score</span>
            <span className="text-2xl font-extrabold text-rose-400">{dangerScore}/100</span>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-rose-500/20 text-rose-400">
            {dangerScore >= 50 ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6 text-emerald-400" />}
          </div>
        </div>
      </div>

      {/* Permissions Selector Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Toggle Sensitive Permissions
          </h3>
          <div className="flex space-x-2 text-xs">
            <button
              type="button"
              onClick={() => setSelectedIds(['accessibility', 'notification_listener', 'sms', 'overlay', 'device_admin'])}
              className="text-rose-600 hover:underline font-medium"
            >
              Select Trojan Profile
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-slate-500 hover:underline font-medium"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PERMISSION_DATABASE.map((perm) => {
            const isChecked = selectedIds.includes(perm.id);
            return (
              <div
                key={perm.id}
                onClick={() => togglePermission(perm.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isChecked
                    ? 'border-slate-800 bg-slate-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isChecked
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="font-bold text-xs text-slate-900">{perm.name}</span>
                  </div>

                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                      perm.severity === 'critical'
                        ? 'bg-rose-100 text-rose-700'
                        : perm.severity === 'high'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {perm.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-600 pl-6 leading-relaxed mb-2">
                  {perm.whyMalwareUsesIt}
                </p>

                <div className="pl-6 text-[11px] text-slate-500 flex items-center space-x-1">
                  <span className="font-semibold text-slate-700">Observed in:</span>
                  <span>{perm.realWorldTrojanExample}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
