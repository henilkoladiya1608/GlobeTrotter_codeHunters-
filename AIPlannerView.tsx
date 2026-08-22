import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { t, formatINR } from "../lib/i18n";
import { Sparkles, Send, Bot, User, Loader2, ArrowRight, Check, Compass, MapPin } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

export const AIPlannerView: React.FC = () => {
  const { currentLanguage, selectedTrip, addTrip, setCurrentView, showToast } = useApp();

  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init",
      sender: "assistant",
      text: `Namaste! I'm **Safar AI**, your dedicated India Travel Companion. 🇮🇳
I can help you build custom day-by-day itineraries across any Indian state, recommend IRCTC trains or scenic road trips, suggest authentic regional thalis & street foods, or translate essential phrases into any of India's 11 regional languages.

What adventure would you like to plan today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [itineraryFormDestination, setItineraryFormDestination] = useState("Varanasi, Uttar Pradesh");
  const [itineraryFormDays, setItineraryFormDays] = useState(3);
  const [itineraryFormBudget, setItineraryFormBudget] = useState(22000);
  const [itineraryFormStyle, setItineraryFormStyle] = useState("Spiritual & Heritage");
  const [isGeneratingTrip, setIsGeneratingTrip] = useState(false);
  const [generatedTripData, setGeneratedTripData] = useState<any | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage("");
    setIsSending(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: textToSend }],
          language: currentLanguage,
          currentTrip: selectedTrip,
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: data.reply || "I am ready to help you explore Incredible India!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "assistant",
          text: "I experienced a momentary connection issue. Please feel free to ask again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleGenerateFullItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingTrip(true);
    setGeneratedTripData(null);

    try {
      const response = await fetch("/api/gemini/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: itineraryFormDestination,
          days: itineraryFormDays,
          budget: itineraryFormBudget,
          travelStyle: itineraryFormStyle,
          travelers: 2,
          language: currentLanguage,
        }),
      });

      const resData = await response.json();
      if (resData?.data) {
        setGeneratedTripData(resData.data);
        showToast(`✨ Generated ${resData.data.tripTitle}`);
      } else {
        showToast("Could not generate itinerary. Please try again.");
      }
    } catch (err) {
      showToast("Error connecting to Gemini API server.");
    } finally {
      setIsGeneratingTrip(false);
    }
  };

  const handleImportToMyTrips = () => {
    if (!generatedTripData) return;

    const formattedDays = (generatedTripData.days || []).map((d: any) => ({
      dayNumber: d.dayNumber,
      title: d.title || `Day ${d.dayNumber}`,
      activities: (d.activities || []).map((a: any, idx: number) => ({
        id: `gen-act-${Date.now()}-${idx}`,
        time: a.time || "10:00 AM",
        title: a.title || "Sightseeing",
        location: a.location || generatedTripData.destination,
        category: a.category || "Sightseeing",
        description: a.description || "",
        estimatedCostINR: a.estimatedCostINR || 500,
        duration: a.duration || "2 Hours",
        isCompleted: false,
      })),
    }));

    addTrip({
      title: generatedTripData.tripTitle || `${itineraryFormDays}-Day ${itineraryFormDestination}`,
      destination: generatedTripData.destination || itineraryFormDestination,
      state: itineraryFormDestination.split(",")[1]?.trim() || "India",
      region: "North India",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 86400000 * itineraryFormDays).toISOString().split("T")[0],
      durationDays: itineraryFormDays,
      budgetINR: generatedTripData.totalEstimatedCostINR || itineraryFormBudget,
      status: "Planning",
      coverImage:
        "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
      description: generatedTripData.summary || "AI-curated itinerary.",
      travelersCount: 2,
      tags: ["AI-Generated", itineraryFormStyle],
      days: formattedDays,
    });

    setCurrentView("my-trips");
  };

  const samplePrompts = [
    "What are the best street food spots in Old Delhi & Chandni Chowk?",
    "Plan a 4-day budget trip to Kerala Backwaters under ₹25,000 INR",
    "Essential etiquette and dress code for Varanasi temples",
    "Translate 'How much does this cost in Rupees?' into Hindi, Tamil & Bengali",
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ffdada] text-[#ba0036] text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 3.7 Flash & 3.1 Pro Powered</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1c1c]">
          {t("aiAssistantTitle", currentLanguage)}
        </h1>
        <p className="text-xs sm:text-sm text-[#5f5e5e] mt-1">
          {t("aiAssistantSubtitle", currentLanguage)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Multi-Day AI Trip Generator Tool */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#DDDDDD] shadow-ethos-card space-y-4">
            <div className="flex items-center gap-2.5 border-b border-[#efeded] pb-3.5">
              <div className="w-9 h-9 rounded-full bg-[#ffdada] flex items-center justify-center text-[#ba0036]">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1b1c1c]">
                  Instant Indian Itinerary Generator
                </h3>
                <p className="text-[11px] text-[#5f5e5e]">
                  Auto-generates day-by-day schedules with realistic INR costs
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerateFullItinerary} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#1b1c1c] mb-1">
                  Destination in India
                </label>
                <input
                  type="text"
                  required
                  value={itineraryFormDestination}
                  onChange={(e) => setItineraryFormDestination(e.target.value)}
                  placeholder="e.g. Kashmir, Ladakh, Jaipur, Munnar"
                  className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1b1c1c] mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={itineraryFormDays}
                    onChange={(e) => setItineraryFormDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1b1c1c] mb-1">
                    Target Budget (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="5000"
                    step="1000"
                    value={itineraryFormBudget}
                    onChange={(e) => setItineraryFormBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1b1c1c] mb-1">
                  Travel Vibe
                </label>
                <select
                  value={itineraryFormStyle}
                  onChange={(e) => setItineraryFormStyle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                >
                  <option value="Spiritual & Heritage">Spiritual & Heritage (Temples, Ghats & Forts)</option>
                  <option value="Himalayan Mountains & Snow">Himalayan Mountains & Snow</option>
                  <option value="Backwaters & Tea Plantations">Backwaters & Tea Plantations</option>
                  <option value="Culinary & Street Food Trails">Culinary & Street Food Trails</option>
                  <option value="Coastal Beaches & Water Sports">Coastal Beaches & Water Sports</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGeneratingTrip}
                className="w-full py-2.5 rounded-full bg-[#ba0036] hover:bg-[#9e002e] text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGeneratingTrip ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Curating with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Detailed Itinerary</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Generated Result Preview Card */}
          {generatedTripData && (
            <div className="p-6 rounded-2xl bg-white border border-[#ffdada] shadow-ethos-card space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ba0036]">
                    Generated Result
                  </span>
                  <h4 className="text-base font-bold text-[#1b1c1c] mt-0.5">
                    {generatedTripData.tripTitle}
                  </h4>
                  <p className="text-xs text-[#5f5e5e] mt-1">{generatedTripData.summary}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#efeded]">
                <span className="text-[#5f5e5e]">Total Estimated Cost:</span>
                <span className="font-bold text-[#1b1c1c]">
                  {formatINR(generatedTripData.totalEstimatedCostINR)}
                </span>
              </div>

              {generatedTripData.localLanguagePhrases && (
                <div className="p-3 bg-[#f5f3f3] rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-[#1b1c1c] text-[11px] block">
                    Local Phrases:
                  </span>
                  {generatedTripData.localLanguagePhrases.map((phrase: any, i: number) => (
                    <div key={i} className="flex justify-between text-[11px] text-[#5f5e5e]">
                      <span>{phrase.phrase}</span>
                      <span className="text-[#888888]">({phrase.meaning})</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleImportToMyTrips}
                className="w-full py-2.5 rounded-full bg-[#ba0036] hover:bg-[#9e002e] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Add to My Trips</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Conversational AI Travel Assistant */}
        <div className="lg:col-span-7 flex flex-col h-[600px] bg-white rounded-2xl border border-[#DDDDDD] shadow-ethos-card overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#efeded] bg-[#f5f3f3] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#ba0036] flex items-center justify-center text-white shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#1b1c1c]">Safar AI India Travel Concierge</h3>
                <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online & Specialized in 11 Indian Languages
                </span>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-[#ffdada] text-[#ba0036] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#1b1c1c] text-white rounded-br-2xs"
                      : "bg-[#f5f3f3] text-[#1b1c1c] border border-[#efeded] rounded-bl-2xs whitespace-pre-wrap"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1.5 text-right ${
                      msg.sender === "user" ? "text-[#ffdada]/70" : "text-[#5f5e5e]"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-[#ba0036] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {isSending && (
              <div className="flex gap-3 justify-start items-center text-xs text-[#5f5e5e]">
                <Loader2 className="w-4 h-4 animate-spin text-[#ba0036]" />
                <span>Safar AI is thinking...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="p-2.5 bg-[#f5f3f3] border-t border-[#efeded] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1 rounded-full bg-white border border-[#DDDDDD] hover:border-[#ba0036] text-[11px] text-[#1b1c1c] whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-[#efeded] bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t("askAnything", currentLanguage)}
              className="flex-1 px-4 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-full text-xs text-[#1b1c1c] placeholder-[#5f5e5e] focus:bg-white focus:border-[#ba0036] outline-hidden"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              className="p-2.5 rounded-full bg-[#ba0036] hover:bg-[#9e002e] text-white shadow-xs disabled:opacity-50 transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
