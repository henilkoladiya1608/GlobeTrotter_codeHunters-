import React from "react";
import { useApp } from "../../context/AppContext";
import { t, formatINR } from "../../lib/i18n";
import {
  X,
  MapPin,
  Star,
  Heart,
  Calendar,
  Sparkles,
  CheckCircle,
  Plus,
  Compass,
} from "lucide-react";

export const DestinationDetailModal: React.FC = () => {
  const {
    selectedDestinationDetail,
    setSelectedDestinationDetail,
    currentLanguage,
    toggleSaveDestination,
    isDestinationSaved,
    setIsCreateTripModalOpen,
  } = useApp();

  if (!selectedDestinationDetail) return null;

  const dest = selectedDestinationDetail;
  const isSaved = isDestinationSaved(dest.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#DDDDDD] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Cover Photo Banner */}
        <div className="relative h-64 w-full shrink-0 bg-[#1b1c1c]">
          <img src={dest.coverImage} alt={dest.name} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1c] via-[#1b1c1c]/40 to-transparent" />

          {/* Close & Save Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => toggleSaveDestination(dest.id)}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                isSaved ? "bg-[#ba0036] text-white" : "bg-black/40 hover:bg-black/60 text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
            </button>
            <button
              onClick={() => setSelectedDestinationDetail(null)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#ba0036] text-white">
                {dest.region}
              </span>
              <span className="text-xs text-[#ffdada] font-semibold">{dest.state}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{dest.name}</h2>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm text-[#1b1c1c]">
          <p className="leading-relaxed text-[#5f5e5e]">{dest.description}</p>

          {/* Highlights grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#f5f3f3] border border-[#DDDDDD] text-center">
              <span className="text-[10px] text-[#5f5e5e] font-semibold uppercase block">
                Avg Daily Cost
              </span>
              <span className="text-sm font-bold text-[#1b1c1c] mt-0.5 block">
                {formatINR(dest.avgDailyCostINR)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f5f3f3] border border-[#DDDDDD] text-center">
              <span className="text-[10px] text-[#5f5e5e] font-semibold uppercase block">
                Best Season
              </span>
              <span className="text-xs font-bold text-[#1b1c1c] mt-0.5 block line-clamp-1">
                {dest.bestTimeToVisit}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f5f3f3] border border-[#DDDDDD] text-center">
              <span className="text-[10px] text-[#5f5e5e] font-semibold uppercase block">
                Rating
              </span>
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#ba0036] mt-0.5">
                <Star className="w-3.5 h-3.5 fill-[#ba0036]" />
                <span>{dest.rating}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f5f3f3] border border-[#DDDDDD] text-center">
              <span className="text-[10px] text-[#5f5e5e] font-semibold uppercase block">
                Cost Tier
              </span>
              <span className="text-sm font-bold text-[#ba0036] mt-0.5 block">
                {dest.costIndex}
              </span>
            </div>
          </div>

          {/* Top Attractions in this Indian City */}
          <div>
            <h4 className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wider mb-2">
              Must-Visit Attractions &amp; Sights
            </h4>
            <div className="flex flex-wrap gap-2">
              {dest.topAttractions.map((attraction, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1 rounded-full bg-[#ffdada]/60 text-[#ba0036] border border-[#ffdada] text-xs font-semibold"
                >
                  {attraction}
                </span>
              ))}
            </div>
          </div>

          {/* Famous Regional Food */}
          {dest.signatureCuisine && dest.signatureCuisine.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wider mb-2">
                Famous Regional Delicacies
              </h4>
              <div className="flex flex-wrap gap-2">
                {dest.signatureCuisine.map((food, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1 rounded-full bg-[#efeded] text-[#1b1c1c] border border-[#DDDDDD] text-xs font-medium"
                  >
                    🍲 {food}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Local Language Phrases */}
          {dest.localPhrases && dest.localPhrases.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wider mb-2">
                Essential Local Phrases ({dest.localLanguage})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dest.localPhrases.map((phrase, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#f5f3f3] border border-[#DDDDDD] text-xs">
                    <span className="font-bold text-[#1b1c1c] block">{phrase.phrase}</span>
                    <span className="text-[#5f5e5e] text-[11px] mt-0.5 block">{phrase.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-[#efeded] flex items-center justify-between bg-[#f5f3f3]">
          <span className="text-xs text-[#5f5e5e]">Ready to travel to {dest.name}?</span>
          <button
            onClick={() => {
              setSelectedDestinationDetail(null);
              setIsCreateTripModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#ba0036] hover:bg-[#9e002e] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Plan Trip to {dest.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
