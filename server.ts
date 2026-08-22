import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Itinerary Generation Endpoint
  app.post("/api/gemini/generate-itinerary", async (req, res) => {
    try {
      const {
        destination,
        days = 3,
        budget = 25000,
        travelStyle = "Cultural & Heritage",
        travelers = 2,
        language = "English",
        specialInterests = "",
      } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: "GEMINI_API_KEY is not configured in server environment.",
        });
      }

      const prompt = `You are an expert India travel curator for "Globetrotter India".
Generate a comprehensive, realistic ${days}-day travel itinerary for "${destination}, India" for ${travelers} traveler(s) with a total budget of ₹${budget} INR.
Travel Style: ${travelStyle}.
Special requests: ${specialInterests || "None"}.
Target display language: ${language} (Provide readable, culturally authentic text suitable for an Indian travel app).

Return ONLY valid JSON matching this exact structure (no markdown formatting, just JSON):
{
  "tripTitle": "${days}-Day ${travelStyle} in ${destination}",
  "destination": "${destination}, India",
  "summary": "Short 2-sentence captivating trip summary",
  "totalEstimatedCostINR": ${budget},
  "bestTimeToVisit": "e.g. October to March",
  "localLanguagePhrases": [
    {"phrase": "Greeting in local language", "meaning": "Hello / Welcome", "pronunciation": "Phonetic guide"},
    {"phrase": "Thank you phrase", "meaning": "Thank you", "pronunciation": "Phonetic guide"}
  ],
  "days": [
    {
      "dayNumber": 1,
      "title": "Day 1 Theme Title",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Activity Name",
          "location": "Exact landmark/place name in ${destination}",
          "category": "Sightseeing", // one of: "Transit", "Sightseeing", "Food", "Adventure", "Culture", "Relaxation"
          "description": "Engaging description with practical tips",
          "estimatedCostINR": 500,
          "duration": "2 hours"
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "accommodation": ${Math.round(budget * 0.4)},
    "transport": ${Math.round(budget * 0.25)},
    "food": ${Math.round(budget * 0.2)},
    "activities": ${Math.round(budget * 0.15)}
  },
  "essentialTravelTips": [
    "Tip 1 about local transport, dress codes or ticketing",
    "Tip 2 about authentic regional food or shopping",
    "Tip 3 about best photography spot or timing"
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction:
            "You are Globetrotter India's premier AI Travel Engine. All costs must be in INR (₹). All destinations, activities, cuisines, and transport must be authentic to India (IRCTC trains, metros, autos, local dhabas, heritage monuments). Output valid JSON.",
        },
      });

      const responseText = response.text?.trim() || "{}";
      const parsedData = JSON.parse(responseText);
      return res.json({ success: true, data: parsedData });
    } catch (err: any) {
      console.error("Itinerary generation error:", err);
      return res.status(500).json({
        error: err.message || "Failed to generate itinerary with Gemini API",
      });
    }
  });

  // AI Chat Endpoint for Travel Advice, Indian Regional Tips, Language Translation
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages = [], language = "English", currentTrip = null } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: "GEMINI_API_KEY is not configured.",
        });
      }

      const systemInstruction = `You are "Safar", the friendly and deeply knowledgeable AI India Travel Companion on Globetrotter.
You specialize in Indian travel destinations, itineraries, Indian Railways (IRCTC/Vande Bharat), state tourism circuits, regional cuisines (Kashmiri, Rajasthani, Mughlai, South Indian Sadhya, Bengali sweets, Goan seafood), safety, cultural etiquettes, festivals, and language translation into Indian regional languages (Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia).
Current user preferred language: ${language}.
${currentTrip ? `Active Trip Context: ${JSON.stringify(currentTrip)}` : ""}
Rules:
1. Always quote prices/estimates in INR (₹).
2. Keep responses warm, culturally insightful, structured with clear bullet points, bold key terms, and actionable travel advice.
3. Suggest authentic local experiences (e.g. Shikara rides, Ganga Aarti, street food walks, heritage homestays, trekking spots).`;

      const lastMessage = messages[messages.length - 1]?.content || "Hello";
      
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: lastMessage,
        config: {
          systemInstruction,
        },
      });

      return res.json({
        success: true,
        reply: response.text || "Here to help you explore Incredible India!",
      });
    } catch (err: any) {
      console.error("Chat error:", err);
      return res.status(500).json({
        error: err.message || "Failed to process chat message",
      });
    }
  });

  // Surprise Me India Destination Generator
  app.post("/api/gemini/surprise-trip", async (req, res) => {
    try {
      const { preference = "hidden_gem", season = "current", days = 4 } = req.body;
      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: "GEMINI_API_KEY is not configured.",
        });
      }

      const prompt = `Recommend 1 extraordinary Indian travel destination for a surprise ${days}-day escape.
Preference vibe: ${preference} (e.g. peaceful mountains, royal heritage, pristine beaches, spiritual retreat, rainforests).
Current travel season: ${season}.

Return JSON:
{
  "name": "Destination Name, State",
  "tagline": "Catchy 1-line hook",
  "state": "State in India",
  "region": "North / South / West / East / North-East",
  "highlight": "What makes this unforgettable",
  "idealDays": ${days},
  "budgetTier": "₹₹₹",
  "estimatedBudgetINR": 18000,
  "topAttractions": ["Spot 1", "Spot 2", "Spot 3"],
  "signatureDish": "Famous local dish to try",
  "bestTimeToVisit": "Months",
  "coverImageHint": "search keyword for photo"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are Globetrotter India's discovery curator. Return valid JSON only.",
        },
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      return res.json({ success: true, destination: parsed });
    } catch (err: any) {
      console.error("Surprise trip error:", err);
      return res.status(500).json({ error: err.message || "Failed to generate surprise trip" });
    }
  });

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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Globetrotter India server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
