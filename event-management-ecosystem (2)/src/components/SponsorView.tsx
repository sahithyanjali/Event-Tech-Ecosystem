import React, { useState } from 'react';
import { Sponsor, SponsorshipPackage, Event } from '../types';
import { 
  Building2, Sparkles, Star, TrendingUp, IndianRupee, 
  HelpCircle, ArrowUpRight, CheckCircle2, Award, Lightbulb, Grid
} from 'lucide-react';

interface SponsorViewProps {
  sponsors: Sponsor[];
  packages: SponsorshipPackage[];
  events: Event[];
  onAddSponsor: (newSponsor: Sponsor) => void;
  onSelectPackage: (sponsorId: string, eventId: string, budgetAmount: number) => void;
}

export default function SponsorView({
  sponsors,
  packages,
  events,
  onAddSponsor,
  onSelectPackage,
}: SponsorViewProps) {
  // Simulator State: Target Sponsor being monitored
  const [activeSponsorId, setActiveSponsorId] = useState<string>(sponsors[0]?.id || '');

  // Form onboarding state
  const [newSponsorName, setNewSponsorName] = useState('');
  const [newSponsorCompany, setNewSponsorCompany] = useState('');
  const [newSponsorIndustry, setNewSponsorIndustry] = useState('Artificial Intelligence');
  const [newSponsorBudget, setNewSponsorBudget] = useState(6000);
  const [newSponsorAudience, setNewSponsorAudience] = useState('Developers and Engineering Students');

  const activeSponsor = sponsors.find(s => s.id === activeSponsorId);

  // -------------------------
  // SPONSOR EVENT RECOMMENDATION ENGINE
  // -------------------------
  // Analyzes sponsor characteristics and returns recommended alignment matching
  const getRecommendation = (sponsor: Sponsor) => {
    let bestEvent = events[0];
    let score = 70;
    let reason = "Broad spectrum general event outreach alignment.";

    const industryLower = sponsor.industry.toLowerCase();
    const audienceLower = sponsor.targetAudience.toLowerCase();

    if (industryLower.includes('hardware') || industryLower.includes('artificial intelligence') || industryLower.includes('ai') || industryLower.includes('ml')) {
      const match = events.find(e => e.category === 'Workshop');
      if (match) {
        bestEvent = match;
        score = 98;
        reason = "A perfect synergy! The academic depth matches your target AI/ML cohort directly with minimal brand noise dilution.";
      }
    } else if (industryLower.includes('finance') || industryLower.includes('payments') || industryLower.includes('hacker') || industryLower.includes('development')) {
      const match = events.find(e => e.category === 'Hackathon');
      if (match) {
        bestEvent = match;
        score = 94;
        reason = "Outstanding fit! Hackers seek APIs and custom infrastructure tools. Direct tooling integration yields highest developer loyalty indexes.";
      }
    } else if (industryLower.includes('recreation') || industryLower.includes('creative') || industryLower.includes('design') || industryLower.includes('music')) {
      const match = events.find(e => e.category === 'College Event');
      if (match) {
        bestEvent = match;
        score = 90;
        reason = "High emotional engagement matchup! Vibrant student lifestyle brands capture massive youth volume directly at main auditoriums.";
      }
    }

    return { event: bestEvent, score, reason };
  };

  const handleCreateSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSponsorName.trim() || !newSponsorCompany.trim()) return;

    const newId = `spn-${Date.now()}`;
    const newSpon: Sponsor = {
      id: newId,
      name: newSponsorName,
      company: newSponsorCompany,
      industry: newSponsorIndustry,
      budget: Number(newSponsorBudget),
      targetAudience: newSponsorAudience
    };

    onAddSponsor(newSpon);
    setActiveSponsorId(newId);

    setNewSponsorName('');
    setNewSponsorCompany('');
    alert('Corporate sponsor profile initialized on deck! Matching indexes configured.');
  };

  return (
    <div id="sponsor-workspace" className="space-y-6">
      
      {/* SIMULATOR BANNER */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold">
              Corporate Desk Enabled
            </span>
            <h2 className="text-lg font-bold tracking-tight text-white mt-1 flex items-center gap-1.5">
              <Building2 className="h-5 w-5 text-indigo-400" />
              Sponsorship Alignment & ROI Analyzer
            </h2>
            <p className="text-xs text-slate-400 mt-1">Review active tier alignments, calculate target impressions, and sponsor upcoming events on the fly.</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-300 font-bold pl-2">Viewing Sponsor Profile:</span>
            <select 
              value={activeSponsorId}
              onChange={(e) => setActiveSponsorId(e.target.value)}
              className="text-xs font-semibold bg-slate-900 border-none text-white focus:ring-0 p-1.5 rounded-lg cursor-pointer"
            >
              {sponsors.map(sp => (
                <option key={sp.id} value={sp.id}>{sp.company} ({sp.name})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1: Recommended Event Alignment (Sponsor Matchmaking Engine) */}
        {activeSponsor ? (
          <div className="lg:col-span-2 space-y-6">
            
            {/* MATCHMAKER COMPONENT */}
            {(() => {
              const recommendation = getRecommendation(activeSponsor);
              return (
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Matchmaker Recommendations Engine</span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        Synergy Alignment Recommendation
                      </h3>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-100 animate-pulse">
                      {recommendation.score}% Compatibility Match
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 block max-w-lg">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Recommended Event Alignment</span>
                      <h4 className="text-sm font-bold text-slate-800">{recommendation.event.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">{recommendation.reason}</p>
                    </div>

                    {/* Quick Alignment Action */}
                    {activeSponsor.matchedEventId !== recommendation.event.id && (
                      <button 
                        onClick={() => onSelectPackage(activeSponsor.id, recommendation.event.id, activeSponsor.budget)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs tracking-wide rounded-xl transition whitespace-nowrap cursor-pointer hover:scale-105"
                      >
                        Accept and Fund Spot →
                      </button>
                    )}
                    {activeSponsor.matchedEventId === recommendation.event.id && (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold font-mono">
                        ✓ Sponsored Active
                      </span>
                    )}
                  </div>

                  {/* SPONSOR METRIC ESTIMATOR (ROI REPORTS) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block pb-1">Expected Impressions</span>
                      <span className="text-lg font-black text-slate-800 font-mono">
                        {(activeSponsor.budget * 4.5).toLocaleString()} views
                      </span>
                      <p className="text-[9px] text-slate-400 mt-1">Logo backdrop coverage estimates</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block pb-1">Expected High Quality Leads</span>
                      <span className="text-lg font-black text-slate-800 font-mono">
                        {(activeSponsor.budget / 35).toFixed(0)} profiles
                      </span>
                      <p className="text-[9px] text-slate-400 mt-1">Direct CV access downloads</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block pb-1">Effective Cost-Per-Lead</span>
                      <span className="text-lg font-black text-slate-800 font-mono">
                        ₹2,950.00
                      </span>
                      <p className="text-[9px] text-slate-400 mt-1">Calculated platform thresholds</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* SPONSORSHIP PACKAGES HIGHLIGHTS */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Premium Package Tiers & Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map(pkg => {
                  const ev = events.find(e => e.id === pkg.eventId);
                  return (
                    <div key={pkg.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between shadow-3xs space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start">
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md uppercase ${
                            pkg.tier === 'Diamond' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-900 font-bold'
                          }`}>
                            {pkg.tier} Tier
                          </span>
                          <span className="font-mono font-bold text-slate-900">₹{pkg.price.toLocaleString()}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-800">{pkg.name}</h4>
                        <p className="text-[11px] text-slate-400 italic">Target: {ev?.name}</p>

                        <ul className="space-y-1.5 pt-3">
                          {pkg.benefits.map((b, idx) => (
                            <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {activeSponsor.budget >= pkg.price && activeSponsor.matchedEventId !== pkg.eventId && (
                        <button 
                          onClick={() => onSelectPackage(activeSponsor.id, pkg.eventId, pkg.price)}
                          className="w-full py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition duration-200 font-bold text-xs rounded-xl cursor-pointer"
                        >
                          Unlock Tier Configuration
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : null}

        {/* COLUMN 2: Corporate Onboarding form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-4 h-fit">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <span className="p-1 rounded bg-indigo-50 text-indigo-600 shrink-0">
              <Star className="h-4 w-4" />
            </span>
            Sponsor Portal Intake
          </h3>
          <p className="text-xs text-slate-500">File a profile inside the ecosystem to matching schedules, target cohorts and evaluate expected ROI indexes instantly.</p>

          <form onSubmit={handleCreateSponsor} className="space-y-4 font-sans text-xs">
            <div className="space-y-1">
              <label className="font-bold uppercase text-slate-400">Your Full Representative Name</label>
              <input 
                type="text" 
                value={newSponsorName}
                onChange={e => setNewSponsorName(e.target.value)}
                placeholder="e.g. Fiona Gallagher"
                className="w-full rounded-xl border border-slate-200 p-2 bg-slate-50 text-sm focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase text-slate-400">Corporation / Organization</label>
              <input 
                type="text" 
                value={newSponsorCompany}
                onChange={e => setNewSponsorCompany(e.target.value)}
                placeholder="e.g. MongoDB Core Inc."
                className="w-full rounded-xl border border-slate-200 p-2 bg-slate-50 text-sm focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase text-slate-400">Industry Sector</label>
              <select 
                value={newSponsorIndustry}
                onChange={e => setNewSponsorIndustry(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-xs"
              >
                <option value="Artificial Intelligence">Artificial Intelligence & ML</option>
                <option value="Payments Hardware">Financial Payments Tooling</option>
                <option value="Creative Design Studio">Creative App Design Systems</option>
                <option value="Recreational Energy Drinks">Recreation Brand / Energy Drinks</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase text-slate-400">Target Marketing Budget (₹)</label>
              <input 
                type="number" 
                value={newSponsorBudget}
                onChange={e => setNewSponsorBudget(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 p-2 bg-slate-50 text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase text-slate-400">Specific Target Audience Profile</label>
              <input 
                type="text" 
                value={newSponsorAudience}
                onChange={e => setNewSponsorAudience(e.target.value)}
                placeholder="e.g. senior backend developers & ML leaders"
                className="w-full rounded-xl border border-slate-200 p-2 bg-slate-50 text-sm focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider rounded-xl transition text-[9px] cursor-pointer"
            >
              Configure Matchmaking Setup
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
