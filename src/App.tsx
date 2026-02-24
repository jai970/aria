/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Layout, 
  Activity, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Database, 
  FileText, 
  Zap, 
  ShieldCheck, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Terminal,
  Cpu,
  Globe,
  BookOpen,
  Newspaper,
  Layers,
  Send,
  RotateCcw,
  Copy,
  ExternalLink
} from 'lucide-react';

// --- Constants & Types ---

const STEP_TYPES = {
  PLAN: { label: 'PLAN', color: '#7c3aed', icon: '◈' },
  SEARCH: { label: 'SEARCH', color: '#10b981', icon: '⌕' },
  EVALUATE: { label: 'EVALUATE', color: '#f59e0b', icon: '◎' },
  SYNTHESIZE: { label: 'SYNTHESIZE', color: '#9333ea', icon: '⬡' },
  FINAL: { label: 'FINAL', color: '#f43f5e', icon: '✦' },
};

const TOOLS = [
  { id: 'web_search', name: 'Web Search', icon: Globe },
  { id: 'scholar', name: 'Scholar API', icon: BookOpen },
  { id: 'news', name: 'News API', icon: Newspaper },
  { id: 'synthesizer', name: 'Synthesizer', icon: Layers },
];

// --- Components ---

const TypewriterText = ({ text, speed = 30, onComplete = undefined }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const index = useRef(0);

  useEffect(() => {
    setDisplayedText('');
    index.current = 0;
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (index.current < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        index.current += 1;
      }, speed);
      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [displayedText, text, speed, onComplete, isComplete]);

  return (
    <span className={!isComplete ? 'cursor-blink' : ''}>
      {displayedText}
    </span>
  );
};

