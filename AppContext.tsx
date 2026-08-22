import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Trip,
  Destination,
  UserProfile,
  LanguageCode,
  ViewType,
  Activity,
  TripExpense,
} from "../types";
import { SAMPLE_TRIPS } from "../data/sampleTrips";
import { INDIAN_DESTINATIONS } from "../data/destinations";
import confetti from "canvas-confetti";

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  trips: Trip[];
  selectedTripId: string | null;
  selectedTrip: Trip | undefined;
  setSelectedTripId: (id: string | null) => void;
  savedDestinationIds: string[];
  toggleSaveDestination: (id: string) => void;
  isDestinationSaved: (id: string) => boolean;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  addTrip: (trip: Partial<Trip>) => Trip;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  duplicateTrip: (id: string) => void;
  addActivity: (tripId: string, dayNumber: number, activity: Omit<Activity, "id">) => void;
  deleteActivity: (tripId: string, dayNumber: number, activityId: string) => void;
  toggleActivityComplete: (tripId: string, dayNumber: number, activityId: string) => void;
  addExpense: (tripId: string, expense: Omit<TripExpense, "id">) => void;
  deleteExpense: (tripId: string, expenseId: string) => void;
  isCreateTripModalOpen: boolean;
  setIsCreateTripModalOpen: (open: boolean) => void;
  isAddExpenseModalOpen: boolean;
  setIsAddExpenseModalOpen: (open: boolean) => void;
  selectedDestinationDetail: Destination | null;
  setSelectedDestinationDetail: (dest: Destination | null) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_TRIPS_KEY = "globetrotter_india_trips_v1";
const LOCAL_STORAGE_USER_KEY = "globetrotter_india_user_v1";
const LOCAL_STORAGE_LANG_KEY = "globetrotter_india_lang_v1";

