import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { t, formatINR } from "../lib/i18n";
import { INDIAN_EXPERIENCES } from "../data/experiences";
import { Experience } from "../types";
import {
  Sparkles,
  Clock,
  Star,
  MapPin,
  Plus,
  CheckCircle2,
  Filter,
  Flame,
} from "lucide-react";

export const ExperiencesView: React.FC = () => {
  const { currentLanguage, trips, addActivity, showToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTripForBooking, setSelectedTripForBooking] = useState<string>(
    trips[0]?.id || ""
  );
  const [bookedExperienceId, setBookedExperienceId] = useState<string | null>(null);

  const categories = [
    "All",
    "Culture & History",
    "Food & Drink",
    "Adventure",
    "Spiritual & Wellness",
    "Nature & Wildlife",
  ];

  const filteredExperiences = INDIAN_EXPERIENCES.filter((exp) => {
    return selectedCategory === "All" || exp.category === selectedCategory;
  });

  const handleAddToTrip = (experience: Experience) => {
    if (!selectedTripForBooking) {
      showToast("Please create or select an active trip first.");
      return;
    }

    addActivity(selectedTripForBooking, 1, {
      title: experience.title,
      location: `${experience.destination}, ${experience.state}`,
      time: experience.bestTime.split("-")[0]?.trim() || "10:00 AM",
      category: experience.category.includes("Food")
        ? "Food"
        : experience.category.includes("Adventure")
        ? "Adventure"
        : "Sightseeing",
      estimatedCostINR: experience.priceINR,
      duration: experience.duration,
      description: experience.description,
      isCompleted: false,
    });

    setBookedExperienceId(experience.id);
    setTimeout(() => setBookedExperienceId(null), 3000);
    showToast(`Added "${experience.title}" to Day 1 itinerary!`);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1c1c]">
            {t("experiences", currentLanguage)}
          </h1>
          <p className="text-xs sm:text-sm text-[#5f5e5e] mt-1">
            Immersive cultural traditions, wildlife safaris, and culinary walks across India
          </p>
        </div>

        {/* Target Trip Selector for 1-click add */}
        {trips.length > 0 && (
          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#DDDDDD] shadow-2xs self-start sm:self-auto">
            <span className="text-xs text-[#5f5e5e] font-medium">Add to Trip:</span>
            <select
              value={selectedTripForBooking}
              onChange={(e) => setSelectedTripForBooking(e.target.value)}
              className="text-xs font-bold text-[#1b1c1c] bg-transparent outline-hidden cursor-pointer"
            >
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-[#ba0036] text-white shadow-xs"
                  : "bg-white border border-[#DDDDDD] text-[#5f5e5e] hover:bg-[#f5f3f3]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Experiences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExperiences.map((exp) => {
          const isJustAdded = bookedExperienceId === exp.id;
          return (
            <div
              key={exp.id}
              className="rounded-2xl bg-white border border-[#DDDDDD] hover:border-[#ba0036]/50 shadow-ethos-card hover:shadow-ethos-hover transition-all overflow-hidden flex flex-col sm:flex-row group"
            >
              {/* Photo */}
              <div className="sm:w-2/5 relative h-48 sm:h-auto min-h-[190px] overflow-hidden">
                <img
                  src={exp.coverImage}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-[#ba0036] backdrop-blur-md shadow-xs">
                    {exp.category}
                  </span>
                </div>
              </div>

              {/* Info & Booking */}
              <div className="sm:w-3/5 p-4 sm:p-5 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[11px] text-[#ba0036] font-semibold">
                      <MapPin className="w-3 h-3 text-[#ba0036]" />
                      <span>
                        {exp.destination}, {exp.state}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-[#ba0036] font-bold">
                      <Star className="w-3.5 h-3.5 fill-[#ba0036]" />
                      <span>{exp.rating}</span>
                      <span className="text-[10px] text-[#5f5e5e]">({exp.reviews})</span>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#1b1c1c] mt-1">
                    {exp.title}
                  </h3>

                  <p className="text-xs text-[#5f5e5e] mt-1.5 line-clamp-2 leading-relaxed">{exp.description}</p>

                  <div className="mt-2.5 flex items-center gap-3 text-xs text-[#5f5e5e]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#5f5e5e]" />
                      {exp.duration}
                    </span>
                    <span>•</span>
                    <span className="text-[#1b1c1c] font-medium">{exp.bestTime}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#efeded] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#5f5e5e] block uppercase font-semibold">
                      Price per person
                    </span>
                    <span className="text-base font-bold text-[#1b1c1c]">
                      {formatINR(exp.priceINR)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToTrip(exp)}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                      isJustAdded
                        ? "bg-[#006a45] text-white"
                        : "bg-[#ba0036] hover:bg-[#9e002e] text-white shadow-xs"
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Itinerary</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
