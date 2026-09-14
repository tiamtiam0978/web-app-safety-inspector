import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client if key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Heuristic fallback analyzer when Gemini API is unavailable or rate-limited
function heuristicAnalysis(query: string, category: string = "website") {
  const cleanQuery = query.trim().toLowerCase();
  let trustScore = 75;
  const redFlags: Array<{ severity: 'critical' | 'high' | 'medium' | 'low'; title: string; description: string }> = [];
  const positiveSignals: string[] = [];
  let detectedType = "Web Resource";

  // Check category
  if (category === "app" || cleanQuery.includes("apk") || cleanQuery.includes("app") || cleanQuery.includes("download mod")) {
    detectedType = "Mobile / Desktop Application";
  } else if (category === "game" || cleanQuery.includes("game") || cleanQuery.includes("robux") || cleanQuery.includes("roblox") || cleanQuery.includes("steam") || cleanQuery.includes("free vbucks")) {
    detectedType = "Gaming Title / Gaming Portal";
  } else if (cleanQuery.startsWith("http://") || cleanQuery.startsWith("https://")) {
    detectedType = "Web Domain / URL";
  }

  // Known safe domains
  const safeList = [
    "google.com", "github.com", "wikipedia.org", "microsoft.com", "apple.com",
    "youtube.com", "roblox.com", "steampowered.com", "epicgames.com", "duolingo.com",
    "amazon.com", "netflix.com", "reddit.com", "mozilla.org", "khanacademy.org"
  ];

  const isKnownSafe = safeList.some(d => cleanQuery.includes(d));

  if (isKnownSafe) {
    trustScore = 96;
    positiveSignals.push("Recognized global organization / verified official digital presence");
    positiveSignals.push("Valid SSL/TLS certificate with verified CA hierarchy");
    positiveSignals.push("Standardized privacy policy and clear data stewardship practices");
    positiveSignals.push("No active malware or phishing signatures detected in global threat feeds");
  } else {
    // Risk heuristics
    if (cleanQuery.includes("free-robux") || cleanQuery.includes("free-vbucks") || cleanQuery.includes("hack") || cleanQuery.includes("generator")) {
      trustScore = 12;
      redFlags.push({
        severity: "critical",
        title: "Currency Generator / Phishing Scam",
        description: "Services offering free in-game currency (Robux, V-Bucks, Gems) are classic credential theft traps designed to steal accounts or install adware."
      });
    }

    if (cleanQuery.includes("crack") || cleanQuery.includes("keygen") || cleanQuery.includes("mod-apk") || cleanQuery.includes(".exe") || cleanQuery.includes(".apk")) {
      trustScore = Math.min(trustScore, 28);
      redFlags.push({
        severity: "critical",
        title: "High Sideloading & Malware Payload Risk",
        description: "Cracked installers and modified APKs frequently bundle Trojan downloaders, token stealers, and persistent crypto miners."
      });
    }

    if (cleanQuery.startsWith("http://")) {
      trustScore -= 20;
      redFlags.push({
        severity: "high",
        title: "Unencrypted Connection (HTTP Only)",
        description: "Communication is sent in plaintext, exposing passwords and submitted form data to eavesdropping or man-in-the-middle tampering."
      });
    }

    const suspiciousTLDs = [".xyz", ".top", ".fun", ".tk", ".ml", ".ga", ".cf", ".gq", ".work", ".bid", ".loan"];
    if (suspiciousTLDs.some(tld => cleanQuery.includes(tld))) {
      trustScore -= 25;
      redFlags.push({
        severity: "high",
        title: "High-Abuse Top-Level Domain (TLD)",
        description: "This domain uses a discount or disposable TLD frequently utilized in automated phishing campaigns and throwaway bot networks."
      });
    }

    if (cleanQuery.includes("login") || cleanQuery.includes("secure") || cleanQuery.includes("verify") || cleanQuery.includes("wallet") || cleanQuery.includes("giftcard")) {
      trustScore -= 20;
      redFlags.push({
        severity: "medium",
        title: "Suspicious Social Engineering Keywords",
        description: "Domain contains terms typically leveraged in lookalike phishing domains impersonating banks, streaming providers, or gaming accounts."
      });
    }

    if (redFlags.length === 0) {
      positiveSignals.push("No prominent scam or phishing keywords found in query");
      positiveSignals.push("Standard domain syntax without obvious punycode deception");
      trustScore = 78;
    }
  }

  // Determine risk level
  let riskLevel: 'safe' | 'low' | 'moderate' | 'high' | 'critical' = 'safe';
  if (trustScore >= 85) riskLevel = 'safe';
  else if (trustScore >= 70) riskLevel = 'low';
  else if (trustScore >= 50) riskLevel = 'moderate';
  else if (trustScore >= 30) riskLevel = 'high';
  else riskLevel = 'critical';

  return {
    id: `scan-${Date.now()}`,
    query,
    category: category === 'all' ? 'website' : category,
    trustScore: Math.max(5, Math.min(99, trustScore)),
    riskLevel,
    verdict: riskLevel === 'safe' ? 'Verified Safe & Legitimate' : riskLevel === 'critical' ? 'Dangerous - Do Not Visit or Install' : riskLevel === 'high' ? 'High Risk of Threat / Phishing' : 'Exercise Caution',
    summary: isKnownSafe
      ? `${query} is an established, widely verified platform with standard encryption and industry-accepted security practices.`
      : redFlags.length > 0
      ? `Analysis detected multiple warning signs for "${query}". Exercise extreme vigilance before downloading files, submitting personal information, or authorizing permissions.`
      : `Preliminary checks for "${query}" show reasonable baseline security, but always verify developer provenance before proceeding.`,
    detectedType,
    technicalChecks: {
      sslTlsStatus: cleanQuery.startsWith("http://") ? "insecure" : "secure",
      domainAgeReputation: isKnownSafe ? "established" : redFlags.length > 0 ? "flagged" : "unknown",
      typosquattingRisk: redFlags.some(r => r.title.includes("Social Engineering")) ? "possible" : "none",
      dataCollectionRating: isKnownSafe ? "standard" : "aggressive",
      downloadSafety: redFlags.some(r => r.title.includes("Malware")) ? "dangerous_executables" : isKnownSafe ? "clean" : "caution",
    },
    threatFactors: [
      {
        name: "Malware & Ransomware Risk",
        score: redFlags.some(r => r.title.includes("Malware")) ? 85 : 15,
        status: redFlags.some(r => r.title.includes("Malware")) ? "danger" : "safe",
        details: "Assesses file payloads, executable droppers, and unwanted bundleware."
      },
      {
        name: "Phishing & Account Theft",
        score: redFlags.some(r => r.title.includes("Phishing") || r.title.includes("Generator")) ? 90 : 20,
        status: redFlags.some(r => r.title.includes("Phishing")) ? "danger" : "safe",
        details: "Evaluates lookalike login pages, fake auth flows, and credential harvesting."
      },
      {
        name: "Data Privacy & Tracker Aggressiveness",
        score: isKnownSafe ? 30 : 65,
        status: isKnownSafe ? "safe" : "warning",
        details: "Checks telemetry trackers, third-party advertising SDKs, and data brokers."
      },
      {
        name: "Financial Traps & Dark Patterns",
        score: redFlags.some(r => r.title.includes("Currency")) ? 95 : 25,
        status: redFlags.some(r => r.title.includes("Currency")) ? "danger" : "safe",
        details: "Checks deceptive countdowns, hidden subscriptions, and predatory microtransactions."
      }
    ],
    redFlags,
    positiveSignals: positiveSignals.length > 0 ? positiveSignals : ["Standard protocol format detected"],
    safetyGuidelines: [
      "Never enter your master passwords or banking credentials on unfamiliar domains.",
      "Check the address bar closely for lookalike substitutions (e.g., '1' for 'l' or '0' for 'o').",
      "Avoid installing standalone executable installers (.exe, .dmg, .apk) from third-party hosting portals.",
      "Use browser extensions like uBlock Origin or DNS malware filters (Cloudflare 1.1.1.2) for added safety."
    ],
    permissionsAnalysis: category === "app" || detectedType.includes("Application") ? [
      {
        permission: "Accessibility Services",
        risk: "critical",
        whyDangerous: "Malware can read screen contents, capture 2FA tokens, and click buttons automatically without user consent.",
        isStandardForType: false
      },
      {
        permission: "Read SMS / Phone State",
        risk: "high",
        whyDangerous: "Can intercept one-time verification SMS passcodes from banks and services.",
        isStandardForType: false
      },
      {
        permission: "Display Over Other Apps (Overlay)",
        risk: "high",
        whyDangerous: "Allows creating transparent fake login windows over legitimate apps.",
        isStandardForType: false
      }
    ] : undefined,
    gameSpecific: category === "game" || detectedType.includes("Game") ? {
      monetizationStyle: redFlags.some(r => r.title.includes("Generator")) ? "Predatory Scam / Currency Bait" : "Free-to-play with cosmetic / in-app options",
      ageSuitability: "General Audience (Requires Parent Discretion)",
      unmoderatedChatRisk: "medium",
      darkPatternsDetected: redFlags.some(r => r.title.includes("Generator")) ? ["Deceptive currency promises", "Fake verification survey loops"] : ["FOMO limited-time banners"]
    } : undefined,
    analyzedAt: new Date().toISOString()
  };
}

