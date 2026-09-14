import { PresetSample } from '../types';

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: 'sample-1',
    label: 'Wikipedia',
    query: 'wikipedia.org',
    category: 'website',
    tag: 'Safe Website',
    expectedRisk: 'safe',
    description: 'Non-profit encyclopedia, strict privacy policy, no commercial trackers.'
  },
  {
    id: 'sample-2',
    label: 'Steam Community Lookalike',
    query: 'https://steamcommunnity-trade.gift.xyz/login',
    category: 'risky_link',
    tag: 'Phishing Scam',
    expectedRisk: 'dangerous',
    description: 'Typosquatted domain mimicking Steam to hijack gaming credentials and trade inventory.'
  },
  {
    id: 'sample-3',
    label: 'Roblox',
    query: 'roblox.com',
    category: 'game',
    tag: 'Major Gaming Platform',
    expectedRisk: 'safe',
    description: 'Legitimate multiplayer gaming platform with parental controls and chat filters.'
  },
  {
    id: 'sample-4',
    label: 'Free Robux Generator',
    query: 'free-robux-unlimited-generator2025.fun',
    category: 'game',
    tag: 'Currency Bait Trap',
    expectedRisk: 'dangerous',
    description: 'Fake generator site that lures players into survey loops and password theft.'
  },
  {
    id: 'sample-5',
    label: 'Duolingo Language App',
    query: 'Duolingo: Language Lessons',
    category: 'app',
    tag: 'Verified Educational App',
    expectedRisk: 'safe',
    description: 'Official verified app on major app stores with standard educational permissions.'
  },
  {
    id: 'sample-6',
    label: 'WhatsApp Gold Mod APK',
    query: 'WhatsApp-Gold-AntiBan-v19.80.apk',
    category: 'app',
    tag: 'Dangerous Modified APK',
    expectedRisk: 'dangerous',
    description: 'Unauthorized WhatsApp clone that demands accessibility and SMS permissions to intercept OTPs.'
  },
  {
    id: 'sample-7',
    label: 'PayPal Account Verification Alert',
    query: 'http://paypal-security-update-billing.top/verify',
    category: 'risky_link',
    tag: 'Banking Phish',
    expectedRisk: 'dangerous',
    description: 'High-risk HTTP phishing link designed to harvest credit cards and bank logins.'
  },
  {
    id: 'sample-8',
    label: 'Free HD Movies Streamer',
    query: 'https://freemovies-no-registration-stream.xyz',
    category: 'website',
    tag: 'Adware / Malware Traps',
    expectedRisk: 'risky',
    description: 'Piracy streaming site laden with malvertising popups and fake video-codec downloads.'
  }
];
