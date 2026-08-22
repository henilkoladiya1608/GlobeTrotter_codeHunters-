import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { ExploreView } from "./components/ExploreView";
import { MyTripsView } from "./components/MyTripsView";
import { TripDetailView } from "./components/TripDetailView";
import { DestinationsView } from "./components/DestinationsView";
import { ExperiencesView } from "./components/ExperiencesView";
import { BudgetDashboardView } from "./components/BudgetDashboardView";
import { AIPlannerView } from "./components/AIPlannerView";
import { SettingsView } from "./components/SettingsView";
import { AuthView } from "./components/AuthView";

// Modals
import { CreateTripModal } from "./components/modals/CreateTripModal";
import { AddExpenseModal } from "./components/modals/AddExpenseModal";
import { DestinationDetailModal } from "./components/modals/DestinationDetailModal";
import { ShareTripModal } from "./components/modals/ShareTripModal";

import { t } from "./lib/i18n";
import { Compass, Sparkles, MapPin, Heart, Shield, CheckCircle2 } from "lucide-react";

const MainContent: React.FC = () => {
  const { currentView, toastMessage, currentLanguage, setCurrentView } = useApp();

  const renderActiveView = () => {
    switch (currentView) {
      case "explore":
        return <ExploreView />;
      case "my-trips":
        return <MyTripsView />;
      case "trip-detail":
        return <TripDetailView />;
      case "destinations":
        return <DestinationsView />;
      case "experiences":
        return <ExperiencesView />;
      case "budget":
        return <BudgetDashboardView />;
      case "ai-planner":
        return <AIPlannerView />;
      case "settings":
        return <SettingsView />;
      case "auth":
        return <AuthView initialMode="login" />;
      case "login":
        return <AuthView initialMode="login" />;
      case "signup":
        return <AuthView initialMode="signup" />;
      default:
        return <ExploreView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f9] text-[#1b1c1c] flex flex-col selection:bg-[#ffdada] selection:text-[#ba0036]">
      {/* Navigation Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {renderActiveView()}
      </main>

      {/* Global Interactive Modals */}
      <CreateTripModal />
      <AddExpenseModal />
      <DestinationDetailModal />
      <ShareTripModal />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-[#1b1c1c] text-white text-xs font-semibold px-4 py-3 rounded-full shadow-xl border border-[#333333] flex items-center gap-2.5 max-w-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#DDDDDD] bg-white mt-12 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5f5e5e]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#ba0036] flex items-center justify-center text-white font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-[#1b1c1c] text-sm">Globetrotter India</span>
            <span className="text-[10px] text-[#ba0036] bg-[#ffdada] px-2.5 py-0.5 rounded-full font-bold">
              All 28 States &amp; 8 UTs
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[#5f5e5e]">
            <span>🇮🇳 All Prices in Indian Rupee (INR ₹)</span>
            <span>•</span>
            <button
              onClick={() => setCurrentView("settings")}
              className="hover:text-[#ba0036] font-medium transition-colors"
            >
              11 Indian Regional Languages
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView("ai-planner")}
              className="hover:text-[#ba0036] font-medium transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#ba0036]" />
              <span>Safar AI Concierge</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView("login")}
              className="hover:text-[#ba0036] font-medium transition-colors"
            >
              Login &amp; Register
            </button>
          </div>

          <p className="text-[11px] text-[#888888]">
            © {new Date().getFullYear()} Globetrotter India. Crafted for exploratory travelers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
