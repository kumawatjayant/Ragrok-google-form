import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle2, Star, ChevronLeft, ChevronRight, Mail, Map, RotateCcw, LayoutDashboard, LogOut, Download, Trash2, Search, Printer, Copy } from 'lucide-react';

const QUESTIONS = [
  {id:1,cat:'Knowledge',color:'#F0C040',text:"When someone says AI uses 'Large Language Models', what does that mean to you?",hint:"Honest answer only — this isn't a test with wrong answers.",type:'mcq',opts:[{t:"I've heard the term but genuinely don't know what it means",s:0},{t:"Something about machines trained on language from the internet",s:1},{t:"Models trained on text data that predict and generate language statistically",s:2},{t:"Transformer-based neural networks that model probability distributions over token sequences",s:3}]},
  {id:2,cat:'Knowledge',color:'#F0C040',text:"What's the actual difference between AI, Machine Learning, and Deep Learning?",hint:"This reveals how clearly you understand the landscape.",type:'mcq',opts:[{t:"I use them interchangeably — I'm not sure they're different",s:0},{t:"AI is the broad concept, ML and DL are types of AI — but I'm fuzzy on specifics",s:1},{t:"AI is the field, ML learns from data, Deep Learning uses neural networks",s:2},{t:"AI > ML > DL as nested subsets — DL learns hierarchical representations via multi-layer networks",s:3}]},
  {id:3,cat:'Knowledge',color:'#F0C040',text:"What is an AI Agent — as opposed to a regular chatbot?",hint:"One of the most important concepts in AI right now.",type:'mcq',opts:[{t:"A smarter, more advanced chatbot — not sure of the specific difference",s:0},{t:"An AI that can take actions and complete tasks, not just converse",s:1},{t:"An AI with tools, memory, and the ability to plan and execute multi-step tasks autonomously",s:2},{t:"An LLM in a perceive-reason-act-observe loop with persistent state and tool access",s:3}]},
  {id:4,cat:'Knowledge',color:'#F0C040',text:"What does 'hallucination' mean when people talk about AI models?",hint:"Critical concept for anyone working seriously with AI.",type:'mcq',opts:[{t:"I haven't come across this term in an AI context",s:0},{t:"When AI makes things up or gives wrong answers confidently",s:1},{t:"When a model generates plausible-sounding but factually incorrect output with high confidence",s:2},{t:"A failure mode where output diverges from ground truth due to overconfident sampling outside training distribution",s:3}]},
  {id:5,cat:'Knowledge',color:'#F0C040',text:"What is RAG — Retrieval-Augmented Generation?",hint:"Foundational to building AI that actually knows things.",type:'mcq',opts:[{t:"Never heard of it",s:0},{t:"Heard the term but not sure what it does",s:1},{t:"It connects AI to external data so it can answer based on real, updated information",s:2},{t:"Retrieved document chunks injected into context at inference time to ground generation in external knowledge",s:3}]},
  {id:6,cat:'Knowledge',color:'#F0C040',text:"How would you describe your current understanding of prompt engineering?",hint:"Honest self-assessment — not what sounds impressive.",type:'mcq',opts:[{t:"I type what I want and hope the AI understands",s:0},{t:"I know being specific and detailed gets better results",s:1},{t:"I use role assignment, chain-of-thought, and examples to shape AI output deliberately",s:2},{t:"I design system prompts, few-shot templates, output schemas and structured reasoning frameworks",s:3}]},
  {id:7,cat:'Knowledge',color:'#F0C040',text:"Rate your overall conceptual understanding of how modern AI systems work under the hood:",hint:"0 = total mystery / 10 = I could teach this clearly",type:'scale',labels:['Total mystery','Could teach it'],scores:[0,0,1,1,2,2,3,3,4,4,5]},

  {id:8,cat:'Experience',color:'#4F8EF7',text:"How frequently do you use AI tools in your actual day-to-day work right now?",hint:"Not how often you intend to — how often you actually do.",type:'mcq',opts:[{t:"Rarely or never — I haven't integrated it into my work yet",s:0},{t:"Occasionally — I open ChatGPT when I'm stuck on something",s:1},{t:"Regularly — AI is part of my weekly routine across 2-3 tools",s:2},{t:"Daily — AI handles a meaningful portion of my actual output",s:3}]},
  {id:9,cat:'Experience',color:'#4F8EF7',text:"Have you ever built or set up any kind of AI-powered workflow, automation, or custom tool?",hint:"Anything counts — a custom GPT or a full n8n pipeline.",type:'mcq',opts:[{t:"No — I've only used AI tools as they come out of the box",s:0},{t:"I've made a custom GPT or set up one basic automation",s:1},{t:"I've built multi-step workflows connecting AI with other tools (Zapier, Make, n8n, etc.)",s:2},{t:"I've built AI agents, fine-tuned models, or deployed AI into production systems",s:3}]},
  {id:10,cat:'Experience',color:'#4F8EF7',text:"What is your biggest recurring frustration when working with AI tools?",hint:"This pinpoints where your real skill gaps are.",type:'mcq',opts:[{t:"I don't know where to start or which tool to use for what",s:0},{t:"The AI gives generic results — it doesn't really understand my specific context",s:1},{t:"I get good individual outputs but can't string them into a reliable repeatable workflow",s:2},{t:"Reliability, cost, latency and edge cases at scale — the hard engineering problems",s:3}]},
  {id:11,cat:'Experience',color:'#4F8EF7',text:"Select every AI tool category you have genuinely used for real work — not just tried once:",hint:"Select all that apply honestly.",type:'multi',opts:[{t:"Text generation (ChatGPT, Claude, Gemini)",s:1},{t:"Image generation (Midjourney, DALL-E, Stable Diffusion)",s:1},{t:"Voice or audio AI (ElevenLabs, Whisper, Suno)",s:1},{t:"Video AI (Runway, HeyGen, Kling)",s:1},{t:"Automation and workflow AI (n8n, Make, Zapier + AI)",s:2},{t:"Code AI (GitHub Copilot, Cursor, Windsurf)",s:1},{t:"AI research tools (Perplexity, NotebookLM, Elicit)",s:1},{t:"Agent frameworks or APIs (LangChain, AutoGen, Anthropic API)",s:3}]},
  {id:12,cat:'Experience',color:'#4F8EF7',text:"How much tangible value has AI actually generated for you in the last 3 months — time saved, output increased, money made?",hint:"0 = no real impact yet / 10 = it's fundamentally changed my results",type:'scale',labels:['Zero real impact','Fundamentally changed things'],scores:[0,0,1,1,2,2,2,3,3,3,4]},
  {id:13,cat:'Experience',color:'#4F8EF7',text:"Describe the most complex thing you've actually done with AI. If nothing yet, describe what you've tried or attempted:",hint:"Be specific and honest — even 'I tried ChatGPT for writing' is a real answer.",type:'text',placeholder:"e.g. I use Claude to write all my client proposals and save 3 hours a week, or I set up an automation that generates social content, or honestly I haven't done much yet..."},

  {id:14,cat:'Mindset',color:'#3DD68C',text:"When you think about AI potentially replacing jobs in your field, your honest gut reaction is:",hint:"Your real feeling — not what you think you should feel.",type:'mcq',opts:[{t:"Mostly fear — I worry my skills could become irrelevant",s:1},{t:"Mixed — I see both the threat and opportunity but I'm unsure how to navigate it",s:2},{t:"Mostly excited — I see this as a chance to massively increase what I can do",s:3},{t:"I've already reframed it — the real threat is people who use AI better than me, not AI itself",s:3}]},
  {id:15,cat:'Mindset',color:'#3DD68C',text:"When you hit a genuine wall while learning something new and difficult, what actually happens?",hint:"Your real default behaviour — not what you wish you did.",type:'mcq',opts:[{t:"I usually step away and come back later — sometimes I don't come back at all",s:0},{t:"I ask someone for help or look for an easier alternative",s:1},{t:"I search until I find the answer — takes time but I get there",s:2},{t:"I break it apart, try multiple angles, and treat confusion as a puzzle to solve",s:3}]},
  {id:16,cat:'Mindset',color:'#3DD68C',text:"What is your primary goal with AI right now — the real one, not the one that sounds best?",hint:"Your actual goal shapes every decision about your roadmap.",type:'mcq',opts:[{t:"Understand what everyone is talking about — general awareness and not feeling left out",s:1},{t:"Save real time by automating the boring, repetitive parts of my current work",s:2},{t:"Add AI as a marketable skill to grow my income or career",s:2},{t:"Build something AI-powered — a product, automated business, or scalable system",s:3}]},
  {id:17,cat:'Mindset',color:'#3DD68C',text:"How many hours per week can you realistically commit to learning and implementing AI?",hint:"Realistic — not optimistic. What actually happens in your week.",type:'mcq',opts:[{t:"Less than 1 hour — I'm genuinely stretched thin right now",s:1},{t:"1-3 hours — I can carve out focused time most days",s:2},{t:"3-7 hours — I'm treating this as a serious priority",s:2},{t:"7+ hours — I'm going all in on this right now",s:3}]},
  {id:18,cat:'Mindset',color:'#3DD68C',text:"How do you actually learn best — not what sounds right, what genuinely works for you?",hint:"This determines how your course will be structured.",type:'mcq',opts:[{t:"Watching videos and following along step by step, repeating examples",s:2},{t:"Understanding the full concept deeply first, then applying it carefully",s:3},{t:"Jumping straight in and building things — I learn fastest by breaking stuff",s:3},{t:"I need external structure, deadlines and accountability or I tend to drift",s:1}]},
  {id:19,cat:'Mindset',color:'#3DD68C',text:"How urgently do you feel the need to become genuinely AI-capable in the next 90 days?",hint:"0 = no real rush / 10 = I needed this 6 months ago",type:'scale',labels:['No real urgency','I needed this yesterday'],scores:[0,0,1,1,2,2,2,3,3,3,3]},
  {id:20,cat:'Mindset',color:'#3DD68C',text:"In your own words — what does your work or life look like 6 months from now if you fully master AI in your field?",hint:"Paint the picture. The more specific you are, the better your roadmap will be.",type:'text',placeholder:"e.g. I want to handle 2x the client workload without working more hours, or I want to be the person in my team who actually knows how to use this stuff, or I want to build a product that generates income while I sleep..."}
];

