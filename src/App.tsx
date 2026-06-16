import { useState, useEffect, useRef } from "react";
import { 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  TrendingUp, 
  Layers, 
  FileText, 
  Sliders, 
  ChevronRight, 
  X, 
  HelpCircle,
  BookOpen
} from "lucide-react";
import { PixelHero } from "@/components/ui/pixel-perfect-hero";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Typewriter } from "@/components/ui/typewriter";
import { Button } from "@/components/ui/button";
import VaporizeTextCycle, { Tag } from "@/components/ui/vapour-text-effect";

/* -----------------------------------------------------------------------------
 * TYPES & STATIC DATA FOR AGENTS
 * -------------------------------------------------------------------------- */

interface LogLine {
  text: string;
  type: 'comment' | 'keyword' | 'string' | 'default';
}

interface AgentData {
  name: string;
  fileName: string;
  badge: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  logs: LogLine[];
}

const AGENTS: Record<string, AgentData> = {
  auditor: {
    name: "Agent Ledger",
    fileName: "audit_agent.py",
    badge: "Continuous Auditor",
    title: "Continuous Ledger Auditor",
    description: "Runs continuous, millisecond-interval auditing on all sub-ledgers. Connects directly to ERP systems to detect micro-discrepancies, automate SaaS invoices reconciliation, and write mathematical compliance records on read-only databases.",
    metric: "99.98%",
    metricLabel: "Auto-Reconciliation Rate",
    logs: [
      { text: ">>> Initializing Agent Ledger v3.4.9...", type: "comment" },
      { text: ">>> Connecting to ERP databases & ledger stream...", type: "keyword" },
      { text: ">>> Listening for real-time transaction blocks...", type: "comment" },
      { text: "SYSTEM: Audit queue status: NORMAL. Listening...", type: "string" },
      { text: "[AUDIT RUN] Checking ledger entry Ref: TXN_89028 ($8,920.00)", type: "default" },
      { text: "STATUS: Validation check passed. Cryptographic hash matches receipt.", type: "string" },
      { text: "[AUDIT RUN] Checking ledger entry Ref: TXN_89029 ($12.50)", type: "default" },
      { text: "WARNING: Micro-discrepancy detected in SaaS expense. Discrepancy: $0.03.", type: "keyword" },
      { text: "ACTION: Scanning Stripe webhook logs for receipt confirmation...", type: "comment" },
      { text: "STATUS: Found Stripe API record match. Reconciling transaction...", type: "string" },
      { text: "SUCCESS: Ledger entry reconciled automatically. Difference cleared.", type: "string" },
      { text: ">>> Ledger State: 100% Verified. SEC Compliant. 0 discrepancies.", type: "string" }
    ]
  },
  treasurer: {
    name: "Agent Arbitrage",
    fileName: "treasury_agent.py",
    badge: "Yield & AP/AR",
    title: "Treasury Yield Allocator",
    description: "Monitors global yield opportunities across treasury bonds and cash equivalents. Automates smart yield transfers within secure multi-signature risk limitations and provides automatic AP/AR credit matching.",
    metric: "$14.5M",
    metricLabel: "Active Assets Managed",
    logs: [
      { text: ">>> Initializing Agent Arbitrage v1.1.2...", type: "comment" },
      { text: ">>> Fetching current market yield rates & vault allocations...", type: "keyword" },
      { text: "STATUS: Vault Balance: $14.50M. Yield Allocation: 85% Cash Reserves.", type: "string" },
      { text: "[CALCULATING YIELDS] Running arbitrage scenarios...", type: "default" },
      { text: "  - Option A: Treasury Bills (4.95% APY)", type: "comment" },
      { text: "  - Option B: Secure Stablecoin Reserve (5.32% APY)", type: "comment" },
      { text: "ANALYSIS: Moving $3.2M cash block to Option B yields +$11,840/mo.", type: "string" },
      { text: "LIMITS: Checking corporate risk rules. Maximum crypto limit: 25%. Currently: 14%.", type: "string" },
      { text: "ACTION: Initiating ledger transfer of $3.2M to yield vault...", type: "keyword" },
      { text: "M-SIG: Verification required. Sending notification for human approval...", type: "keyword" },
      { text: "M-SIG: Approved by Treasurer-in-Chief. Transfer executing...", type: "string" },
      { text: "SUCCESS: Vault funds rebalanced. New annualized projected yield: 5.18%.", type: "string" }
    ]
  },
  forecaster: {
    name: "Agent Forecast",
    fileName: "fpa_agent.py",
    badge: "Runway & FP&A",
    title: "Real-time FP&A Forecaster",
    description: "Simulates multi-variable financial forecasts instantly. Automatically maps cash runway changes under complex market scenarios, calculates run-rate parameters, and distributes reports to stakeholders.",
    metric: "< 1 Sec",
    metricLabel: "Scenario Calculations Speed",
    logs: [
      { text: ">>> Initializing Agent Forecast v2.0.4...", type: "comment" },
      { text: ">>> Importing live banking transaction metadata...", type: "keyword" },
      { text: "STATUS: Syncing bank logs: Plaid, Silicon Valley Bank, Chase...", type: "string" },
      { text: "STATUS: Q2 Cash Runway calculated: 26.4 months at current burn.", type: "string" },
      { text: "[RUNNING SCENARIOS] Triggering forecast simulations...", type: "default" },
      { text: "  - Scenario Alpha: Churn rises 15%, SaaS expansions halt.", type: "comment" },
      { text: "  - Scenario Beta: Hiring freezes, Marketing spends cut 20%.", type: "comment" },
      { text: "ALPHA OUTPUT: Runway drops to 21.2 months. Cash gap in March 2027.", type: "keyword" },
      { text: "BETA OUTPUT: Runway extends to 32.8 months. Profitability reached.", type: "string" },
      { text: "ACTION: Generating executive chart asset (SVG) & financial summary...", type: "keyword" },
      { text: "SUMMARY: Recommending immediate SaaS optimization. Savings: $40k/yr.", type: "string" },
      { text: ">>> Report generated and emailed to Board of Directors.", type: "string" }
    ]
  },
  tax: {
    name: "Agent Taxon",
    fileName: "tax_agent.js",
    badge: "Compliance & Filing",
    title: "Multi-Jurisdictional Tax Compliance",
    description: "Tracks multi-state and international tax law adjustments. Performs automated transaction classification for R&D tax credit claims, prepares tax returns drafts, and structures franchise filings ahead of deadlines.",
    metric: "100%",
    metricLabel: "Automated IRS Auditing Compliance",
    logs: [
      { text: ">>> Initializing Agent Taxon v0.8.2...", type: "comment" },
      { text: ">>> Scanning legal database for 2026 tax rate updates...", type: "keyword" },
      { text: "STATUS: 14 new corporate tax revisions detected in CA, NY, & DE.", type: "string" },
      { text: "[COMPLIANCE SCAN] Reviewing Q3 corporate payroll allocations...", type: "default" },
      { text: "CALCULATING: Section 163(j) interest expense limitations...", type: "comment" },
      { text: "CALCULATING: R&D tax credit tax qualifications...", type: "comment" },
      { text: "SUCCESS: Identified $48,200 eligible R&D credit from software costs.", type: "string" },
      { text: "ACTION: Preparing IRS Form 6765 draft files...", type: "keyword" },
      { text: "STATUS: Tax forms prepared. Tax liability matches general ledger.", type: "string" },
      { text: "REPORT: Estimated state franchise taxes: $1,250. Prepared DE filing.", type: "string" },
      { text: ">>> System state: 100% Tax Compliant. Filing queue locked for human signing.", type: "string" }
    ]
  }
};

