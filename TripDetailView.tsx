import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { t, formatINR } from "../lib/i18n";
import { ActivityCategory, Activity } from "../types";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Plus,
  Share2,
  Sparkles,
  CheckCircle2,
  Circle,
  Trash2,
  Printer,
  ChevronRight,
  Train,
  Plane,
  Camera,
  Utensils,
  Mountain,
  Landmark,
  BedDouble,
  Tag,
  DollarSign,
  Users,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export const TripDetailView: React.FC = () => {
  const {
    selectedTrip,
    currentLanguage,
    setCurrentView,
    addActivity,
    deleteActivity,
    toggleActivityComplete,
    setIsShareModalOpen,
    setIsAddExpenseModalOpen,
    showToast,
  } = useApp();

  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"timeline" | "calendar">("timeline");
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // New Activity Form State
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newTime, setNewTime] = useState("10:00 AM");
  const [newCategory, setNewCategory] = useState<ActivityCategory>("Sightseeing");
  const [newCostINR, setNewCostINR] = useState<number>(500);
  const [newDescription, setNewDescription] = useState("");

  if (!selectedTrip) {
    return (
      <div className="text-center py-20">
        <p className="text-[#5f5e5e]">No trip selected.</p>
        <button
          onClick={() => setCurrentView("my-trips")}
          className="mt-4 px-5 py-2.5 bg-[#ba0036] hover:bg-[#9e002e] text-white rounded-full text-xs font-semibold shadow-xs"
        >
          Return to My Trips
        </button>
      </div>
    );
  }

  const currentDayData =
    selectedTrip.days.find((d) => d.dayNumber === selectedDayNumber) || selectedTrip.days[0];

  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addActivity(selectedTrip.id, selectedDayNumber, {
      title: newTitle,
      location: newLocation || selectedTrip.destination,
      time: newTime,
      category: newCategory,
      estimatedCostINR: Number(newCostINR) || 0,
      description: newDescription,
      duration: "1.5 Hours",
      isCompleted: false,
    });

    setNewTitle("");
    setNewLocation("");
    setNewDescription("");
    setIsAddActivityOpen(false);
  };

  const handleAIOptimize = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Please review and optimize Day ${selectedDayNumber} of my trip to ${selectedTrip.destination}, India. Provide 3 smart recommendations for local transit (IRCTC/Metro/Cabs), peak hour tips, and must-try regional culinary stops nearby.`,
            },
          ],
          language: currentLanguage,
          currentTrip: selectedTrip,
        }),
      });
      const data = await res.json();
      if (data?.reply) {
        showToast("✨ AI Itinerary Recommendations Ready in AI Companion!");
        setCurrentView("ai-planner");
      }
    } catch (e) {
      showToast("Could not optimize at this moment.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const getCategoryIcon = (category: ActivityCategory) => {
    switch (category) {
      case "Transit":
        return <Train className="w-4 h-4 text-blue-600" />;
      case "Sightseeing":
        return <Camera className="w-4 h-4 text-emerald-600" />;
      case "Food":
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case "Adventure":
        return <Mountain className="w-4 h-4 text-red-600" />;
      case "Culture":
      case "Spiritual":
        return <Landmark className="w-4 h-4 text-purple-600" />;
      case "Stay":
        return <BedDouble className="w-4 h-4 text-indigo-600" />;
      default:
        return <Tag className="w-4 h-4 text-[#5f5e5e]" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Back button & Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView("my-trips")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5f5e5e] hover:text-[#1b1c1c] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Trips</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="trip-detail-share-btn"
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#DDDDDD] bg-white hover:bg-[#f5f3f3] text-xs font-medium text-[#1b1c1c] shadow-2xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#DDDDDD] bg-white hover:bg-[#f5f3f3] text-xs font-medium text-[#1b1c1c] shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            id="trip-detail-add-expense-btn"
            onClick={() => setIsAddExpenseModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#006a45] hover:bg-[#005235] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Hero Trip Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#1b1c1c] text-white shadow-ethos-card border border-[#DDDDDD]">
        <div className="relative h-60 sm:h-72 w-full">
          <img
            src={selectedTrip.coverImage}
            alt={selectedTrip.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1c] via-[#1b1c1c]/50 to-transparent" />

          {/* Banner Content */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#ba0036] text-white shadow-xs">
                  {selectedTrip.status}
                </span>
                <span className="text-xs text-[#ffdada] font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#ffb2b6]" />
                  {selectedTrip.destination} ({selectedTrip.state})
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold text-white">
                {selectedTrip.title}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#e3e2e2]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#dbdad9]" />
                  {selectedTrip.startDate} — {selectedTrip.endDate} ({selectedTrip.durationDays} Days)
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#dbdad9]" />
                  {selectedTrip.travelersCount} Travelers
                </span>
              </div>
            </div>

            {/* Budget Box */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 min-w-[200px] text-right">
              <span className="text-[11px] text-[#dbdad9] uppercase tracking-wider font-semibold">
                Budget in INR
              </span>
              <p className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {formatINR(selectedTrip.budgetINR)}
              </p>
              <div className="mt-1 flex items-center justify-end gap-1.5 text-xs text-[#ffdada] font-medium">
                <span>Spent: {formatINR(selectedTrip.spentINR)}</span>
                <span>({Math.round((selectedTrip.spentINR / (selectedTrip.budgetINR || 1)) * 100)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Itinerary Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Timeline & Activities */}
        <div className="lg:col-span-8 space-y-6">
          {/* Day Selector Pills */}
          <div className="flex items-center justify-between gap-3 border-b border-[#DDDDDD] pb-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {selectedTrip.days.map((day) => {
                const isDayActive = day.dayNumber === selectedDayNumber;
                return (
                  <button
                    key={day.dayNumber}
                    onClick={() => setSelectedDayNumber(day.dayNumber)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex flex-col items-center ${
                      isDayActive
                        ? "bg-[#ba0036] text-white shadow-xs scale-105"
                        : "bg-white border border-[#DDDDDD] text-[#1b1c1c] hover:bg-[#f5f3f3]"
                    }`}
                  >
                    <span>Day {day.dayNumber}</span>
                    <span
                      className={`text-[10px] font-normal mt-0.5 ${
                        isDayActive ? "text-white/80" : "text-[#5f5e5e]"
                      }`}
                    >
                      {day.activities.length} spots
                    </span>
                  </button>
                );
              })}
            </div>

            {/* AI Optimize Button */}
            <button
              onClick={handleAIOptimize}
              disabled={isOptimizing}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ffdada] hover:bg-[#ffc1c5] text-[#ba0036] text-xs font-semibold transition-colors disabled:opacity-50 shrink-0"
            >
              <Sparkles className={`w-3.5 h-3.5 text-[#ba0036] ${isOptimizing ? "animate-spin" : ""}`} />
              <span>{isOptimizing ? "Optimizing..." : t("optimizeWithAI", currentLanguage)}</span>
            </button>
          </div>

          {/* Current Day Header */}
          {currentDayData && (
            <div className="flex items-center justify-between bg-white border border-[#DDDDDD] rounded-2xl p-4 shadow-ethos-card">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ba0036]">
                  Day {currentDayData.dayNumber} Schedule
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#1b1c1c] mt-0.5">
                  {currentDayData.title}
                </h3>
                {currentDayData.theme && (
                  <p className="text-xs text-[#5f5e5e] mt-0.5">{currentDayData.theme}</p>
                )}
              </div>

              <button
                onClick={() => setIsAddActivityOpen(!isAddActivityOpen)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ba0036] hover:bg-[#9e002e] text-white text-xs font-semibold shadow-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Activity</span>
              </button>
            </div>
          )}

          {/* Add Activity Inline Form */}
          {isAddActivityOpen && (
            <form
              onSubmit={handleAddActivitySubmit}
              className="p-5 rounded-2xl bg-white border border-[#ba0036]/50 shadow-ethos-hover space-y-4 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="flex items-center justify-between border-b border-[#efeded] pb-2">
                <span className="text-xs font-bold text-[#1b1c1c]">
                  Add Activity to Day {selectedDayNumber}
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddActivityOpen(false)}
                  className="text-xs text-[#5f5e5e] hover:text-[#1b1c1c]"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1b1c1c] mb-1">
                    Activity Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Hawa Mahal Guided Tour"
                    className="w-full px-3 py-1.5 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1b1c1c] mb-1">
                    Specific Landmark / Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Badi Choupad, Old City"
                    className="w-full px-3 py-1.5 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1b1c1c] mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 09:30 AM"
                    className="w-full px-3 py-1.5 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1b1c1c] mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ActivityCategory)}
                    className="w-full px-3 py-1.5 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                  >
                    <option value="Sightseeing">Sightseeing &amp; Heritage</option>
                    <option value="Food">Food &amp; Dining</option>
                    <option value="Transit">Transit (Train / Flight / Cab)</option>
                    <option value="Adventure">Adventure &amp; Treks</option>
                    <option value="Culture">Culture &amp; Arts</option>
                    <option value="Stay">Hotel / Stay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1b1c1c] mb-1">
                    Estimated Cost (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCostINR}
                    onChange={(e) => setNewCostINR(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1b1c1c] mb-1">
                    Description &amp; Tips
                  </label>
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="e.g. Pre-booked online pass, entry via gate 2"
                    className="w-full px-3 py-1.5 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddActivityOpen(false)}
                  className="px-4 py-1.5 rounded-full border border-[#DDDDDD] text-xs font-medium text-[#5f5e5e] hover:bg-[#f5f3f3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full bg-[#ba0036] hover:bg-[#9e002e] text-white text-xs font-semibold shadow-xs"
                >
                  Save Activity
                </button>
              </div>
            </form>
          )}

          {/* Activities List */}
          {(!currentDayData || currentDayData.activities.length === 0) ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-white border border-[#DDDDDD]">
              <Clock className="w-8 h-8 text-[#5f5e5e] mx-auto mb-2" />
              <p className="text-xs text-[#5f5e5e]">No activities scheduled for this day yet.</p>
              <button
                onClick={() => setIsAddActivityOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#ba0036] hover:text-[#9e002e]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add first activity</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {currentDayData.activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    activity.isCompleted
                      ? "bg-[#f5f3f3]/80 border-[#DDDDDD] opacity-70"
                      : "bg-white border-[#DDDDDD] hover:border-[#ba0036]/50 shadow-ethos-card hover:shadow-ethos-hover"
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    {/* Checkbox toggle */}
                    <button
                      onClick={() =>
                        toggleActivityComplete(selectedTrip.id, selectedDayNumber, activity.id)
                      }
                      className="mt-0.5 text-[#5f5e5e] hover:text-[#006a45] transition-colors shrink-0"
                      aria-label="Toggle activity complete"
                    >
                      {activity.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-[#006a45] fill-[#80f9bd]/20" />
                      ) : (
                        <Circle className="w-5 h-5 hover:text-[#1b1c1c]" />
                      )}
                    </button>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#efeded] text-[#1b1c1c]">
                          {activity.time}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#ffdada] text-[#ba0036]">
                          {getCategoryIcon(activity.category)}
                          <span>{activity.category}</span>
                        </span>
                        {activity.estimatedCostINR > 0 && (
                          <span className="text-[11px] font-bold text-[#1b1c1c] bg-[#efeded] px-2.5 py-0.5 rounded-full">
                            {formatINR(activity.estimatedCostINR)}
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-sm font-bold ${
                          activity.isCompleted ? "line-through text-[#5f5e5e]" : "text-[#1b1c1c]"
                        }`}
                      >
                        {activity.title}
                      </h4>

                      <div className="flex items-center gap-1 text-xs text-[#5f5e5e]">
                        <MapPin className="w-3 h-3 text-[#5f5e5e] shrink-0" />
                        <span>{activity.location}</span>
                      </div>

                      {activity.description && (
                        <p className="text-xs text-[#5f5e5e] mt-1 leading-relaxed">{activity.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Delete activity */}
                  <button
                    onClick={() =>
                      deleteActivity(selectedTrip.id, selectedDayNumber, activity.id)
                    }
                    className="p-1.5 text-[#5f5e5e] hover:text-[#ba1a1a] transition-colors shrink-0"
                    title="Remove activity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Trip Quick Stats & Expense Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Expense Breakdown Box */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDDDDD] shadow-ethos-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#efeded] pb-3">
              <h3 className="text-sm font-bold text-[#1b1c1c]">Trip Expenses (INR)</h3>
              <button
                onClick={() => setCurrentView("budget")}
                className="text-xs font-semibold text-[#ba0036] hover:underline"
              >
                Full Ledger
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#5f5e5e]">Total Budget:</span>
                <span className="font-bold text-[#1b1c1c]">{formatINR(selectedTrip.budgetINR)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#5f5e5e]">Total Spent:</span>
                <span className="font-bold text-[#ba0036]">{formatINR(selectedTrip.spentINR)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#5f5e5e]">Remaining:</span>
                <span className="font-bold text-[#006a45]">
                  {formatINR(Math.max(0, selectedTrip.budgetINR - selectedTrip.spentINR))}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsAddExpenseModalOpen(true)}
              className="w-full py-2.5 rounded-full bg-[#1b1c1c] hover:bg-black text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Expense</span>
            </button>
          </div>

          {/* Indian Travel Checklist */}
          <div className="p-5 rounded-2xl bg-[#ffdada]/30 border border-[#ffdada] space-y-3 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#ba0036] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#ba0036]" />
              <span>Essential India Travel Checklist</span>
            </h3>
            <ul className="text-xs text-[#1b1c1c] space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#ba0036] font-bold">•</span>
                <span>Carry valid Indian Government photo ID / Passport for monument check-ins.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ba0036] font-bold">•</span>
                <span>Keep small cash (₹100/₹200) handy alongside UPI for local autos and prasad.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ba0036] font-bold">•</span>
                <span>Pre-download offline maps for remote mountain / ghat areas.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