const LEVELS = [
  {max:22,name:'🌱 AI Newcomer',color:'#3DD68C',desc:'You\'re at the start of something that will genuinely change your career. No bad habits, no wrong assumptions — just a clean slate to build on. Your 14-day roadmap starts from ground zero and takes you to confidently using AI in your actual daily work.',strengths:['You\'re approaching this without preconceptions — a real advantage','Asking the right questions by being here matters more than you think','The gap between you and advanced users is smaller than it feels'],focus:['Building clear foundational understanding of how AI actually works','Getting your first real AI workflow running for your specific job','Learning to communicate with AI effectively for your field']},
  {max:45,name:'⚡ AI Explorer',color:'#4F8EF7',desc:'You\'ve started. You know AI is real and powerful — but there\'s a gap between knowing and doing. That\'s exactly the gap your roadmap closes. You\'re much closer than you think to becoming genuinely AI-capable in your field.',strengths:['You\'ve moved past fear and into real curiosity','You have genuine exposure to AI tools you can build on','You understand the basics and have useful context to work with'],focus:['Developing prompting skills specific to your professional context','Moving from occasional use to deep daily integration','Connecting tools into actual workflows that save you real time']},
  {max:68,name:'🔥 AI Practitioner',color:'#F0C040',desc:'You\'re already ahead of most people. AI is in your workflow. Now it\'s time to go from user to architect — building systems that work for you autonomously, not just with you. Your roadmap goes deep on automation, agents, and scale.',strengths:['Consistent real-world AI usage across multiple tools','Working knowledge of connecting AI into actual workflows','You think in AI solutions — not just AI prompts'],focus:['Building autonomous multi-step workflows and basic agents','Making your AI usage reliable, repeatable and scalable','Monetising your AI advantage directly in your field']},
  {max:100,name:'🚀 AI Native',color:'#C084FC',desc:'You\'re operating at the frontier. Your roadmap is about going from power user to AI architect — building systems that clone your expertise, scale your output infinitely, and run while you sleep. This is where things get genuinely exciting.',strengths:['Deep conceptual and hands-on AI understanding','Real experience building and deploying AI systems','You think at the systems level — not the tool level'],focus:['Multi-agent orchestration and fully autonomous systems','Fine-tuning and training models on your own expertise and data','Building your AI clone and scaling your knowledge as a product']}
];

