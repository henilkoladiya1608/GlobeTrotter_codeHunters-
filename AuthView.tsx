import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { t } from "../lib/i18n";
import {
  Compass,
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Check,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Heart,
  Globe2,
  Palmtree,
  Mountain,
  Utensils,
  Camera,
} from "lucide-react";

interface AuthViewProps {
  initialMode?: "login" | "signup";
}

const INDIAN_CITIES = [
  "Bengaluru, Karnataka",
  "Mumbai, Maharashtra",
  "New Delhi, NCR",
  "Jaipur, Rajasthan",
  "Kochi, Kerala",
  "Kolkata, West Bengal",
  "Chennai, Tamil Nadu",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  "Chandigarh, Punjab",
  "Srinagar, Jammu & Kashmir",
  "Guwahati, Assam",
  "Bhubaneswar, Odisha",
];

const TRAVEL_INTERESTS_OPTIONS = [
  { id: "Heritage & Forts", icon: "🏰" },
  { id: "Himalayan Treks", icon: "🏔️" },
  { id: "Spiritual & Ghats", icon: "🛕" },
  { id: "Coastal & Backwaters", icon: "🌴" },
  { id: "Culinary Trails", icon: "🍛" },
  { id: "Wildlife & Safaris", icon: "🐅" },
];

