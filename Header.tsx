import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { SUPPORTED_LANGUAGES, t } from "../lib/i18n";
import { ViewType, LanguageCode } from "../types";
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  Wallet,
  Globe,
  Search,
  Plus,
  User,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Bookmark,
  ChevronDown,
  Menu,
  X,
  Languages,
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentLanguage,
    setLanguage,
    user,
    isAuthenticated,
    setIsCreateTripModalOpen,
    searchQuery,
    setSearchQuery,
    savedDestinationIds,
    logout,
  } = useApp();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: ViewType; labelKey: string; icon: React.ReactNode }[] = [
    { id: "explore", labelKey: "explore", icon: <Compass className="w-4 h-4" /> },
    { id: "my-trips", labelKey: "myTrips", icon: <Calendar className="w-4 h-4" /> },
    { id: "destinations", labelKey: "destinations", icon: <MapPin className="w-4 h-4" /> },
    { id: "experiences", labelKey: "experiences", icon: <Globe className="w-4 h-4" /> },
    { id: "budget", labelKey: "budget", icon: <Wallet className="w-4 h-4" /> },
    { id: "ai-planner", labelKey: "aiPlanner", icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
  ];

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-b border-[#DDDDDD] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div
            id="brand-logo"
            onClick={() => setCurrentView("explore")}
            className="flex items-center gap-3 cursor-pointer shrink-0 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ba0036] via-[#e21e4a] to-[#ff385c] flex items-center justify-center text-white shadow-sm shadow-[#ba0036]/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-[#1b1c1c]">
                  Globetrotter
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#ffdada] text-[#40000d] border border-[#e5bdbe]">
                  India
                </span>
              </div>
              <span className="text-[11px] text-[#5f5e5e] font-medium">
                {t("tagline", currentLanguage)}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#ffdada]/70 text-[#ba0036] font-semibold"
                      : "text-[#5f5e5e] hover:text-[#1b1c1c] hover:bg-[#efeded]"
                  }`}
                >
                  {item.icon}
                  <span>{t(item.labelKey, currentLanguage)}</span>
                </button>
              );
            })}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2.5">
            {/* Quick Search */}
            <div className="hidden md:flex items-center relative w-48 xl:w-64">
              <Search className="w-4 h-4 absolute left-3.5 text-[#5f5e5e] pointer-events-none" />
              <input
                id="header-global-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (currentView !== "destinations") {
                    setCurrentView("destinations");
                  }
                }}
                placeholder={t("searchPlaceholder", currentLanguage)}
                className="w-full pl-9 pr-3.5 py-1.5 bg-[#f5f3f3] hover:bg-[#efeded] focus:bg-white text-xs text-[#1b1c1c] placeholder-[#5f5e5e] rounded-full border border-transparent focus:border-[#ba0036] focus:ring-2 focus:ring-[#ffdada] transition-all outline-hidden"
              />
            </div>

            {/* Currency Badge */}
            <div
              id="currency-badge"
              title="All prices in Indian Rupees (INR)"
              className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-[#efeded] border border-[#DDDDDD] text-[#1b1c1c] text-xs font-semibold"
            >
              <span className="text-[#ba0036] font-bold">₹</span>
              <span>INR</span>
            </div>

            {/* Regional Language Switcher */}
            <div className="relative">
              <button
                id="language-switcher-btn"
                onClick={() => {
                  setIsLangDropdownOpen(!isLangDropdownOpen);
                  setIsProfileDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#DDDDDD] bg-white hover:bg-[#f5f3f3] text-xs font-medium text-[#1b1c1c] shadow-2xs transition-colors"
                aria-label="Select Regional Language"
              >
                <Languages className="w-3.5 h-3.5 text-[#ba0036]" />
                <span className="font-semibold">{currentLangObj.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-[#5f5e5e]" />
              </button>

              {isLangDropdownOpen && (
                <div
                  id="language-dropdown-menu"
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#DDDDDD] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3.5 py-1.5 border-b border-[#efeded] text-[11px] font-semibold uppercase tracking-wider text-[#5f5e5e]">
                    Indian Regional Languages
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 flex items-center justify-between text-xs transition-colors ${
                          currentLanguage === lang.code
                            ? "bg-[#ffdada]/60 text-[#ba0036] font-semibold"
                            : "text-[#1b1c1c] hover:bg-[#f5f3f3]"
                        }`}
                      >
                        <div>
                          <span className="text-sm font-medium">{lang.nativeName}</span>
                          <span className="text-[#5f5e5e] text-[11px] ml-1.5">({lang.name})</span>
                        </div>
                        <span className="text-[10px] text-[#5f5e5e]">{lang.regionHint}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Plan Trip CTA */}
            <button
              id="header-create-trip-btn"
              onClick={() => setIsCreateTripModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#ba0036] hover:bg-[#9e002e] text-white text-xs font-semibold rounded-full shadow-sm shadow-[#ba0036]/20 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">{t("planNewTrip", currentLanguage)}</span>
              <span className="sm:hidden">Trip</span>
            </button>

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  id="user-avatar-btn"
                  onClick={() => {
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    setIsLangDropdownOpen(false);
                  }}
                  className="flex items-center gap-1.5 p-0.5 rounded-full border border-[#DDDDDD] hover:border-[#ba0036] transition-colors"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div
                    id="user-profile-dropdown"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#DDDDDD] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2.5 border-b border-[#efeded]">
                      <p className="text-xs font-bold text-[#1b1c1c]">{user.name}</p>
                      <p className="text-[11px] text-[#5f5e5e] truncate">{user.email}</p>
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#ba0036] bg-[#ffdada]/70 px-2.5 py-0.5 rounded-full font-semibold">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>{user.homeCity}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCurrentView("settings");
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#1b1c1c] hover:bg-[#f5f3f3] flex items-center gap-2.5"
                      >
                        <User className="w-3.5 h-3.5 text-[#5f5e5e]" />
                        <span>{t("profile", currentLanguage)}</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView("settings");
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#1b1c1c] hover:bg-[#f5f3f3] flex items-center gap-2.5"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-[#5f5e5e]" />
                        <span>
                          {t("viewSavedPlaces", currentLanguage)} ({savedDestinationIds.length})
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView("settings");
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#1b1c1c] hover:bg-[#f5f3f3] flex items-center gap-2.5"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#5f5e5e]" />
                        <span>{t("settings", currentLanguage)}</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView("login");
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#1b1c1c] hover:bg-[#f5f3f3] flex items-center gap-2.5"
                      >
                        <LogIn className="w-3.5 h-3.5 text-[#5f5e5e]" />
                        <span>Switch Account / Login</span>
                      </button>
                    </div>

                    <div className="border-t border-[#efeded] pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#ba1a1a] hover:bg-[#ffdada]/40 flex items-center gap-2.5 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5 text-[#ba1a1a]" />
                        <span>{t("signOut", currentLanguage)}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  id="header-login-btn"
                  onClick={() => setCurrentView("login")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#DDDDDD] hover:border-[#ba0036] hover:bg-[#ffdada]/30 text-xs font-bold text-[#1b1c1c] transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#ba0036]" />
                  <span>{t("signIn", currentLanguage)}</span>
                </button>
                <button
                  id="header-signup-btn"
                  onClick={() => setCurrentView("signup")}
                  className="hidden sm:flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#ba0036] hover:bg-[#9e002e] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{t("signUp", currentLanguage)}</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#5f5e5e] hover:bg-[#efeded] rounded-full"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-[#DDDDDD] animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1 pb-2">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3.5 py-2 rounded-full text-sm font-medium ${
                      isActive
                        ? "bg-[#ffdada]/70 text-[#ba0036] font-semibold"
                        : "text-[#1b1c1c] hover:bg-[#efeded]"
                    }`}
                  >
                    {item.icon}
                    <span>{t(item.labelKey, currentLanguage)}</span>
                  </button>
                );
              })}

              <div className="pt-2 mt-1 border-t border-[#efeded] flex flex-col gap-1">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        setCurrentView("settings");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-3.5 py-2 rounded-full text-sm text-[#1b1c1c] hover:bg-[#efeded]"
                    >
                      <User className="w-4 h-4 text-[#5f5e5e]" />
                      <span>{t("profile", currentLanguage)} ({user.name})</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView("login");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-3.5 py-2 rounded-full text-sm text-[#1b1c1c] hover:bg-[#efeded]"
                    >
                      <LogIn className="w-4 h-4 text-[#5f5e5e]" />
                      <span>Switch Account / Sign In</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-3.5 py-2 rounded-full text-sm text-[#ba1a1a] hover:bg-[#ffdada]/40 font-medium"
                    >
                      <LogOut className="w-4 h-4 text-[#ba1a1a]" />
                      <span>{t("signOut", currentLanguage)}</span>
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setCurrentView("login");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 py-2 px-3 rounded-full border border-[#DDDDDD] text-xs font-bold text-[#1b1c1c]"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#ba0036]" />
                      <span>{t("signIn", currentLanguage)}</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView("signup");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-[#ba0036] text-white text-xs font-bold"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{t("signUp", currentLanguage)}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