import { supabase } from './supabase';

const LogoSymbol = () => (
  <div className="relative flex h-8 w-8 items-center justify-center">
    <div className="absolute inset-0 rounded-lg bg-gold/10 blur-sm" />
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#F0C040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="#F0C040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="#F0C040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    </svg>
  </div>
);

// Admin password from environment (VITE_ prefix for client access)
// State refresh bump
const ADMIN_PWD_1 = import.meta.env.VITE_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_1 || 'change_this_password';
const ADMIN_PWD_2 = process.env.ADMIN_PASSWORD_2 || 'change_this_password';

export default function App() {
  const [screen, setScreen] = useState<'intro' | 'question' | 'result' | 'admin'>('intro');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [logoClicks, setLogoClicks] = useState(0);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);

  const handleLogoClick = () => {
    const newClicks = logoClicks + 1;
    if (newClicks >= 3) {
      setScreen('admin');
      setLogoClicks(0);
    } else {
      setLogoClicks(newClicks);
      // Reset clicks after 2 seconds of inactivity
      setTimeout(() => setLogoClicks(0), 2000);
    }
  };

  useEffect(() => {
    if (window.location.hash === '#admin') {
      setScreen('admin');
    }
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setScreen('admin');
      } else {
        setScreen('intro');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const fetchSubmissions = async (pwd: string) => {
    setIsLoading(true);
    setAdminError('');
    try {
      // Debug info (safe)
      const url = (import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
      const hasKey = !!(import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY);
      console.log('Supabase Debug:', { 
        urlPrefix: url ? url.substring(0, 15) + '...' : 'MISSING',
        hasKey,
        isSupabaseNull: !supabase 
      });

      console.log('Attempting login. Provided length:', pwd.length, 'Expected 1:', ADMIN_PWD_1.length, 'Expected 2:', ADMIN_PWD_2.length);
      
      // Client-side password check for simplicity in serverless environments
      const p1 = ADMIN_PWD_1.trim();
      const p2 = ADMIN_PWD_2.trim();
      const input = pwd.trim();
      
      if (input !== p1 && input !== p2) {
        setAdminError('Invalid password');
        setIsLoading(false);
        return;
      }

      if (!supabase) {
        setAdminError('Database not connected! Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Netlify Environment Variables.');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setSubmissions(data || []);
      setIsAdmin(true);
    } catch (error: any) {
      console.error('Supabase fetch error:', error);
      
      // Handle specific "Failed to fetch" error which usually means CORS, Adblocker, or Paused Project
      if (error.message === 'Failed to fetch' || error.message?.includes('Failed to fetch')) {
        setAdminError('Network error: Failed to connect to Supabase. This usually means your Supabase project is paused (wake it up in the Supabase dashboard), your URL is incorrect, or an ad-blocker is blocking the connection.');
      } else {
        setAdminError(error.message || 'Error fetching data from Supabase. Make sure your table is set up.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!supabase) return;
    if (!confirm('Are you sure you want to delete this submission?')) return;
    try {
      const { error } = await supabase
        .from('assessments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSubmissions(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Supabase delete error:', error);
      alert('Error deleting submission.');
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Field', 'Email', 'Score', 'Knowledge', 'Experience', 'Mindset', 'Date', 'Full Answers'];
    const rows = submissions.map(s => [
      s.id,
      s.name,
      s.field,
      s.email,
      s.score,
      s.knowledge_score,
      s.experience_score,
      s.mindset_score,
      s.created_at,
      JSON.stringify(s.answers_json || {}).replace(/"/g, '""')
    ]);
    const csvContent = [headers, ...rows].map(e => `"${e.map(val => String(val).replace(/"/g, '""')).join('","')}"`).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "ragrok_submissions.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubmissions = submissions.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.field.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [userName, setUserName] = useState('');
  const [userField, setUserField] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = QUESTIONS[currentIdx];
  const progress = Math.round((currentIdx / QUESTIONS.length) * 100);

  const scores = useMemo(() => {
    if (screen !== 'result') return { total: 0, k: 0, e: 0, m: 0 };
    let k = 0, kM = 0, e = 0, eM = 0, m = 0, mM = 0;
    QUESTIONS.forEach(q => {
      const a = answers[q.id];
      let pts = 0;
      if (q.type === 'mcq') pts = (a !== undefined && a !== null) ? (q.opts[a]?.s || 0) : 0;
      else if (q.type === 'scale') pts = (a !== undefined) ? (q.scores[a] || 0) : 0;
      else if (q.type === 'multi') pts = (a && a.length) ? Math.min(a.reduce((s: number, i: number) => s + (q.opts[i]?.s || 0), 0), 4) : 0;
      else pts = (a && a.trim().length >= 20) ? 2 : (a && a.trim().length >= 10) ? 1 : 0;

      if (q.cat === 'Knowledge') { k += pts; kM += 5; }
      else if (q.cat === 'Experience') { e += pts; eM += 5; }
      else { m += pts; mM += 5; }
    });
    return {
      total: Math.round((k / (kM || 1)) * 100 * 0.4 + (e / (eM || 1)) * 100 * 0.35 + (m / (mM || 1)) * 100 * 0.25),
      k: Math.round((k / (kM || 1)) * 100),
      e: Math.round((e / (eM || 1)) * 100),
      m: Math.round((m / (mM || 1)) * 100)
    };
  }, [screen, answers]);

  const level = useMemo(() => LEVELS.find(l => scores.total <= l.max) || LEVELS[LEVELS.length - 1], [scores.total]);

  const handleStart = () => {
    if (!userName.trim()) return;
    setScreen('question');
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setScreen('result');
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleSubmitEmail = async () => {
    if (!email || !email.includes('@')) return;
    setIsSubmitting(true);
    try {
      if (!supabase) {
        alert('Database not connected! Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Netlify Environment Variables.');
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('assessments')
        .insert([
          {
            name: userName,
            field: userField,
            email: email,
            score: scores.total,
            knowledge_score: scores.k,
            experience_score: scores.e,
            mindset_score: scores.m,
            answers_json: answers
          }
        ]);

      if (error) throw error;
      alert('Your roadmap is on its way!');
    } catch (error) {
      console.error('Supabase submission error:', error);
      alert('Error saving your assessment to Supabase.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAnswered = answers[currentQuestion.id] !== undefined && (
    currentQuestion.type === 'multi' ? answers[currentQuestion.id].length > 0 :
    currentQuestion.type === 'text' ? answers[currentQuestion.id].trim().length >= 10 :
    true
  );

  return (
    <div className="wrapper">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <header className="topbar">
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleLogoClick}>
          <LogoSymbol />
          <div className="font-clash text-[18px] font-bold tracking-tight text-text">Ragrok<span className="text-gold">.</span>AI</div>
        </div>
        <div className="time-badge flex items-center gap-1.5 text-xs text-[#4A5260]">
          <Clock size={12} />
          ~5 minutes
        </div>
      </header>

      <div className="progress-track">
        <motion.div 
          className="progress-glow" 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <main className="main flex justify-center px-6 pt-15 pb-20">
        <div className={`content-box w-full ${screen === 'admin' ? 'max-w-[1000px]' : 'max-w-[640px]'}`}>
          <AnimatePresence mode="wait">
            {screen === 'admin' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-[1000px] mx-auto"
              >
                {!isAdmin ? (
                  <div className="max-w-md mx-auto mt-20 p-8 bg-surface border border-border rounded-2xl">
                    <h2 className="font-clash text-2xl font-bold mb-6 flex items-center gap-2">
                      <LayoutDashboard className="text-gold" /> Admin Access
                    </h2>
                    {adminError && (
                      <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {adminError}
                      </div>
                    )}
                    <input 
                      type="password" 
                      placeholder="Enter admin password"
                      className="field-input mb-4"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchSubmissions(adminPassword)}
                    />
                    <button 
                      className="btn-start"
                      onClick={() => fetchSubmissions(adminPassword)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Verifying...' : 'Login'}
                    </button>
                  </div>
                ) : (
                  <div className="mt-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                      <div>
                        <h2 className="font-clash text-3xl font-bold mb-1">Submissions</h2>
                        <p className="text-text-muted text-sm">Manage and view all assessment data</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={exportCSV}
                          className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary hover:border-border-hover"
                        >
                          <Download size={16} /> Export CSV
                        </button>
                        <button 
                          onClick={() => { setIsAdmin(false); setAdminPassword(''); window.location.hash = ''; }}
                          className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>

                    <div className="relative mb-6">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search by name, email, or field..."
                        className="field-input pl-12"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-bottom border-border bg-surface2">
                            <th className="px-6 py-4 text-[11px] font-bold tracking-widest uppercase text-text-muted">User</th>
                            <th className="px-6 py-4 text-[11px] font-bold tracking-widest uppercase text-text-muted">Field</th>
                            <th className="px-6 py-4 text-[11px] font-bold tracking-widest uppercase text-text-muted text-center">Score</th>
                            <th className="px-6 py-4 text-[11px] font-bold tracking-widest uppercase text-text-muted text-center">K/E/M</th>
                            <th className="px-6 py-4 text-[11px] font-bold tracking-widest uppercase text-text-muted">Date</th>
                            <th className="px-6 py-4 text-[11px] font-bold tracking-widest uppercase text-text-muted text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {filteredSubmissions.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-text-muted">No submissions found</td>
                            </tr>
                          ) : (
                            filteredSubmissions.map((s) => (
                              <tr key={s.id} className="hover:bg-white/2 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="font-medium text-text">{s.name}</div>
                                  <div className="text-xs text-text-muted">{s.email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-text-secondary">{s.field}</td>
                                <td className="px-6 py-4 text-center">
                                  <span className="font-clash font-bold text-gold">{s.score}</span>
                                </td>
                                <td className="px-6 py-4 text-center text-xs text-text-muted">
                                  {s.knowledge_score}/{s.experience_score}/{s.mindset_score}
                                </td>
                                <td className="px-6 py-4 text-xs text-text-muted">
                                  {new Date(s.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => setSelectedSubmission(s)}
                                      className="p-2 text-text-muted hover:text-gold transition-colors"
                                      title="View Details"
                                    >
                                      <Search size={16} />
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(s.id)}
                                      className="p-2 text-text-muted hover:text-red-400 transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Submission Detail Modal */}
                <AnimatePresence>
                  {selectedSubmission && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedSubmission(null)}
                        className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
                      />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl"
                      >
                        <div className="flex items-center justify-between border-b border-border px-8 py-6">
                          <div>
                            <h3 className="font-clash text-xl font-bold">{selectedSubmission.name}'s Assessment</h3>
                            <p className="text-sm text-text-muted">{selectedSubmission.email} • {selectedSubmission.field}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => window.print()}
                              className="rounded-full p-2 hover:bg-surface2 transition-colors text-text-muted hover:text-gold"
                              title="Print Assessment"
                            >
                              <Printer size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(selectedSubmission, null, 2));
                                alert('Assessment data copied to clipboard!');
                              }}
                              className="rounded-full p-2 hover:bg-surface2 transition-colors text-text-muted hover:text-gold"
                              title="Copy JSON Data"
                            >
                              <Copy size={18} />
                            </button>
                            <button 
                              onClick={() => setSelectedSubmission(null)}
                              className="rounded-full p-2 hover:bg-surface2 transition-colors"
                            >
                              <RotateCcw size={20} className="rotate-45" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="overflow-y-auto p-8 max-h-[calc(85vh-100px)]">
                          <div className="grid grid-cols-4 gap-4 mb-10">
                            <div className="rounded-2xl bg-surface2 p-4 text-center">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Total Score</div>
                              <div className="font-clash text-2xl font-bold text-gold">{selectedSubmission.score}</div>
                            </div>
                            <div className="rounded-2xl bg-surface2 p-4 text-center">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Knowledge</div>
                              <div className="font-clash text-2xl font-bold text-text">{selectedSubmission.knowledge_score}%</div>
                            </div>
                            <div className="rounded-2xl bg-surface2 p-4 text-center">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Experience</div>
                              <div className="font-clash text-2xl font-bold text-text">{selectedSubmission.experience_score}%</div>
                            </div>
                            <div className="rounded-2xl bg-surface2 p-4 text-center">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Mindset</div>
                              <div className="font-clash text-2xl font-bold text-text">{selectedSubmission.mindset_score}%</div>
                            </div>
                          </div>

                          <div className="space-y-12">
                            {QUESTIONS.map((q, idx) => {
                              const ans = selectedSubmission.answers_json?.[q.id];
                              return (
                                <div key={q.id} className="relative">
                                  <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                      <span className="flex h-6 w-6 items-center justify-center rounded bg-surface2 text-[10px] font-bold text-text-muted">
                                        {idx + 1}
                                      </span>
                                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: q.color }}>
                                        {q.cat}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <h4 className="font-clash text-xl font-semibold text-text mb-6 leading-tight">
                                    {q.text}
                                  </h4>
                                  
                                  <div className="pointer-events-none opacity-90">
                                    {q.type === 'mcq' && (
                                      <div className="flex flex-col gap-2">
                                        {q.opts?.map((opt, i) => (
                                          <div
                                            key={i}
                                            className={`flex items-start gap-4 rounded-xl border px-4 py-3 text-left ${ans === i ? 'border-gold-border bg-gold-dim' : 'border-border bg-surface/50'}`}
                                          >
                                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[10px] font-bold ${ans === i ? 'bg-gold border-gold text-[#08090C]' : 'bg-surface2 border-border text-text-muted'}`}>
                                              {String.fromCharCode(65 + i)}
                                            </span>
                                            <span className={`text-sm leading-relaxed ${ans === i ? 'text-text' : 'text-text-secondary'}`}>
                                              {opt.t}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {q.type === 'scale' && (
                                      <div className="scale-container">
                                        <div className="flex justify-between text-[10px] font-bold text-text-muted mb-3 uppercase tracking-wider">
                                          <span>{q.labels?.[0]}</span>
                                          <span>{q.labels?.[1]}</span>
                                        </div>
                                        <div className="grid grid-cols-11 gap-1">
                                          {Array.from({ length: 11 }).map((_, i) => (
                                            <div
                                              key={i}
                                              className={`flex aspect-square items-center justify-center rounded-lg border text-xs font-bold ${ans === i ? 'bg-gold border-gold text-[#08090C]' : 'bg-surface border-border text-text-muted'}`}
                                            >
                                              {i}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {q.type === 'text' && (
                                      <div className="rounded-xl border border-border bg-surface/50 px-4 py-3.5 text-sm leading-relaxed text-text-secondary italic">
                                        {ans || "No answer provided"}
                                      </div>
                                    )}

                                    {q.type === 'multi' && (
                                      <div className="flex flex-col gap-2">
                                        {q.opts?.map((opt, i) => {
                                          const isSelected = (ans || []).includes(i);
                                          return (
                                            <div
                                              key={i}
                                              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left ${isSelected ? 'border-gold-border bg-gold-dim' : 'border-border bg-surface/50'}`}
                                            >
                                              <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded bg-surface2 border ${isSelected ? 'bg-gold border-gold' : 'border-border'}`}>
                                                {isSelected && <CheckCircle2 size={10} className="text-[#08090C]" />}
                                              </div>
                                              <span className={`text-sm leading-tight ${isSelected ? 'text-text' : 'text-text-secondary'}`}>
                                                {opt.t}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                  {idx < QUESTIONS.length - 1 && <div className="mt-12 h-px bg-border/30 w-full" />}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {screen === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="screen active"
              >
                <div className="intro-eyebrow inline-flex items-center gap-2 rounded-full border border-gold-border px-3 py-1 text-[11px] font-bold tracking-widest uppercase text-gold mb-7">
                  <span className="pulse-dot w-1.5 h-1.5 bg-gold rounded-full animate-pulse" /> AI Intelligence Assessment
                </div>
                <h1 className="intro-h1 font-clash text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-5">
                  Find out exactly <em className="not-italic text-gold">where you stand</em> with AI
                </h1>
                <p className="intro-sub text-text-secondary text-lg leading-relaxed mb-11 max-w-[480px]">
                  20 diagnostic questions. Honest, specific, and built to reveal your actual AI level — so every part of your learning path is designed around you.
                </p>

                <div className="info-row flex flex-wrap gap-2.5 mb-11">
                  <div className="info-pill flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-sm font-medium text-text-secondary">
                    <Clock size={14} className="text-gold" /> ~5 minutes
                  </div>
                  <div className="info-pill flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-sm font-medium text-text-secondary">
                    <CheckCircle2 size={14} className="text-gold" /> 20 questions
                  </div>
                  <div className="info-pill flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-sm font-medium text-text-secondary">
                    <Star size={14} className="text-gold" /> Instant score + insights
                  </div>
                </div>

                <div className="field-group mb-4.5">
                  <label className="field-label block text-[11px] font-bold tracking-widest uppercase text-text-muted mb-2.5">Your first name</label>
                  <input 
                    className="field-input w-full rounded-2xl border border-border bg-surface px-5 py-4 text-text outline-none transition-all focus:border-gold-border focus:ring-3 focus:ring-gold/5" 
                    type="text" 
                    placeholder="e.g. Priya, Ahmed, Siddharth..."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="field-group mb-4.5">
                  <label className="field-label block text-[11px] font-bold tracking-widest uppercase text-text-muted mb-2.5">Your profession / field</label>
                  <input 
                    className="field-input w-full rounded-2xl border border-border bg-surface px-5 py-4 text-text outline-none transition-all focus:border-gold-border focus:ring-3 focus:ring-gold/5" 
                    type="text" 
                    placeholder="e.g. Graphic Designer, Teacher, HR Manager..."
                    value={userField}
                    onChange={(e) => setUserField(e.target.value)}
                  />
                </div>
                <button 
                  className="btn-start w-full mt-2 rounded-2xl bg-gold py-4.5 text-lg font-clash font-semibold text-[#08090C] transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-gold/25"
                  onClick={handleStart}
                >
                  Begin Assessment →
                </button>

                <div className="mt-12 text-center">
                  <button 
                    onClick={() => setScreen('admin')}
                    className="text-[10px] uppercase tracking-[0.2em] text-text-muted hover:text-gold transition-colors opacity-30 hover:opacity-100"
                  >
                    Admin Access
                  </button>
                </div>
              </motion.div>
            )}

            {screen === 'question' && (
              <motion.div
                key={`q-${currentIdx}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="screen active"
              >
                <div className="q-header flex items-center justify-between mb-12">
                  <div className="q-counter text-sm text-text-muted font-medium">
                    Question <strong className="text-text-secondary font-bold">{currentIdx + 1}</strong> of <strong>20</strong>
                  </div>
                  <div className="category-tag flex items-center gap-1.5 rounded-full border border-border bg-surface2 px-3 py-1 text-[11px] font-bold tracking-widest uppercase text-text-muted">
                    <span className="cat-dot w-1.5 h-1.5 rounded-full" style={{ background: currentQuestion.color }} />
                    {currentQuestion.cat}
                  </div>
                </div>
                <div className="q-text font-clash text-2xl md:text-3xl font-semibold leading-tight tracking-tight text-text mb-2.5">
                  {currentQuestion.text}
                </div>
                <div className="q-hint text-sm text-text-muted leading-relaxed mb-8">
                  {currentQuestion.hint}
                </div>
                
                <div className="q-body">
                  {currentQuestion.type === 'mcq' && (
                    <div className="options-list flex flex-col gap-2.5">
                      {currentQuestion.opts?.map((opt, i) => (
                        <button
                          key={i}
                          className={`option-btn flex items-start gap-4 w-full rounded-2xl border px-5 py-4 transition-all text-left ${answers[currentQuestion.id] === i ? 'border-gold-border bg-gold-dim' : 'border-border bg-surface hover:border-border-hover hover:translate-x-1'}`}
                          onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: i }))}
                        >
                          <span className={`opt-key flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg border font-clash text-xs font-semibold transition-all ${answers[currentQuestion.id] === i ? 'bg-gold border-gold text-[#08090C]' : 'bg-surface2 border-border text-text-muted'}`}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className={`opt-text pt-1 text-sm leading-relaxed transition-all ${answers[currentQuestion.id] === i ? 'text-text' : 'text-text-secondary'}`}>
                            {opt.t}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === 'scale' && (
                    <div className="scale-container my-2">
                      <div className="scale-ends flex justify-between text-xs font-medium text-text-muted mb-3.5">
                        <span>{currentQuestion.labels?.[0]}</span>
                        <span>{currentQuestion.labels?.[1]}</span>
                      </div>
                      <div className="scale-buttons grid grid-cols-11 gap-1.5">
                        {Array.from({ length: 11 }).map((_, i) => (
                          <button
                            key={i}
                            className={`scale-btn flex aspect-square items-center justify-center rounded-xl border font-clash text-sm font-semibold transition-all ${answers[currentQuestion.id] === i ? 'bg-gold border-gold text-[#08090C]' : 'bg-surface border-border text-text-muted hover:border-border-hover hover:text-text'}`}
                            onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: i }))}
                          >
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentQuestion.type === 'text' && (
                    <div className="text-container">
                      <textarea
                        className="answer-textarea w-full min-h-[120px] rounded-2xl border border-border bg-surface px-5 py-4.5 text-sm leading-relaxed text-text outline-none transition-all focus:border-gold-border focus:ring-3 focus:ring-gold/5"
                        placeholder={currentQuestion.placeholder}
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                      />
                      <div className="char-count mt-2 text-right text-xs text-text-muted">
                        {(answers[currentQuestion.id] || '').length} characters
                      </div>
                    </div>
                  )}

                  {currentQuestion.type === 'multi' && (
                    <div className="multi-grid flex flex-col gap-2.5">
                      {currentQuestion.opts?.map((opt, i) => {
                        const selected = answers[currentQuestion.id] || [];
                        const isSelected = selected.includes(i);
                        return (
                          <button
                            key={i}
                            className={`multi-option flex items-center gap-3.5 w-full rounded-2xl border px-5 py-4 transition-all text-left ${isSelected ? 'border-gold-border bg-gold-dim' : 'border-border bg-surface hover:border-border-hover'}`}
                            onClick={() => {
                              const newSelected = [...selected];
                              const idx = newSelected.indexOf(i);
                              if (idx === -1) newSelected.push(i);
                              else newSelected.splice(idx, 1);
                              setAnswers(prev => ({ ...prev, [currentQuestion.id]: newSelected }));
                            }}
                          >
                            <div className={`checkbox flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-1.5 transition-all ${isSelected ? 'bg-gold border-gold' : 'border-border-hover'}`}>
                              {isSelected && <CheckCircle2 size={12} className="text-[#08090C]" />}
                            </div>
                            <span className={`multi-text text-sm leading-tight transition-all ${isSelected ? 'text-text' : 'text-text-secondary'}`}>
                              {opt.t}
                            </span>
                          </button>
                        );
                      })}
                      <div className="multi-hint mt-2.5 text-xs text-text-muted">Select all that apply</div>
                    </div>
                  )}
                </div>

                <div className="q-nav flex items-center justify-between mt-10 pt-7 border-t border-border">
                  <button 
                    className="btn-back flex items-center gap-2 rounded-xl border border-border bg-transparent px-5 py-3 text-sm font-medium text-text-muted transition-all hover:border-border-hover hover:text-text-secondary disabled:opacity-30"
                    onClick={handleBack}
                    disabled={currentIdx === 0}
                  >
                    <ChevronLeft size={14} /> Back
                  </button>
                  <button 
                    className="btn-next flex items-center gap-2.5 rounded-xl bg-gold px-7 py-3.5 font-clash text-sm font-semibold text-[#08090C] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/20 disabled:bg-surface2 disabled:text-text-muted disabled:shadow-none disabled:translate-y-0"
                    onClick={handleNext}
                    disabled={!isAnswered}
                  >
                    {currentIdx === QUESTIONS.length - 1 ? 'See My Results' : 'Continue'} <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {screen === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="screen active"
              >
                <div className="result-top text-center mb-12">
                  <div className="result-eyebrow inline-flex items-center gap-2 rounded-full border border-green/30 px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase text-green mb-6">
                    <span className="w-1.5 h-1.5 bg-green rounded-full" /> Assessment Complete
                  </div>
                  <h1 className="result-h1 font-clash text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-2.5">
                    Your AI <em className="not-italic text-gold">Intelligence</em> Report
                  </h1>
                  <div className="result-sub text-sm text-text-muted">
                    {userName} · {userField}
                  </div>
                </div>

                <div className="score-card relative overflow-hidden rounded-[24px] border border-border bg-surface px-10 py-12 text-center mb-4">
                  <div className="score-ring-outer relative w-40 h-40 mx-auto mb-8">
                    <svg className="score-ring-svg w-full h-full -rotate-90" viewBox="0 0 160 160">
                      <circle className="ring-track fill-none stroke-surface2 stroke-[8]" cx="80" cy="80" r="70" />
                      <motion.circle 
                        className="ring-prog fill-none stroke-[8] stroke-linecap-round"
                        cx="80" cy="80" r="70"
                        stroke={level.color}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: scores.total / 100 }}
                        transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
                      />
                    </svg>
                    <div className="score-center absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                      <div className="score-big font-clash text-5xl font-bold leading-none tracking-tight" style={{ color: level.color }}>
                        {scores.total}
                      </div>
                      <div className="score-max text-xs text-text-muted">/ 100</div>
                    </div>
                  </div>
                  <div 
                    className="level-pill inline-flex items-center rounded-full px-5 py-2.5 font-clash text-base font-semibold tracking-tight mb-4"
                    style={{ background: `${level.color}15`, border: `1px solid ${level.color}30`, color: level.color }}
                  >
                    {level.name}
                  </div>
                  <p className="level-desc mx-auto max-w-[460px] text-sm leading-relaxed text-text-secondary">
                    {level.desc}
                  </p>
                </div>

                <div className="breakdown grid grid-cols-3 gap-3 mb-4">
                  <div className="bd-card rounded-2xl border border-border bg-surface px-4 py-6 text-center">
                    <div className="bd-pct font-clash text-3xl font-bold tracking-tight text-gold mb-1 leading-none">{scores.k}%</div>
                    <div className="bd-label text-[11px] font-bold tracking-widest uppercase text-text-muted">Knowledge</div>
                  </div>
                  <div className="bd-card rounded-2xl border border-border bg-surface px-4 py-6 text-center">
                    <div className="bd-pct font-clash text-3xl font-bold tracking-tight text-gold mb-1 leading-none">{scores.e}%</div>
                    <div className="bd-label text-[11px] font-bold tracking-widest uppercase text-text-muted">Experience</div>
                  </div>
                  <div className="bd-card rounded-2xl border border-border bg-surface px-4 py-6 text-center">
                    <div className="bd-pct font-clash text-3xl font-bold tracking-tight text-gold mb-1 leading-none">{scores.m}%</div>
                    <div className="bd-label text-[11px] font-bold tracking-widest uppercase text-text-muted">Mindset</div>
                  </div>
                </div>

                <div className="insight-card rounded-[18px] border border-border bg-surface p-6.5 mb-3.5">
                  <div className="insight-title flex items-center gap-2 font-clash text-sm font-semibold mb-4" style={{ color: level.color }}>
                    <Star size={14} fill={level.color} /> Your Current Strengths
                  </div>
                  <div className="insight-items flex flex-col gap-2.5">
                    {level.strengths.map((s, i) => (
                      <div key={i} className="insight-item flex items-start gap-3 text-sm leading-relaxed text-text-secondary">
                        <span className="insight-dot mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: level.color }} />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="insight-card rounded-[18px] border border-border bg-surface p-6.5 mb-3.5">
                  <div className="insight-title flex items-center gap-2 font-clash text-sm font-semibold mb-4 text-[#4F8EF7]">
                    <Map size={14} /> Where Your Roadmap Will Focus
                  </div>
                  <div className="insight-items flex flex-col gap-2.5">
                    {level.focus.map((f, i) => (
                      <div key={i} className="insight-item flex items-start gap-3 text-sm leading-relaxed text-text-secondary">
                        <span className="insight-dot mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4F8EF7]" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="notify-card rounded-[20px] border border-gold-border bg-gradient-to-br from-gold/10 to-gold/3 p-8 text-center mb-4">
                  <div className="notify-h font-clash text-xl font-bold tracking-tight mb-2.5">Your personalised roadmap is being prepared 🗺️</div>
                  <p className="notify-sub text-sm leading-relaxed text-text-secondary mb-6">
                    Ragrok reviews every result personally and builds your custom 14-day AI plan based on your score, field, and goals. Drop your email and you'll receive it directly.
                  </p>
                  <div className="notify-row flex flex-col md:flex-row gap-2.5">
                    <input 
                      className="notify-email flex-1 rounded-xl border border-border bg-bg px-4.5 py-3.5 text-sm text-text outline-none transition-all focus:border-gold-border" 
                      type="email" 
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button 
                      className="btn-notify rounded-xl bg-gold px-5.5 py-3.5 font-clash text-sm font-semibold text-[#08090C] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/20"
                      onClick={handleSubmitEmail}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send My Roadmap'}
                    </button>
                  </div>
                </div>

                <button 
                  className="btn-restart w-full rounded-2xl border border-border bg-transparent py-4 text-sm font-medium text-text-muted transition-all hover:border-border-hover hover:text-text-secondary mt-0.5"
                  onClick={() => {
                    setScreen('intro');
                    setCurrentIdx(0);
                    setAnswers({});
                    setUserName('');
                    setUserField('');
                    setEmail('');
                  }}
                >
                  <RotateCcw size={14} className="inline mr-2" /> Retake Assessment
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
