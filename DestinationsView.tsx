import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { t, formatINR } from "../lib/i18n";
import { INDIAN_DESTINATIONS } from "../data/destinations";
import { Destination, Region } from "../types";
import {
  MapPin,
  Search,
  Star,
  Heart,
  Plus,
  Filter,
  ArrowRight,
  Compass,
  Sparkles,
} from "lucide-react";

export const DestinationsView: React.FC = () => {
  const {
    currentLanguage,
    setSelectedDestinationDetail,
    toggleSaveDestination,
    isDestinationSaved,
    searchQuery,
    setSearchQuery,
    setIsCreateTripModalOpen,
  } = useApp();

  const [selectedRegion, setSelectedRegion] = useState<Region>("All");
  const [selectedCostTier, setSelectedCostTier] = useState<string>("All");
  const [selectedStyle, setSelectedStyle] = useState<string>("All");

  const regions: Region[] = [
    "All",
    "North India",
    "South India",
    "West India",
    "East & North East",
    "Islands",
  ];

  const travelStyles = [
    "All",
    "Heritage & History",
    "Mountains & Snow",
    "Beaches & Coastal",
    "Spiritual & Yoga",
    "Nature & Wildlife",
    "Adventure & Treks",
  ];

  const filteredDestinations = useMemo(() => {
    return INDIAN_DESTINATIONS.filter((dest) => {
      const matchesSearch =
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.topAttractions.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRegion = selectedRegion === "All" || dest.region === selectedRegion;
      const matchesCost = selectedCostTier === "All" || dest.costIndex === selectedCostTier;
      const matchesStyle =
        selectedStyle === "All" ||
        dest.travelStyles.some((style) => style.toLowerCase().includes(selectedStyle.toLowerCase()));

      return matchesSearch && matchesRegion && matchesCost && matchesStyle;
    });
  }, [searchQuery, selectedRegion, selectedCostTier, selectedStyle]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1c1c]">
          {t("destinations", currentLanguage)}
        </h1>
        <p className="text-xs sm:text-sm text-[#5f5e5e] mt-1">
          Explore iconic circuits and hidden gems across all states &amp; union territories of India
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3.5 bg-white p-4 sm:p-5 rounded-2xl border border-[#DDDDDD] shadow-ethos-card">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Main Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5f5e5e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, state, monument, or experience (e.g. Kashmir, Hampi, Aarti)..."
              className="w-full pl-10 pr-4 py-2 bg-[#f5f3f3] border border-[#DDDDDD]/80 rounded-full text-xs sm:text-sm text-[#1b1c1c] placeholder-[#5f5e5e] focus:bg-white focus:border-[#ba0036] focus:ring-2 focus:ring-[#ffdada] outline-hidden transition-all"
            />
          </div>

          {/* Cost Index Filter */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
            <span className="text-xs font-semibold text-[#5f5e5e]">Cost:</span>
            {["All", "₹", "₹₹", "₹₹₹"].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedCostTier(tier)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  selectedCostTier === tier
                    ? "bg-[#1b1c1c] text-white"
                    : "bg-[#efeded] text-[#5f5e5e] hover:bg-[#e2dfde]"
                }`}
              >
                {tier === "All" ? "All" : tier}
              </button>
            ))}
          </div>
        </div>

        {/* Region Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-[#efeded]">
          <span className="text-xs font-semibold text-[#5f5e5e] shrink-0">Region:</span>
          {regions.map((region) => {
            const isSelected = selectedRegion === region;
            return (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#ba0036] text-white shadow-xs"
                    : "bg-[#efeded] text-[#1b1c1c] hover:bg-[#e2dfde]"
                }`}
              >
                {region}
              </button>
            );
          })}
        </div>

        {/* Travel Style Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-xs font-semibold text-[#5f5e5e] shrink-0">Style:</span>
          {travelStyles.map((style) => {
            const isSelected = selectedStyle === style;
            return (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#1b1c1c] text-white font-semibold"
                    : "bg-white text-[#5f5e5e] border border-[#DDDDDD] hover:bg-[#f5f3f3]"
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>

      {/* Destinations Grid */}
      {filteredDestinations.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-[#DDDDDD]">
          <Compass className="w-8 h-8 text-[#5f5e5e] mx-auto mb-2" />
          <p className="text-sm font-bold text-[#1b1c1c]">No destinations found matching your filters</p>
          <p className="text-xs text-[#5f5e5e] mt-1">Try resetting the filters or searching for another Indian region.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => {
            const isSaved = isDestinationSaved(dest.id);
            return (
              <div
                key={dest.id}
                onClick={() => setSelectedDestinationDetail(dest)}
                className="group relative rounded-2xl bg-white border border-[#DDDDDD] hover:border-[#ba0036]/60 shadow-ethos-card hover:shadow-ethos-hover transition-all overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                {/* Photo & Top Badges */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={dest.coverImage}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveDestination(dest.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                      isSaved
                        ? "bg-[#ba0036] text-white"
                        : "bg-black/40 hover:bg-black/60 text-white"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-white" : ""}`} />
                  </button>

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-[#1b1c1c] shadow-2xs">
                      {dest.region}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[11px] text-[#ffdada] font-semibold">{dest.state}</span>
                    <h3 className="text-base font-bold text-white">{dest.name}</h3>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-xs text-[#5f5e5e] line-clamp-2 leading-relaxed">{dest.description}</p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {dest.travelStyles.slice(0, 2).map((style, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#efeded] text-[#1b1c1c]"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#efeded] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#5f5e5e] text-[11px]">Avg Daily: </span>
                      <span className="font-bold text-[#1b1c1c]">
                        {formatINR(dest.avgDailyCostINR)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[#ba0036] font-bold">
                      <Star className="w-3.5 h-3.5 fill-[#ba0036]" />
                      <span>{dest.rating}</span>
                      <span className="text-[#5f5e5e] text-[10px]">({dest.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
