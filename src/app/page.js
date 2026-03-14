"use client";

import { useState, useEffect } from "react";

export default function AICOOApp() {
  // ==========================================
  // AUTH STATE
  // ==========================================
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [userName, setUserName] = useState("");

  // ==========================================
  // FEATURE STATES
  // ==========================================
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const [isPodcastLoading, setIsPodcastLoading] = useState(false);
  const [podcastScript, setPodcastScript] = useState("");
  const [podcastAudio, setPodcastAudio] = useState("");

  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [answerScript, setAnswerScript] = useState("");
  const [answerAudio, setAnswerAudio] = useState("");
  const [mathData, setMathData] = useState("");
  const [showMath, setShowMath] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [alertScript, setAlertScript] = useState("");
  const [alertAudio, setAlertAudio] = useState("");

  const [postgresUrl, setPostgresUrl] = useState("");

  // ==========================================
  // KPI COUNTERS
  // ==========================================
  const [queriesCount, setQueriesCount] = useState(0);
  const [podcastCount, setPodcastCount] = useState(0);
  const [riskScans, setRiskScans] = useState(0);

  // ==========================================
  // UI STATE
  // ==========================================
  const [currentTime, setCurrentTime] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit"
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => { clearInterval(interval); window.removeEventListener("scroll", handleScroll); };
  }, []);

  // ==========================================
  // AUTH HANDLER
  // ==========================================
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUser === "admin" && loginPass === "admin123") {
      setIsLoggedIn(true);
      setUserName("Admin");
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Try admin / admin123");
    }
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setLoginUser("");
    setLoginPass("");
    setLoginError("");
  };

  // ==========================================
  // API HANDLERS
  // ==========================================
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploadStatus("Uploading to Snowflake...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:8000/upload-file", { method: "POST", body: formData });
      const data = await res.json();
      setUploadStatus(data.message || data.error);
    } catch (err) {
      setUploadStatus("Upload failed. Is the backend running?");
    }
  };

  const handlePostgresSync = async () => {
    if (!postgresUrl) return;
    setUploadStatus("Syncing with PostgreSQL...");
    try {
      const res = await fetch("http://localhost:8000/sync-postgres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ db_url: postgresUrl }),
      });
      const data = await res.json();
      setUploadStatus(data.message || data.error);
    } catch (e) {
      setUploadStatus("PostgreSQL sync failed.");
    }
  };

  const handleGeneratePodcast = async () => {
    setIsPodcastLoading(true);
    try {
      const res = await fetch("http://localhost:8000/generate-podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extra_context: "" }),
      });
      const data = await res.json();
      setPodcastScript(data.script);
      setPodcastAudio("http://localhost:8000/play-podcast?t=" + Date.now());
      setPodcastCount((c) => c + 1);
    } finally {
      setIsPodcastLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question) return;
    setIsAsking(true);
    setShowMath(false);
    try {
      const res = await fetch("http://localhost:8000/ask-coo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswerScript(data.answer);
      setMathData(data.math_used);
      setAnswerAudio("http://localhost:8000/play-answer?t=" + Date.now());
      setQueriesCount((c) => c + 1);
    } finally {
      setIsAsking(false);
    }
  };

  const handleRiskRadar = async () => {
    setIsScanning(true);
    setAlertScript("");
    setAlertAudio("");
    try {
      const res = await fetch("http://localhost:8000/risk-radar", { method: "POST" });
      const data = await res.json();
      setAlertScript(data.alert_script);
      setAlertAudio("http://localhost:8000/play-alert?t=" + Date.now());
      setRiskScans((c) => c + 1);
    } finally {
      setIsScanning(false);
    }
  };

  // ==========================================
  // LOGIN SCREEN
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="login-bg min-h-screen flex items-center justify-center p-4">
        <div className="animate-fade-in w-full max-w-md">
          {/* Brand */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 mb-6 shadow-lg shadow-emerald-500/20">
              <span className="text-3xl">🧠</span>
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-2">AI COO</h1>
            <p className="text-slate-400 text-sm">Enterprise Intelligence Engine</p>
          </div>

          {/* Login Card */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold text-white mb-1">Welcome back</h2>
            <p className="text-slate-400 text-sm mb-6">Sign in to access your command center</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
                <input
                  type="text"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  autoComplete="current-password"
                />
              </div>

              {loginError && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.98]"
              >
                Sign In
              </button>
            </form>

            <p className="text-center text-slate-500 text-xs mt-6">
              Default credentials: admin / admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[var(--background)]">

      {/* ===== NAVBAR ===== */}
      <nav className={`navbar-glass fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg shadow-black/20" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <span className="text-sm">🧠</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">AI COO</span>
            <span className="hidden sm:inline-block text-xs text-slate-500 border-l border-slate-700 pl-3 ml-1">Enterprise Intelligence</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: "Dashboard", href: "#dashboard" },
              { label: "Data Sync", href: "#data-sync" },
              { label: "Briefing", href: "#briefing" },
              { label: "War Room", href: "#war-room" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleRiskRadar}
              disabled={isScanning}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all disabled:opacity-50"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              {isScanning ? "Scanning..." : "Risk Radar"}
            </button>

            <div className="flex items-center gap-3 border-l border-slate-700/50 pl-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                {userName.charAt(0)}
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">

        {/* ===== HERO ===== */}
        <section id="dashboard" className="mb-12 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-slate-400 text-sm mb-1">{currentTime}</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {userName}
              </h1>
              <p className="text-slate-400 mt-1">Your enterprise intelligence dashboard is ready.</p>
            </div>
            <button
              onClick={handleRiskRadar}
              disabled={isScanning}
              className="sm:hidden flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all disabled:opacity-50"
            >
              {isScanning ? "Scanning..." : "🚨 Run Risk Radar"}
            </button>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
            {[
              { label: "Active Data Sources", value: "2", icon: "📊", accent: "emerald", sub: "Snowflake + Postgres" },
              { label: "AI Queries", value: queriesCount, icon: "⚡", accent: "cyan", sub: "War Room Sessions" },
              { label: "Podcast Episodes", value: podcastCount, icon: "🎙️", accent: "blue", sub: "Generated Briefings" },
              { label: "Risk Scans", value: riskScans, icon: "🛡️", accent: "red", sub: "Threat Analyses" },
            ].map((kpi) => (
              <div key={kpi.label} className={`glass-card kpi-card ${kpi.accent} p-5 animate-slide-up`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{kpi.icon}</span>
                  <span className="text-3xl font-bold text-white">{kpi.value}</span>
                </div>
                <p className="text-sm font-medium text-slate-300">{kpi.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{kpi.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== RISK ALERT (conditional) ===== */}
        {alertScript && (
          <section className="mb-8 animate-slide-up">
            <div className="glass-card p-6 border-red-500/30 animate-glow-pulse" style={{ borderColor: "rgba(239, 68, 68, 0.3)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <span className="text-xl">⚠️</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-red-400">CRITICAL SYSTEM ALERT</h2>
                  <p className="text-xs text-red-300/60">Predictive Risk Radar &mdash; Auto-generated threat analysis</p>
                </div>
              </div>
              {alertAudio && (
                <audio controls autoPlay className="w-full mb-4">
                  <source src={alertAudio} type="audio/mpeg" />
                </audio>
              )}
              <p className="text-red-200/80 text-sm leading-relaxed font-mono bg-red-950/30 rounded-lg p-4 border border-red-500/10">
                {alertScript}
              </p>
            </div>
          </section>
        )}

        <div className="section-divider mb-8"></div>

        {/* ===== DATA SYNC ===== */}
        <section id="data-sync" className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">
              <span className="text-lg">🗄️</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Universal Data Sync</h2>
              <p className="text-xs text-slate-500">Import data from local files or live databases</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* File Upload Card */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-1">Local File Upload</h3>
              <p className="text-xs text-slate-500 mb-4">Supports .csv and .json formats</p>
              <form onSubmit={handleFileUpload} className="space-y-3">
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  className="block w-full text-sm text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-500/15 file:text-indigo-300 hover:file:bg-indigo-500/25 file:cursor-pointer file:transition-all"
                />
                <button
                  type="submit"
                  disabled={!file}
                  className="w-full py-2.5 text-sm font-semibold bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Upload to Snowflake
                </button>
              </form>
            </div>

            {/* Postgres Sync Card */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-1">PostgreSQL Sync</h3>
              <p className="text-xs text-slate-500 mb-4">Connect a live database for real-time sync</p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={postgresUrl}
                  onChange={(e) => setPostgresUrl(e.target.value)}
                  placeholder="postgresql://user:pass@host:5432/db"
                  className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
                />
                <button
                  onClick={handlePostgresSync}
                  disabled={!postgresUrl}
                  className="w-full py-2.5 text-sm font-semibold bg-violet-600/80 hover:bg-violet-600 text-white rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Sync Database
                </button>
              </div>
            </div>
          </div>

          {uploadStatus && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-emerald-400 text-sm font-mono">{uploadStatus}</p>
            </div>
          )}
        </section>

        <div className="section-divider mb-8"></div>

        {/* ===== MORNING BRIEFING ===== */}
        <section id="briefing" className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <span className="text-lg">🎙️</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Morning Briefing</h2>
              <p className="text-xs text-slate-500">AI-powered executive podcast from live Snowflake data</p>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-300">Generate a professional audio briefing from your latest data.</p>
                <p className="text-xs text-slate-500 mt-1">Powered by Gemini AI + ElevenLabs Voice</p>
              </div>
              <button
                onClick={handleGeneratePodcast}
                disabled={isPodcastLoading}
                className="px-6 py-3 text-sm font-semibold bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                {isPodcastLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Generating...
                  </>
                ) : "Generate Podcast"}
              </button>
            </div>

            {podcastScript && (
              <div className="pt-5 border-t border-slate-700/50 animate-fade-in">
                {podcastAudio && (
                  <audio controls autoPlay className="w-full mb-4">
                    <source src={podcastAudio} type="audio/mpeg" />
                  </audio>
                )}
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
                  <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Transcript</p>
                  <p className="text-slate-300 text-sm leading-relaxed italic">&ldquo;{podcastScript}&rdquo;</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="section-divider mb-8"></div>

        {/* ===== WAR ROOM ===== */}
        <section id="war-room" className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <span className="text-lg">⚡</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Live War Room</h2>
              <p className="text-xs text-slate-500">Ask your AI-COO anything about your live enterprise data</p>
            </div>
          </div>

          <div className="glass-card p-6">
            {/* Input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Which region has the most support tickets?"
                className="flex-1 px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
              />
              <button
                onClick={handleAskQuestion}
                disabled={isAsking || !question}
                className="px-6 py-3 text-sm font-semibold bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-xl transition-all disabled:opacity-30 shrink-0 flex items-center gap-2"
              >
                {isAsking ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Thinking...
                  </>
                ) : "Ask AI"}
              </button>
            </div>

            {/* Answer */}
            {answerScript && (
              <div className="mt-6 pt-6 border-t border-slate-700/50 animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-sm">🧠</span>
                  </div>
                  <p className="text-sm font-semibold text-emerald-400">AI-COO Response</p>
                </div>

                {answerAudio && (
                  <audio controls autoPlay className="w-full mb-4">
                    <source src={answerAudio} type="audio/mpeg" />
                  </audio>
                )}

                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 mb-4">
                  <p className="text-slate-300 text-sm leading-relaxed">{answerScript}</p>
                </div>

                {/* Audit Trail */}
                <button
                  onClick={() => setShowMath(!showMath)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors group"
                >
                  <svg className={`w-3.5 h-3.5 transition-transform ${showMath ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  {showMath ? "Hide Data Lineage" : "Show me the Math"}
                </button>

                {showMath && (
                  <div className="mt-3 bg-slate-950 rounded-xl p-4 border border-slate-700/30 font-mono text-xs animate-fade-in overflow-x-auto">
                    <p className="text-slate-600 mb-2">// Data queried from Snowflake COMPANY_SALES table:</p>
                    <pre className="text-cyan-300 whitespace-pre-wrap">{mathData}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <div className="section-divider mb-8"></div>

        {/* ===== FOOTER ===== */}
        <footer className="text-center py-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <span className="text-xs">🧠</span>
            </div>
            <span className="text-sm font-bold text-white">AI COO</span>
          </div>
          <p className="text-xs text-slate-500">
            Powered by Gemini AI &middot; Snowflake &middot; ElevenLabs &middot; Next.js
          </p>
          <p className="text-xs text-slate-600 mt-1">
            &copy; {new Date().getFullYear()} AI COO. Enterprise Intelligence Engine.
          </p>
        </footer>

      </main>
    </div>
  );
}