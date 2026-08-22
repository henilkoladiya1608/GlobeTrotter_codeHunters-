import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { t } from "../../lib/i18n";
import { X, Share2, Copy, Check, Mail, MessageCircle, Link, Send } from "lucide-react";

export const ShareTripModal: React.FC = () => {
  const {
    isShareModalOpen,
    setIsShareModalOpen,
    selectedTrip,
    currentLanguage,
    showToast,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  if (!isShareModalOpen || !selectedTrip) return null;

  const tripShareUrl = `${window.location.origin}/trips/${selectedTrip.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(tripShareUrl);
    setCopied(true);
    showToast("Trip itinerary link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    showToast(`Itinerary invite sent to ${inviteEmail}!`);
    setInviteEmail("");
    setIsShareModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#DDDDDD] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#efeded] flex items-center justify-between bg-[#f5f3f3]">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#ba0036]" />
            <h3 className="text-base font-bold text-[#1b1c1c]">
              Share Trip Itinerary
            </h3>
          </div>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="p-1.5 text-[#5f5e5e] hover:text-[#1b1c1c] rounded-full hover:bg-[#efeded] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <h4 className="text-xs font-bold text-[#1b1c1c]">{selectedTrip.title}</h4>
            <p className="text-xs text-[#5f5e5e] mt-0.5">
              {selectedTrip.destination}, India • {selectedTrip.durationDays} Days
            </p>
          </div>

          {/* Direct Link Copy */}
          <div>
            <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
              Public Trip Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={tripShareUrl}
                className="flex-1 px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] outline-hidden select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-full bg-[#ba0036] hover:bg-[#9e002e] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Invite Co-Travelers via Email */}
          <form onSubmit={handleSendInvite} className="space-y-2 border-t border-[#efeded] pt-4">
            <label className="block text-xs font-semibold text-[#1b1c1c]">
              Invite Co-Travelers via Email
            </label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="companion@gmail.com"
                className="flex-1 px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#1b1c1c] hover:bg-black text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Invite</span>
              </button>
            </div>
          </form>

          {/* Social Quick Share */}
          <div className="pt-2">
            <span className="block text-[11px] font-semibold text-[#5f5e5e] uppercase tracking-wider mb-2">
              Quick Share
            </span>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out our trip itinerary for ${selectedTrip.destination}, India: ${tripShareUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-full border border-[#DDDDDD] hover:bg-[#f5f3f3] flex items-center justify-center gap-2 text-xs font-semibold text-[#1b1c1c] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(
                  `India Travel Itinerary: ${selectedTrip.title}`
                )}&body=${encodeURIComponent(
                  `Hi,\n\nHere is our upcoming travel plan for ${selectedTrip.destination}, India:\n${tripShareUrl}\n\nBudget in INR: ₹${selectedTrip.budgetINR}\nDuration: ${selectedTrip.durationDays} Days`
                )}`}
                className="px-3.5 py-2 rounded-full border border-[#DDDDDD] hover:bg-[#f5f3f3] flex items-center justify-center gap-2 text-xs font-semibold text-[#1b1c1c] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#5f5e5e]" />
                <span>Email App</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