const ConfidenceBar = ({ value, label = "CONFIDENCE LEVEL" }) => {
  const getColor = (v) => {
    if (v < 40) return 'bg-rose-500';
    if (v < 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1 text-slate-400 font-mono">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${getColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

const ConfidenceDial = ({ value }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  
  const getColor = (v) => {
    if (v < 40) return '#f43f5e';
    if (v < 70) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="relative flex items-center justify-center w-40 h-40 mx-auto">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-slate-800"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke={getColor(value)}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1s ease-out, stroke 1s' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold font-mono text-white">{value}%</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Confidence</span>
      </div>
    </div>
  );
};

const LogCard = (props) => {
  const { step, isLatest } = props;
  const [isExpanded, setIsExpanded] = useState(true);
  const typeInfo = STEP_TYPES[step.type];

  return (
    <div 
      className={`mb-4 bg-slate-900/50 border-l-4 rounded-r-lg overflow-hidden animate-slide-up ${isLatest ? 'ring-1 ring-cyan-500/30 shadow-[0_0_15px_rgba(0,212,255,0.1)]' : ''}`}
      style={{ borderLeftColor: typeInfo.color }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span 
              className="px-2 py-0.5 text-[10px] font-bold rounded text-white"
              style={{ backgroundColor: typeInfo.color }}
            >
              {typeInfo.label}
            </span>
            <span className="text-xl opacity-80">{typeInfo.icon}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">{step.timestamp}</span>
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Thinking:</span>
            <p className="text-sm italic text-slate-400 leading-relaxed">
              <TypewriterText text={step.thinking} />
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Action:</span>
            <p className="text-sm font-medium text-cyan-400">
              {step.action}
            </p>
          </div>

          {step.data && (
            <div className="mt-4 border-t border-slate-800 pt-3">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors"
              >
                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                DATA_READOUT
              </button>
              
              {isExpanded && (
                <div className="mt-2 bg-black/40 rounded p-3 font-mono text-[11px] text-slate-300 border border-slate-800/50">
                  {step.type === 'SEARCH' && (
                    <div className="space-y-1">
                      <div className="flex justify-between"><span className="text-emerald-500">query:</span> <span>"{step.data.query}"</span></div>
                      <div className="flex justify-between"><span className="text-emerald-500">tool:</span> <span>{step.data.tool}</span></div>
                      <div className="flex justify-between"><span className="text-emerald-500">results:</span> <span>{step.data.resultsCount} items found</span></div>
                    </div>
                  )}
                  {step.type === 'EVALUATE' && (
                    <div className="space-y-2">
                      <ConfidenceBar value={step.data.confidence} />
                      <div className="mt-2">
                        <span className="text-amber-500 block mb-1">Information Gaps:</span>
                        <ul className="list-disc list-inside opacity-80">
                          {step.data.gaps.map((gap, i) => <li key={i}>{gap}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}
                  {step.type === 'SYNTHESIZE' && (
                    <div className="space-y-2">
                      <div className="flex justify-between"><span className="text-purple-500">sources_processed:</span> <span>{step.data.sourcesCount}</span></div>
                      <div className="flex justify-between"><span className="text-purple-500">contradictions_resolved:</span> <span>{step.data.contradictions}</span></div>
                      <div className="mt-1">
                        <span className="text-purple-500 block mb-1">Key Findings:</span>
                        <ul className="space-y-1 opacity-80">
                          {step.data.findings.map((f, i) => <li key={i} className="flex gap-2"><span>•</span> {f}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}
                  {step.type === 'FINAL' && (
                    <div className="space-y-2">
                      <div className="text-rose-400 font-bold mb-1">EXECUTIVE SUMMARY READY</div>
                      <p className="opacity-80 leading-relaxed">{step.data.summary}</p>
                      <div className="flex justify-between mt-2 pt-2 border-t border-slate-800">
                        <span className="text-rose-500">final_confidence:</span>
                        <span>{step.data.confidence}%</span>
                      </div>
                    </div>
                  )}
                  {step.type === 'PLAN' && (
                    <div className="space-y-1">
                      <span className="text-violet-500 block mb-1">Execution Strategy:</span>
                      {step.data.tasks.map((t, i) => (
                        <div key={i} className="flex justify-between opacity-80">
                          <span>{i+1}. {t.label}</span>
                          <span className="text-[9px] px-1 border border-slate-700 rounded">{t.priority}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [query, setQuery] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [plan, setPlan] = useState([]);
  const [stats, setStats] = useState({ steps: 0, searches: 0, iterations: 0, startTime: null });
  const [elapsedTime, setElapsedTime] = useState('00:00');
  const [confidence, setConfidence] = useState(0);
  const [sources, setSources] = useState([]);
  const [toolUsage, setToolUsage] = useState(
    TOOLS.map(t => ({ ...t, count: 0, lastUsed: '-', active: false }))
  );
  const [showFinal, setShowFinal] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState(null);

  const logEndRef = useRef(null);
  const timerRef = useRef(null);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Timer logic
  useEffect(() => {
    if (isRunning && stats.startTime) {
      timerRef.current = setInterval(() => {
        const diff = Math.floor((Date.now() - stats.startTime) / 1000);
        const mins = Math.floor(diff / 60).toString().padStart(2, '0');
        const secs = (diff % 60).toString().padStart(2, '0');
        setElapsedTime(`${mins}:${secs}`);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, stats.startTime]);

  const resetState = () => {
    setIsRunning(false);
    setLogs([]);
    setPlan([]);
    setStats({ steps: 0, searches: 0, iterations: 0, startTime: null });
    setElapsedTime('00:00');
    setConfidence(0);
    setSources([]);
    setToolUsage(TOOLS.map(t => ({ ...t, count: 0, lastUsed: '-', active: false })));
    setShowFinal(false);
    setFinalAnswer(null);
  };

  const activateTool = (toolId) => {
    setToolUsage(prev => prev.map(t => {
      if (t.id === toolId) {
        return { 
          ...t, 
          count: t.count + 1, 
          lastUsed: new Date().toLocaleTimeString([], { hour12: false }),
          active: true 
        };
      }
      return { ...t, active: false };
    }));
    // Deactivate after flash
    setTimeout(() => {
      setToolUsage(prev => prev.map(t => ({ ...t, active: false })));
    }, 1000);
  };

  const addLog = (step) => {
    setLogs(prev => [...prev, { ...step, timestamp: new Date().toLocaleTimeString([], { hour12: false }) }]);
    setStats(prev => ({ ...prev, steps: prev.steps + 1 }));
  };

  const runSimulation = async () => {
    if (!query.trim()) return;
    
    resetState();
    setIsRunning(true);
    setStats(prev => ({ ...prev, startTime: Date.now() }));

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Step 1: PLAN
    await sleep(1000);
    const initialTasks = [
      { id: 1, label: "Analyze AGI impact on manufacturing sectors", priority: "HIGH", status: "active" },
      { id: 2, label: "Evaluate shift in service-based economies", priority: "MED", status: "pending" },
      { id: 3, label: "Synthesize expert projections for 2030-2050", priority: "HIGH", status: "pending" },
      { id: 4, label: "Assess universal basic income feasibility", priority: "LOW", status: "pending" }
    ];
    setPlan(initialTasks);
    addLog({
      type: 'PLAN',
      thinking: "Deconstructing research query into multi-vector analysis tasks. Prioritizing high-impact economic sectors first.",
      action: "Generating research roadmap and task prioritization matrix.",
      data: { tasks: initialTasks }
    });

    // Step 2: SEARCH 1
    await sleep(2500);
    activateTool('web_search');
    setStats(prev => ({ ...prev, searches: prev.searches + 1 }));
    addLog({
      type: 'SEARCH',
      thinking: "Initiating broad scan of recent economic reports from IMF, World Bank, and McKinsey regarding automation trends.",
      action: "Executing global database query for 'AGI economic impact 2025-2030'.",
      data: { query: "AGI economic impact 2025-2030", tool: "Web Search", resultsCount: 1420 }
    });
    setSources([
      { id: 1, domain: "mckinsey.com", snippet: "Generative AI could add $2.6T to $4.4T annually to the global economy.", reliability: "HIGH" },
      { id: 2, domain: "imf.org", snippet: "40% of global employment is exposed to AI, with advanced economies at higher risk.", reliability: "HIGH" }
    ]);

    // Step 3: EVALUATE 1
    await sleep(2000);
    setConfidence(45);
    addLog({
      type: 'EVALUATE',
      thinking: "Initial data suggests massive productivity gains but highlights a significant gap in specific regional displacement data.",
      action: "Performing gap analysis on retrieved dataset.",
      data: { 
        confidence: 45, 
        gaps: ["Regional data for SE Asia missing", "Specific impact on creative industries unclear"] 
      }
    });

    // Step 4: SEARCH 2
    await sleep(2000);
    activateTool('scholar');
    setStats(prev => ({ ...prev, searches: prev.searches + 1 }));
    setPlan(prev => prev.map(t => t.id === 1 ? { ...t, status: 'complete' } : t.id === 2 ? { ...t, status: 'active' } : t));
    addLog({
      type: 'SEARCH',
      thinking: "Drilling down into academic literature for specific displacement models in service sectors.",
      action: "Querying Google Scholar for 'AI displacement in service economy longitudinal study'.",
      data: { query: "AI displacement in service economy", tool: "Scholar API", resultsCount: 84 }
    });
    setSources(prev => [
      ...prev,
      { id: 3, domain: "mit.edu", snippet: "Task-based displacement models suggest 15% net job loss in administrative roles.", reliability: "HIGH" },
      { id: 4, domain: "oxford.ac.uk", snippet: "Creative industries show 'augmentation' rather than 'replacement' in 70% of cases.", reliability: "MEDIUM" }
    ]);

    // Step 5: EVALUATE 2
    await sleep(2000);
    setConfidence(72);
    addLog({
      type: 'EVALUATE',
      thinking: "Confidence increasing. Service sector data is robust. Final gap identified: long-term policy response efficacy.",
      action: "Refining confidence score based on new academic inputs.",
      data: { 
        confidence: 72, 
        gaps: ["Long-term policy efficacy data needed"] 
      }
    });

    // Step 6: SEARCH 3
    await sleep(2000);
    activateTool('news');
    setStats(prev => ({ ...prev, searches: prev.searches + 1 }));
    setPlan(prev => prev.map(t => t.id === 2 ? { ...t, status: 'complete' } : t.id === 3 ? { ...t, status: 'active' } : t));
    addLog({
      type: 'SEARCH',
      thinking: "Searching for real-time policy updates and pilot program results for UBI and reskilling initiatives.",
      action: "Scanning global news feeds for 'AI policy response 2026'.",
      data: { query: "AI policy response 2026", tool: "News API", resultsCount: 312 }
    });
    setSources(prev => [
      ...prev,
      { id: 5, domain: "reuters.com", snippet: "EU Parliament passes 'AI Transition Fund' to support displaced workers.", reliability: "HIGH" }
    ]);

    // Step 7: SYNTHESIZE
    await sleep(2000);
    setConfidence(88);
    activateTool('synthesizer');
    setPlan(prev => prev.map(t => t.id === 3 ? { ...t, status: 'complete' } : t.id === 4 ? { ...t, status: 'active' } : t));
    addLog({
      type: 'SYNTHESIZE',
      thinking: "Merging economic projections, academic models, and current policy trends. Resolving contradictions between optimistic tech reports and cautious academic studies.",
      action: "Running cross-reference synthesis algorithm.",
      data: { 
        sourcesCount: 5, 
        contradictions: 2,
        findings: [
          "Net job growth likely in tech/maintenance, but massive churn in mid-tier admin.",
          "Productivity gains of 30% expected by 2030.",
          "Policy response is lagging behind technological deployment speed."
        ]
      }
    });

    // Step 8: FINAL
    await sleep(2500);
    setConfidence(94);
    setPlan(prev => prev.map(t => ({ ...t, status: 'complete' })));
    const finalData = {
      summary: "AGI will likely cause a 'Great Reallocation' rather than a 'Great Unemployment'. While 300M jobs are exposed to automation, new roles in AI management and human-centric services will emerge. The primary risk is a widening wealth gap and temporary regional instability during the 2028-2032 transition period.",
      confidence: 94,
      caveats: ["Assumes AGI deployment follows current exponential curve", "Geopolitical conflict could disrupt supply chains"],
      answer: "The impact of AGI on global employment will be transformative, characterized by high volatility in administrative and manufacturing sectors, but balanced by significant productivity-led growth in new industries. Success depends heavily on the speed of government reskilling initiatives."
    };
    addLog({
      type: 'FINAL',
      thinking: "Research complete. All primary and secondary objectives met. Generating final executive report.",
      action: "Compiling final research dossier.",
      data: finalData
    });
    setFinalAnswer(finalData);
    setShowFinal(true);
    setIsRunning(false);
  };

  const handleExampleClick = (txt) => {
    setQuery(txt);
  };

  return (
    <div className="h-screen flex flex-col bg-[#080b14] relative overflow-hidden scanlines">
      {/* Header */}
      <header className="h-14 border-b border-cyan-500/20 bg-black/40 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/40 rounded flex items-center justify-center">
            <Cpu className="text-cyan-400" size={18} />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">
            ARIA <span className="text-cyan-500 font-mono font-light text-sm ml-2 opacity-70">— Autonomous Research Intelligence Agent</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6 font-mono text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="uppercase">Model:</span>
            <span className="text-cyan-400">GEMINI-3.1-PRO</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="uppercase">Session:</span>
            <span className="text-cyan-400">{elapsedTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="uppercase">Status:</span>
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-slate-600'}`} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* Left Panel (25%) */}
        <aside className="w-1/4 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1">
          {/* Research Plan */}
          <section className="bg-slate-900/40 border border-cyan-500/10 rounded-lg p-4">
            <h2 className="text-[11px] font-mono font-bold text-cyan-400 mb-4 tracking-widest">[ RESEARCH PLAN ]</h2>
            <div className="space-y-4">
              {plan.length > 0 ? plan.map((task) => (
                <div key={task.id} className="flex gap-3 items-start group">
                  <div className="mt-1">
                    {task.status === 'complete' ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : task.status === 'active' ? (
                      <Circle size={14} className="text-cyan-400 animate-pulse" />
                    ) : (
                      <Circle size={14} className="text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs leading-tight ${task.status === 'complete' ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                      {task.label}
                    </p>
                    <div className="flex mt-1">
                      <span className={`text-[8px] px-1 rounded border ${
                        task.priority === 'HIGH' ? 'border-rose-500/30 text-rose-400' : 
                        task.priority === 'MED' ? 'border-amber-500/30 text-amber-400' : 
                        'border-slate-500/30 text-slate-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-xs text-slate-600 italic">No plan initialized. Deploy agent to begin.</div>
              )}
            </div>
          </section>

          {/* Tool Usage */}
          <section className="bg-slate-900/40 border border-cyan-500/10 rounded-lg p-4">
            <h2 className="text-[11px] font-mono font-bold text-cyan-400 mb-4 tracking-widest">[ TOOLS ACTIVATED ]</h2>
            <div className="space-y-3">
              {toolUsage.map((tool) => (
                <div key={tool.id} className={`flex items-center justify-between p-2 rounded border border-transparent transition-all ${tool.active ? 'tool-flash border-white/20' : ''}`}>
                  <div className="flex items-center gap-2">
                    <tool.icon size={14} className={tool.count > 0 ? 'text-cyan-400' : 'text-slate-600'} />
                    <span className={`text-[11px] ${tool.count > 0 ? 'text-slate-200' : 'text-slate-500'}`}>{tool.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-mono text-cyan-500">{tool.count} calls</span>
                    <span className="text-[8px] font-mono text-slate-600">{tool.lastUsed}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="bg-slate-900/40 border border-cyan-500/10 rounded-lg p-4 mt-auto">
            <h2 className="text-[11px] font-mono font-bold text-cyan-400 mb-4 tracking-widest">[ AGENT STATS ]</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] text-slate-500 uppercase block">Steps</span>
                <span className="text-lg font-mono text-cyan-400">{stats.steps}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase block">Searches</span>
                <span className="text-lg font-mono text-cyan-400">{stats.searches}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase block">Iterations</span>
                <span className="text-lg font-mono text-cyan-400">{stats.iterations}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase block">Time</span>
                <span className="text-lg font-mono text-cyan-400">{elapsedTime}</span>
              </div>
            </div>
          </section>
        </aside>

        {/* Center Panel (45%) */}
        <section className="flex-1 flex flex-col bg-slate-900/20 border border-cyan-500/10 rounded-lg overflow-hidden">
          <div className="p-3 border-b border-cyan-500/10 bg-black/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-cyan-400" />
              <span className="text-[11px] font-mono font-bold text-cyan-400 tracking-widest">THINKING_LOG_STREAM</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono text-emerald-500">LIVE</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {logs.length > 0 ? (
              <>
                {logs.map((step, idx) => (
                  <LogCard key={idx} step={step} isLatest={idx === logs.length - 1} />
                ))}
                <div ref={logEndRef} />
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                <Zap size={48} className="mb-4 animate-pulse" />
                <p className="text-sm font-mono">WAITING FOR DEPLOYMENT...</p>
              </div>
            )}
          </div>
        </section>

        {/* Right Panel (30%) */}
        <aside className="w-[30%] flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1">
          {/* Confidence Dashboard */}
          <section className="bg-slate-900/40 border border-cyan-500/10 rounded-lg p-4">
            <h2 className="text-[11px] font-mono font-bold text-cyan-400 mb-4 tracking-widest">[ CONFIDENCE TRACKER ]</h2>
            <ConfidenceDial value={confidence} />
            <p className="text-center text-[10px] text-slate-500 mt-2 font-mono uppercase tracking-widest">Research Confidence</p>
          </section>

          {/* Sources Panel */}
          <section className="bg-slate-900/40 border border-cyan-500/10 rounded-lg p-4 flex-1 flex flex-col">
            <h2 className="text-[11px] font-mono font-bold text-cyan-400 mb-4 tracking-widest">[ SOURCES FOUND ]</h2>
            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1">
              {sources.length > 0 ? sources.map((source) => (
                <div key={source.id} className="p-3 bg-black/40 border border-slate-800 rounded-lg animate-slide-up group hover:border-cyan-500/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[8px] font-bold text-white">
                        {source.domain.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[11px] font-bold text-slate-300">{source.domain}</span>
                    </div>
                    <span className={`text-[8px] px-1 rounded border ${
                      source.reliability === 'HIGH' ? 'border-emerald-500/30 text-emerald-400' : 
                      source.reliability === 'MEDIUM' ? 'border-amber-500/30 text-amber-400' : 
                      'border-rose-500/30 text-rose-400'
                    }`}>
                      {source.reliability}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 italic">"{source.snippet}"</p>
                  <div className="mt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink size={10} className="text-cyan-500 cursor-pointer" />
                  </div>
                </div>
              )) : (
                <div className="text-xs text-slate-600 italic">No sources indexed yet.</div>
              )}
            </div>
          </section>

          {/* Final Answer Panel */}
          {showFinal && finalAnswer && (
            <section className="bg-slate-900/80 border border-rose-500/40 rounded-lg p-4 animate-slide-up shadow-[0_0_20px_rgba(244,63,94,0.2)]">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={16} className="text-rose-500" />
                <h2 className="text-[11px] font-mono font-bold text-rose-500 tracking-widest">[ RESEARCH COMPLETE ]</h2>
              </div>
              <div className="text-xs text-slate-200 leading-relaxed mb-4">
                <TypewriterText text={finalAnswer.answer} speed={20} />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-[10px] text-amber-400">
                  <AlertCircle size={12} />
                  <span className="font-bold uppercase">Caveats:</span>
                </div>
                <ul className="text-[10px] text-slate-400 space-y-1 ml-5 list-disc">
                  {finalAnswer.caveats.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-400 py-2 rounded text-[10px] font-bold flex items-center justify-center gap-2 transition-all">
                  <Copy size={12} /> COPY DOSSIER
                </button>
              </div>
            </section>
          )}
        </aside>
      </main>

      {/* Bottom Input Bar */}
      <footer className="p-4 bg-black/60 border-t border-cyan-500/20 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-3 mb-3">
            <div className="flex-1 relative">
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runSimulation()}
                placeholder="Enter your research query..."
                className="w-full bg-slate-900/80 border border-cyan-500/20 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
                disabled={isRunning}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button 
                  onClick={resetState}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                  title="Reset Agent"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
            <button 
              onClick={runSimulation}
              disabled={isRunning || !query.trim()}
              className={`px-6 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                isRunning 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(0,212,255,0.3)] hover:shadow-[0_0_25px_rgba(0,212,255,0.5)]'
              }`}
            >
              {isRunning ? (
                <>
                  <Activity size={18} className="animate-spin" />
                  AGENT RUNNING...
                </>
              ) : (
                <>
                  DEPLOY AGENT
                  <Send size={16} />
                </>
              )}
            </button>
          </div>
          
          <div className="flex gap-2 items-center">
            <span className="text-[10px] text-slate-500 uppercase font-mono mr-2">Quick Queries:</span>
            {[
              "Impact of AGI on global employment",
              "Is cold fusion scientifically viable?",
              "Geopolitical consequences of de-dollarization"
            ].map((txt) => (
              <button 
                key={txt}
                onClick={() => handleExampleClick(txt)}
                className="px-3 py-1 rounded-full border border-slate-800 text-[10px] text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all bg-slate-900/40"
              >
                {txt}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