const DEMO_ACCOUNTS = [
  {
    name: "Alex Sharma",
    email: "alex.traveler@gmail.com",
    city: "Bengaluru, Karnataka",
    role: "Heritage Explorer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Priya Nair",
    email: "priya.backpacker@gmail.com",
    city: "Kochi, Kerala",
    role: "Backpacker & Foodie",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Rahul Mehta",
    email: "rahul.treks@gmail.com",
    city: "Mumbai, Maharashtra",
    role: "Himalayan Trekker",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
];

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = "login" }) => {
  const { currentLanguage, login, updateUser, showToast, triggerConfetti, setCurrentView } = useApp();
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<"login" | "signup">(initialMode);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  
  // Form fields
  const [name, setName] = useState("Alex Sharma");
  const [email, setEmail] = useState("alex.traveler@gmail.com");
  const [phone, setPhone] = useState("9876543210");
  const [password, setPassword] = useState("IndiaTravel@2026");
  const [confirmPassword, setConfirmPassword] = useState("IndiaTravel@2026");
  const [homeCity, setHomeCity] = useState("Bengaluru, Karnataka");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Heritage & Forts",
    "Culinary Trails",
  ]);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setAuthMode(initialMode);
  }, [initialMode]);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { score: 0, text: "", color: "" };
    if (pwd.length < 6) return { score: 1, text: "Weak", color: "bg-red-500" };
    if (pwd.length < 9) return { score: 2, text: "Moderate", color: "bg-amber-500" };
    return { score: 3, text: "Strong", color: "bg-emerald-500" };
  };

  const pwdStrength = getPasswordStrength(password);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    setIsOtpSent(true);
    setErrorMessage(null);
    showToast(`OTP 5492 sent to +91 ${phone}`);
    setOtpCode("5492");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (authMode === "signup") {
      if (!name.trim()) {
        setErrorMessage("Please enter your full name");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setErrorMessage("Please enter a valid email address");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        return;
      }
      if (!agreeTerms) {
        setErrorMessage("Please agree to the Terms of Service & Privacy Policy");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        login(email, name);
        updateUser({
          name,
          email,
          homeCity,
          travelInterests: selectedInterests,
        });
        triggerConfetti();
        showToast(`Account created! Welcome to Globetrotter India, ${name}!`);
      }, 700);
    } else {
      // Login mode
      if (loginMethod === "phone") {
        if (!phone || phone.length < 10) {
          setErrorMessage("Please enter a valid 10-digit Indian mobile number");
          return;
        }
        if (isOtpSent && otpCode !== "5492") {
          setErrorMessage("Invalid OTP code. Please enter 5492");
          return;
        }
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          login(`traveler.${phone}@globetrotter.in`, `Traveler (+91 ${phone})`);
          showToast("Signed in successfully via Mobile OTP!");
        }, 700);
      } else {
        if (!email.trim() || !email.includes("@")) {
          setErrorMessage("Please enter a valid email address");
          return;
        }
        if (!password) {
          setErrorMessage("Please enter your password");
          return;
        }

        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          login(email, name || email.split("@")[0]);
          showToast(`Welcome back, ${name || "Traveler"}!`);
        }, 600);
      }
    }
  };

  const handleDemoAccountLogin = (account: typeof DEMO_ACCOUNTS[0]) => {
    setName(account.name);
    setEmail(account.email);
    setHomeCity(account.city);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(account.email, account.name);
      updateUser({
        name: account.name,
        email: account.email,
        homeCity: account.city,
        avatarUrl: account.avatar,
      });
      showToast(`Logged in as ${account.name} (${account.role})`);
    }, 400);
  };

  const handleForgotPassword = () => {
    if (!email) {
      showToast("Please enter your email above to receive reset instructions");
      return;
    }
    showToast(`Password reset link sent to ${email}`);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-2 sm:px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-[#DDDDDD] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Indian Travel Imagery & Showcase (5 cols on lg) */}
        <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-8 bg-[#1b1c1c] text-white overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80"
            alt="Kashmir Valley"
            className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1c] via-[#1b1c1c]/70 to-[#1b1c1c]/30" />

          {/* Top Brand Logo */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ba0036] via-[#e21e4a] to-[#ff385c] flex items-center justify-center text-white shadow-md">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-white">Globetrotter</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#ffdada] text-[#ba0036]">
                    India
                  </span>
                </div>
                <p className="text-[11px] text-[#ffdada]/90 font-medium">
                  Official Travel Planner
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#ffdada]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>All 28 States &amp; 8 Union Territories</span>
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed">
                Smart itinerary generation, real-time INR budget tracking, and instant translations across 11 Indian languages.
              </p>
            </div>
          </div>

          {/* Center Features */}
          <div className="relative z-10 space-y-3 my-6">
            <div className="flex items-center gap-3 text-xs text-white/90">
              <div className="w-6 h-6 rounded-full bg-[#ba0036] flex items-center justify-center text-white shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Day-by-day train, cab &amp; flight timeline planner</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/90">
              <div className="w-6 h-6 rounded-full bg-[#ba0036] flex items-center justify-center text-white shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>UPI &amp; INR expense breakdown with safe daily limits</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/90">
              <div className="w-6 h-6 rounded-full bg-[#ba0036] flex items-center justify-center text-white shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Safar AI Travel Concierge powered by Gemini</span>
            </div>
          </div>

          {/* Bottom Quick Test Accounts */}
          <div className="relative z-10 space-y-2.5 pt-4 border-t border-white/10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-white/70">
              ⚡ 1-Click Instant Demo Profiles
            </span>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDemoAccountLogin(acc)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-all group"
                  title={`Login as ${acc.name}`}
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-6 h-6 rounded-full object-cover mb-1 border border-white/40"
                  />
                  <p className="text-[11px] font-bold text-white truncate group-hover:text-[#ffdada]">
                    {acc.name.split(" ")[0]}
                  </p>
                  <p className="text-[9px] text-white/60 truncate">{acc.role.split(" ")[0]}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Auth Form (7 cols on lg) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-5">
          {/* Header & Tabs */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1c1c]">
                  {authMode === "login" ? "Welcome Back" : "Create Travel Account"}
                </h1>
                <p className="text-xs text-[#5f5e5e] mt-1">
                  {authMode === "login"
                    ? "Sign in to access your Indian trips, saved places and budgets"
                    : "Join Globetrotter India and start planning your dream journey"}
                </p>
              </div>

              {/* View Switch Pill */}
              <div className="flex bg-[#f5f3f3] p-1 rounded-full border border-[#DDDDDD] shrink-0">
                <button
                  id="tab-login-btn"
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setErrorMessage(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    authMode === "login"
                      ? "bg-[#ba0036] text-white shadow-xs"
                      : "text-[#5f5e5e] hover:text-[#1b1c1c]"
                  }`}
                >
                  Sign In
                </button>
                <button
                  id="tab-register-btn"
                  type="button"
                  onClick={() => {
                    setAuthMode("signup");
                    setErrorMessage(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    authMode === "signup"
                      ? "bg-[#ba0036] text-white shadow-xs"
                      : "text-[#5f5e5e] hover:text-[#1b1c1c]"
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Social Sign-In (Google) */}
          <div className="space-y-2">
            <button
              id="google-signin-btn"
              type="button"
              onClick={() => handleDemoAccountLogin(DEMO_ACCOUNTS[0])}
              className="w-full py-2.5 px-4 rounded-full border border-[#DDDDDD] bg-white hover:bg-[#f5f3f3] text-xs font-bold text-[#1b1c1c] shadow-2xs transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{t("signInWithGoogle", currentLanguage)}</span>
            </button>

            <div className="relative flex items-center justify-center pt-2">
              <div className="border-t border-[#DDDDDD] w-full" />
              <span className="bg-white px-3 text-[11px] text-[#5f5e5e] uppercase font-semibold">
                Or with {authMode === "login" ? "credentials" : "new account"}
              </span>
            </div>
          </div>

          {/* Login Method Sub-Toggle (For Login Mode) */}
          {authMode === "login" && (
            <div className="flex items-center gap-2 p-1 bg-[#f5f3f3] rounded-xl border border-[#DDDDDD] text-xs">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("email");
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  loginMethod === "email"
                    ? "bg-white text-[#ba0036] shadow-2xs font-bold"
                    : "text-[#5f5e5e] hover:text-[#1b1c1c]"
                }`}
              >
                Email &amp; Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("phone");
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  loginMethod === "phone"
                    ? "bg-white text-[#ba0036] shadow-2xs font-bold"
                    : "text-[#5f5e5e] hover:text-[#1b1c1c]"
                }`}
              >
                Indian Mobile OTP (🇮🇳 +91)
              </button>
            </div>
          )}

          {/* Main Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* SIGN UP FIELDS */}
            {authMode === "signup" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-2.5 text-[#5f5e5e]" />
                      <input
                        id="register-fullname-input"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Sharma"
                        className="w-full pl-9 pr-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                      Home City in India
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-2.5 text-[#5f5e5e]" />
                      <select
                        value={homeCity}
                        onChange={(e) => setHomeCity(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                      >
                        {INDIAN_CITIES.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-2.5 text-[#5f5e5e]" />
                    <input
                      id="register-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-2.5 text-[#5f5e5e]" />
                      <input
                        id="register-password-input"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-9 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-[#5f5e5e] hover:text-[#1b1c1c]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <div className="flex-1 h-1 bg-[#DDDDDD] rounded-full overflow-hidden">
                          <div
                            className={`h-full ${pwdStrength.color}`}
                            style={{ width: `${(pwdStrength.score / 3) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-[#5f5e5e]">
                          {pwdStrength.text}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-2.5 text-[#5f5e5e]" />
                      <input
                        id="register-confirmpassword-input"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-9 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-[#5f5e5e] hover:text-[#1b1c1c]"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Travel Interests Tag Select */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#1b1c1c] mb-1.5">
                    Select Your Travel Interests
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TRAVEL_INTERESTS_OPTIONS.map((item) => {
                      const isSelected = selectedInterests.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleInterest(item.id)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1 ${
                            isSelected
                              ? "bg-[#ffdada] border-[#ba0036] text-[#ba0036] font-bold"
                              : "bg-white border-[#DDDDDD] text-[#5f5e5e] hover:border-[#ba0036]"
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span>{item.id}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    id="agree-terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#ba0036] focus:ring-[#ba0036]"
                  />
                  <label htmlFor="agree-terms" className="text-[11px] text-[#5f5e5e] leading-snug">
                    I agree to Globetrotter India's{" "}
                    <span className="text-[#ba0036] font-semibold cursor-pointer underline">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-[#ba0036] font-semibold cursor-pointer underline">
                      Privacy Policy
                    </span>
                    .
                  </label>
                </div>
              </>
            )}

            {/* SIGN IN (LOGIN) FIELDS */}
            {authMode === "login" && (
              <>
                {loginMethod === "email" ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-2.5 text-[#5f5e5e]" />
                        <input
                          id="login-email-input"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-9 pr-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-[#1b1c1c]">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-[11px] text-[#ba0036] hover:underline font-semibold"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-2.5 text-[#5f5e5e]" />
                        <input
                          id="login-password-input"
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-9 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-[#5f5e5e] hover:text-[#1b1c1c]"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Indian Phone Number Login */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                        Indian Mobile Number
                      </label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-2 bg-[#efeded] border border-[#DDDDDD] rounded-xl text-xs font-bold text-[#1b1c1c]">
                          <span>🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                          placeholder="9876543210"
                          className="flex-1 px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="px-4 py-2 bg-[#f5f3f3] hover:bg-[#efeded] border border-[#DDDDDD] text-[#ba0036] text-xs font-bold rounded-xl whitespace-nowrap transition-colors"
                        >
                          {isOtpSent ? "Resend OTP" : "Send OTP"}
                        </button>
                      </div>
                    </div>

                    {isOtpSent && (
                      <div className="space-y-1 animate-in fade-in duration-150">
                        <label className="block text-xs font-semibold text-[#1b1c1c]">
                          Enter 4-Digit OTP
                        </label>
                        <div className="relative">
                          <KeyRound className="w-4 h-4 absolute left-3.5 top-2.5 text-[#5f5e5e]" />
                          <input
                            type="text"
                            maxLength={4}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="Enter 5492"
                            className="w-full pl-9 pr-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden tracking-widest font-bold"
                          />
                        </div>
                        <p className="text-[10px] text-emerald-700 font-medium">
                          Demo OTP: <strong>5492</strong> (auto-filled)
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-[#5f5e5e] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-[#ba0036] focus:ring-[#ba0036]"
                    />
                    <span>Remember my session</span>
                  </label>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-[#ba0036] hover:bg-[#9e002e] text-white text-xs font-bold shadow-sm shadow-[#ba0036]/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>
                    {authMode === "signup"
                      ? "Create Globetrotter Account"
                      : "Sign In to Globetrotter"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Footer */}
          <div className="text-center pt-2 border-t border-[#efeded]">
            <p className="text-xs text-[#5f5e5e]">
              {authMode === "signup" ? (
                <>
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setErrorMessage(null);
                    }}
                    className="font-bold text-[#ba0036] hover:underline"
                  >
                    Sign In here
                  </button>
                </>
              ) : (
                <>
                  First time planning a trip in India?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("signup");
                      setErrorMessage(null);
                    }}
                    className="font-bold text-[#ba0036] hover:underline"
                  >
                    Create a Free Account
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
