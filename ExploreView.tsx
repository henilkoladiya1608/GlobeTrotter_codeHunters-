import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { t, formatINR } from "../lib/i18n";
import { INDIAN_DESTINATIONS } from "../data/destinations";
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Bookmark,
  Star,
  Users,
  ChevronRight,
  TrendingUp,
  Tag,
  Clock,
  Shuffle,
  ShieldCheck,
  CheckCircle2,
  Heart,
} from "lucide-react";

export const ExploreView: React.FC = () => {
  const {
    currentLanguage,
    user,
    trips,
    setSelectedTripId,
    setCurrentView,
    setIsCreateTripModalOpen,
    setSelectedDestinationDetail,
    toggleSaveDestination,
    isDestinationSaved,
    showToast,
  } = useApp();

  const [isSurpriseLoading, setIsSurpriseLoading] = useState(false);

  const upcomingTrip = trips.find((t) => t.status === "Booked" || t.status === "Planning") || trips[0];
  const featuredDestinations = INDIAN_DESTINATIONS.filter((d) => d.isFeatured);

  const handleSurpriseMe = async () => {
    setIsSurpriseLoading(true);
    try {
      const res = await fetch("/api/gemini/surprise-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preference: "scenic_and_cultural", days: 4 }),
      });
      const data = await res.json();
      if (data?.destination) {
        showToast(`✨ Surprise Destination: ${data.destination.name} (${data.destination.tagline})`);
        setCurrentView("destinations");
      } else {
        // Pick random from local
        const randomDest = INDIAN_DESTINATIONS[Math.floor(Math.random() * INDIAN_DESTINATIONS.length)];
        setSelectedDestinationDetail(randomDest);
      }
    } catch (e) {
      const randomDest = INDIAN_DESTINATIONS[Math.floor(Math.random() * INDIAN_DESTINATIONS.length)];
      setSelectedDestinationDetail(randomDest);
    } finally {
      setIsSurpriseLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Greeting & Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1b1c1c] via-[#303031] to-[#1b1c1c] text-white p-6 sm:p-10 shadow-ethos-card border border-[#DDDDDD]/30">
        {/* Subtle Decorative Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ba0036]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#006a45]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#ffdada] text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#ffb2b6]" />
            <span>{t("tagline", currentLanguage)}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            {t("greeting", currentLanguage)}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#e9e8e7] max-w-2xl font-normal leading-relaxed">
            {t("whereToNext", currentLanguage)}
          </p>

          {/* Quick Action Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <button
              id="hero-plan-trip-btn"
              onClick={() => setIsCreateTripModalOpen(true)}
              className="flex flex-col items-start p-4 rounded-2xl bg-white/10 hover:bg-[#ba0036] backdrop-blur-md border border-white/10 hover:border-[#ba0036] text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-[#ba0036]/30 group-hover:bg-white/20 flex items-center justify-center text-[#ffdada] group-hover:text-white mb-2.5 transition-colors">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-white">
                {t("planNewTrip", currentLanguage)}
              </span>
              <span className="text-[11px] text-[#e3e2e2] group-hover:text-white/90 mt-0.5">
                Custom itineraries in ₹
              </span>
            </button>

            <button
              id="hero-destinations-btn"
              onClick={() => setCurrentView("destinations")}
              className="flex flex-col items-start p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-[#ffdada] mb-2.5">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-white">
                {t("destinations", currentLanguage)}
              </span>
              <span className="text-[11px] text-[#e3e2e2] mt-0.5">
                North to South circuits
              </span>
            </button>

            <button
              id="hero-saved-btn"
              onClick={() => setCurrentView("settings")}
              className="flex flex-col items-start p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-[#008558]/30 flex items-center justify-center text-[#80f9bd] mb-2.5">
                <Bookmark className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-white">
                {t("viewSavedPlaces", currentLanguage)}
              </span>
              <span className="text-[11px] text-[#e3e2e2] mt-0.5">
                {user.savedDestinationIds.length} bookmarked spots
              </span>
            </button>

            <button
              id="hero-surprise-btn"
              onClick={handleSurpriseMe}
              disabled={isSurpriseLoading}
              className="flex flex-col items-start p-4 rounded-2xl bg-gradient-to-br from-[#ba0036]/30 to-[#e21e4a]/30 hover:from-[#ba0036]/50 hover:to-[#e21e4a]/50 backdrop-blur-md border border-[#e5bdbe]/30 text-left transition-all group disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-full bg-[#ffdada]/20 flex items-center justify-center text-[#ffdada] mb-2.5">
                <Shuffle className={`w-4 h-4 ${isSurpriseLoading ? "animate-spin" : ""}`} />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-white">
                {isSurpriseLoading ? "Exploring..." : t("surpriseMe", currentLanguage)}
              </span>
              <span className="text-[11px] text-[#ffdada]/80 mt-0.5">
                AI Hidden Indian Gem
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Upcoming Trips Card / Carousel Section */}
      {upcomingTrip && (
        <section id="upcoming-trips-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1b1c1c]">
                {t("myUpcomingTrips", currentLanguage)}
              </h2>
              <p className="text-xs text-[#5f5e5e]">
                Track itinerary milestones, reservations and expenses
              </p>
            </div>
            <button
              onClick={() => setCurrentView("my-trips")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#ba0036] hover:text-[#9e002e] hover:underline"
            >
              <span>View All ({trips.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white border border-[#DDDDDD] shadow-ethos-card hover:shadow-ethos-hover transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Trip Cover Image */}
              <div className="lg:col-span-5 relative h-56 lg:h-auto min-h-[220px]">
                <img
                  src={upcomingTrip.coverImage}
                  alt={upcomingTrip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent lg:hidden" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-[#ba0036] shadow-xs">
                    {upcomingTrip.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1b1c1c]/80 backdrop-blur-md text-white">
                    {upcomingTrip.durationDays} {t("days", currentLanguage)}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 text-white lg:hidden">
                  <p className="text-xs font-medium text-[#ffdada]">{upcomingTrip.destination}</p>
                  <p className="text-lg font-bold">{upcomingTrip.title}</p>
                </div>
              </div>

              {/* Trip Details & Progress */}
              <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-5">
                <div>
                  <div className="hidden lg:flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#ba0036]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{upcomingTrip.destination}</span>
                    </div>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#ffdada] text-[#40000d]">
                      {upcomingTrip.status}
                    </span>
                  </div>

                  <h3 className="hidden lg:block text-xl font-bold text-[#1b1c1c] mt-1">
                    {upcomingTrip.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5f5e5e] mt-2 line-clamp-2">
                    {upcomingTrip.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#5f5e5e]">
                    <div className="flex items-center gap-1.5 bg-[#f5f3f3] px-3 py-1 rounded-full border border-[#DDDDDD]/60">
                      <Calendar className="w-3.5 h-3.5 text-[#5f5e5e]" />
                      <span>
                        {upcomingTrip.startDate} - {upcomingTrip.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#f5f3f3] px-3 py-1 rounded-full border border-[#DDDDDD]/60">
                      <Users className="w-3.5 h-3.5 text-[#5f5e5e]" />
                      <span>{upcomingTrip.travelersCount} Travelers</span>
                    </div>
                  </div>

                  {/* Budget & Spend Progress in INR */}
                  <div className="mt-4 pt-4 border-t border-[#efeded]">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#5f5e5e] font-medium">Budget Tracking (INR)</span>
                      <span className="font-bold text-[#1b1c1c]">
                        {formatINR(upcomingTrip.spentINR)} / {formatINR(upcomingTrip.budgetINR)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#efeded] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          upcomingTrip.spentINR > upcomingTrip.budgetINR
                            ? "bg-[#ba1a1a]"
                            : "bg-[#ba0036]"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((upcomingTrip.spentINR / (upcomingTrip.budgetINR || 1)) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#5f5e5e]">
                    <CheckCircle2 className="w-4 h-4 text-[#006a45]" />
                    <span>
                      {upcomingTrip.days.reduce(
                        (acc, d) => acc + d.activities.filter((a) => a.isCompleted).length,
                        0
                      )}{" "}
                      of {upcomingTrip.days.reduce((acc, d) => acc + d.activities.length, 0)} activities checked
                    </span>
                  </div>

                  <button
                    id="upcoming-trip-view-itinerary-btn"
                    onClick={() => {
                      setSelectedTripId(upcomingTrip.id);
                      setCurrentView("trip-detail");
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ba0036] hover:bg-[#9e002e] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
                  >
                    <span>{t("viewItinerary", currentLanguage)}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Discover India Bento Grid Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1b1c1c]">
              {t("discoverIndia", currentLanguage)}
            </h2>
            <p className="text-xs text-[#5f5e5e]">
              Curated iconic destinations across Incredible India
            </p>
          </div>
          <button
            onClick={() => setCurrentView("destinations")}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#ba0036] hover:text-[#9e002e] hover:underline"
          >
            <span>Explore All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[240px]">
          {/* Bento Item 1: Large Highlight (Gulmarg & Kashmir) */}
          <div
            onClick={() => setSelectedDestinationDetail(featuredDestinations[0])}
            className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer shadow-ethos-card hover:shadow-ethos-hover transition-all border border-[#DDDDDD]"
          >
            <img
              src={featuredDestinations[0].coverImage}
              alt={featuredDestinations[0].name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1c] via-[#1b1c1c]/40 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#ba0036] text-xs font-bold shadow-xs">
                ⭐ Featured Paradise
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveDestination(featuredDestinations[0].id);
                }}
                className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                  isDestinationSaved(featuredDestinations[0].id)
                    ? "bg-[#ba0036] text-white"
                    : "bg-black/40 hover:bg-black/60 text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${isDestinationSaved(featuredDestinations[0].id) ? "fill-white" : ""}`} />
              </button>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 text-[#ffdada] text-xs font-semibold mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#ffb2b6]" />
                <span>{featuredDestinations[0].state}</span>
                <span>•</span>
                <span>{featuredDestinations[0].region}</span>
              </div>
              <h3 className="text-2xl font-bold">{featuredDestinations[0].name}</h3>
              <p className="text-xs text-[#e9e8e7] mt-1 line-clamp-2 max-w-xl">
                {featuredDestinations[0].description}
              </p>
              <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/15 text-xs">
                <div>
                  <span className="text-[#e3e2e2] text-[11px]">Avg Daily: </span>
                  <span className="font-bold text-white">
                    {formatINR(featuredDestinations[0].avgDailyCostINR)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#ffdada] font-semibold">
                  <Star className="w-3.5 h-3.5 fill-[#ffdada]" />
                  <span>{featuredDestinations[0].rating}</span>
                  <span className="text-[#e3e2e2] text-[10px]">
                    ({featuredDestinations[0].reviewCount})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Item 2: Jaipur (The Pink City) */}
          <div
            onClick={() => setSelectedDestinationDetail(featuredDestinations[1])}
            className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-ethos-card hover:shadow-ethos-hover transition-all border border-[#DDDDDD]"
          >
            <img
              src={featuredDestinations[1].coverImage}
              alt={featuredDestinations[1].name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1c] via-[#1b1c1c]/40 to-transparent" />
            <div className="absolute top-3 right-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveDestination(featuredDestinations[1].id);
                }}
                className={`p-1.5 rounded-full backdrop-blur-md ${
                  isDestinationSaved(featuredDestinations[1].id)
                    ? "bg-[#ba0036] text-white"
                    : "bg-black/40 text-white"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isDestinationSaved(featuredDestinations[1].id) ? "fill-white" : ""}`} />
              </button>
            </div>
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[10px] text-[#ffdada] font-semibold">{featuredDestinations[1].state}</span>
              <h4 className="text-base font-bold">{featuredDestinations[1].name}</h4>
              <p className="text-[11px] text-[#e9e8e7] truncate">{featuredDestinations[1].tagline}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-white/10">
                <span className="font-semibold">{formatINR(featuredDestinations[1].avgDailyCostINR)}/day</span>
                <span className="text-[#ffdada] font-bold">★ {featuredDestinations[1].rating}</span>
              </div>
            </div>
          </div>

          {/* Bento Item 3: Kerala / Munnar */}
          <div
            onClick={() => setSelectedDestinationDetail(featuredDestinations[2])}
            className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-ethos-card hover:shadow-ethos-hover transition-all border border-[#DDDDDD]"
          >
            <img
              src={featuredDestinations[2].coverImage}
              alt={featuredDestinations[2].name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1c] via-[#1b1c1c]/40 to-transparent" />
            <div className="absolute top-3 right-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveDestination(featuredDestinations[2].id);
                }}
                className={`p-1.5 rounded-full backdrop-blur-md ${
                  isDestinationSaved(featuredDestinations[2].id)
                    ? "bg-[#ba0036] text-white"
                    : "bg-black/40 text-white"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isDestinationSaved(featuredDestinations[2].id) ? "fill-white" : ""}`} />
              </button>
            </div>
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[10px] text-[#80f9bd] font-semibold">{featuredDestinations[2].state}</span>
              <h4 className="text-base font-bold">{featuredDestinations[2].name}</h4>
              <p className="text-[11px] text-[#e9e8e7] truncate">{featuredDestinations[2].tagline}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-white/10">
                <span className="font-semibold">{formatINR(featuredDestinations[2].avgDailyCostINR)}/day</span>
                <span className="text-[#80f9bd] font-bold">★ {featuredDestinations[2].rating}</span>
              </div>
            </div>
          </div>

          {/* Bento Item 4: Varanasi */}
          <div
            onClick={() => setSelectedDestinationDetail(featuredDestinations[3])}
            className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-ethos-card hover:shadow-ethos-hover transition-all border border-[#DDDDDD]"
          >
            <img
              src={featuredDestinations[3].coverImage}
              alt={featuredDestinations[3].name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1c] via-[#1b1c1c]/40 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[10px] text-[#ffdada] font-semibold">{featuredDestinations[3].state}</span>
              <h4 className="text-base font-bold">{featuredDestinations[3].name}</h4>
              <p className="text-[11px] text-[#e9e8e7] truncate">{featuredDestinations[3].tagline}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-white/10">
                <span className="font-semibold">{formatINR(featuredDestinations[3].avgDailyCostINR)}/day</span>
                <span className="text-[#ffdada] font-bold">★ {featuredDestinations[3].rating}</span>
              </div>
            </div>
          </div>

          {/* Bento Item 5: Goa Coastal */}
          <div
            onClick={() => setSelectedDestinationDetail(featuredDestinations[4])}
            className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-ethos-card hover:shadow-ethos-hover transition-all border border-[#DDDDDD]"
          >
            <img
              src={featuredDestinations[4].coverImage}
              alt={featuredDestinations[4].name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1c] via-[#1b1c1c]/40 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[10px] text-[#ffdada] font-semibold">{featuredDestinations[4].state}</span>
              <h4 className="text-base font-bold">{featuredDestinations[4].name}</h4>
              <p className="text-[11px] text-[#e9e8e7] truncate">{featuredDestinations[4].tagline}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-white/10">
                <span className="font-semibold">{formatINR(featuredDestinations[4].avgDailyCostINR)}/day</span>
                <span className="text-[#ffdada] font-bold">★ {featuredDestinations[4].rating}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
