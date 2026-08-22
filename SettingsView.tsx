import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { SUPPORTED_LANGUAGES, t, formatINR } from "../lib/i18n";
import { INDIAN_DESTINATIONS } from "../data/destinations";
import { LanguageCode } from "../types";
import {
  User,
  Settings as SettingsIcon,
  Globe,
  Bookmark,
  Bell,
  Check,
  MapPin,
  Mail,
  Shield,
  Save,
  Trash2,
  ExternalLink,
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const {
    user,
    updateUser,
    currentLanguage,
    setLanguage,
    savedDestinationIds,
    toggleSaveDestination,
    setSelectedDestinationDetail,
    showToast,
  } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [homeCity, setHomeCity] = useState(user.homeCity);
  const [bio, setBio] = useState(user.bio);
  const [emailNotifications, setEmailNotifications] = useState(user.emailNotifications);
  const [budgetAlerts, setBudgetAlerts] = useState(user.budgetAlerts);

  const savedDestinations = INDIAN_DESTINATIONS.filter((d) =>
    savedDestinationIds.includes(d.id)
  );

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      homeCity,
      bio,
      emailNotifications,
      budgetAlerts,
    });
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1c1c]">
          {t("settings", currentLanguage)} & Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#5f5e5e] mt-1">
          Manage your travel profile, Indian regional language preferences, and saved destinations
        </p>
      </div>

      {/* Public Profile Form */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#DDDDDD] shadow-ethos-card space-y-6">
        <div className="flex items-center gap-3 border-b border-[#efeded] pb-4">
          <div className="w-9 h-9 rounded-full bg-[#ffdada] flex items-center justify-center text-[#ba0036]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1b1c1c]">Personal Information</h2>
            <p className="text-xs text-[#5f5e5e]">Your profile details across Globetrotter India</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#ba0036]"
            />
            <div>
              <p className="text-xs font-semibold text-[#1b1c1c]">Profile Picture</p>
              <p className="text-[11px] text-[#5f5e5e]">Traveler Avatar</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                Home City & State in India
              </label>
              <input
                type="text"
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                placeholder="e.g. Mumbai, Maharashtra or New Delhi"
                className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">Travel Bio</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden resize-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#ba0036] hover:bg-[#9e002e] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t("saveChanges", currentLanguage)}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Regional Language & Currency Selector Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#DDDDDD] shadow-ethos-card space-y-5">
        <div className="flex items-center gap-3 border-b border-[#efeded] pb-4">
          <div className="w-9 h-9 rounded-full bg-[#ffdada] flex items-center justify-center text-[#ba0036]">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1b1c1c]">
              Indian Regional Language & Currency
            </h2>
            <p className="text-xs text-[#5f5e5e]">
              Localized display interface for 11 official Indian languages
            </p>
          </div>
        </div>

        {/* Currency Notice */}
        <div className="p-3.5 rounded-2xl bg-[#f5f3f3] border border-[#DDDDDD] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#1b1c1c]">{t("currency", currentLanguage)}:</span>
          <span className="text-xs font-bold px-3 py-1 bg-white border border-[#DDDDDD] rounded-full text-[#ba0036] shadow-2xs">
            {t("currencyLocked", currentLanguage)}
          </span>
        </div>

        {/* Language Grid */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#1b1c1c]">
            {t("displayLanguage", currentLanguage)}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-[#ba0036] bg-[#ffdada]/30 shadow-xs"
                      : "border-[#DDDDDD] bg-[#f5f3f3]/60 hover:bg-[#f5f3f3] hover:border-[#CCCCCC]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#1b1c1c]">
                      {lang.nativeName}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#ba0036]" />}
                  </div>
                  <div className="mt-1">
                    <span className="text-[11px] text-[#5f5e5e] font-medium block">
                      {lang.name}
                    </span>
                    <span className="text-[10px] text-[#888888] block">{lang.regionHint}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bookmarked / Saved Destinations in India */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#DDDDDD] shadow-ethos-card space-y-4">
        <div className="flex items-center justify-between border-b border-[#efeded] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#ffdada] flex items-center justify-center text-[#ba0036]">
              <Bookmark className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[#1b1c1c]">
              Saved Places ({savedDestinations.length})
            </h2>
          </div>
        </div>

        {savedDestinations.length === 0 ? (
          <p className="text-xs text-[#5f5e5e] py-4 text-center">No saved places yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedDestinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => setSelectedDestinationDetail(dest)}
                className="p-3.5 rounded-2xl border border-[#DDDDDD] hover:border-[#ba0036] flex items-center gap-3 cursor-pointer group transition-colors bg-white shadow-xs"
              >
                <img
                  src={dest.coverImage}
                  alt={dest.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#ba0036] font-semibold">{dest.state}</span>
                  <h4 className="text-xs font-bold text-[#1b1c1c] truncate group-hover:text-[#ba0036]">
                    {dest.name}
                  </h4>
                  <span className="text-[11px] text-[#5f5e5e] font-medium">
                    {formatINR(dest.avgDailyCostINR)}/day
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveDestination(dest.id);
                  }}
                  className="p-1.5 text-[#5f5e5e] hover:text-[#ba0036] transition-colors rounded-full"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
