import React, { useState } from 'react';
import { Lock, AlertTriangle, CheckCircle2, Copy, Check, Eye } from 'lucide-react';

export const UrlDeobfuscator: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('https://pаypal.com/security/login?return_to=http://fake-portal.xyz');
  const [copied, setCopied] = useState(false);

  // Analysis
  const analyzeUrl = (raw: string) => {
    let clean = raw.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }

    const homoglyphs: Array<{ index: number; char: string; codePoint: string; description: string }> = [];
    const redFlags: string[] = [];

    // Check homoglyphs (non-ASCII characters in hostname)
    try {
      const parsed = new URL(clean);
      const hostname = parsed.hostname;

      for (let i = 0; i < hostname.length; i++) {
        const code = hostname.charCodeAt(i);
        if (code > 127) {
          homoglyphs.push({
            index: i,
            char: hostname[i],
            codePoint: `U+${code.toString(16).toUpperCase().padStart(4, '0')}`,
            description: 'Non-ASCII unicode character (possible spoofing/homoglyph trick)',
          });
        }
      }

      if (homoglyphs.length > 0) {
        redFlags.push(`Critical Homoglyph Attack: Found ${homoglyphs.length} non-Latin character(s) visually disguising the domain.`);
      }

      // Check for user-info @ trick
      if (raw.includes('@')) {
        redFlags.push('Basic Auth Trick Detected (@ symbol): Modern browsers may ignore everything before "@", secretly sending you to the domain after it!');
      }

      // Check unencoded or open redirect query parameters
      if (parsed.search.includes('http://') || parsed.search.includes('https://') || parsed.search.includes('url=') || parsed.search.includes('redirect=')) {
        redFlags.push('Open Redirect Parameter: Query string contains external links, commonly used in phishing relays.');
      }

      // Check IP address hostname
      const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
      if (isIp) {
        redFlags.push('Raw IP Hostname: High risk. Legitimate public services almost never ask users to browse directly to bare IP addresses.');
      }

      // Check double extensions in pathname
      if (/\.(pdf|docx|zip|jpg|png)\.(exe|scr|bat|vbs|apk|iso)$/i.test(parsed.pathname)) {
        redFlags.push('Double File Extension Trapping: Disguised executable pretending to be a document or image.');
      }

      return {
        valid: true,
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash,
        homoglyphs,
        redFlags,
      };
    } catch {
      return {
        valid: false,
        protocol: '',
        hostname: '',
        pathname: '',
        search: '',
        hash: '',
        homoglyphs: [],
        redFlags: ['Malformed URL structure'],
      };
    }
  };

  const analysis = analyzeUrl(inputUrl);

  const handleCopyClean = () => {
    navigator.clipboard.writeText(inputUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              URL De-Obfuscator & Homoglyph Deception Detector
            </h2>
            <p className="text-xs text-slate-500">
              Detect invisible lookalike characters, Cyrillic lookalikes, basic-auth redirect tricks, and query token traps.
            </p>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div>
        <label htmlFor="url-decoder-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Paste Suspicious Link or Obfuscated URL
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="url-decoder-input"
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="e.g. https://pаypal.com/login or http://google.com@evil.com"
            className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 bg-slate-50 font-mono"
          />
          <button
            id="copy-deobfuscated-btn"
            type="button"
            onClick={handleCopyClean}
            className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Quick Test Samples */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="text-slate-400 self-center">Test examples:</span>
        <button
          type="button"
          onClick={() => setInputUrl('https://pаypal.com/login')}
          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono"
        >
          Cyrillic `а` in paypal.com
        </button>
        <button
          type="button"
          onClick={() => setInputUrl('https://steamcommunity.com@fake-inventory-trader.top/trade')}
          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono"
        >
          @ Auth Redirect Trick
        </button>
        <button
          type="button"
          onClick={() => setInputUrl('http://192.168.1.1/update.pdf.exe')}
          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono"
        >
          Double .pdf.exe Extension
        </button>
      </div>

      {/* Breakdown Breakdown */}
      {analysis.valid ? (
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-1">Target Protocol</span>
              <span className={`font-mono font-bold ${analysis.protocol === 'https:' ? 'text-emerald-700' : 'text-rose-600'}`}>
                {analysis.protocol} {analysis.protocol === 'http:' ? '(Plaintext - Insecure)' : ''}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-1">Actual Hostname Destination</span>
              <span className="font-mono font-bold text-slate-800 break-all">{analysis.hostname}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-1">Path / Executable Route</span>
              <span className="font-mono text-slate-700 break-all">{analysis.pathname || '/'}</span>
            </div>
          </div>

          {/* Homoglyph alert */}
          {analysis.homoglyphs.length > 0 && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm mb-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Spoofed Homoglyph Characters Detected!</span>
              </div>
              <p className="text-xs text-rose-700 mb-3">
                This URL looks identical to a legitimate brand in standard fonts, but uses foreign character sets to trick you into visiting a hacker-controlled replica:
              </p>
              <div className="space-y-1.5">
                {analysis.homoglyphs.map((h, i) => (
                  <div key={i} className="flex items-center space-x-3 text-xs font-mono bg-white p-2 rounded-lg border border-rose-200">
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-sm">
                      '{h.char}'
                    </span>
                    <span className="text-slate-500">Unicode {h.codePoint}</span>
                    <span className="text-slate-700">{h.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Red flags list */}
          {analysis.redFlags.length > 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Link Deception Indicators ({analysis.redFlags.length})</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-900">
                {analysis.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Standard URL format: No obvious homoglyphic deception, auth tricks, or open redirect hooks found.</span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          The link entered is malformed. Please enter a valid URL syntax.
        </div>
      )}
    </div>
  );
};
