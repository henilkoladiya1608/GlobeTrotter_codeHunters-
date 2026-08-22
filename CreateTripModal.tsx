import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { t, formatINR } from "../../lib/i18n";
import { INDIAN_DESTINATIONS } from "../../data/destinations";
import { Region } from "../../types";
import { X, Calendar, MapPin, Sparkles, Image, Users, Wallet } from "lucide-react";

export const CreateTripModal: React.FC = () => {
  const {
    isCreateTripModalOpen,
    setIsCreateTripModalOpen,
    addTrip,
    currentLanguage,
    setCurrentView,
    showToast,
  } = useApp();

  const [title, setTitle] = useState("");
  const [selectedDestinationName, setSelectedDestinationName] = useState("Jaipur (The Pink City)");
  const [startDate, setStartDate] = useState("2026-11-10");
  const [endDate, setEndDate] = useState("2026-11-15");
  const [budgetINR, setBudgetINR] = useState(35000);
  const [travelersCount, setTravelersCount] = useState(2);
  const [selectedCoverImage, setSelectedCoverImage] = useState(
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80"
  );
  const [description, setDescription] = useState("Exciting holiday exploring forts, palaces, and local markets.");
  const [aiAssistEnabled, setAiAssistEnabled] = useState(true);

  if (!isCreateTripModalOpen) return null;

  const coverPresets = [
    {
      label: "Jaipur Palace",
      url: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    },
    {
      label: "Kashmir Gulmarg",
      url: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      label: "Kerala Backwaters",
      url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    },
    {
      label: "Varanasi Ghats",
      url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    },
    {
      label: "Goa Coast",
      url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const matchedDest =
      INDIAN_DESTINATIONS.find((d) => d.name.includes(selectedDestinationName)) ||
      INDIAN_DESTINATIONS[0];

    const startD = new Date(startDate);
    const endD = new Date(endDate);
    const diffDays = Math.max(1, Math.round((endD.getTime() - startD.getTime()) / (1000 * 3600 * 24)));

    // Initialize days
    const initialDays = Array.from({ length: diffDays }).map((_, idx) => ({
      dayNumber: idx + 1,
      dateStr: `Day ${idx + 1}`,
      title: idx === 0 ? "Arrival & Orientation" : `Exploring Highlights - Day ${idx + 1}`,
      theme: matchedDest.travelStyles[0] || "Exploration",
      activities:
        idx === 0
          ? [
              {
                id: `init-act-${Date.now()}-1`,
                time: "11:00 AM",
                title: `Arrival in ${matchedDest.name}`,
                location: matchedDest.name,
                category: "Stay" as const,
                description: "Hotel check-in and unpacking.",
                estimatedCostINR: Math.round(budgetINR * 0.15),
                isCompleted: false,
              },
              {
                id: `init-act-${Date.now()}-2`,
                time: "04:00 PM",
                title: `${matchedDest.topAttractions[0] || "Landmark Tour"}`,
                location: matchedDest.name,
                category: "Sightseeing" as const,
                description: "Evening exploration & sunset photography.",
                estimatedCostINR: 800,
                isCompleted: false,
              },
            ]
          : [],
    }));

    const newTrip = addTrip({
      title: title || `${diffDays}-Day ${selectedDestinationName} Expedition`,
      destination: matchedDest.name,
      state: matchedDest.state,
      region: matchedDest.region,
      startDate,
      endDate,
      durationDays: diffDays,
      budgetINR: Number(budgetINR),
      status: "Planning",
      coverImage: selectedCoverImage,
      description,
      travelersCount: Number(travelersCount),
      tags: matchedDest.travelStyles,
      days: initialDays,
    });

    setIsCreateTripModalOpen(false);
    setCurrentView("trip-detail");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#DDDDDD] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#efeded] flex items-center justify-between bg-[#f5f3f3]">
          <div>
            <h3 className="text-base font-bold text-[#1b1c1c]">
              {t("planNewTrip", currentLanguage)}
            </h3>
            <p className="text-xs text-[#5f5e5e]">
              Customize dates, INR budget, and destinations across India
            </p>
          </div>
          <button
            onClick={() => setIsCreateTripModalOpen(false)}
            className="p-1.5 text-[#5f5e5e] hover:text-[#1b1c1c] rounded-full hover:bg-[#efeded] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
              Trip Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Royal Rajasthan & Amer Fort Escapade"
              className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
              Destination in India *
            </label>
            <select
              value={selectedDestinationName}
              onChange={(e) => {
                setSelectedDestinationName(e.target.value);
                const found = INDIAN_DESTINATIONS.find((d) => d.name === e.target.value);
                if (found) {
                  setSelectedCoverImage(found.coverImage);
                }
              }}
              className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
            >
              {INDIAN_DESTINATIONS.map((dest) => (
                <option key={dest.id} value={dest.name}>
                  {dest.name} ({dest.state} • {dest.region})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">End Date *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                Total Budget (INR ₹) *
              </label>
              <input
                type="number"
                min="2000"
                step="500"
                required
                value={budgetINR}
                onChange={(e) => setBudgetINR(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                Number of Travelers
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={travelersCount}
                onChange={(e) => setTravelersCount(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
              />
            </div>
          </div>

          {/* Cover Photo Presets */}
          <div>
            <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
              Select Cover Image
            </label>
            <div className="grid grid-cols-5 gap-2">
              {coverPresets.map((preset, idx) => {
                const isSelected = selectedCoverImage === preset.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedCoverImage(preset.url)}
                    className={`relative rounded-xl overflow-hidden h-14 border-2 transition-all ${
                      isSelected ? "border-[#ba0036] scale-105 shadow-xs" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
              Trip Description & Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#efeded] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateTripModalOpen(false)}
              className="px-4 py-2 rounded-full border border-[#DDDDDD] text-xs font-semibold text-[#5f5e5e] hover:bg-[#f5f3f3]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#ba0036] hover:bg-[#9e002e] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Create Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