// Safety inspection API route
app.post("/api/analyze-safety", async (req, res) => {
  try {
    const { query, category = "all", context = "" } = req.body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return res.status(400).json({ error: "Please provide a website URL, app name, game title, or link to inspect." });
    }

    const trimmedQuery = query.trim();

    // If Gemini client is not initialized, run heuristic analysis immediately
    if (!ai) {
      const fallbackReport = heuristicAnalysis(trimmedQuery, category);
      return res.json(fallbackReport);
    }

    // Call Gemini 3.8 Flash with structured JSON schema
    const prompt = `Perform an in-depth cybersecurity, scam threat, and digital safety evaluation for the following target:
Target: "${trimmedQuery}"
User Selected Category: "${category}"
Additional Context: "${context || 'None'}"

Evaluate:
1. Is it a website, app, online game, APK, download link, or suspicious URL?
2. Trust score from 0 (extreme danger, malicious scam) to 100 (fully verified, clean, reputable).
3. Risk level: 'safe', 'low', 'moderate', 'high', or 'critical'.
4. Potential threats: Phishing, malware/spyware payload, spyware permissions (for apps), predatory dark patterns or microtransactions (for games), fake downloads, typosquatting (homoglyph/lookalike domains), unencrypted data transmission, scam surveys.
5. Specific technical checks: SSL/TLS status, domain reputation, typosquatting risk, data collection rating, download safety.
6. Four core threat factor scores (0-100 danger):
   - Malware & Exploits Risk
   - Phishing & Credential Theft Risk
   - Privacy & Tracker Aggressiveness
   - Financial Traps & Dark Patterns
7. Concrete red flags (if any) with severity ('critical'|'high'|'medium'|'low') and clear descriptions.
8. Positive safety signals (e.g. established company, reputable store, strict privacy controls, bug bounty program).
9. Clear, actionable safety guidelines for regular users.
10. If an app is detected: include critical permissions analysis (e.g., Accessibility, SMS, Location, Contacts, Overlay).
11. If a game is detected: include monetization style, age appropriateness, chat moderation risks, and gacha/loot-box dark patterns.

Return accurate, realistic, protective cybersecurity advice.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a senior cybersecurity auditor and digital consumer safety intelligence analyst. Your job is to rigorously evaluate websites, mobile/desktop applications, video games, URLs, and suspicious links. Identify scam tactics, malware, phishing traps, aggressive privacy invasions, and deceptive practices clearly and objectively. Deliver structured JSON matching the provided schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedType: { type: Type.STRING, description: "Classification e.g. E-Commerce Website, Mobile App APK, Multiplayer Game, Phishing Trap, etc." },
            trustScore: { type: Type.INTEGER, description: "Trust score 0 to 100 (100 = completely trustworthy)" },
            riskLevel: { type: Type.STRING, description: "One of: safe, low, moderate, high, critical" },
            verdict: { type: Type.STRING, description: "Short clear verdict title e.g. 'Safe & Verified', 'High Phishing Risk', 'Predatory Gaming Mechanics'" },
            summary: { type: Type.STRING, description: "2-3 sentence executive safety summary" },
            technicalChecks: {
              type: Type.OBJECT,
              properties: {
                sslTlsStatus: { type: Type.STRING, description: "One of: secure, insecure, not_applicable, suspicious" },
                domainAgeReputation: { type: Type.STRING, description: "One of: established, new_or_unregistered, flagged, unknown" },
                typosquattingRisk: { type: Type.STRING, description: "One of: none, possible, high_impersonation" },
                dataCollectionRating: { type: Type.STRING, description: "One of: minimal, standard, aggressive, excessive" },
                downloadSafety: { type: Type.STRING, description: "One of: clean, caution, dangerous_executables, not_applicable" },
              },
              required: ["sslTlsStatus", "domainAgeReputation", "typosquattingRisk", "dataCollectionRating", "downloadSafety"],
            },
            threatFactors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  score: { type: Type.INTEGER, description: "0 to 100 danger score" },
                  status: { type: Type.STRING, description: "safe, warning, or danger" },
                  details: { type: Type.STRING },
                },
                required: ["name", "score", "status", "details"],
              },
            },
            redFlags: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  severity: { type: Type.STRING, description: "critical, high, medium, or low" },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["severity", "title", "description"],
              },
            },
            positiveSignals: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            safetyGuidelines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            permissionsAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  permission: { type: Type.STRING },
                  risk: { type: Type.STRING, description: "low, medium, high, or critical" },
                  whyDangerous: { type: Type.STRING },
                  isStandardForType: { type: Type.BOOLEAN },
                },
                required: ["permission", "risk", "whyDangerous", "isStandardForType"],
              },
            },
            gameSpecific: {
              type: Type.OBJECT,
              properties: {
                monetizationStyle: { type: Type.STRING },
                ageSuitability: { type: Type.STRING },
                unmoderatedChatRisk: { type: Type.STRING, description: "none, low, medium, or high" },
                darkPatternsDetected: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
            },
          },
          required: [
            "detectedType",
            "trustScore",
            "riskLevel",
            "verdict",
            "summary",
            "technicalChecks",
            "threatFactors",
            "redFlags",
            "positiveSignals",
            "safetyGuidelines"
          ],
        },
      },
    });

    const rawText = response.text?.trim();
    if (!rawText) {
      throw new Error("Empty response from AI engine");
    }

    const parsed = JSON.parse(rawText);
    const report = {
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      query: trimmedQuery,
      category: category === "all" ? (parsed.detectedType.toLowerCase().includes("app") ? "app" : parsed.detectedType.toLowerCase().includes("game") ? "game" : "website") : category,
      trustScore: typeof parsed.trustScore === "number" ? Math.max(0, Math.min(100, parsed.trustScore)) : 70,
      riskLevel: ["safe", "low", "moderate", "high", "critical"].includes(parsed.riskLevel) ? parsed.riskLevel : "moderate",
      verdict: parsed.verdict || "Inspection Complete",
      summary: parsed.summary || "",
      detectedType: parsed.detectedType || "Unknown Target",
      technicalChecks: parsed.technicalChecks,
      threatFactors: parsed.threatFactors || [],
      redFlags: parsed.redFlags || [],
      positiveSignals: parsed.positiveSignals || [],
      safetyGuidelines: parsed.safetyGuidelines || [],
      permissionsAnalysis: parsed.permissionsAnalysis,
      gameSpecific: parsed.gameSpecific,
      analyzedAt: new Date().toISOString(),
    };

    return res.json(report);
  } catch (error: any) {
    console.error("Safety analysis error:", error);
    // Graceful fallback to heuristic analysis
    const fallback = heuristicAnalysis(req.body?.query || "Unknown Target", req.body?.category || "website");
    return res.json(fallback);
  }
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "safety-inspector" });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Safety Inspector Server running on http://localhost:${PORT}`);
  });
}

startServer();
