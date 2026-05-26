import React, { useState } from 'react';
import { 
  Activity, LogIn, Key, Mail, User, Shield, 
  Award, Building2, Users, Sparkles, Zap, Heart, Calendar
} from 'lucide-react';

interface LandingPageProps {
  onLoginSuccess: (name: string, email: string, role: 'organizer' | 'volunteer' | 'sponsor' | 'participant') => void;
}

export default function LandingPage({ onLoginSuccess }: LandingPageProps) {
  // Mode toggle: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Custom inputs state
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState<'organizer' | 'volunteer' | 'sponsor' | 'participant'>('organizer');
  const [passwordInput, setPasswordInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1-Click demo logins to make exploration friction-free
  const demoProfiles = [
    { name: 'Pranav Shaurya', email: 'director@smartcampus.edu', role: 'organizer' as const, desc: 'Central University Director' },
    { name: 'Dr. Sneha Paul', email: 'sneha.paul@smartcampus.edu', role: 'organizer' as const, desc: 'Academic Co-Director & Head Judge' },
    { name: 'Anjali Verma', email: 'anjali.v@student.edu', role: 'volunteer' as const, desc: 'Lead Logistics Co-pilot' },
    { name: 'Yash Vardhan', email: 'yash.volunteer@student.edu', role: 'volunteer' as const, desc: 'Core Setup Representative' },
    { name: 'Siddharth Roy', email: 'roy@techcorp.io', role: 'sponsor' as const, desc: 'Silicon Labs Venture Lead' },
    { name: 'Michael Chen', email: 'micheal.rsvp@gmail.com', role: 'participant' as const, desc: 'Hack-X Participant' }
  ];

  const handleDemoLogin = (profile: typeof demoProfiles[0]) => {
    setSuccessMsg(`Access Granted! Logging in as ${profile.name}...`);
    setTimeout(() => {
      onLoginSuccess(profile.name, profile.email, profile.role);
    }, 750);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register' && !nameInput.trim()) {
      setSuccessMsg('⚠️ Error: Please enter your full name for credentials enrollment.');
      return;
    }
    const email = emailInput || (authMode === 'login' ? 'sandbox.user@smartcampus.com' : 'new.rsvp@campus.edu');
    const name = nameInput || (authMode === 'login' ? 'Sandbox Explorer' : 'Guest Student');
    
    setSuccessMsg(`Welcome aboard! Authenticating credentials...`);
    setTimeout(() => {
      onLoginSuccess(name, email, roleInput);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800 font-sans">
      
      {/* LANDING NAVIGATION */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs flex items-center justify-center font-bold">
              <Activity className="h-5 w-5" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-indigo-600 block leading-none">PRIME PORTAL</span>
              <h1 className="text-sm font-black text-slate-900 mt-0.5 leading-none">Smart Event Management Sandbox</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href="#sandbox-portal" 
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-wider rounded-xl transition"
            >
              Get Started Gate
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column Description */}
          <div className="space-y-6 md:pr-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-widest rounded-full">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Smart Event Management Ecosystem</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              A cohesive hub for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-650 to-indigo-900">multi-sided</span> campus execution.
            </h2>
            
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
              Simulate or host high-impact college hackathons, technical workshops, and campus meetups. Connect event directors, student coordinators, logistics volunteers, and enterprise sponsors in a singular synchronized state engine.
            </p>

            {/* Micro value badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center gap-2 shadow-2xs">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700">Role View Scopes</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center gap-2 shadow-2xs">
                <Zap className="h-4 w-4 text-indigo-500" />
                <span className="text-xs font-bold text-slate-700">Gamified XP</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center gap-2 shadow-2xs col-span-2 sm:col-span-1">
                <Calendar className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-700">Schedules</span>
              </div>
            </div>

            {/* Interactive Roles Card */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400">⚡ Explore Multi-Sided Perspectives</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <h4 className="font-extrabold flex items-center gap-1.5 text-slate-100">
                    <User className="h-3.5 w-3.5 text-indigo-400" />
                    Organizers
                  </h4>
                  <p className="text-[11px] text-slate-400">Deploy checklists, overview dynamic budgets, and audit checklists.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold flex items-center gap-1.5 text-slate-100">
                    <Award className="h-3.5 w-3.5 text-indigo-400" />
                    Volunteers
                  </h4>
                  <p className="text-[11px] text-slate-400">Register logistics shift timetables and secure real-time XP prizes.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold flex items-center gap-1.5 text-slate-100">
                    <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                    Sponsors
                  </h4>
                  <p className="text-[11px] text-slate-400">Pledge active sponsorships to directly boost project budget limits.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold flex items-center gap-1.5 text-slate-100">
                    <Users className="h-3.5 w-3.5 text-indigo-400" />
                    Attendees
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">Verify custom QR codes, generate PDF graduation certificates.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Portal Access */}
          <div id="sandbox-portal" className="scroll-mt-20">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-150 shadow-xl space-y-6 relative overflow-hidden">
              
              {/* Abs decoration bubble */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -z-10" />

              <div className="text-center space-y-1 pb-2 border-b border-slate-100">
                <h3 className="text-xl font-extrabold text-slate-900">Ecosystem Registration</h3>
                <p className="text-xs text-slate-500">Sign in instantly via sandbox profiles or register a custom student account.</p>
              </div>

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs font-bold rounded-xl text-center animate-pulse">
                  {successMsg}
                </div>
              )}

              {/* Two sub modes */}
              <div className="bg-slate-100 p-1 rounded-xl grid grid-cols-2 text-xs font-bold text-slate-500">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`py-2 rounded-lg transition-all ${
                    authMode === 'login' ? 'bg-white text-indigo-600 shadow-xs' : 'hover:text-slate-800'
                  }`}
                >
                  🚪 Sandbox Presets (1-Click)
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`py-2 rounded-lg transition-all ${
                    authMode === 'register' ? 'bg-white text-indigo-600 shadow-xs' : 'hover:text-slate-800'
                  }`}
                >
                  ➕ Custom Enroll Form
                </button>
              </div>

              {authMode === 'login' ? (
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Select a preloaded simulation account:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {demoProfiles.map((p) => {
                      const badgeColor = 
                        p.role === 'organizer' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        p.role === 'volunteer' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        p.role === 'sponsor' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-blue-50 text-blue-700 border-blue-200';

                      return (
                        <button
                          key={p.email}
                          type="button"
                          onClick={() => handleDemoLogin(p)}
                          className="p-3 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 rounded-xl text-left transition duration-150 space-y-1.5 cursor-pointer flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-xs font-extrabold text-slate-800 block truncate leading-none">{p.name}</span>
                            <span className="text-[10px] text-slate-400 truncate block mt-0.5">{p.desc}</span>
                          </div>
                          <span className={`text-[8px] font-extrabold font-mono uppercase px-1.5 py-0.5 rounded border ${badgeColor} inline-block self-start`}>
                            {p.role} view
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-450" />
                      <input
                        type="text"
                        placeholder="e.g. Priyanshu Jha"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full text-xs pl-9 p-2.5 border border-slate-250 bg-slate-50 rounded-xl focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Email Coordinates</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-450" />
                      <input
                        type="email"
                        placeholder="e.g. student@university.edu"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full text-xs pl-9 p-2.5 border border-slate-250 bg-slate-50 rounded-xl focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Enter Sandbox Role</label>
                      <select
                        value={roleInput}
                        onChange={(e) => setRoleInput(e.target.value as any)}
                        className="w-full text-xs p-2.5 border border-slate-250 bg-white rounded-xl focus:outline-hidden"
                      >
                        <option value="organizer">Director (Organizer)</option>
                        <option value="volunteer">Volunteer Coordinator</option>
                        <option value="sponsor">Corporate Sponsor</option>
                        <option value="participant">Academic Attendee</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Security Password</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-slate-450" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          className="w-full text-xs pl-9 p-2.5 border border-slate-250 bg-slate-50 rounded-xl focus:outline-hidden animate-pulse"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-xs"
                  >
                    🚀 Establish Custom Sandbox Session
                  </button>
                </form>
              )}

              {/* General terms message */}
              <p className="text-[10px] text-center text-slate-400 select-none">
                By entering the gateway, you launch a clean reactive local state stored securely inside your browser's persistent sandbox.
              </p>

            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>© 2026 Smart Event Management Suite. All modular runtimes deployed in sandbox simulation container.</span>
          <span className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 text-emerald-800 rounded-full text-[10px] font-bold border border-emerald-200">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            Vite Prototype Engine Live
          </span>
        </div>
      </footer>

    </div>
  );
}
