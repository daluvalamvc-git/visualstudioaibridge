import React, { useState } from "react";
import { UserSession, AIChannel } from "../types";
import { AI_CHANNELS, getChannelById } from "../utils/aiChannels";
import { 
  Sparkles, Key, Lock, User, Eye, EyeOff, CheckCircle2, 
  ExternalLink, ArrowRight, ShieldCheck, Cpu, Zap, Radio, 
  Terminal, Layers, Globe, Server, Info, HelpCircle
} from "lucide-react";

interface Props {
  onSignIn: (session: UserSession) => void;
  currentSession?: UserSession | null;
}

export default function SignInPage({ onSignIn, currentSession }: Props) {
  const [username, setUsername] = useState(currentSession?.username || "daluvalanokia@gmail.com");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState<string>(currentSession?.selectedChannel.id || "aistudio");
  const [apiKey, setApiKey] = useState(currentSession?.apiKey || "");
  const [customEndpoint, setCustomEndpoint] = useState(currentSession?.customEndpoint || "");
  const [rememberMe, setRememberMe] = useState(currentSession?.rememberMe ?? true);
  const [authTab, setAuthTab] = useState<"signin" | "register">("signin");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedChannel = getChannelById(selectedChannelId);

  // Auto update model when channel changes if model not explicitly set
  const activeModel = selectedModel && selectedChannel.availableModels.includes(selectedModel)
    ? selectedModel 
    : selectedChannel.defaultModel;

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannelId(channelId);
    const channel = getChannelById(channelId);
    setSelectedModel(channel.defaultModel);
    setErrorMsg(null);
    if (channel.endpointUrl) {
      setCustomEndpoint(channel.endpointUrl);
    }
  };

  const handleQuickDemoFill = (channelId: string = "aistudio") => {
    setUsername("daluvalanokia@gmail.com");
    setPassword("DemoDeveloper2026!");
    handleChannelSelect(channelId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg("Please enter a valid username or email.");
      return;
    }
    if (!password.trim()) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    // Simulate authenticating session and connecting AI Channel
    setTimeout(() => {
      setIsLoading(false);
      const session: UserSession = {
        username: username.trim(),
        email: username.includes("@") ? username.trim() : `${username.trim()}@developer.io`,
        signedInAt: new Date(),
        selectedChannel: {
          ...selectedChannel,
          defaultModel: activeModel
        },
        credits: currentSession?.credits || {
          totalCredits: 1000,
          usedCredits: 160,
          remainingCredits: 840,
          planName: selectedChannel.isFreeTier ? "Developer Free Tier" : "Pro Enterprise Tier",
          tokensUsedToday: 14280,
          requestsLimitPerDay: 500,
          requestsUsedToday: 32,
          costPerPrompt: 10
        },
        apiKey: apiKey.trim() || undefined,
        customEndpoint: customEndpoint.trim() || selectedChannel.endpointUrl,
        rememberMe
      };
      onSignIn(session);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans select-none overflow-x-hidden relative">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Navbar */}
      <header className="border-b border-gray-900 bg-gray-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg border border-indigo-500">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              visualstudioaibridge
              <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-900 px-2 py-0.5 rounded">
                Multi-Channel Gateway
              </span>
            </h1>
            <p className="text-xs text-gray-400">Connect Google AI Studio, Base44, Replit, Vercel, Lovable &amp; Free API Channels</p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-3 text-xs text-gray-400 font-medium">
          <span className="flex items-center space-x-1 bg-gray-900 border border-gray-800 px-3 py-1 rounded-full text-indigo-300">
            <Radio className="w-3.5 h-3.5 text-green-400 animate-pulse" />
            <span>11 AI Provider Channels Active</span>
          </span>
          <a 
            href="#channels-grid" 
            className="hover:text-indigo-400 transition flex items-center space-x-1"
          >
            <span>View All Channels</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* Main Form & Selection Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 items-start">
        
        {/* Left Column: Sign-In Form & Channel Switcher */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>

            {/* Form Title & Auth Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-400" />
                  Sign In to AI Chatbot
                </h2>
                <p className="text-xs text-gray-400 mt-1">Authenticate your developer account and select your active AI provider channel.</p>
              </div>

              {/* Sign In vs Register Toggle */}
              <div className="bg-gray-950 p-1 rounded-xl border border-gray-800 flex items-center self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setAuthTab("signin")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    authTab === "signin"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab("register")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    authTab === "register"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  New Account
                </button>
              </div>
            </div>

            {/* Quick Demo Shortcut Banner */}
            <div className="bg-indigo-950/40 border border-indigo-900/80 rounded-xl p-3 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2 text-indigo-200">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Quick Start: Connect using default developer credentials and Google AI Studio</span>
              </div>
              <button
                type="button"
                onClick={() => handleQuickDemoFill("aistudio")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-lg transition shrink-0 shadow"
              >
                Auto-Fill Demo
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-950/50 border border-red-900 text-red-200 p-3 rounded-xl text-xs">
                {errorMsg}
              </div>
            )}

            {/* Actual Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Input */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center justify-between">
                  <span>Username or Email Address</span>
                  <span className="text-[10px] text-gray-500 font-mono">e.g., daluvalanokia@gmail.com</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="enter your username or email"
                    className="w-full bg-gray-950 text-gray-100 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center justify-between">
                  <span>Account Password</span>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Demo Mode: Password reset is not required for testing!"); }} className="text-[10px] text-indigo-400 hover:underline">
                    Forgot Password?
                  </a>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-gray-950 text-gray-100 border border-gray-800 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* AI Supporting Channels Dropdown */}
              <div className="space-y-2 pt-2 border-t border-gray-800/80">
                <label className="block text-xs font-semibold text-indigo-300 tracking-wide uppercase flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-indigo-400" />
                    AI Supporting Channel Integration
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 bg-gray-950 px-2 py-0.5 rounded border border-gray-800">
                    Dropdown Selection
                  </span>
                </label>

                <div className="relative">
                  <select
                    value={selectedChannelId}
                    onChange={(e) => handleChannelSelect(e.target.value)}
                    className="w-full bg-gray-950 text-white font-medium border border-indigo-900/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer appearance-none"
                  >
                    <optgroup label="Recommended Cloud & AI Builders">
                      <option value="aistudio">✨ Google AI Studio (Gemini 3.5 / 2.5) — Recommended Free Tier</option>
                      <option value="base44">🚀 Base44 AI Engine (App Generator & C# Agent)</option>
                      <option value="replit">⚡ Replit AI Agent & Workspace Channel</option>
                      <option value="vercel">▲ Vercel AI SDK & v0 Component Engine</option>
                      <option value="lovable">💖 Lovable AI Software Engineer</option>
                    </optgroup>
                    <optgroup label="Top Free API Providers & Open Models">
                      <option value="groq">⚡ Groq Llama 3.3 (Ultra-Fast 800 tok/s Free API)</option>
                      <option value="openrouter">🌐 OpenRouter (DeepSeek R1 & Qwen Free Hub)</option>
                      <option value="huggingface">🤗 Hugging Face Serverless Inference API</option>
                      <option value="together">🤝 Together AI Open Models Channel</option>
                      <option value="mistral">🌪️ Mistral AI (Codestral Free Tier)</option>
                    </optgroup>
                    <optgroup label="Self-Hosted / Local Host">
                      <option value="ollama">💻 Ollama / Local AI Host (100% Offline & Private)</option>
                    </optgroup>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-indigo-400">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Model Choice Dropdown for Channel */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center justify-between">
                  <span>Selected Provider Model</span>
                  <span className="text-[10px] font-mono text-indigo-400">{selectedChannel.category}</span>
                </label>
                <select
                  value={activeModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-gray-950 text-gray-200 border border-gray-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 transition font-mono"
                >
                  {selectedChannel.availableModels.map((m) => (
                    <option key={m} value={m}>
                      {m} {m === selectedChannel.defaultModel ? "(Default)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional Custom API Key or Custom Endpoint Field */}
              {selectedChannel.requiresApiKey ? (
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center justify-between">
                    <span>{selectedChannel.name} API Key (Optional)</span>
                    <a
                      href={selectedChannel.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-indigo-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Get Free API Key</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Key className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={`Paste your ${selectedChannel.name} API key or leave blank for default proxy`}
                      className="w-full bg-gray-950 text-gray-100 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Leave empty to run using standard developer sandbox proxy mode.
                  </p>
                </div>
              ) : selectedChannel.id === "ollama" ? (
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Local Host Endpoint URL</label>
                  <input
                    type="text"
                    value={customEndpoint}
                    onChange={(e) => setCustomEndpoint(e.target.value)}
                    placeholder="http://localhost:11434"
                    className="w-full bg-gray-950 text-gray-100 border border-gray-800 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-teal-400 mt-1">
                    Connects directly to your local Ollama server running on your machine.
                  </p>
                </div>
              ) : (
                <div className="bg-indigo-950/30 border border-indigo-900/60 rounded-xl p-3 text-xs text-indigo-200 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Google AI Studio is built directly into server-side GenAI proxy. No API key needed to test immediately!
                  </span>
                </div>
              )}

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer text-xs text-gray-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-gray-950 border-gray-800 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Remember my user session &amp; default AI channel</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-3.5 px-6 rounded-xl transition shadow-xl hover:shadow-indigo-500/20 flex items-center justify-center space-x-2 text-sm border border-indigo-500/50"
              >
                {isLoading ? (
                  <span>Connecting to {selectedChannel.name}...</span>
                ) : (
                  <>
                    <span>Sign In &amp; Launch Chatbot Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Selected AI Channel Preview Card & Features */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-indigo-950 rounded-xl flex items-center justify-center border border-indigo-800">
                  <Globe className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{selectedChannel.name}</h3>
                  <p className="text-xs text-gray-400">{selectedChannel.provider}</p>
                </div>
              </div>
              <span className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border ${selectedChannel.badgeColor}`}>
                {selectedChannel.badge}
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {selectedChannel.description}
            </p>

            {/* Key capabilities list */}
            <div className="space-y-2 pt-2">
              <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Channel Capabilities</h4>
              <div className="grid grid-cols-1 gap-2">
                {selectedChannel.features.map((feat, idx) => (
                  <div key={idx} className="bg-gray-950 border border-gray-800 rounded-lg p-2.5 flex items-center space-x-2 text-xs text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Model & Target IDE Bridge */}
            <div className="bg-indigo-950/40 border border-indigo-900 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs text-indigo-200">
                <span className="font-semibold">Visual Studio C# Extension Routing</span>
                <span className="font-mono text-[10px] text-indigo-400">VS 2026 Ready</span>
              </div>
              <p className="text-[11px] text-gray-300 leading-normal">
                Prompts sent from the C# WPF tool window simulator will be securely dispatched to <strong className="text-white">{selectedChannel.name}</strong> running <code className="bg-gray-950 px-1.5 py-0.5 rounded text-indigo-300 font-mono">{activeModel}</code>.
              </p>
            </div>
          </div>

          {/* Quick Selection Shortcuts Box */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Quick Select Popular AI Providers:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {["aistudio", "base44", "groq", "replit", "vercel", "lovable"].map((id) => {
                const ch = getChannelById(id);
                return (
                  <button
                    key={id}
                    onClick={() => handleChannelSelect(id)}
                    className={`p-2 rounded-xl text-left border transition flex items-center justify-between ${
                      selectedChannelId === id
                        ? "bg-indigo-950 border-indigo-600 text-white font-semibold"
                        : "bg-gray-950 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
                    }`}
                  >
                    <span className="truncate">{ch.name}</span>
                    {selectedChannelId === id && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Complete Interactive Channels Grid Gallery */}
      <section className="bg-gray-900/90 border-t border-gray-800 py-10 px-6 mt-8 z-10" id="channels-grid">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                All Supported AI Channels &amp; Free API Integrations
              </h3>
              <p className="text-xs text-gray-400">Click any provider below to select it in your sign-in configuration.</p>
            </div>
            <span className="text-xs text-gray-400 font-mono bg-gray-950 px-3 py-1 rounded-full border border-gray-800 self-start md:self-auto">
              11 Supporting Providers
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AI_CHANNELS.map((channel) => (
              <div
                key={channel.id}
                onClick={() => handleChannelSelect(channel.id)}
                className={`bg-gray-950 border rounded-xl p-4 space-y-3 cursor-pointer transition group hover:border-indigo-500 relative ${
                  selectedChannelId === channel.id
                    ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-xl"
                    : "border-gray-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-100 group-hover:text-indigo-300 transition">
                    {channel.name}
                  </h4>
                  <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded border ${channel.badgeColor}`}>
                    {channel.badge}
                  </span>
                </div>

                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {channel.description}
                </p>

                <div className="pt-2 border-t border-gray-900 flex items-center justify-between text-[10px] text-gray-500">
                  <span className="font-mono text-indigo-400">{channel.defaultModel}</span>
                  <span className="group-hover:text-white transition flex items-center space-x-1">
                    <span>Select Channel</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-gray-950 py-6 px-8 text-center text-xs text-gray-500 z-10">
        <p>© 2026 Visual Studio AI Chatbot Integrator. Supports Google AI Studio, Base44, Replit, Vercel, Lovable, Groq, OpenRouter &amp; Local AI.</p>
      </footer>
    </div>
  );
}