const SECURITY_NODES: Record<string, { title: string; desc: string }> = {
  soc2: {
    title: "SOC 2 Type II Certified",
    desc: "Fully audited by AICPA-certified third parties. Our agents, databases, and operational frameworks adhere strictly to rigorous security, availability, and confidentiality protocols."
  },
  crypt: {
    title: "Cryptographic Ledger Records",
    desc: "Every transactional log, action authorization, and API state transformation is hashed and stored on a read-only immutable cryptographic ledger, making audit histories tamper-proof."
  },
  sig: {
    title: "Multi-Signature Rulesets",
    desc: "No agent can execute capital movement beyond predetermined limits alone. Large balances require multi-signature cryptographic tokens signed by human supervisors."
  },
  api: {
    title: "Bank-Grade Vault Encryption",
    desc: "Database reads and integrations with Plaid, Stripe, and banking APIs are protected under AES-256 envelope encryption. Financial data never leaks outside designated sandboxes."
  }
};

export default function App() {
  // Navigation & Interactive UI State
  const [activeTab, setActiveTab] = useState<string>("Overview");
  
  // Console Tab State & Typing Animation
  const [consoleAgent, setConsoleAgent] = useState<string>("auditor");
  const [typedLogs, setTypedLogs] = useState<LogLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  // ROI Calculator State
  const [revVal, setRevVal] = useState<number>(50); // Millions
  const [teamVal, setTeamVal] = useState<number>(8); // Headcount
  const [hoursSaved, setHoursSaved] = useState<number>(6988);
  const [savingsAmt, setSavingsAmt] = useState<number>(550188);

  // Security Trust Map State
  const [activeSecurityNode, setActiveSecurityNode] = useState<string>("soc2");

  // Content Modal / Drawer Overlay States (Satisfies "content on every link" requirement)
  const [activeModal, setActiveModal] = useState<"whitepaper" | "deploy" | "docs" | "contact" | "console" | null>(null);

  /* -----------------------------------------------------------------------------
   * 1. HOVER SPOTLIGHT GLOBAL LISTENER
   * -------------------------------------------------------------------------- */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll(".glass-panel");
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
        (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* -----------------------------------------------------------------------------
   * 2. TYPING TERMINAL SIMULATOR
   * -------------------------------------------------------------------------- */
  useEffect(() => {
    // Reset typing state on agent switch
    if (typingTimer.current) clearTimeout(typingTimer.current);
    setTypedLogs([]);
    setCurrentLineIndex(0);
    setCurrentCharIndex(0);
  }, [consoleAgent]);

  useEffect(() => {
    const activeData = AGENTS[consoleAgent];
    if (!activeData) return;

    if (currentLineIndex >= activeData.logs.length) {
      return;
    }

    const currentLine = activeData.logs[currentLineIndex];
    
    // If starting a new line, append a blank line element
    if (currentCharIndex === 0) {
      setTypedLogs(prev => [...prev, { text: "", type: currentLine.type }]);
    }

    typingTimer.current = setTimeout(() => {
      setTypedLogs(prev => {
        const next = [...prev];
        if (next[currentLineIndex]) {
          next[currentLineIndex] = {
            ...next[currentLineIndex],
            text: currentLine.text.substring(0, currentCharIndex + 1)
          };
        }
        return next;
      });

      if (currentCharIndex + 1 < currentLine.text.length) {
        setCurrentCharIndex(prev => prev + 1);
      } else {
        // Move to next line
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }
    }, 12 + Math.random() * 14); // Realistic variable delay

    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, [consoleAgent, currentLineIndex, currentCharIndex]);

  /* -----------------------------------------------------------------------------
   * 3. ROI CALCULATOR MATH & SVG PATH UPDATES
   * -------------------------------------------------------------------------- */
  useEffect(() => {
    // Math logic matching raw requirements
    const targetHours = Math.round(teamVal * 2080 * 0.42);
    const targetSavings = Math.round(targetHours * 68 + (revVal * 1500));

    // Smooth numerical updates
    setHoursSaved(targetHours);
    setSavingsAmt(targetSavings);
  }, [revVal, teamVal]);

  // Redraw SVG path based on savings amount
  const getSavingsPath = () => {
    const maxPossSavings = 2500000;
    const ratio = Math.min(savingsAmt / maxPossSavings, 1);
    
    const startX = 0;
    const startY = 80;
    const cp1x = 100;
    const cp1y = 80 - (ratio * 10);
    const cp2x = 220;
    const cp2y = 80 - (ratio * 40);
    const endX = 350;
    const endY = Math.max(10, 80 - (ratio * 70));

    return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
  };

  const activeAgentInfo = AGENTS[consoleAgent];

  return (
    <div className="relative min-h-screen bg-[#030508] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Background Ambient Glows */}
      <div className="ambient-glow top-[-100px] right-[10%] bg-gradient-to-r from-blue-600/20 to-transparent" />
      <div className="ambient-glow top-[600px] left-[-100px] bg-gradient-to-r from-emerald-600/20 to-transparent" />
      <div className="ambient-glow bottom-[800px] right-[-100px] bg-gradient-to-r from-amber-600/15 to-transparent" />

      {/* Floating Header Navbar */}
      <div className="navbar-container">
        <header className="navbar glass-panel">
          <div className="logo cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="28" height="28" rx="8" stroke="url(#nav-logo-grad)" strokeWidth="2"/>
              <path d="M9 16H23" stroke="url(#nav-logo-grad)" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M16 9V23" stroke="url(#nav-logo-grad)" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="16" cy="16" r="4" fill="#10b981"/>
              <defs>
                <linearGradient id="nav-logo-grad" x1="2" y1="2" x2="30" y2="30">
                  <stop stopColor="#3b82f6"/>
                  <stop offset="0.5" stopColor="#10b981"/>
                  <stop offset="1" stopColor="#e2b76c"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="font-semibold tracking-tighter">FINGENT AI</span>
          </div>

          <nav>
            <ul className="nav-links">
              <li className={activeTab === "Overview" ? "active" : ""}>
                <a href="#overview" onClick={() => setActiveTab("Overview")}>Overview</a>
              </li>
              <li className={activeTab === "Agents" ? "active" : ""}>
                <a href="#agents" onClick={() => setActiveTab("Agents")}>The Agents</a>
              </li>
              <li className={activeTab === "ROI" ? "active" : ""}>
                <a href="#roi" onClick={() => setActiveTab("ROI")}>ROI Calculator</a>
              </li>
              <li className={activeTab === "Security" ? "active" : ""}>
                <a href="#security" onClick={() => setActiveTab("Security")}>Security & Trust</a>
              </li>
              <li>
                <a href="#docs" onClick={(e) => { e.preventDefault(); setActiveModal("docs"); }}>Docs</a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveModal("console")} 
              className="btn btn-secondary flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5" />
              Dev Console
            </button>
            <button 
              onClick={() => setActiveModal("deploy")} 
              className="btn btn-primary"
            >
              Deploy Agent
            </button>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section id="overview" className="pt-28">
        <PixelHero
          titleComponent={
            <VaporizeTextCycle
              texts={["Fingent AI", "Autonomous Finance", "Ledger Auditor", "Treasury Arbitrage"]}
              font={{
                fontFamily: "Inter, sans-serif",
                fontSize: "70px",
                fontWeight: 800
              }}
              color="rgb(248, 250, 252)"
              spread={5}
              density={5}
              animation={{
                vaporizeDuration: 2,
                fadeInDuration: 1,
                waitDuration: 2.0
              }}
              direction="left-to-right"
              alignment="center"
              tag={Tag.H1}
            />
          }
          description={
            <span>
              Deploy secure, compliance-first AI agents to{" "}
              <Typewriter
                text={[
                  "run ledgers at millisecond speed.",
                  "audit transactions continuously.",
                  "optimize treasury rebalancing.",
                  "prepare compliance tax filings."
                ]}
                speed={50}
                className="text-emerald-400 font-semibold"
                waitTime={2000}
                deleteSpeed={30}
                cursorChar={"_"}
              />
            </span>
          }
          primaryCta="Deploy First Agent"
          primaryCtaMobile="Deploy"
          secondaryCta="Read Financial Whitepaper"
          secondaryCtaMobile="Whitepaper"
          onPrimaryClick={() => setActiveModal("deploy")}
          onSecondaryClick={() => setActiveModal("whitepaper")}
          githubUrl="https://github.com/fingent-ai/workspace"
        />

        {/* Live Interactive Agent Sandbox Console (Directly under main headline) */}
        <div className="max-w-[950px] mx-auto px-4 -mt-24 sm:-mt-10 mb-20 relative z-20">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-mono tracking-wider uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              Live Ledger Sandbox Simulation
            </span>
          </div>

          <div className="console-sandbox glass-panel rounded-2xl">
            {/* Console Sidebar */}
            <div className="console-sidebar">
              <span className="console-sidebar-title">Autonomous Roster</span>
              
              <button 
                onClick={() => setConsoleAgent("auditor")} 
                className={`agent-tab ${consoleAgent === "auditor" ? "active" : ""}`}
              >
                <span className="indicator" />
                Agent Ledger
              </button>
              <button 
                onClick={() => setConsoleAgent("treasurer")} 
                className={`agent-tab ${consoleAgent === "treasurer" ? "active" : ""}`}
              >
                <span className="indicator" />
                Agent Arbitrage
              </button>
              <button 
                onClick={() => setConsoleAgent("forecaster")} 
                className={`agent-tab ${consoleAgent === "forecaster" ? "active" : ""}`}
              >
                <span className="indicator" />
                Agent Forecast
              </button>
              <button 
                onClick={() => setConsoleAgent("tax")} 
                className={`agent-tab ${consoleAgent === "tax" ? "active" : ""}`}
              >
                <span className="indicator" />
                Agent Taxon
              </button>

              <div className="mt-auto pt-6 border-t border-border/40 hidden md:block">
                <span className="block text-[10px] text-slate-500 font-mono mb-1">active status</span>
                <span className="block text-xs font-medium text-emerald-400">SOC-2 Compliant Sandbox</span>
              </div>
            </div>

            {/* Console Screen Workspace */}
            <div className="console-workspace">
              <div className="console-header">
                <div className="console-dots">
                  <span className="console-dot console-dot-close" />
                  <span className="console-dot console-dot-minimize" />
                  <span className="console-dot console-dot-expand" />
                </div>
                <div className="console-file-tab">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="file-name">{activeAgentInfo.fileName}</span>
                </div>
                <span className="console-badge">{activeAgentInfo.badge}</span>
              </div>

              <div className="console-body min-h-[350px]">
                {typedLogs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`console-log-line ${
                      log.type === "comment" ? "console-comment" :
                      log.type === "keyword" ? "console-keyword" :
                      log.type === "string" ? "console-string" : ""
                    }`}
                  >
                    {log.text}
                  </div>
                ))}
                {currentLineIndex < activeAgentInfo.logs.length && (
                  <span className="cursor-blink" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Directory of Agents */}
      <section id="agents" className="section border-t border-border/40">
        <span className="section-tag">Continuous Agent Directory</span>
        <h2 className="section-title">
          <Typewriter
            text="Fully autonomous agents working across your financial stack."
            speed={40}
            cursorChar="_"
          />
        </h2>
        <p className="section-desc">Deploy task-specific AI agents that integrate directly with your banking logs, general ledgers, and cash flows.</p>
        
        <div className="bento-grid">
          {/* Card 1: Auditor */}
          <div className="bento-card bento-card-large glass-panel">
            <div>
              <div className="bento-icon text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="bento-card-title">Continuous Auditor (Agent Ledger)</h3>
              <p className="bento-card-text">
                Runs continuous, millisecond-interval auditing on all sub-ledgers. Connects directly to ERP modules to detect micro-discrepancies, automate SaaS invoices reconciliation, and write mathematical compliance records on read-only databases.
              </p>
            </div>
            <div className="bento-card-footer">
              <div className="bento-card-spec">
                <span className="bullet bg-emerald-400" />
                99.98% Auto-Reconciliation
              </div>
              <button 
                onClick={() => { setConsoleAgent("auditor"); window.scrollTo({ top: 500, behavior: "smooth" }); }} 
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
              >
                Inspect Logs
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Treasurer */}
          <div className="bento-card bento-card-small glass-panel">
            <div>
              <div className="bento-icon text-blue-400 border-blue-500/20 bg-blue-500/5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="bento-card-title">Treasury Allocator (Agent Arbitrage)</h3>
              <p className="bento-card-text">
                Monitors global yield opportunities across treasury bonds and cash equivalents. Automates smart yield transfers within secure multi-signature risk limitations.
              </p>
            </div>
            <div className="bento-card-footer">
              <div className="bento-card-spec">
                <span className="bullet bg-blue-400" />
                Multi-Sig Safeguards
              </div>
              <button 
                onClick={() => { setConsoleAgent("treasurer"); window.scrollTo({ top: 500, behavior: "smooth" }); }} 
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
              >
                Inspect Logs
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: FP&A Forecaster */}
          <div className="bento-card bento-card-small glass-panel">
            <div>
              <div className="bento-icon text-slate-300 border-slate-500/20 bg-slate-500/5">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="bento-card-title">FP&A Scenarios (Agent Forecast)</h3>
              <p className="bento-card-text">
                Simulates multi-variable financial forecasts instantly. Automatically maps cash runway changes under complex market scenarios and distributes report files to stakeholders.
              </p>
            </div>
            <div className="bento-card-footer">
              <div className="bento-card-spec">
                <span className="bullet bg-slate-400" />
                Runway Simulation &lt; 1s
              </div>
              <button 
                onClick={() => { setConsoleAgent("forecaster"); window.scrollTo({ top: 500, behavior: "smooth" }); }} 
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
              >
                Inspect Logs
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 4: Tax Compliance */}
          <div className="bento-card bento-card-large glass-panel">
            <div>
              <div className="bento-icon text-amber-400 border-amber-500/20 bg-amber-500/5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="bento-card-title">Tax Compliance (Agent Taxon)</h3>
              <p className="bento-card-text">
                Tracks multi-state and international tax law adjustments. Performs automated transaction logging for R&D tax credit classifications, prepares tax returns drafts, and structures franchise filings ahead of schedules.
              </p>
            </div>
            <div className="bento-card-footer">
              <div className="bento-card-spec">
                <span className="bullet bg-amber-400" />
                Auto Form 6765 Generation
              </div>
              <button 
                onClick={() => { setConsoleAgent("tax"); window.scrollTo({ top: 500, behavior: "smooth" }); }} 
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
              >
                Inspect Logs
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ROI & Runway Calculator */}
      <section id="roi" className="section border-t border-border/40">
        <span className="section-tag">Financial Projections</span>
        <h2 className="section-title">
          <Typewriter
            text="Calculate your autonomous yield savings."
            speed={40}
            cursorChar="_"
          />
        </h2>
        <p className="section-desc">Estimate the operational cost reduction and hours reclaimed by deploying Fingent AI agents into your organization.</p>

        <div className="calculator-grid glass-panel">
          {/* Sliders Column */}
          <div className="calc-sliders">
            <div className="slider-group">
              <div className="slider-header">
                <label className="slider-label">Annual Enterprise Revenue</label>
                <span className="slider-value">${revVal}M</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="500" 
                value={revVal} 
                onChange={(e) => setRevVal(Number(e.target.value))} 
                className="premium-slider" 
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label className="slider-label">Current Finance Team Size</label>
                <span className="slider-value">{teamVal} FTE</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={teamVal} 
                onChange={(e) => setTeamVal(Number(e.target.value))} 
                className="premium-slider" 
              />
            </div>

            {/* SVG Interactive Chart Curve */}
            <div className="savings-chart-box mt-8">
              <div className="chart-header">
                <span>Savings Projections Curve</span>
                <span>12 Month Accumulation</span>
              </div>
              <div className="chart-svg-container">
                <svg viewBox="0 0 350 90" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid Lines */}
                  <line x1="0" y1="80" x2="350" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                  <line x1="0" y1="45" x2="350" y2="45" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                  <line x1="0" y1="10" x2="350" y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                  
                  {/* Glow Curve Path */}
                  <path 
                    d={getSavingsPath()} 
                    stroke="url(#react-chart-glow)" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                  />
                  
                  {/* Endpoint Circle */}
                  <circle cx="350" cy={Math.max(10, 80 - (Math.min(savingsAmt / 2500000, 1) * 70))} r="4" fill="#10b981" />
                  
                  <defs>
                    <linearGradient id="react-chart-glow" x1="0" y1="80" x2="350" y2="20">
                      <stop stopColor="#3b82f6"/>
                      <stop offset="0.6" stopColor="#10b981"/>
                      <stop offset="1" stopColor="#10b981"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="calc-result-panel">
            <div className="results-dashboard">
              <div className="result-card">
                <div className="result-num-label">Hours Saved / Year</div>
                <div className="result-number">{hoursSaved.toLocaleString()}</div>
              </div>

              <div className="result-card">
                <div className="result-num-label">Audit Discrepancy Margin</div>
                <div className="result-number glow">0.00%</div>
              </div>

              <div className="result-card">
                <div className="result-num-label">Projected Annual Savings</div>
                <div className="result-number">${savingsAmt.toLocaleString()}</div>
              </div>
            </div>

            <button 
              onClick={() => setActiveModal("deploy")} 
              className="btn btn-primary w-full mt-6"
            >
              Initiate Risk Assessment
            </button>
          </div>
        </div>
      </section>

      {/* Security & Cryptographic Trust Map */}
      <section id="security" className="section border-t border-border/40">
        <span className="section-tag">Institutional Trust</span>
        <h2 className="section-title">
          <Typewriter
            text="Ironclad compliance for decentralized operations."
            speed={40}
            cursorChar="_"
          />
        </h2>
        <p className="section-desc">Financial automation requires absolute security. We establish a cryptographically transparent framework that prevents errors and secures data.</p>
        
        <div className="security-layout">
          {/* Interactive Nodes SVG Map */}
          <div className="trust-diagram-panel glass-panel rounded-2xl min-h-[350px]">
            <svg viewBox="0 0 200 200" fill="none" className="w-full max-w-[400px]" xmlns="http://www.w3.org/2000/svg">
              {/* Connection lines */}
              <line className="connection-line" x1="100" y1="30" x2="60" y2="85" />
              <line className="connection-line" x1="100" y1="30" x2="140" y2="85" />
              <line className="connection-line" x1="60" y1="85" x2="100" y2="145" />
              <line className="connection-line" x1="140" y1="85" x2="100" y2="145" />
              <line className="connection-line" x1="100" y1="30" x2="100" y2="145" />
              <line className="connection-line" x1="60" y1="85" x2="140" y2="85" />

              {/* Node SOC2 */}
              <g 
                onClick={() => setActiveSecurityNode("soc2")}
                className={`trust-node ${activeSecurityNode === "soc2" ? "active" : ""}`}
              >
                <circle cx="100" cy="30" r="14" />
                <text x="100" y="34" textAnchor="middle">SOC2</text>
              </g>

              {/* Node CRYPT */}
              <g 
                onClick={() => setActiveSecurityNode("crypt")}
                className={`trust-node ${activeSecurityNode === "crypt" ? "active" : ""}`}
              >
                <circle cx="60" cy="85" r="14" />
                <text x="60" y="89" textAnchor="middle">CRYPT</text>
              </g>

              {/* Node M-SIG */}
              <g 
                onClick={() => setActiveSecurityNode("sig")}
                className={`trust-node ${activeSecurityNode === "sig" ? "active" : ""}`}
              >
                <circle cx="140" cy="85" r="14" />
                <text x="140" y="89" textAnchor="middle">M-SIG</text>
              </g>

              {/* Node VAULT */}
              <g 
                onClick={() => setActiveSecurityNode("api")}
                className={`trust-node ${activeSecurityNode === "api" ? "active" : ""}`}
              >
                <circle cx="100" cy="145" r="14" />
                <text x="100" y="149" textAnchor="middle">VAULT</text>
              </g>
            </svg>
          </div>

          {/* Explanations and Checklist */}
          <div className="flex flex-col gap-6">
            <ul className="security-checklist">
              <li className="flex gap-4">
                <div className="security-icon text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="security-content">
                  <h4 className="font-semibold text-slate-100">Bank-Grade API Protocols</h4>
                  <p className="text-slate-400 text-sm">Protected behind SOC 2 envelope systems, securing your credentials on read-only sandboxes.</p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="security-icon text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="security-content">
                  <h4 className="font-semibold text-slate-100">Cryptographic Verification Chains</h4>
                  <p className="text-slate-400 text-sm">Every transaction audit trail writes directly to immutable logs, ready for SEC and internal board reviews.</p>
                </div>
              </li>
            </ul>

            {/* Dynamic Details Box */}
            <div className="trust-details-box glass-panel rounded-xl p-6 border-l-2 border-l-amber-400 bg-amber-400/[0.02]">
              <h4 className="trust-details-title font-semibold text-amber-300 text-base mb-2">
                {SECURITY_NODES[activeSecurityNode].title}
              </h4>
              <p className="trust-details-desc text-slate-300 text-sm leading-relaxed">
                {SECURITY_NODES[activeSecurityNode].desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration of Framer Motion Background Paths */}
      <section className="section border-t border-border/40">
        <span className="section-tag">Architecture Integrity</span>
        <BackgroundPaths 
          title="Fingent Agentic Infrastructure Core" 
          onCtaClick={() => setActiveModal("docs")}
        />
      </section>

      {/* Grand CTA Block */}
      <section className="footer-cta border-t border-border/40">
        <h2 className="footer-cta-title font-medium">
          <Typewriter
            text="The future of enterprise finance is agentic."
            speed={40}
            cursorChar="_"
          />
        </h2>
        <p className="footer-cta-desc text-slate-400">Deploy your dedicated finance workforce today and transition your operations to self-reconciling precision.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setActiveModal("deploy")} className="btn btn-gold">Deploy First Agent</button>
          <button onClick={() => setActiveModal("contact")} className="btn btn-secondary">Request Sandbox Access</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer border-t border-border/40">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="28" height="28" rx="8" stroke="url(#foot-logo-grad)" strokeWidth="2"/>
                <circle cx="16" cy="16" r="4" fill="#10b981"/>
                <defs>
                  <linearGradient id="foot-logo-grad" x1="2" y1="2" x2="30" y2="30">
                    <stop stopColor="#3b82f6"/>
                    <stop offset="0.5" stopColor="#10b981"/>
                    <stop offset="1" stopColor="#e2b76c"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-semibold text-slate-100 text-base">FINGENT AI</span>
            </div>
            <p className="text-slate-400 text-sm">The autonomous, audit-ready operating system for global enterprise finance teams.</p>
          </div>

          <div>
            <h4 className="footer-links-title">Agents Roster</h4>
            <ul className="footer-links">
              <li><a href="#agents" onClick={() => { setConsoleAgent("auditor"); setActiveTab("Agents"); }}>Agent Ledger (Auditor)</a></li>
              <li><a href="#agents" onClick={() => { setConsoleAgent("treasurer"); setActiveTab("Agents"); }}>Agent Arbitrage (Treasury)</a></li>
              <li><a href="#agents" onClick={() => { setConsoleAgent("forecaster"); setActiveTab("Agents"); }}>Agent Forecast (FP&A)</a></li>
              <li><a href="#agents" onClick={() => { setConsoleAgent("tax"); setActiveTab("Agents"); }}>Agent Taxon (Tax)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-links-title">Resources & Info</h4>
            <ul className="footer-links">
              <li><a href="#whitepaper" onClick={(e) => { e.preventDefault(); setActiveModal("whitepaper"); }}>Whitepaper Analysis</a></li>
              <li><a href="#docs" onClick={(e) => { e.preventDefault(); setActiveModal("docs"); }}>Developer Guide Docs</a></li>
              <li><a href="#calculator" onClick={(e) => { e.preventDefault(); setActiveTab("ROI"); window.scrollTo({ top: 2000, behavior: "smooth" }); }}>Runway Savings Calculator</a></li>
              <li><a href="#deploy" onClick={(e) => { e.preventDefault(); setActiveModal("deploy"); }}>Agent Provisioner Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-links-title">Security Compliance</h4>
            <ul className="footer-links">
              <li><a href="#security" onClick={() => { setActiveSecurityNode("soc2"); setActiveTab("Security"); }}>SOC 2 Certification</a></li>
              <li><a href="#security" onClick={() => { setActiveSecurityNode("crypt"); setActiveTab("Security"); }}>Cryptographic Vaults</a></li>
              <li><a href="#security" onClick={() => { setActiveSecurityNode("sig"); setActiveTab("Security"); }}>Multi-Signature Rules</a></li>
              <li><a href="#security" onClick={() => { setActiveSecurityNode("api"); setActiveTab("Security"); }}>Plaid/Stripe Envelope Specs</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; 2026 Fingent AI Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy Policy Content: We process accounting, ledger data, and transaction details with end-to-end AES-256 vault encryption. No training is performed on confidential enterprise finance records."); }}>Privacy Policy</a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Service: Access to autonomous operations is subject to multi-signature limits. Financial operations are regulated under corporate governance keys."); }}>Terms of Service</a>
          </div>
        </div>
      </footer>

      /* -----------------------------------------------------------------------------
       * CONTENT OVERLAYS / DRAWERS
       * Satisfies "key thing is, there needs to be content on every hyperlink"
       * -------------------------------------------------------------------------- */
      
      {/* 1. Whitepaper Modal */}
      {activeModal === "whitepaper" && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto glass-panel p-8 rounded-2xl border border-amber-500/20 bg-slate-950/90">
            <button 
              onClick={() => setActiveModal(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 bg-white/5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-amber-400" />
              <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-semibold">Technical Whitepaper</span>
            </div>
            <h3 className="text-3xl font-serif italic mb-6">Cryptographic Ledger Auditing & Autonomous Capital Allocation</h3>
            
            <div className="space-y-6 text-slate-300 text-sm leading-relaxed font-sans">
              <p>
                <strong>Abstract:</strong> Traditional corporate finance relies heavily on manual end-of-month reconciliation, leading to discrepancy margins between 1.5% and 3.2%. Fingent AI introduces a framework of autonomous ledger agents executing real-time double-entry auditing, SEC-compliant transaction signing, and hardware-secured treasury management.
              </p>
              
              <h4 className="text-lg font-semibold text-slate-200 mt-4 border-b border-border/50 pb-2">1. Continuous Double-Entry Audit (CDEA)</h4>
              <p>
                CDEA algorithms monitor API streams from bank ledgers and invoices. Every credit card swipe or invoice trigger is matched against general ledger accounts within 12 milliseconds. Discrepancies generate localized cryptographic validation challenges, executing automated receipts matches using vector search webhooks.
              </p>

              <h4 className="text-lg font-semibold text-slate-200 mt-4 border-b border-border/50 pb-2">2. Multi-Signature Yield Optimization</h4>
              <p>
                Agent Arbitrage computes risk-adjusted curves across liquid indices. To safeguard assets, treasury reallocation actions are governed by hardware-bound multi-sig keys. If transaction volume shifts exceed standard deviations, transfers lock until cryptographic tokens are cleared by human supervisors.
              </p>
            </div>
            
            <div className="mt-8 pt-4 border-t border-border flex justify-end">
              <Button onClick={() => setActiveModal(null)} className="rounded-xl px-6">Close Document</Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Deploy Agent Drawer */}
      {activeModal === "deploy" && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md h-full bg-[#05070a] border-l border-border/60 p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold tracking-tighter text-slate-100">Provision Autonomous Agent</h3>
                </div>
                <button 
                  onClick={() => setActiveModal(null)} 
                  className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 mb-2">Select Agent Profile</label>
                  <select 
                    value={consoleAgent} 
                    onChange={(e) => setConsoleAgent(e.target.value)}
                    className="w-full bg-slate-900 border border-border rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="auditor">Agent Ledger (Continuous Auditor)</option>
                    <option value="treasurer">Agent Arbitrage (Treasury & AP/AR)</option>
                    <option value="forecaster">Agent Forecast (Real-time FP&A)</option>
                    <option value="tax">Agent Taxon (Tax Compliance)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 mb-2">Primary Integration Source</label>
                  <select className="w-full bg-slate-900 border border-border rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500">
                    <option>Stripe Connect Vaults</option>
                    <option>Plaid Bank Feeds</option>
                    <option>NetSuite SuiteTalk API</option>
                    <option>QuickBooks Online SDK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 mb-2">Operational Guardrails</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-border bg-slate-950 text-emerald-500 accent-emerald-500" />
                      Auto-reconcile limits &lt; $5,000
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-border bg-slate-950 text-emerald-500 accent-emerald-500" />
                      Require Ledger Multi-Sig signoff
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-border bg-slate-950 text-emerald-500 accent-emerald-500" />
                      Cryptographic SOC 2 logging
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border mt-8 space-y-3">
              <button 
                onClick={() => { alert(`Success: Agent Profile "${AGENTS[consoleAgent].name}" deployment initialized. Fetching integration keys... Check your email for authentication payloads.`); setActiveModal(null); }}
                className="btn btn-primary w-full py-3"
              >
                Provision & Connect Keys
              </button>
              <button onClick={() => setActiveModal(null)} className="btn btn-secondary w-full py-3">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Documentation Drawer */}
      {activeModal === "docs" && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto glass-panel p-8 rounded-2xl bg-[#06080e]/95 border border-border">
            <button 
              onClick={() => setActiveModal(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 bg-white/5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold">Developer Documentation</span>
            </div>
            
            <h3 className="text-3xl font-semibold mb-6">API & Deployment Reference</h3>
            
            <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
              <div>
                <h4 className="text-base font-semibold text-slate-200 mb-2">1. SDK Initialization</h4>
                <p className="mb-2">Initialize the Fingent secure wrapper directly within your React or Node backend to sync with Plaid sandbox nodes:</p>
                <pre className="bg-slate-950 p-4 rounded-xl border border-border font-mono text-xs text-emerald-400 overflow-x-auto">
{`import { FingentAgent } from '@fingent/sdk';

const agent = new FingentAgent({
  apiKey: process.env.FINGENT_KEY,
  guardrails: {
    maxSingleReconcileLimit: 5000,
    multisigRequiredAbove: 100000
  }
});

await agent.deploy('audit_agent');`}
                </pre>
              </div>

              <div>
                <h4 className="text-base font-semibold text-slate-200 mb-2">2. Reconcile Webhook Payload</h4>
                <p className="mb-2">Webhook triggers emitted on continuous ledger reconciliation events:</p>
                <pre className="bg-slate-950 p-4 rounded-xl border border-border font-mono text-xs text-blue-400 overflow-x-auto">
{`{
  "event": "ledger.reconciled",
  "txn_id": "TXN_89029",
  "amount": 12.50,
  "discrepancy": 0.03,
  "reconciled_via": "stripe_webhook_match",
  "cryptographic_hash": "a1f9e6...e88"
}`}
                </pre>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border flex justify-end">
              <Button onClick={() => setActiveModal(null)} className="rounded-xl px-6">Done</Button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Contact / Sandbox Access Modal */}
      {activeModal === "contact" && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-panel p-8 rounded-2xl bg-[#06080e]/95 border border-border">
            <button 
              onClick={() => setActiveModal(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 bg-white/5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-6 h-6 text-amber-400" />
              <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-semibold">Sandbox Access</span>
            </div>
            
            <h3 className="text-2xl font-semibold mb-6">Request API Keys</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Company Email</label>
                <input type="email" placeholder="cfo@company.com" className="w-full bg-slate-900 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Projected Annual Revenue</label>
                <select className="w-full bg-slate-900 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400">
                  <option>&lt; $10M</option>
                  <option>$10M - $50M</option>
                  <option>$50M - $200M</option>
                  <option>&gt; $200M</option>
                </select>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button onClick={() => { alert("Sandbox application received. A cryptographic onboarding payload will be dispatched to your email within 10 minutes."); setActiveModal(null); }}>Submit Request</Button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Developer Console Modal */}
      {activeModal === "console" && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto glass-panel p-8 rounded-2xl bg-[#030508] border border-border">
            <button 
              onClick={() => setActiveModal(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 bg-white/5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-6 h-6 text-emerald-400" />
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold">Fingent Live Network CLI</span>
            </div>
            
            <h3 className="text-2xl font-semibold mb-6">Active Operational Nodes</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900/50 border border-border rounded-xl">
                  <span className="block text-[10px] text-slate-500 font-mono uppercase">Node status</span>
                  <span className="text-sm font-semibold text-slate-200">US-EAST-1 (Audit Core)</span>
                  <span className="block text-xs text-emerald-400 mt-2 font-mono">● Active / Reconciling</span>
                </div>
                <div className="p-4 bg-slate-900/50 border border-border rounded-xl">
                  <span className="block text-[10px] text-slate-500 font-mono uppercase">Node status</span>
                  <span className="text-sm font-semibold text-slate-200">EU-WEST-3 (Arbitrage Allocator)</span>
                  <span className="block text-xs text-emerald-400 mt-2 font-mono">● Active / Rebalancing</span>
                </div>
                <div className="p-4 bg-slate-900/50 border border-border rounded-xl">
                  <span className="block text-[10px] text-slate-500 font-mono uppercase">Node status</span>
                  <span className="text-sm font-semibold text-slate-200">US-WEST-2 (Tax Compliance)</span>
                  <span className="block text-xs text-amber-400 mt-2 font-mono">▲ Idle / Locked</span>
                </div>
              </div>

              <div className="bg-slate-950 p-6 rounded-xl border border-border font-mono text-xs leading-relaxed text-slate-400">
                <div className="text-emerald-400 font-semibold mb-2">&gt; fingent system status --live</div>
                <div>[14:44:02] Fetching consensus reports from 3 running nodes...</div>
                <div>[14:44:03] Node 1 (Audit Core): All hashes valid. Last block #108,929 audited.</div>
                <div>[14:44:03] Node 2 (Arbitrage Allocator): Yield threshold set at 5.0%. Currently producing 5.18%.</div>
                <div>[14:44:04] Node 3 (Tax Compliance): Ready for Delaware corporate franchise submission.</div>
                <div className="text-slate-500 mt-2">// Ready for inputs. Click "Deploy Agent" on the main navbar to provision additional workers.</div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border flex justify-end">
              <Button onClick={() => setActiveModal(null)} className="rounded-xl px-6">Close Console</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