const DEFAULT_USER: UserProfile = {
  id: "user-alex-1",
  name: "Alex",
  email: "alex.traveler@gmail.com",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  homeCity: "Bengaluru, Karnataka",
  bio: "Passionate traveler discovering the rich culture, spicy thalis, Himalayan peaks, and coastal backwaters across India.",
  language: "en",
  currency: "INR (₹)",
  travelInterests: ["Heritage & History", "Himalayan Treks", "Culinary Trails", "Spiritual"],
  savedDestinationIds: ["dest-gulmarg-kashmir", "dest-munnar-kerala", "dest-varanasi-up"],
  emailNotifications: true,
  budgetAlerts: true,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>("explore");
  const [selectedTripId, setSelectedTripId] = useState<string | null>("trip-rajasthan-royals");
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [selectedDestinationDetail, setSelectedDestinationDetail] = useState<Destination | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Trips state
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to read trips from localStorage", e);
    }
    return SAMPLE_TRIPS;
  });

  // User Profile state
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to read user from localStorage", e);
    }
    return DEFAULT_USER;
  });

  // Language state
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
      if (stored && ["en", "hi", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "or"].includes(stored)) {
        return stored as LanguageCode;
      }
    } catch (e) {
      console.error("Failed to read lang from localStorage", e);
    }
    return "en";
  });

  // Save trips to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(trips));
    } catch (e) {
      console.error("Failed to write trips to localStorage", e);
    }
  }, [trips]);

  // Save user profile to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error("Failed to write user to localStorage", e);
    }
  }, [user]);

  // Save language to local storage
  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    setUser((prev) => ({ ...prev, language: lang }));
    try {
      localStorage.setItem(LOCAL_STORAGE_LANG_KEY, lang);
    } catch (e) {
      console.error("Failed to write lang to localStorage", e);
    }
    showToast(`Language changed to ${lang.toUpperCase()}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ea580c", "#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"],
      });
    } catch (e) {
      // safe fallback
    }
  };

  const selectedTrip = trips.find((t) => t.id === selectedTripId) || trips[0];

  const toggleSaveDestination = (destId: string) => {
    setUser((prev) => {
      const exists = prev.savedDestinationIds.includes(destId);
      const updated = exists
        ? prev.savedDestinationIds.filter((id) => id !== destId)
        : [...prev.savedDestinationIds, destId];
      showToast(exists ? "Removed from Saved Places" : "Added to Saved Places in India");
      return { ...prev, savedDestinationIds: updated };
    });
  };

  const isDestinationSaved = (destId: string) => {
    return user.savedDestinationIds.includes(destId);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    showToast("Profile settings saved successfully");
  };

  const addTrip = (tripData: Partial<Trip>): Trip => {
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      title: tripData.title || "Incredible India Expedition",
      destination: tripData.destination || "Jaipur, Rajasthan",
      state: tripData.state || "Rajasthan",
      region: tripData.region || "West India",
      startDate: tripData.startDate || new Date().toISOString().split("T")[0],
      endDate: tripData.endDate || new Date(Date.now() + 86400000 * 4).toISOString().split("T")[0],
      durationDays: tripData.durationDays || 4,
      budgetINR: tripData.budgetINR || 30000,
      spentINR: 0,
      status: tripData.status || "Planning",
      coverImage:
        tripData.coverImage ||
        "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
      description: tripData.description || "Exciting journey exploring India.",
      travelersCount: tripData.travelersCount || 2,
      tags: tripData.tags || ["Heritage", "Culture"],
      days: tripData.days || [
        {
          dayNumber: 1,
          dateStr: "Day 1",
          title: "Arrival & City Orientation",
          activities: [],
        },
      ],
      expenses: [],
      collaborators: [user.email],
      createdAt: new Date().toISOString(),
    };

    setTrips((prev) => [newTrip, ...prev]);
    setSelectedTripId(newTrip.id);
    triggerConfetti();
    showToast(`New trip "${newTrip.title}" created!`);
    return newTrip;
  };

  const updateTrip = (id: string, updates: Partial<Trip>) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id === id) {
          const updatedTrip = { ...trip, ...updates };
          // Recalculate spentINR if expenses changed
          if (updates.expenses) {
            updatedTrip.spentINR = updates.expenses.reduce((sum, exp) => sum + exp.amountINR, 0);
          }
          return updatedTrip;
        }
        return trip;
      })
    );
    showToast("Trip details updated");
  };

  const deleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    if (selectedTripId === id) {
      const remaining = trips.filter((t) => t.id !== id);
      setSelectedTripId(remaining.length > 0 ? remaining[0].id : null);
    }
    showToast("Trip deleted");
  };

  const duplicateTrip = (id: string) => {
    const target = trips.find((t) => t.id === id);
    if (!target) return;
    const duplicated: Trip = {
      ...target,
      id: `trip-${Date.now()}`,
      title: `${target.title} (Copy)`,
      status: "Draft",
      spentINR: 0,
      expenses: [],
      createdAt: new Date().toISOString(),
    };
    setTrips((prev) => [duplicated, ...prev]);
    setSelectedTripId(duplicated.id);
    showToast(`Duplicated "${target.title}"`);
  };

  const addActivity = (tripId: string, dayNumber: number, activityData: Omit<Activity, "id">) => {
    const newActivity: Activity = {
      ...activityData,
      id: `act-${Date.now()}`,
    };

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        let dayFound = false;
        const updatedDays = trip.days.map((day) => {
          if (day.dayNumber === dayNumber) {
            dayFound = true;
            return {
              ...day,
              activities: [...day.activities, newActivity],
            };
          }
          return day;
        });

        if (!dayFound) {
          updatedDays.push({
            dayNumber,
            title: `Day ${dayNumber}`,
            activities: [newActivity],
          });
        }

        return { ...trip, days: updatedDays };
      })
    );
    showToast(`Added activity: "${newActivity.title}"`);
  };

  const deleteActivity = (tripId: string, dayNumber: number, activityId: string) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updatedDays = trip.days.map((day) => {
          if (day.dayNumber === dayNumber) {
            return {
              ...day,
              activities: day.activities.filter((a) => a.id !== activityId),
            };
          }
          return day;
        });
        return { ...trip, days: updatedDays };
      })
    );
    showToast("Activity removed");
  };

  const toggleActivityComplete = (tripId: string, dayNumber: number, activityId: string) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updatedDays = trip.days.map((day) => {
          if (day.dayNumber === dayNumber) {
            return {
              ...day,
              activities: day.activities.map((a) =>
                a.id === activityId ? { ...a, isCompleted: !a.isCompleted } : a
              ),
            };
          }
          return day;
        });
        return { ...trip, days: updatedDays };
      })
    );
  };

  const addExpense = (tripId: string, expenseData: Omit<TripExpense, "id">) => {
    const newExpense: TripExpense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updatedExpenses = [newExpense, ...trip.expenses];
        const newTotalSpent = updatedExpenses.reduce((sum, exp) => sum + exp.amountINR, 0);
        return {
          ...trip,
          expenses: updatedExpenses,
          spentINR: newTotalSpent,
        };
      })
    );
    showToast(`Added expense: ₹${newExpense.amountINR}`);
  };

  const deleteExpense = (tripId: string, expenseId: string) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updatedExpenses = trip.expenses.filter((e) => e.id !== expenseId);
        const newTotalSpent = updatedExpenses.reduce((sum, exp) => sum + exp.amountINR, 0);
        return {
          ...trip,
          expenses: updatedExpenses,
          spentINR: newTotalSpent,
        };
      })
    );
    showToast("Expense removed");
  };

  const login = (email: string, name?: string) => {
    setIsAuthenticated(true);
    setUser((prev) => ({
      ...prev,
      email: email || prev.email,
      name: name || email.split("@")[0] || prev.name,
    }));
    setCurrentView("explore");
    showToast(`Welcome back, ${name || "Traveler"}!`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentView("login");
    showToast("Logged out successfully");
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        trips,
        selectedTripId,
        selectedTrip,
        setSelectedTripId,
        savedDestinationIds: user.savedDestinationIds,
        toggleSaveDestination,
        isDestinationSaved,
        user,
        updateUser,
        currentLanguage,
        setLanguage,
        addTrip,
        updateTrip,
        deleteTrip,
        duplicateTrip,
        addActivity,
        deleteActivity,
        toggleActivityComplete,
        addExpense,
        deleteExpense,
        isCreateTripModalOpen,
        setIsCreateTripModalOpen,
        isAddExpenseModalOpen,
        setIsAddExpenseModalOpen,
        selectedDestinationDetail,
        setSelectedDestinationDetail,
        isShareModalOpen,
        setIsShareModalOpen,
        toastMessage,
        showToast,
        searchQuery,
        setSearchQuery,
        isAuthenticated,
        login,
        logout,
        triggerConfetti,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
