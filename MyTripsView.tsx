import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { t, formatINR } from "../lib/i18n";
import { Trip, TripStatus } from "../types";
import {
  Calendar,
  MapPin,
  Plus,
  ArrowRight,
  MoreVertical,
  Trash2,
  Copy,
  Share2,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
} from "lucide-react";

export const MyTripsView: React.FC = () => {
  const {
    trips,
    currentLanguage,
    setSelectedTripId,
    setCurrentView,
    setIsCreateTripModalOpen,
    setIsShareModalOpen,
    deleteTrip,
    duplicateTrip,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  const tabs = ["All", "Booked", "Planning", "In Progress", "Completed", "Draft"];

  const filteredTrips = trips.filter((trip) => {
    const matchesTab = activeTab === "All" || trip.status === activeTab;
    const matchesSearch =
      trip.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchFilter.toLowerCase()) ||
      trip.state.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1c1c]">
            {t("myTrips", currentLanguage)}
          </h1>
          <p className="text-xs sm:text-sm text-[#5f5e5e] mt-1">
            Manage, customize and track your adventures across Incredible India
          </p>
        </div>

        <button
          id="my-trips-new-trip-btn"
          onClick={() => setIsCreateTripModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ba0036] hover:bg-[#9e002e] text-white text-xs sm:text-sm font-semibold shadow-sm shadow-[#ba0036]/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t("planNewTrip", currentLanguage)}</span>
        </button>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDDDDD] pb-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => {
            const count =
              tab === "All" ? trips.length : trips.filter((t) => t.status === tab).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#ba0036] text-white shadow-xs"
                    : "bg-[#efeded] text-[#5f5e5e] hover:bg-[#e2dfde]"
                }`}
              >
                <span>{tab}</span>
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-[#dbdad9] text-[#1b1c1c]"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5f5e5e]" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter trips by city or state..."
            className="w-full pl-9 pr-3.5 py-1.5 bg-[#f5f3f3] border border-[#DDDDDD] rounded-full text-xs text-[#1b1c1c] placeholder-[#5f5e5e] focus:bg-white focus:border-[#ba0036] focus:ring-1 focus:ring-[#ffdada] outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#DDDDDD]">
          <div className="w-16 h-16 rounded-full bg-[#ffdada]/60 text-[#ba0036] flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#1b1c1c]">No trips found</h3>
          <p className="text-xs text-[#5f5e5e] max-w-sm mx-auto mt-1">
            You don't have any trips matching the selected criteria. Plan a new escape to Kashmir, Rajasthan, or Kerala!
          </p>
          <button
            onClick={() => setIsCreateTripModalOpen(true)}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#ba0036] hover:bg-[#9e002e] text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Trip</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const spentPercent = Math.min(
              100,
              Math.round((trip.spentINR / (trip.budgetINR || 1)) * 100)
            );
            const isMenuOpen = activeActionMenuId === trip.id;

            return (
              <div
                key={trip.id}
                id={`trip-card-${trip.id}`}
                className="group relative rounded-2xl bg-white border border-[#DDDDDD] hover:border-[#ba0036]/60 shadow-ethos-card hover:shadow-ethos-hover transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Cover Image & Badges */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                      className={`px-3 py-0.5 rounded-full text-[11px] font-bold backdrop-blur-md shadow-xs ${
                        trip.status === "Booked"
                          ? "bg-[#006a45]/90 text-white"
                          : trip.status === "Planning"
                          ? "bg-[#ba0036]/90 text-white"
                          : trip.status === "Completed"
                          ? "bg-[#1b1c1c]/90 text-white"
                          : "bg-[#5f5e5e]/90 text-white"
                      }`}
                    >
                      {trip.status}
                    </span>

                    {/* Action Dropdown Menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionMenuId(isMenuOpen ? null : trip.id);
                        }}
                        className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
                        aria-label="Trip options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {isMenuOpen && (
                        <div
                          className="absolute right-0 mt-1 w-40 bg-white rounded-2xl shadow-lg border border-[#DDDDDD] py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              setSelectedTripId(trip.id);
                              setIsShareModalOpen(true);
                              setActiveActionMenuId(null);
                            }}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-[#1b1c1c] hover:bg-[#f5f3f3] flex items-center gap-2"
                          >
                            <Share2 className="w-3.5 h-3.5 text-[#5f5e5e]" />
                            <span>Share Trip</span>
                          </button>
                          <button
                            onClick={() => {
                              duplicateTrip(trip.id);
                              setActiveActionMenuId(null);
                            }}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-[#1b1c1c] hover:bg-[#f5f3f3] flex items-center gap-2"
                          >
                            <Copy className="w-3.5 h-3.5 text-[#5f5e5e]" />
                            <span>Duplicate Trip</span>
                          </button>
                          <div className="border-t border-[#efeded] my-1" />
                          <button
                            onClick={() => {
                              deleteTrip(trip.id);
                              setActiveActionMenuId(null);
                            }}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-[#ba1a1a] hover:bg-[#ffdada]/40 flex items-center gap-2 font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-[#ba1a1a]" />
                            <span>Delete Trip</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Destination Overlay */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="flex items-center gap-1.5 text-[#ffdada] text-xs font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{trip.destination}</span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#1b1c1c] group-hover:text-[#ba0036] transition-colors">
                      {trip.title}
                    </h3>
                    <p className="text-xs text-[#5f5e5e] mt-1 line-clamp-2 leading-relaxed">
                      {trip.description}
                    </p>

                    <div className="mt-3 flex items-center gap-3 text-xs text-[#5f5e5e]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#5f5e5e]" />
                        <span>
                          {trip.startDate} ({trip.durationDays} {t("days", currentLanguage)})
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#5f5e5e]" />
                        <span>{trip.travelersCount}</span>
                      </div>
                    </div>

                    {/* Budget Progress Bar */}
                    <div className="mt-4 pt-3 border-t border-[#efeded]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#5f5e5e]">Spent / Budget</span>
                        <span className="font-bold text-[#1b1c1c]">
                          {formatINR(trip.spentINR)} / {formatINR(trip.budgetINR)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#efeded] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            trip.spentINR > trip.budgetINR
                              ? "bg-[#ba1a1a]"
                              : "bg-[#ba0036]"
                          }`}
                          style={{ width: `${spentPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="pt-3 border-t border-[#efeded] flex items-center justify-between">
                    <span className="text-[11px] text-[#5f5e5e]">
                      {trip.days.reduce((acc, d) => acc + d.activities.length, 0)} activities
                    </span>
                    <button
                      onClick={() => {
                        setSelectedTripId(trip.id);
                        setCurrentView("trip-detail");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ba0036] hover:text-[#9e002e] group/btn"
                    >
                      <span>{t("viewItinerary", currentLanguage)}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
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
