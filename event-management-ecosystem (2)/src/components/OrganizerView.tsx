import React, { useState } from 'react';
import { 
  Event, Participant, ExpenseRecord, FeedbackResponse, 
  CommunicationRecord, Volunteer, SponsorshipPackage, Sponsor, Team, TimelineItem
} from '../types';
import { 
  Calendar, Users, Coins, MessageSquare, Plus, CheckCircle2, 
  TrendingUp, IndianRupee, ArrowUpRight, Search, Sparkles, 
  Send, AlertCircle, RefreshCw, BarChart3, Activity, Heart, ShieldAlert,
  Clock, Palette, BellRing, FileDown, Mail, Shuffle, Download, Eye, Layers, Trash2, Printer,
  UserCheck, Shield
} from 'lucide-react';

interface OrganizerViewProps {
  events: Event[];
  participants: Participant[];
  expenses: ExpenseRecord[];
  feedbacks: FeedbackResponse[];
  communications: CommunicationRecord[];
  volunteers: Volunteer[];
  sponsors: Sponsor[];
  teams?: Team[];
  onAddEvent: (newEvent: Event) => void;
  onAddExpense: (newExpense: ExpenseRecord) => void;
  onToggleCheckIn: (participantId: string) => void;
  onAddParticipant: (newParticipant: Participant) => void;
  onSendCommunication: (newComm: CommunicationRecord) => void;
  onUpdateEvent: (updatedEvent: Event) => void;
}

export default function OrganizerView({
  events,
  participants,
  expenses,
  feedbacks,
  communications,
  volunteers,
  sponsors,
  teams = [],
  onAddEvent,
  onAddExpense,
  onToggleCheckIn,
  onAddParticipant,
  onSendCommunication,
  onUpdateEvent,
}: OrganizerViewProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || 'all');
  const [activeTab, setActiveTab] = useState<'analytics' | 'planning' | 'expenses' | 'participants' | 'comms' | 'feedback'>('analytics');

  // Event Planning state
  const [newEventName, setNewEventName] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'Hackathon' | 'Workshop' | 'College Event'>('Hackathon');
  const [newEventBudget, setNewEventBudget] = useState(10000);
  const [newEventVenue, setNewEventVenue] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-06-30');

  // Expense tracker state
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(500);
  const [expenseCategory, setExpenseCategory] = useState<'Logistics' | 'Catering' | 'Marketing' | 'Prizes' | 'Licensing'>('Logistics');
  const [expenseEventId, setExpenseEventId] = useState(events[0]?.id || '');

  // Manual participant add state
  const [newRegName, setNewRegName] = useState('');
  const [newRegEmail, setNewRegEmail] = useState('');
  const [newRegCollege, setNewRegCollege] = useState('');
  const [newRegTicket, setNewRegTicket] = useState<'General' | 'VIP' | 'Observer'>('General');
  const [newRegEventId, setNewRegEventId] = useState(events[0]?.id || '');

  // Communication states
  const [commSubject, setCommSubject] = useState('');
  const [commMessage, setCommMessage] = useState('');
  const [commRecipient, setCommRecipient] = useState('Participants');
  const [commEventId, setCommEventId] = useState(events[0]?.id || '');

  // NEW DYNAMIC STATE MANAGEMENT FOR USER ENHANCEMENTS
  // 1. Export portal
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // 2. Event Timeline Planner States
  const [newTimelineTime, setNewTimelineTime] = useState('09:00 AM');
  const [newTimelineTitle, setNewTimelineTitle] = useState('');
  const [newTimelineDesc, setNewTimelineDesc] = useState('');
  const [newTimelineStage, setNewTimelineStage] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Morning');

  // 3. Automated Banner Generator States
  const [bannerStyle, setBannerStyle] = useState<'cyber' | 'sunrise' | 'emerald' | 'royal' | 'minimal'>('cyber');
  const [bannerTagline, setBannerTagline] = useState('UNLEASH THE FUTURE DIRECTLY');
  const [bannerSpeaker, setBannerSpeaker] = useState('Top Cyber Practitioners');
  const [bannerBadge, setBannerBadge] = useState('100% Free Interactive RSVP');

  // 4. Bulk Messaging dispatch simulator state
  const [commChannel, setCommChannel] = useState<'email' | 'sms' | 'push' | 'slack'>('email');
  const [bulkDispatching, setBulkDispatching] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkLogs, setBulkLogs] = useState<string[]>([]);

  // 5. Event editing states for manual changes
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editVenue, setEditVenue] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editBudget, setEditBudget] = useState(0);
  const [editCategory, setEditCategory] = useState<'Hackathon' | 'Workshop' | 'College Event'>('Hackathon');

  const startEditingEvent = (evt: Event) => {
    setEditingEventId(evt.id);
    setEditName(evt.name);
    setEditVenue(evt.venue);
    setEditDate(evt.date);
    setEditDesc(evt.description);
    setEditBudget(evt.budget);
    setEditCategory(evt.category);
  };

  const saveEditedEvent = (evtId: string) => {
    onUpdateEvent({
      id: evtId,
      name: editName,
      description: editDesc,
      date: editDate,
      venue: editVenue,
      category: editCategory,
      budget: Number(editBudget),
      status: events.find(e => e.id === evtId)?.status || 'Active',
      bannerColor: events.find(e => e.id === evtId)?.bannerColor || 'from-indigo-600 to-indigo-950',
      timeline: events.find(e => e.id === evtId)?.timeline || []
    });
    setEditingEventId(null);
  };

  // SEARCH filters
  const [participantSearch, setParticipantSearch] = useState('');

  // Quick event adding within view scope
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddName, setQuickAddName] = useState('');

  const handleQuickAddEventName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddName.trim()) return;

    const bannerColors = [
      'from-blue-600 to-indigo-900',
      'from-emerald-600 to-teal-900',
      'from-amber-600 to-rose-950',
      'from-violet-600 to-fuchsia-950',
      'from-cyan-600 to-blue-900'
    ];
    const randomColor = bannerColors[events.length % bannerColors.length];

    const newEvtId = `evt-${events.length + 1}`;
    onAddEvent({
      id: newEvtId,
      name: quickAddName.trim(),
      description: "Quick-created event. You can customize this description, budget, category, or venue below.",
      date: new Date().toISOString().split('T')[0],
      venue: "Main Auditorium",
      category: "Hackathon",
      budget: 15000,
      bannerColor: randomColor,
      status: 'Active',
    });

    setSelectedEventId(newEvtId);
    setQuickAddName('');
    setShowQuickAdd(false);
  };


  // -------------------------
  // COMPUTED ANALYTICS DATA
  // -------------------------
  const filteredEvents = selectedEventId === 'all' ? events : events.filter(e => e.id === selectedEventId);

  // Filter participants
  const filteredParticipants = participants.filter(p => {
    const matchesEvent = selectedEventId === 'all' || p.eventId === selectedEventId;
    const matchesSearch = p.name.toLowerCase().includes(participantSearch.toLowerCase()) || 
                          p.email.toLowerCase().includes(participantSearch.toLowerCase()) || 
                          p.college.toLowerCase().includes(participantSearch.toLowerCase());
    return matchesEvent && matchesSearch;
  });

  // Calculate current event's financials
  const totalBudgetBudget = filteredEvents.reduce((acc, curr) => acc + curr.budget, 0);
  const eventExpenses = expenses.filter(exp => selectedEventId === 'all' || exp.eventId === selectedEventId);
  const totalSpent = eventExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBudget = totalBudgetBudget - totalSpent;
  const utilizationPercentage = totalBudgetBudget > 0 ? Math.min(100, (totalSpent / totalBudgetBudget) * 100) : 0;

  // Feedback statistics
  const eventFeedbacks = feedbacks.filter(fb => selectedEventId === 'all' || fb.eventId === selectedEventId);
  const averageRating = eventFeedbacks.length > 0
    ? (eventFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / eventFeedbacks.length).toFixed(1)
    : 'N/A';

  // Count participants per event
  const getParticipantCount = (evtId: string) => participants.filter(p => p.eventId === evtId).length;
  const getCheckedInCount = (evtId: string) => participants.filter(p => p.eventId === evtId && p.checkedIn).length;

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim() || !newEventVenue.trim()) return;

    const bannerColors = [
      'from-blue-600 to-indigo-900',
      'from-emerald-600 to-teal-900',
      'from-amber-600 to-rose-950',
      'from-violet-600 to-fuchsia-950',
      'from-cyan-600 to-blue-900'
    ];
    const randomColor = bannerColors[events.length % bannerColors.length];

    onAddEvent({
      id: `evt-${events.length + 1}`,
      name: newEventName,
      description: newEventDesc,
      date: newEventDate,
      venue: newEventVenue,
      category: newEventCategory,
      budget: Number(newEventBudget),
      bannerColor: randomColor,
      status: 'Planning',
    });

    setNewEventName('');
    setNewEventDesc('');
    setNewEventVenue('');
    setActiveTab('analytics');
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDesc.trim() || expenseAmount <= 0) return;

    onAddExpense({
      id: `exp-${expenses.length + 1}`,
      eventId: expenseEventId,
      description: expenseDesc,
      amount: Number(expenseAmount),
      category: expenseCategory,
      date: new Date().toISOString().split('T')[0],
    });

    setExpenseDesc('');
    setExpenseAmount(500);
  };

  const handleManualRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegName.trim() || !newRegEmail.trim()) return;

    onAddParticipant({
      id: `p-${participants.length + 1}`,
      name: newRegName,
      email: newRegEmail,
      college: newRegCollege || 'Independent Tech Scholar',
      ticketType: newRegTicket,
      eventId: newRegEventId,
      registeredAt: new Date().toISOString(),
      checkedIn: false,
      paymentStatus: newRegTicket === 'VIP' ? 'Paid' : 'Free'
    });

    setNewRegName('');
    setNewRegEmail('');
    setNewRegCollege('');
  };

  // -------------------------
  // TIMELINE ACTIONS
  // -------------------------
  const handleAddTimelineItem = (evtId: string) => {
    if (!newTimelineTitle.trim()) return;
    const evt = events.find(e => e.id === evtId);
    if (!evt) return;

    const newItems: TimelineItem[] = [
      ...(evt.timeline || []),
      {
        id: `tl-${Date.now()}`,
        time: newTimelineTime,
        title: newTimelineTitle,
        description: newTimelineDesc,
        stage: newTimelineStage,
        completed: false
      }
    ].sort((a, b) => a.time.localeCompare(b.time));

    onUpdateEvent({
      ...evt,
      timeline: newItems
    });
    
    setNewTimelineTitle('');
    setNewTimelineDesc('');

    // Audio-feedback chime
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {}
  };

  const handleToggleTimelineItem = (evtId: string, itemId: string) => {
    const evt = events.find(e => e.id === evtId);
    if (!evt) return;
    const nextTimeline = (evt.timeline || []).map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdateEvent({
      ...evt,
      timeline: nextTimeline
    });
  };

  const handleDeleteTimelineItem = (evtId: string, itemId: string) => {
    const evt = events.find(e => e.id === evtId);
    if (!evt) return;
    const nextTimeline = (evt.timeline || []).filter(item => item.id !== itemId);
    onUpdateEvent({
      ...evt,
      timeline: nextTimeline
    });
  };

  const handleAutoGenerateTimeline = (evtId: string) => {
    const evt = events.find(e => e.id === evtId);
    if (!evt) return;

    let items: TimelineItem[] = [];
    if (evt.category === 'Hackathon') {
      items = [
        { id: `tl-1-${Date.now()}`, time: '08:00 AM', title: 'Gate Entrance & Registration Desk', description: 'Log initial participant check-ins and dispense hacker NFC badge sets and visual templates.', stage: 'Morning', completed: false },
        { id: `tl-2-${Date.now()}`, time: '10:00 AM', title: 'Opening ceremony and Rules briefing', description: 'Introduce corporate sponsors, layout assessment rules, and configure local chat feeds.', stage: 'Morning', completed: false },
        { id: `tl-3-${Date.now()}`, time: '01:30 PM', title: 'Mentor Team Routing Rounds', description: 'Allocate student volunteers to troubleshoot active coding dependencies in real time.', stage: 'Afternoon', completed: false },
        { id: `tl-4-${Date.now()}`, time: '06:00 PM', title: 'Pitch Deck Clinic Workshop', description: 'Specialized seminar highlighting layout design, demo presentations, and value statements.', stage: 'Evening', completed: false },
        { id: `tl-5-${Date.now()}`, time: '11:30 PM', title: 'Checkpoint Alpha Project Submission', description: 'Verify current team rosters and validate code repository paths directly.', stage: 'Night', completed: false }
      ];
    } else if (evt.category === 'Workshop') {
      items = [
        { id: `tl-1-${Date.now()}`, time: '09:00 AM', title: 'Pre-requisite Library Validation', description: 'Deploy core package states, import local models, and setup development notebook containers.', stage: 'Morning', completed: false },
        { id: `tl-2-${Date.now()}`, time: '11:15 AM', title: 'Practical Deep Dive: Training Runs', description: 'Perform supervised structural training using the provided campus cloud GPU cluster.', stage: 'Morning', completed: false },
        { id: `tl-3-${Date.now()}`, time: '02:00 PM', title: 'Expert Panels & Networking Break', description: 'Corporate sponsors showcase state-of-the-art enterprise tools over tea/coffee.', stage: 'Afternoon', completed: false },
        { id: `tl-4-${Date.now()}`, time: '04:30 PM', title: 'Hands-on API Inference Lab', description: 'Build and deploy an active micro-service endpoint delivering realtime inference.', stage: 'Afternoon', completed: false }
      ];
    } else {
      items = [
        { id: `tl-1-${Date.now()}`, time: '10:30 AM', title: 'Campus Exhibition Gates Open', description: 'Admit observer pass holders and configure physical live staging panels.', stage: 'Morning', completed: false },
        { id: `tl-2-${Date.now()}`, time: '02:00 PM', title: 'Spotlight Showcases & Stage Acts', description: 'Live inter-collegiate dance tracks, musical showcases, and theater events.', stage: 'Afternoon', completed: false },
        { id: `tl-3-${Date.now()}`, time: '06:00 PM', title: 'Gala Dinner & Student Mixer', description: 'Social icebreaker games accompanied by dining arrays and volunteer badges.', stage: 'Evening', completed: false },
        { id: `tl-4-${Date.now()}`, time: '08:30 PM', title: 'Elite Awards Ceremony', description: 'Disburse prize currencies to winners and provide observer feedback reviews.', stage: 'Evening', completed: false }
      ];
    }

    onUpdateEvent({
      ...evt,
      timeline: items
    });
  };

  // -------------------------
  // BANNER GENERATOR ACTIONS
  // -------------------------
  const handleApplyGeneratedBanner = (evtId: string) => {
    const evt = events.find(e => e.id === evtId);
    if (!evt) return;

    let gradientColorStr = 'from-blue-600 to-indigo-900';
    if (bannerStyle === 'cyber') gradientColorStr = 'from-purple-600 via-fuchsia-900 to-slate-950';
    else if (bannerStyle === 'sunrise') gradientColorStr = 'from-orange-500 via-rose-600 to-purple-950';
    else if (bannerStyle === 'emerald') gradientColorStr = 'from-emerald-500 via-teal-800 to-slate-950';
    else if (bannerStyle === 'royal') gradientColorStr = 'from-blue-600 via-indigo-900 to-black';
    else if (bannerStyle === 'minimal') gradientColorStr = 'from-slate-700 via-indigo-950 to-zinc-950';

    onUpdateEvent({
      ...evt,
      bannerColor: gradientColorStr,
      description: `${evt.description.split(' | Keynote:')[0]} | Keynote: ${bannerSpeaker} (${bannerTagline})`
    });

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch (e) {}

    alert(`Success: Interactive visual graphics successfully applied to "${evt.name}".`);
  };

  const handleDownloadSVGBanner = (evtId: string) => {
    const evt = events.find(e => e.id === evtId);
    if (!evt) return;

    let fill1 = '#8b5cf6', fill2 = '#4c1d95', fill3 = '#020617';
    if (bannerStyle === 'sunrise') { fill1 = '#f97316'; fill2 = '#e11d48'; fill3 = '#3b0764'; }
    else if (bannerStyle === 'emerald') { fill1 = '#10b981'; fill2 = '#115e59'; fill3 = '#090d16'; }
    else if (bannerStyle === 'royal') { fill1 = '#2563eb'; fill2 = '#312e81'; fill3 = '#000000'; }
    else if (bannerStyle === 'minimal') { fill1 = '#475569'; fill2 = '#1e1b4b'; fill3 = '#09090b'; }

    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${fill1}" />
            <stop offset="50%" stop-color="${fill2}" />
            <stop offset="100%" stop-color="${fill3}" />
          </linearGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#g)" />
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        <circle cx="200" cy="150" r="100" fill="rgba(255,255,255,0.02)" />
        <circle cx="1000" cy="450" r="250" fill="rgba(255,255,255,0.01)" />
        
        <!-- Frame Accents -->
        <rect x="30" y="30" width="1140" height="570" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
        <path d="M 50 30 L 150 30" stroke="#fff" stroke-width="4" />
        <path d="M 30 50 L 30 150" stroke="#fff" stroke-width="4" />
        
        <!-- Category Pill -->
        <g transform="translate(80, 100)">
          <rect width="180" height="36" rx="18" fill="rgba(255,255,255,0.15)" />
          <text x="90" y="22" font-family="'Inter', sans-serif" font-weight="900" font-size="12" fill="#fff" letter-spacing="1.5" text-anchor="middle" transform="translate(0, 1)">${evt.category.toUpperCase()}</text>
        </g>
        
        <!-- Banner Tagline -->
        <text x="80" y="200" font-family="'Courier New', monospace" font-weight="bold" font-size="20" fill="${fill1}" letter-spacing="4">${bannerTagline}</text>
        
        <!-- Title -->
        <text x="80" y="280" font-family="'Inter', sans-serif" font-weight="900" font-size="54" fill="#ffffff" letter-spacing="-1.5">${evt.name}</text>
        
        <!-- Sub-text -->
        <text x="80" y="340" font-family="'Inter', sans-serif" font-weight="normal" font-size="18" fill="rgba(255,255,255,0.75)">${evt.venue} &bull; ${evt.date}</text>
        
        <!-- Speaker / Features Highlight badge -->
        <g transform="translate(80, 400)">
          <rect width="450" height="85" rx="12" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
          <text x="24" y="35" font-family="'Inter', sans-serif" font-weight="bold" font-size="12" fill="rgba(255,255,255,0.4)" letter-spacing="1">FEATURING SPEAKER / GUEST</text>
          <text x="24" y="60" font-family="'Inter', sans-serif" font-weight="900" font-size="22" fill="#ffffff">${bannerSpeaker}</text>
        </g>
        
        <!-- Stamp Indicator Badge -->
        <g transform="translate(1000, 100)">
          <circle cx="50" cy="50" r="50" fill="${fill1}" opacity="0.8" />
          <text x="50" y="55" font-family="'Inter', sans-serif" font-weight="bold" font-size="11" fill="#fff" text-anchor="middle" letter-spacing="0.5">${bannerBadge.split(' ')[0]}</text>
        </g>

        <!-- Platform Stamp -->
        <text x="1120" y="565" font-family="'Courier New', monospace" font-size="10" fill="rgba(255,255,255,0.3)" text-anchor="end">CAMPUS ECOSYSTEM SYSTEM ID &bull; PERSISTED</text>
      </svg>
    `;

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", url);
    downloadLink.setAttribute("download", `promotional_banner_${evt.id}_${bannerStyle}.svg`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  // -------------------------
  // BULK MESSAGING SIMULATOR
  // -------------------------
  const handleBulkMessagingDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commSubject.trim() || !commMessage.trim() || bulkDispatching) return;

    // Filter recipients based on selection
    let targets: Participant[] = [];
    if (commRecipient === 'Participants') {
      targets = participants;
    } else if (commRecipient === 'On-Duty-Volunteers') {
      // Create simulated recipients if volunteers
      targets = volunteers.map(v => ({
        id: v.id,
        name: v.name,
        email: v.email,
        college: 'Student Support Roster',
        ticketType: 'Observer',
        eventId: commEventId,
        registeredAt: '',
        checkedIn: true,
        paymentStatus: 'Free'
      }));
    } else {
      // Registered delegates
      targets = participants.filter(p => p.ticketType === 'VIP');
    }

    if (targets.length === 0) {
      alert("Warning: Selected recipient list matches 0 active profiles.");
      return;
    }

    setBulkDispatching(true);
    setBulkProgress(0);
    setBulkLogs([`[System] Initializing Multi-Channel Gateway for "${commSubject}"`, `[Registry] Detected ${targets.length} target records for transmission.`]);

    let idx = 0;
    const totalTargets = targets.length;
    const intervalTime = Math.max(100, Math.min(600, 3000 / totalTargets)); // Smooth pacing

    const timer = setInterval(() => {
      if (idx < totalTargets) {
        const p = targets[idx];
        const eventName = events.find(ev => ev.id === p.eventId)?.name || 'Campus Event';
        
        // Render templates
        const renderedBody = commMessage
          .replace(/{{name}}/g, p.name)
          .replace(/{{college}}/g, p.college)
          .replace(/{{ticket}}/g, p.ticketType)
          .replace(/{{event}}/g, eventName);

        const channelLabel = commChannel.toUpperCase();
        const nextLog = `[${channelLabel}] Queued match to: ${p.name} (${p.email}) - SUCCESS`;
        
        setBulkLogs(prev => [...prev, nextLog]);
        setBulkProgress(Math.floor(((idx + 1) / totalTargets) * 100));
        idx++;

        // Add soft ticker sounds
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.frequency.setValueAtTime(idx % 2 === 0 ? 987.77 : 1046.50, audioCtx.currentTime); // Hissing beeps
          gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.04);
        } catch (err) {}

      } else {
        clearInterval(timer);
        
        // Push final aggregated record to communications activity log in parent
        onSendCommunication({
          id: `comm-bulk-${Date.now()}`,
          eventId: commEventId,
          sender: 'Ecosystem Automated Hub',
          recipientGroup: `${commRecipient} (${commChannel.toUpperCase()} Batch)`,
          subject: commSubject,
          message: commMessage,
          sentAt: new Date().toISOString()
        });

        // Add closing log
        setBulkLogs(prev => [...prev, `[System] ALL TRANSMISSIONS ENGULFED SUCCESSFULLY. ${totalTargets} messages verified.`]);
        
        // Final chime
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'sine';
          osc.frequency.value = 523.25; // C5
          osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.3); // High swipe
          gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.35);
        } catch (e) {}

        // Complete! Wait briefly then dismiss progress screen
        setTimeout(() => {
          setBulkDispatching(false);
          setCommSubject('');
          setCommMessage('');
          alert(`Bulk Messaging Broadcast Decoded! Sent ${totalTargets} simulated notifications successfully on channel: ${commChannel.toUpperCase()}`);
        }, 1200);
      }
    }, intervalTime);
  };

  const insertVariableTag = (tag: string) => {
    setCommMessage(prev => prev + ` {{${tag}}}`);
  };

  // -------------------------
  // EXPORTER IMPLEMENTATION
  // -------------------------
  const generateCSV = (headers: string[], rows: string[][], filename: string) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportParticipants = () => {
    const headers = ['ID', 'Name', 'Email', 'College/Organization', 'Ticket Level', 'Event Connected', 'Registration Date', 'Turnout Status'];
    const rows = participants.map(p => {
      const evtName = events.find(e => e.id === p.eventId)?.name || 'N/A';
      return [
        p.id,
        p.name,
        p.email,
        p.college,
        p.ticketType,
        evtName,
        p.registeredAt,
        p.checkedIn ? 'Checked-In' : 'Registered/No-Show'
      ];
    });
    generateCSV(headers, rows, `participants_ledger_${Date.now()}.csv`);
  };

  const handleExportExpenses = () => {
    const headers = ['ID', 'Event Target', 'Description/Particular', 'Amount (INR)', 'Category', 'Post Date'];
    const rows = expenses.map(e => {
      const evtName = events.find(evt => evt.id === e.eventId)?.name || 'N/A';
      return [
        e.id,
        evtName,
        e.description,
        e.amount.toString(),
        e.category,
        e.date
      ];
    });
    generateCSV(headers, rows, `expenses_ledger_${Date.now()}.csv`);
  };

  const handleExportVolunteers = () => {
    const headers = ['ID', 'Name', 'Email', 'Expert Skills', 'Current Availability Status', 'Reward Points'];
    const rows = volunteers.map(v => [
      v.id,
      v.name,
      v.email,
      v.skills.join(' | '),
      v.availability,
      v.points.toString()
    ]);
    generateCSV(headers, rows, `volunteers_roster_${Date.now()}.csv`);
  };

  const handleExportEcosystemJSON = () => {
    const bundle = {
      events,
      participants,
      expenses,
      volunteers,
      sponsors,
      teams,
      communications,
      feedbacks,
      exportDate: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ecosystem_complete_state_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  return (
    <div id="organizer-workspace" className="space-y-6">
      
      {/* FILTER HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Activity className="h-5 w-5" />
            </span>
            Ecosystem Organizer Console
          </h2>
          <p className="text-sm text-slate-500 mt-1">Cross-workflow monitoring, automated participant tables, and real-time expense oversight.</p>
        </div>

        {/* Dynamic Selector of Events */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">View Scope:</span>
            {!showQuickAdd ? (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1">
                <select 
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="bg-transparent border-0 py-1.5 px-2 text-sm font-medium text-slate-700 focus:outline-hidden select-none outline-hidden cursor-pointer"
                >
                  <option value="all">🌐 All Ecosystem Events</option>
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.category === 'Hackathon' ? '🏆' : evt.category === 'Workshop' ? '🧠' : '🎉'} {evt.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowQuickAdd(true)}
                  className="p-1 bg-white hover:bg-indigo-50 text-indigo-600 rounded-lg transition border border-slate-100 flex items-center justify-center cursor-pointer shadow-3xs"
                  title="Add custom event name directly to scope"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuickAddEventName} className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 rounded-xl px-2 py-1 animate-fade-in shadow-2xs">
                <input
                  type="text"
                  placeholder="Enter Event Title..."
                  value={quickAddName}
                  onChange={e => setQuickAddName(e.target.value)}
                  className="bg-white px-2.5 py-1 text-xs rounded-lg border border-indigo-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-44 font-bold text-slate-800 placeholder-slate-400"
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center w-6 h-6 shadow-3xs"
                  title="Save Event"
                >
                  ✓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickAdd(false);
                    setQuickAddName('');
                  }}
                  className="p-1 hover:bg-slate-200/50 text-slate-500 hover:text-slate-700 font-bold text-xs rounded-lg cursor-pointer flex items-center justify-center w-6 h-6"
                  title="Cancel"
                >
                  ✕
                </button>
              </form>
            )}
          </div>

          <button 
            type="button"
            onClick={() => setShowExportModal(true)}
            className="rounded-xl bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 px-4.5 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FileDown className="h-4 w-4 text-emerald-400" />
            Universal Exporter
          </button>
        </div>
      </div>

      {/* QUICK TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          📈 Real-Time Analytics
        </button>
        <button
          onClick={() => setActiveTab('planning')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'planning'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          ✏️ Event Planning Node
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'expenses'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          💸 Expense Overseer ({expenses.length})
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'participants'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          👥 Registrants & Turnout ({filteredParticipants.length})
        </button>
        <button
          onClick={() => setActiveTab('comms')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'comms'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          📣 Broadcast Hub
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'feedback'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          ⭐ Feedback & Sentiments
        </button>
      </div>

      {/* TAB CONTENT PAGES */}

      {/* Tab 1: Analytics Dashboard */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Allocated Budget</span>
                <Coins className="h-5 w-5 text-indigo-500" />
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">₹{totalBudgetBudget.toLocaleString()}</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                <span>Across {filteredEvents.length} events scope</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Ecosystem Outflow</span>
                <IndianRupee className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">₹{totalSpent.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-amber-600 font-medium">
                <span>{utilizationPercentage.toFixed(1)}% safe threshold utilized</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Roster Registrants</span>
                <Users className="h-5 w-5 text-teal-500" />
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {participants.filter(p => selectedEventId === 'all' || p.eventId === selectedEventId).length}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-teal-600 font-medium">
                <CheckCircle2 className="h-3 w-3" />
                <span>{participants.filter(p => (selectedEventId === 'all' || p.eventId === selectedEventId) && p.checkedIn).length} actively checked in</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Delegate Sentiment</span>
                <Heart className="h-5 w-5 text-rose-500 animate-pulse" />
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">{averageRating} ★</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                <span>Based on {eventFeedbacks.length} survey replies</span>
              </div>
            </div>
          </div>

          {/* Interactive Core Analytical Chart Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart Module 1: Budget Utilization */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                Budget vs. Expenditure Outlays
              </h3>
              
              <div className="space-y-5">
                {filteredEvents.map(evt => {
                  const evtBudget = evt.budget;
                  const evtSpent = expenses.filter(ex => ex.eventId === evt.id).reduce((sum, current) => sum + current.amount, 0);
                  const pct = Math.min(100, evtBudget > 0 ? (evtSpent / evtBudget) * 100 : 0);
                  return (
                    <div key={evt.id} className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-800 font-semibold truncate max-w-[200px]">{evt.name}</span>
                        <span className="text-slate-500 font-mono">₹{evtSpent.toLocaleString()} spent / ₹{evtBudget.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden flex">
                        <div 
                          style={{ width: `${pct}%` }} 
                          className={`h-full rounded-full transition-all duration-500 ${pct > 90 ? 'bg-rose-500' : pct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <span className={`inline-block w-2 bg-slate-400 rounded-full h-2 ${pct > 90 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                          {pct > 90 ? 'Approaching Limit' : 'Affordable Safe'}
                        </span>
                        <span className="font-bold text-slate-600">{pct.toFixed(0)}% Utl.</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart Module 2: Turnout Ratios */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                Participant Target Attendance & Engagement Index
              </h3>

              <div className="space-y-6">
                {filteredEvents.map(evt => {
                  const totalReg = getParticipantCount(evt.id);
                  const checkedIn = getCheckedInCount(evt.id);
                  const turnoutPct = totalReg > 0 ? (checkedIn / totalReg) * 100 : 0;
                  return (
                    <div key={evt.id} className="flex items-center gap-4">
                      {/* Interactive Donut Core or Progress Ring using minimal clean SVG */}
                      <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="28" cy="28" r="24" className="stroke-slate-100" strokeWidth="4" fill="transparent" />
                          <circle 
                            cx="28" 
                            cy="28" 
                            r="24" 
                            className="stroke-emerald-500 transition-all duration-500" 
                            strokeWidth="4" 
                            fill="transparent" 
                            strokeDasharray={150}
                            strokeDashoffset={150 - (150 * turnoutPct) / 100}
                          />
                        </svg>
                        <span className="absolute text-[10px] font-mono font-bold text-slate-700">{turnoutPct.toFixed(0)}%</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{evt.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Roster: <b className="text-slate-700 font-semibold">{totalReg}</b> registered / <b className="text-emerald-600">{checkedIn}</b> checked-in.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Quick Ecosystem Health and Alerts Panel */}
          <div className="bg-amber-50/50 border border-amber-200/60 p-5 rounded-2xl flex flex-col md:flex-row items-start gap-4">
            <span className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0 mt-0.5">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-950">Ecosystem Health Diagnostic Alerts: ({events.filter(e => e.status === 'Planning').length} events awaiting checkins)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ensure that all assigned student volunteers review their designated gate credentials on time. Currently, <b>{volunteers.filter(v => v.availability === 'Available').length} volunteers</b> are listed as fully available with <b>{participants.filter(p => !p.checkedIn).length} pending</b> ticketing confirmations. Use the broad notifications hub tab to issue automated gate maps.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Event Planning Node */}
      {activeTab === 'planning' && (
        <div id="event-plan-editor" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 lg:col-span-1 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="p-1 rounded bg-indigo-50 text-indigo-600">
                <Plus className="h-4 w-4" />
              </span>
              Blueprint Event Intake
            </h3>
            <p className="text-xs text-slate-500">Initiate configuration for incoming custom campus hackathons or masterclass workshops directly into the state.</p>

            <form onSubmit={handleCreateEvent} className="space-y-4 mt-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Event Title</label>
                <input 
                  type="text" 
                  value={newEventName}
                  onChange={e => setNewEventName(e.target.value)}
                  placeholder="e.g. BioTech Hack-X" 
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Brief Agenda Summary</label>
                <textarea 
                  value={newEventDesc}
                  onChange={e => setNewEventDesc(e.target.value)}
                  placeholder="Objectives, deliverables, targeted outcomes..." 
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50 h-20 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Category</label>
                  <select 
                    value={newEventCategory}
                    onChange={e => setNewEventCategory(e.target.value as any)}
                    className="w-full text-sm border border-slate-200 rounded-xl p-2.5 bg-slate-50"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="College Event">College Event</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Budget Allocation (₹)</label>
                  <input 
                    type="number" 
                    value={newEventBudget}
                    onChange={e => setNewEventBudget(Number(e.target.value))}
                    className="w-full text-sm border border-slate-200 rounded-xl p-2.5 bg-slate-50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Venue Location</label>
                <input 
                  type="text" 
                  value={newEventVenue}
                  onChange={e => setNewEventVenue(e.target.value)}
                  placeholder="e.g. Science Block Annex"
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Target Setup Date</label>
                <input 
                  type="date" 
                  value={newEventDate}
                  onChange={e => setNewEventDate(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 bg-slate-50"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-xs cursor-pointer"
              >
                Publish Event Blueprint
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Currently Stored Event Configurations ({events.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map(evt => {
                const totalSpentOnEvt = expenses.filter(ex => ex.eventId === evt.id).reduce((sum, curr) => sum + curr.amount, 0);
                const isEditing = editingEventId === evt.id;

                return (
                  <div key={evt.id} className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm hover:shadow-md transition duration-150">
                    {isEditing ? (
                      <div className="p-4 space-y-3 bg-linear-to-b from-slate-50 to-slate-100">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                          <span className="text-[10px] font-black text-indigo-600 uppercase">✏️ Edit Event Details</span>
                          <button 
                            type="button" 
                            onClick={() => setEditingEventId(null)}
                            className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                          >
                            Cancel
                          </button>
                        </div>

                        {/* Title Input */}
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold text-slate-500 uppercase">Event Title</label>
                          <input 
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full text-xs font-bold border border-slate-250 rounded-lg p-2 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        {/* Description Input */}
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold text-slate-500 uppercase">Description / Agenda</label>
                          <textarea 
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="w-full text-xs border border-slate-250 rounded-lg p-2 bg-white text-slate-800 h-16 resize-none focus:outline-hidden"
                            required
                          />
                        </div>

                        {/* Category & Budget */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-500 uppercase">Category</label>
                            <select 
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value as any)}
                              className="w-full text-xs border border-slate-250 rounded-lg p-1.5 bg-white text-slate-800 focus:outline-hidden"
                            >
                              <option value="Hackathon">🏆 Hackathon</option>
                              <option value="Workshop">⚡ Workshop</option>
                              <option value="College Event">🎭 College Event</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-500 uppercase">Budget (₹)</label>
                            <input 
                              type="number"
                              value={editBudget}
                              onChange={(e) => setEditBudget(Number(e.target.value))}
                              className="w-full text-xs border border-slate-250 rounded-lg p-1.5 bg-white text-slate-800 focus:outline-hidden"
                              required
                            />
                          </div>
                        </div>

                        {/* Date & Venue */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-500 uppercase">Planned Date</label>
                            <input 
                              type="text"
                              value={editDate}
                              onChange={(e) => setEditDate(e.target.value)}
                              placeholder="YYYY-MM-DD"
                              className="w-full text-xs border border-slate-250 rounded-lg p-1.5 bg-white font-mono text-slate-800 focus:outline-hidden"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-500 uppercase">Venue</label>
                            <input 
                              type="text"
                              value={editVenue}
                              onChange={(e) => setEditVenue(e.target.value)}
                              className="w-full text-xs border border-slate-250 rounded-lg p-1.5 bg-white text-slate-800 focus:outline-hidden"
                              required
                            />
                          </div>
                        </div>

                        {/* Save Action */}
                        <button
                          type="button"
                          onClick={() => saveEditedEvent(evt.id)}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                        >
                          💾 Save Event Changes
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className={`p-4 bg-linear-to-r ${evt.bannerColor} text-white relative group`}>
                          <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full inline-block mb-2">
                            {evt.category}
                          </span>
                          <h4 className="font-bold text-base tracking-tight truncate">{evt.name}</h4>
                          <p className="text-xs text-white/80 line-clamp-2 mt-1 min-h-[32px]">{evt.description}</p>
                        </div>

                        <div className="p-4 space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Planned Date</span>
                              <span className="font-semibold text-slate-800 font-mono">{evt.date}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Venue Space</span>
                              <span className="font-semibold text-slate-800 truncate block">{evt.venue}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Budget Utilization</span>
                              <span className="font-mono font-bold text-slate-800">₹{totalSpentOnEvt.toLocaleString()} / ₹{evt.budget.toLocaleString()}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                              evt.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {evt.status}
                            </span>
                          </div>

                          {/* Quick Manual trigger button to change names/details */}
                          <div className="pt-2.5 border-t border-dashed border-slate-150 flex justify-end">
                            <button
                              type="button"
                              onClick={() => startEditingEvent(evt)}
                              className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 border border-indigo-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              ✏️ Edit Details &amp; Name
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* TIMELINE SCHEDULER & BANNER GENERATOR SECTION */}
          <div className="mt-8 bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black tracking-tight flex items-center gap-2 text-white">
                <span className="p-1 px-1.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-900">
                  <Layers className="h-5 w-5 animate-pulse" />
                </span>
                Active Event Execution Suite
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Customize operational chronologies and automatically synthesize high-fidelity graphical promotion assets for marketing grids.
              </p>
            </div>

            {selectedEventId === 'all' ? (
              <div className="p-8 text-center bg-slate-950/65 rounded-xl border border-dashed border-slate-800 space-y-3">
                <div className="p-3 bg-indigo-950/40 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-indigo-400 border border-indigo-900/60 font-black text-sm">
                  💡
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-200">View Scope Constraint Active</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                    Select a <b>specific active event</b> from the "View Scope" dropdown in the top action filter bar above to unlock high-fidelity Timeline Chronologies and the Graphical Banner builder.
                  </p>
                </div>
              </div>
            ) : (
              (() => {
                const activeEvt = events.find(e => e.id === selectedEventId);
                if (!activeEvt) return null;
                const activeTimeline = activeEvt.timeline || [];

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* PANEL A: CHRONOLOGICAL TIMELINE PATHWAY */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">CHRONOLOGICAL PATHWAY</span>
                          <h4 className="text-sm font-bold text-slate-100">{activeEvt.name} Schedule</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAutoGenerateTimeline(activeEvt.id)}
                          className="px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-900 rounded-lg text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer transition"
                        >
                          <Shuffle className="h-3.5 w-3.5" />
                          Auto-Install Setup
                        </button>
                      </div>

                      {/* Visual Timeline Stream list */}
                      <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800 max-h-80 overflow-y-auto">
                        {activeTimeline.length === 0 ? (
                          <div className="p-6 text-center space-y-1">
                            <Clock className="h-8 w-8 text-slate-600 mx-auto animate-pulse" />
                            <p className="text-xs font-bold text-slate-400">Chronology Grid Empty</p>
                            <p className="text-[10px] text-slate-500">Click &apos;Auto-Install Setup&apos; to instantly configure standardized pathways based on event classification.</p>
                          </div>
                        ) : (
                          <div className="space-y-4 relative pl-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                            {activeTimeline.map((item) => (
                              <div key={item.id} className="relative group transition duration-200">
                                {/* Chronology Circle Bullet */}
                                <div className={`absolute -left-[14px] top-1 w-3 h-3 rounded-full border-2 transition ${
                                  item.completed 
                                    ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_6px_#10b981]' 
                                    : 'bg-slate-950 border-slate-700'
                                }`} />

                                <div className="flex justify-between items-start gap-2">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-mono text-[10px] font-bold text-indigo-400 bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-900/60">
                                        {item.time}
                                      </span>
                                      <span className={`text-xs font-bold ${item.completed ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
                                        {item.title}
                                      </span>
                                      <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 rounded-xs ${
                                        item.stage === 'Morning' ? 'bg-amber-950/70 border border-amber-900/50 text-amber-400' :
                                        item.stage === 'Afternoon' ? 'bg-sky-950/70 border border-sky-900/50 text-sky-400' :
                                        item.stage === 'Evening' ? 'bg-indigo-950/70 border border-indigo-900/50 text-indigo-400' :
                                        'bg-rose-950/70 border border-rose-900/50 text-rose-400'
                                      }`}>
                                        {item.stage}
                                      </span>
                                    </div>
                                    <p className={`text-[11px] leading-relaxed ${item.completed ? 'text-slate-500' : 'text-slate-400'}`}>
                                      {item.description}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0 hover:opacity-100 transition whitespace-nowrap">
                                    <input 
                                      type="checkbox"
                                      checked={item.completed}
                                      onChange={() => handleToggleTimelineItem(activeEvt.id, item.id)}
                                      className="rounded border-slate-700 bg-slate-950 h-3.5 w-3.5 text-emerald-500 focus:ring-0 cursor-pointer"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteTimelineItem(activeEvt.id, item.id)}
                                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer transition border border-transparent hover:border-rose-900"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Timeline Quick Add Form */}
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Create Chronological Checkpoint</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="sm:col-span-2">
                            <input 
                              type="text"
                              value={newTimelineTitle}
                              onChange={(e) => setNewTimelineTitle(e.target.value)}
                              placeholder="Checkpoint (e.g. Mentor Sync)"
                              className="w-full text-xs rounded-lg bg-black border border-slate-800 p-2 text-white placeholder-slate-700 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <input 
                              type="text"
                              value={newTimelineTime}
                              onChange={(e) => setNewTimelineTime(e.target.value)}
                              placeholder="09:00 AM"
                              className="w-full text-xs rounded-lg bg-black border border-slate-800 p-2 text-white text-center font-mono placeholder-slate-700 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                          <div className="sm:col-span-3">
                            <input 
                              type="text"
                              value={newTimelineDesc}
                              onChange={(e) => setNewTimelineDesc(e.target.value)}
                              placeholder="Execution instructions (optional)"
                              className="w-full text-xs rounded-lg bg-black border border-slate-800 p-2 text-white placeholder-slate-700 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <select
                              value={newTimelineStage}
                              onChange={(e) => setNewTimelineStage(e.target.value as any)}
                              className="w-full text-xs rounded-lg bg-black border border-slate-800 p-2 text-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                            >
                              <option value="Morning">🌅 Morning</option>
                              <option value="Afternoon">☀️ Afternoon</option>
                              <option value="Evening">🌉 Evening</option>
                              <option value="Night">🌙 Late</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddTimelineItem(activeEvt.id)}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[10px] uppercase tracking-widest transition cursor-pointer"
                        >
                          ⚡ Insert Timeline Checkpoint
                        </button>
                      </div>
                    </div>

                    {/* PANEL B: PROMOTIONAL DIGITAL BANNER GENERATOR */}
                    <div className="space-y-4">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center col-span-1">
                        <div>
                          <span className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-wider block">MARKETING GRAPHICS SYNTHESIS</span>
                          <h4 className="text-sm font-bold text-slate-100">Live Custom Poster Builder</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-fuchsia-950 border border-fuchsia-900 text-fuchsia-400 text-[10px] font-mono">Automated SVG</span>
                      </div>

                      {/* Display Canvas Preview Box */}
                      <div className={`relative aspect-video rounded-xl overflow-hidden shadow-md flex flex-col justify-between p-5 border border-slate-800 transition-all duration-500 bg-linear-to-r ${
                        bannerStyle === 'cyber' ? 'from-purple-600 via-fuchsia-900 to-slate-950' :
                        bannerStyle === 'sunrise' ? 'from-orange-500 via-rose-600 to-purple-950' :
                        bannerStyle === 'emerald' ? 'from-emerald-500 via-teal-800 to-slate-950' :
                        bannerStyle === 'royal' ? 'from-blue-600 via-indigo-900 to-black' :
                        'from-slate-700 via-indigo-950 to-zinc-950'
                      }`}>
                        {/* Overlay visual grids */}
                        <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                        <div className="flex justify-between items-start z-10">
                          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-extrabold text-[9px] uppercase tracking-wider border border-white/10">
                            {activeEvt.category}
                          </span>
                          <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 bg-black/40 text-rose-300 border border-rose-900/60 rounded uppercase tracking-widest">
                            {bannerBadge}
                          </span>
                        </div>

                        <div className="space-y-1 z-10">
                          <span className="font-mono text-[9px] font-extrabold tracking-widest text-fuchsia-300 block">
                            {bannerTagline.toUpperCase()}
                          </span>
                          <h4 className="text-xl md:text-2xl font-black text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] truncate">
                            {activeEvt.name}
                          </h4>
                          <p className="text-[10px] text-white/80 font-medium">
                            📍 {activeEvt.venue} &bull; 📅 {activeEvt.date}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/15 z-10 flex justify-between items-center text-white">
                          <div>
                            <span className="text-[8px] font-bold text-white/50 block tracking-wider uppercase">Lead Speaker / Feature</span>
                            <span className="text-xs font-black text-white">{bannerSpeaker}</span>
                          </div>
                          <span className="text-[8px] font-mono text-white/20">CAMPUS GRID V.1</span>
                        </div>
                      </div>

                      {/* Configuration Controls */}
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-white">
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-500 block uppercase">Visual Backdrop Style</label>
                            <div className="grid grid-cols-5 gap-1">
                              {[
                                { key: 'cyber', label: '💜' },
                                { key: 'sunrise', label: '🌅' },
                                { key: 'emerald', label: '💚' },
                                { key: 'royal', label: '💙' },
                                { key: 'minimal', label: '🌑' }
                              ].map(st => (
                                <button
                                  key={st.key}
                                  type="button"
                                  onClick={() => setBannerStyle(st.key as any)}
                                  title={`${st.key} style`}
                                  className={`py-1 rounded border text-center transition cursor-pointer text-xs ${
                                    bannerStyle === st.key ? 'bg-indigo-600 border-indigo-500' : 'bg-black border-slate-800 hover:border-slate-600'
                                  }`}
                                >
                                  {st.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-500 block uppercase">Promotional Tagline</label>
                            <input 
                              type="text"
                              value={bannerTagline}
                              onChange={(e) => setBannerTagline(e.target.value)}
                              className="w-full text-xs rounded-lg bg-black border border-slate-800 p-2 text-white focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-500 block uppercase">Speaker / Guest Anchor</label>
                            <input 
                              type="text"
                              value={bannerSpeaker}
                              onChange={(e) => setBannerSpeaker(e.target.value)}
                              className="w-full text-xs rounded-lg bg-black border border-slate-800 p-2 text-white focus:outline-hidden"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-500 block uppercase">RSVP Code Badge</label>
                            <input 
                              type="text"
                              value={bannerBadge}
                              onChange={(e) => setBannerBadge(e.target.value)}
                              className="w-full text-xs rounded-lg bg-black border border-slate-800 p-2 text-white focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2 grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                          <button
                            type="button"
                            onClick={() => handleApplyGeneratedBanner(activeEvt.id)}
                            className="py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-lg text-[9px] uppercase tracking-widest cursor-pointer flex items-center justify-center gap-1 transition"
                          >
                            <Palette className="h-3.5 w-3.5" />
                            Apply To Event
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleDownloadSVGBanner(activeEvt.id)}
                            className="py-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 font-bold rounded-lg text-[9px] uppercase tracking-widest cursor-pointer flex items-center justify-center gap-1 transition-colors"
                          >
                            <Download className="h-3.5 w-3.5 text-emerald-400" />
                            Download SVG Flyer
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Expense Overseer */}
      {activeTab === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 lg:col-span-1 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1">
              <Coins className="h-5 w-5 text-indigo-600" />
              File Outflow Voucher
            </h3>
            <p className="text-xs text-slate-500">Record payments for supplies, materials, catering fuel or licensed softwares immediately against their respective event budgets.</p>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Target Event</label>
                <select 
                  value={expenseEventId}
                  onChange={e => setExpenseEventId(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 bg-slate-50"
                >
                  {events.map(evt => (
                    <option key={evt.id} value={evt.id}>{evt.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Expense Category</label>
                <select 
                  value={expenseCategory}
                  onChange={e => setExpenseCategory(e.target.value as any)}
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 bg-slate-50"
                >
                  <option value="Logistics">📦 Logistics & Equipment</option>
                  <option value="Catering">🍕 Catering & Refreshments</option>
                  <option value="Marketing">📣 Marketing & Stickers</option>
                  <option value="Prizes">🏆 Prizes & Swag Gear</option>
                  <option value="Licensing">🔑 Softwares & API Licensing</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Description / Purpose</label>
                <input 
                  type="text" 
                  value={expenseDesc}
                  onChange={e => setExpenseDesc(e.target.value)}
                  placeholder="e.g. Redundant heavy ethernet routers"
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Cost (INR - ₹)</label>
                <input 
                  type="number" 
                  value={expenseAmount}
                  onChange={e => setExpenseAmount(Number(e.target.value))}
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 bg-slate-50"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer font-sans"
              >
                Log Approved Expense
              </button>
            </form>

            {/* AUTOMATED BUDGET ALERTS & EXPENSE GUARD */}
            <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-200 space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5 text-indigo-650 animate-pulse" />
                  Ecosystem Fiscal Guard
                </span>
                <span className="text-[9px] font-mono font-bold bg-white/70 px-1.5 py-0.5 rounded text-indigo-600 border border-indigo-100">
                  REAL-TIME ALERTS
                </span>
              </div>

              {(() => {
                const targetId = selectedEventId === 'all' ? (expenseEventId || events[0]?.id) : selectedEventId;
                const evt = events.find(e => e.id === targetId);
                if (!evt) return <p className="text-[10px] text-slate-400">Select an event scope to run calculations.</p>;

                const spent = expenses.filter(x => x.eventId === evt.id).reduce((sum, curr) => sum + curr.amount, 0);
                const limit = evt.budget;
                const ratio = limit > 0 ? (spent / limit) : 0;
                const pct = Math.round(ratio * 100);

                let healthBg = 'bg-emerald-500';
                let healthText = 'text-emerald-750';
                let alertLabel = 'Fiscal Balance Stable';
                let alarmIcon = '💚';
                let alertNotice = `Expense profiles correspond to ${pct}% of mapped resource budgets. Safe operation zone.`;

                if (pct >= 100) {
                  healthBg = 'bg-rose-500 animate-pulse';
                  healthText = 'text-rose-600 font-extrabold';
                  alertLabel = 'DEFICIT CRITICAL BOUNDARY';
                  alarmIcon = '🚨';
                  alertNotice = `OVERRUN! Event spends are now ₹${(spent - limit).toLocaleString()} over assigned budget limit! Action required immediately!`;
                } else if (pct >= 85) {
                  healthBg = 'bg-orange-500 animate-pulse';
                  healthText = 'text-orange-600 font-bold';
                  alertLabel = 'HIGH RISK DEFICIT WARNING';
                  alarmIcon = '⚠️';
                  alertNotice = `Fiscal alarms triggered. Spends are at ${pct}% capacity. Restrict secondary voucher files.`;
                } else if (pct >= 60) {
                  healthBg = 'bg-amber-500';
                  healthText = 'text-amber-600 font-medium';
                  alertLabel = 'Moderate Spend Trajectory';
                  alarmIcon = '🟡';
                  alertNotice = `Spends have crossed 60%. Monitor auxiliary logistical caters and swags gear to prevent runoffs.`;
                }

                return (
                  <div className="space-y-3 font-sans">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-800 truncate block max-w-[125px]">{evt.name}</span>
                      <span className={`text-xs font-mono font-black ${healthText}`}>{pct}%</span>
                    </div>

                    {/* Outer Progress bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-250">
                      <div className={`h-full ${healthBg} rounded-full transition-all duration-500`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>

                    {/* Alarm Display Block */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-700">
                        <span>{alarmIcon}</span>
                        <span className="tracking-wide text-[10px]">{alertLabel}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-normal">
                        {alertNotice}
                      </p>
                    </div>

                    {/* Automated Optimization Advice recommendation engine */}
                    <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-[9px] text-slate-500">
                      <span className="p-0.5 rounded bg-amber-55 text-amber-950 border border-amber-100 uppercase font-bold shrink-0 text-[8px]">REC</span>
                      <p className="leading-tight text-[9px]">
                        {pct >= 85 
                          ? "Advise conversions in Bronze sponsors tiers and monetize remaining observer tickets."
                          : "Configure automated notification channels to cascade ledger receipts to active coordinators."}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center bg-slate-100/60 p-4 rounded-xl">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Ecosystem Outflow Logging</span>
                <p className="text-base font-extrabold text-slate-800">₹{totalSpent.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Approved Events Scope</span>
                <p className="text-base font-extrabold text-slate-800">{events.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4">Event</th>
                      <th className="p-4">Expense Particular</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {expenses.map(exp => {
                      const associatedEvtName = events.find(ev => ev.id === exp.eventId)?.name || 'Ecosystem Wide';
                      return (
                        <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-4 font-semibold text-slate-700 truncate max-w-[140px]">{associatedEvtName}</td>
                          <td className="p-4 text-slate-600">{exp.description}</td>
                          <td className="p-4 font-mono">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px]">
                              {exp.category}
                            </span>
                          </td>
                          <td className="p-4 text-right font-bold text-slate-900 font-mono">₹{exp.amount.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Registrants Database */}
      {activeTab === 'participants' && (
        <div className="space-y-4">
          
          <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
            {/* Search filter for participant lists */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, email, or college/organization..."
                value={participantSearch}
                onChange={e => setParticipantSearch(e.target.value)}
                className="pl-10 pr-4 py-2 text-xs w-full border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            {/* Manual Admin Register Trigger */}
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const demoName = 'Demo Attendee ' + (participants.length + 1);
                  onAddParticipant({
                    id: `p-${participants.length + 1}`,
                    name: demoName,
                    email: `demo.${participants.length + 1}@college.edu`,
                    college: 'Politecnico di Torino',
                    ticketType: 'General',
                    eventId: selectedEventId === 'all' ? events[0]?.id : selectedEventId,
                    registeredAt: new Date().toISOString(),
                    checkedIn: false,
                    paymentStatus: 'Free'
                  });
                }}
                className="bg-indigo-50 text-indigo-600 hover:bg-slate-100 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Fast Add Participant
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left side: Grid listing */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                      <th className="p-4">Name & Email</th>
                      <th className="p-4">College / Company</th>
                      <th className="p-4">Ticket</th>
                      <th className="p-4">Check-in Stamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredParticipants.map(pic => {
                      const associatedEvt = events.find(e => e.id === pic.eventId);
                      return (
                        <tr key={pic.id} className="hover:bg-slate-50/50">
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{pic.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{pic.email}</div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold">{pic.college}</span>
                            <span className="block text-[9px] text-slate-400 truncate max-w-[150px]">{associatedEvt?.name}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              pic.ticketType === 'VIP' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {pic.ticketType} Stamp
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => onToggleCheckIn(pic.id)}
                              className={`px-3 py-1 font-mono text-[10px] rounded-lg border font-bold text-left transition cursor-pointer w-28 whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-between ${
                                pic.checkedIn 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              <span>{pic.checkedIn ? '✅ Checked In' : '❌ Absent'}</span>
                              <RefreshCw className="h-2.5 w-2.5 opacity-60 ml-1 inline grow-0 shrink-0" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredParticipants.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center p-8 text-slate-400">
                          No matching active participant schedules found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Side: Manual Registry Entry Portal */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 lg:col-span-1 h-fit space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                Add Participant Entry Manual
              </h4>
              <p className="text-xs text-slate-500">Fast tracking registration in case of physical walk-ins or cash ticketing transactions.</p>
              
              <form onSubmit={handleManualRegister} className="space-y-4 font-sans text-xs">
                <div className="space-y-1">
                  <label className="font-bold uppercase text-slate-500">Full Name</label>
                  <input 
                    type="text" 
                    value={newRegName} 
                    onChange={e => setNewRegName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-sm bg-slate-50"
                    placeholder="e.g. Liam Smith"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase text-slate-500">Academic Email</label>
                  <input 
                    type="email" 
                    value={newRegEmail}
                    onChange={e => setNewRegEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-sm bg-slate-50"
                    placeholder="liam@academy.edu"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase text-slate-500">Institution Block</label>
                  <input 
                    type="text" 
                    value={newRegCollege}
                    onChange={e => setNewRegCollege(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-sm bg-slate-50"
                    placeholder="e.g. Berkeley Innovation Group"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold uppercase text-slate-500">Destination Event</label>
                    <select 
                      value={newRegEventId}
                      onChange={e => setNewRegEventId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs bg-slate-50"
                    >
                      {events.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold uppercase text-slate-500">Pass Level</label>
                    <select 
                      value={newRegTicket}
                      onChange={e => setNewRegTicket(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs bg-slate-50"
                    >
                      <option value="General">General Pass</option>
                      <option value="VIP">VIP Ticket</option>
                      <option value="Observer">Observer Pass</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2 bg-emerald-600 font-bold uppercase tracking-wider text-white text-[10px] rounded-xl cursor-pointer hover:bg-emerald-700 transition"
                >
                  Confirm Registration & Ticket
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

      {/* Tab 5: Broadcasters Hub */}
      {activeTab === 'comms' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 lg:col-span-1 space-y-4 relative overflow-hidden">
            
            {/* Real-time dispatching simulation screen overlay */}
            {bulkDispatching && (
              <div className="absolute inset-0 bg-slate-950/95 z-20 p-5 flex flex-col justify-between text-white font-mono">
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-[10px] text-indigo-400 font-bold animate-pulse uppercase tracking-[2px]">Dispatch Pipeline Active</span>
                    <span className="text-xs text-slate-400">{bulkProgress}%</span>
                  </div>

                  {/* Progressive bar bar */}
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-linear-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-300" style={{ width: `${bulkProgress}%` }} />
                  </div>

                  {/* Terminal status stream list */}
                  <div className="space-y-1.5 text-[10px] text-slate-300 max-h-72 overflow-y-auto pt-2 scrollbar-thin scrollbar-thumb-indigo-900">
                    {bulkLogs.map((log, idx) => (
                      <div key={idx} className="leading-tight truncate">
                        <span className="text-slate-500 select-none mr-1">&gt;</span>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500">
                  <span>CHANNELS MATCH SYSTEM</span>
                  <span className="animate-ping rounded-full h-1.5 w-1.5 bg-indigo-500" />
                </div>
              </div>
            )}

            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <Send className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
              Broadcasters Hub &amp; Guest Mailer
            </h3>
            <p className="text-xs text-slate-500">Construct templated briefs and broadcast notifications to participants automatically across custom delivery platforms.</p>

            <form onSubmit={handleBulkMessagingDispatch} className="space-y-4 font-sans text-xs">
              
              {/* Channel Selector */}
              <div className="space-y-1">
                <label className="font-bold uppercase text-[10px] text-slate-500 tracking-wide">Multi-Channel Routing Gateway</label>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { key: 'email', label: '📧 Email', name: 'Email Server' },
                    { key: 'sms', label: '💬 Ph SMS', name: 'Telecom network' },
                    { key: 'push', label: '📱 Push', name: 'Client App' },
                    { key: 'slack', label: '🔥 Slack', name: 'Sponsor integration' }
                  ].map(chan => (
                    <button
                      key={chan.key}
                      type="button"
                      onClick={() => setCommChannel(chan.key as any)}
                      title={`Send via ${chan.name}`}
                      className={`py-1.5 rounded-lg border text-center font-bold text-[9px] uppercase transition cursor-pointer ${
                        commChannel === chan.key ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {chan.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-[10px] text-slate-505">Related Event Scope</label>
                <select 
                  value={commEventId}
                  onChange={e => setCommEventId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 font-medium text-slate-700"
                >
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-[10px] text-slate-505">Recipient Target Sub-Group</label>
                <select 
                  value={commRecipient}
                  onChange={e => setCommRecipient(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 font-medium text-slate-700"
                >
                  <option value="Participants">👥 Registered Participants ({participants.length})</option>
                  <option value="On-Duty-Volunteers">⚡ Active Volunteers ({volunteers.length})</option>
                  <option value="Sponsors">💎 VIP Premium Ticket Holders</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-[10px] text-slate-505">Subject / Header Line</label>
                <input 
                  type="text" 
                  value={commSubject}
                  onChange={(e) => setCommSubject(e.target.value)}
                  placeholder="e.g. Schedule Change Updates"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-slate-50 text-slate-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <label className="font-bold uppercase text-[10px] text-slate-550">Templates Content</label>
                  <span className="text-[9px] text-slate-400">Tap tag to auto-insert:</span>
                </div>
                
                {/* Dynamically Injectable Template Fields chips */}
                <div className="flex flex-wrap gap-1 pb-1">
                  {[
                    { tag: 'name', label: 'Name' },
                    { tag: 'college', label: 'College' },
                    { tag: 'ticket', label: 'Tier' },
                    { tag: 'event', label: 'Event' }
                  ].map(item => (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => insertVariableTag(item.tag)}
                      className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-indigo-50 border border-indigo-100 text-indigo-650 hover:bg-indigo-100 cursor-pointer transition-colors"
                    >
                      &#123;&#123;{item.tag}&#125;&#125;
                    </button>
                  ))}
                </div>

                <textarea 
                  value={commMessage}
                  onChange={(e) => setCommMessage(e.target.value)}
                  placeholder="Hey {{name}}, important update regarding {{event}} on the campus ground..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-slate-50 h-28 resize-none text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider rounded-xl transition cursor-pointer text-[10px] flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
                Dispatch Custom Campaign
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Ecosystem Broadcast Log Activity</h3>
            <div className="space-y-3">
              {communications.map(item => {
                const assocEvt = events.find(e => e.id === item.eventId);
                return (
                  <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-3xs space-y-2">
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <span className="font-extrabold text-indigo-600 block">{item.subject}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          Target: <b className="text-slate-700">{item.recipientGroup}</b> for <b>{assocEvt?.name || 'All Events'}</b>
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border-l-2 border-slate-400">
                      {item.message}
                    </p>
                  </div>
                );
              })}
            </div>
            </div>
        </div>
      )}

      {/* Tab 6: Feedbacks and Sentiments */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white p-5 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase block">Delegate Net Score</span>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{averageRating} / 5.0</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase block">Positive Sentiments</span>
              <p className="text-3xl font-extrabold text-teal-600 mt-2">
                {feedbacks.filter(f => f.sentiment === 'Positive').length} responses
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase block">Interactive Reviews Shared</span>
              <p className="text-3xl font-extrabold text-indigo-600 mt-2">{feedbacks.length} slots</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Qualitative Delegate Testimonials</h3>
            <div className="divide-y divide-slate-100">
              {feedbacks.map(f => {
                const associatedEvName = events.find(e => e.id === f.eventId)?.name;
                return (
                  <div key={f.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start">
                    <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg ${
                      f.rating >= 4 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {f.rating} ★
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-700 italic">"{f.comment}"</p>
                      <div className="flex gap-2 items-center text-[10px] text-slate-400">
                        <span>Event: <b className="text-slate-500 font-semibold">{associatedEvName}</b></span>
                        <span>•</span>
                        <span>Sentiment: <b className="text-indigo-600">{f.sentiment}</b></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* UNIVERSAL EXPORTER PORTAL DIALOG */}
      {showExportModal && (
        <div id="exporter-viewport-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-950 p-6 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-950 border border-emerald-990 text-emerald-450">
                  <FileDown className="h-5 w-5 text-emerald-400" />
                </span>
                <div>
                  <h3 className="font-extrabold text-sm md:text-base tracking-tight text-white">Ecosystem Export Operations Portal</h3>
                  <p className="text-[10px] text-slate-400">Synchronize client, fiscal ledger, and support streams into standardized assets.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setShowExportModal(false);
                  setShowPrintPreview(false);
                }}
                className="p-1 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Modal Body / Selection Section */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {!showPrintPreview ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Exporter Card A */}
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between hover:border-indigo-200 transition-all">
                      <div className="space-y-1.5 pb-4">
                        <span className="text-[9px] font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">Registrants DB</span>
                        <h4 className="text-xs font-extrabold text-slate-800">Registrants Ledger Spreadsheet</h4>
                        <p className="text-[10px] text-slate-500 leading-normal">Retrieve comprehensive participant registries mapping colleges, ticket level types, and gate turnouts.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleExportParticipants}
                        className="w-full py-2 bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 border border-indigo-100 font-extrabold text-[10px] uppercase tracking-wide rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 animate-pulse"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        Download Attendees (.csv)
                      </button>
                    </div>

                    {/* Exporter Card B */}
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between hover:border-emerald-200 transition-all">
                      <div className="space-y-1.5 pb-4">
                        <span className="text-[9px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase font-mono border border-emerald-100">FINANCE LEDGER</span>
                        <h4 className="text-xs font-extrabold text-slate-800">Operational Inflows-Outflows</h4>
                        <p className="text-[10px] text-slate-500 leading-normal">Inward sponsor credits and logged auxiliary payout voucher logs parsed against categorical event limits.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleExportExpenses}
                        className="w-full py-2 bg-white hover:bg-emerald-600 hover:text-white text-emerald-600 border border-emerald-100 font-extrabold text-[10px] uppercase tracking-wide rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                      >
                        <Coins className="h-3.5 w-3.5" />
                        Download Expenses (.csv)
                      </button>
                    </div>

                    {/* Exporter Card C */}
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between hover:border-amber-200 transition-all">
                      <div className="space-y-1.5 pb-4">
                        <span className="text-[9px] font-bold tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">ROSTERS FILE</span>
                        <h4 className="text-xs font-extrabold text-slate-800">Support Volunteers Roster</h4>
                        <p className="text-[10px] text-slate-500 leading-normal">Download details of on-duty volunteers, specialized software skilltags, and points indicators.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleExportVolunteers}
                        className="w-full py-2 bg-white hover:bg-amber-600 hover:text-white text-amber-600 border border-amber-100 font-extrabold text-[10px] uppercase tracking-wide rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                      >
                        <Shield className="h-3.5 w-3.5" />
                        Download Volunteers (.csv)
                      </button>
                    </div>

                    {/* Exporter Card D */}
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between hover:border-slate-300 transition-all">
                      <div className="space-y-1.5 pb-4">
                        <span className="text-[9px] font-bold tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded uppercase font-mono">SYSTEM RECOVERY</span>
                        <h4 className="text-xs font-extrabold text-slate-800">Full Ecosystem Offline Backup</h4>
                        <p className="text-[10px] text-slate-500 leading-normal">Full JSON bundle backup mapping events structured data models, communications logs, and teams state.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleExportEcosystemJSON}
                        className="w-full py-2 bg-white hover:bg-slate-900 hover:text-white text-slate-800 border border-slate-200 font-extrabold text-[10px] uppercase tracking-wide rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                      >
                        <Layers className="h-3.5 w-3.5" />
                        Download JSON State (.json)
                      </button>
                    </div>

                  </div>

                  {/* Prestige Print Trigger Board preview banner */}
                  <div className="p-5 bg-linear-to-r from-indigo-700 to-indigo-900 rounded-2xl text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold uppercase py-0.5 px-2 rounded bg-white/20 inline-block font-mono">EXECUTIVE OVERVIEW</span>
                      <h4 className="text-sm font-black tracking-tight">Generate Prestige Auditor Briefing</h4>
                      <p className="text-[10px] text-white/85 max-w-sm font-light">Renders a highly visually detailed business performance executive dashboard formatted for print or PDF capture.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPrintPreview(true)}
                      className="px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-black text-[10px] uppercase tracking-wider rounded-xl transition cursor-pointer whitespace-nowrap self-stretch sm:self-auto text-center font-sans shadow-sm"
                    >
                      Configure Executive Print
                    </button>
                  </div>
                </>
              ) : (
                /* EXECUTIVE IMPACT PREVIEW CARD */
                <div className="space-y-4">
                  <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-inner font-sans space-y-6 text-slate-800" id="executive-print-area">
                    {/* Corporate logo header */}
                    <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4">
                      <div>
                        <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase font-extrabold block">PRESIDENTIAL ECOSYSTEM RECORD</span>
                        <h2 className="text-lg font-black tracking-tight text-slate-905 uppercase">Ecosystem Impact Ledger</h2>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-bold tracking-tight block">GENERATED DATE</span>
                        <span className="text-xs font-mono font-bold text-slate-800">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Meta stats counters */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-[8px] font-bold text-slate-400 block uppercase">Scope Events</span>
                        <span className="text-sm font-black text-slate-800 block">{events.length} Activations</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-[8px] font-bold text-slate-400 block uppercase">Registrates</span>
                        <span className="text-sm font-black text-slate-800 block">{participants.length} Active</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-[8px] font-bold text-slate-400 block uppercase">Aggregate Spent</span>
                        <span className="text-sm font-black text-slate-800 block text-emerald-650 font-mono">₹{totalSpent.toLocaleString()}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-[8px] font-bold text-slate-400 block uppercase">Staff Volunteers</span>
                        <span className="text-sm font-black text-slate-800 block">{volunteers.length} Allocated</span>
                      </div>
                    </div>

                    {/* Table summaries list */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase text-slate-500 border-b border-slate-205 pb-1 select-none">Segment Event Trackers</h4>
                      <table className="w-full text-left text-[10px] border-collapse">
                        <thead>
                          <tr className="text-[8px] text-slate-400 font-extrabold uppercase border-b border-slate-100">
                            <th className="py-1">Event Target</th>
                            <th className="py-1">Date</th>
                            <th className="py-1">Venue</th>
                            <th className="py-1 text-right">Spends / Budget limit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {events.map(ev => {
                            const evSpent = expenses.filter(x => x.eventId === ev.id).reduce((s, c) => s + c.amount, 0);
                            return (
                              <tr key={ev.id}>
                                <td className="py-1.5 font-bold text-slate-700">{ev.name}</td>
                                <td className="py-1.5">{ev.date}</td>
                                <td className="py-1.5 text-slate-500">{ev.venue}</td>
                                <td className="py-1.5 text-right font-mono font-bold">₹{evSpent.toLocaleString()} / ₹{ev.budget.toLocaleString()}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Table summaries list B */}
                    <div className="space-y-2 select-none">
                      <h4 className="text-[10px] font-black uppercase text-slate-500 border-b border-slate-200 pb-1">Historical ledger metrics</h4>
                      <div className="grid grid-cols-2 gap-4 text-[10px]">
                        <div>
                          <span className="font-bold text-slate-600 block pb-1 border-b border-slate-100 font-mono">TOP SWAG SWAPPING</span>
                          <span className="font-mono text-slate-500 block pt-1.5">
                            Prizes &amp; swags level spending: ₹{expenses.filter(st => st.category === 'Prizes').reduce((sm, cu) => sm + cu.amount, 0).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-600 block pb-1 border-b border-slate-100 font-mono">NET DELEGATE ACCEPTANCE</span>
                          <span className="font-semibold text-emerald-600 block pt-1.5">
                            Unified sentiment rating stars: {averageRating} / 5.0 Rating Stars
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sign-off authentication */}
                    <div className="pt-6 border-t border-slate-200 flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>VERIFIED &amp; COMPILED ONLINE UNDER PRIVATE AUDITOR ENVIRONMENT</span>
                      <span>LEDGER CODE: {Date.now().toString().slice(-6)} &bull; OK</span>
                    </div>
                  </div>

                  {/* Print preview controls */}
                  <div className="flex gap-2 justify-end shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowPrintPreview(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-205 text-slate-700 font-bold rounded-lg text-[10px] uppercase tracking-wide cursor-pointer transition font-sans"
                    >
                      Back to Assets
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.print();
                      }}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider cursor-pointer transition flex items-center gap-1.5 font-sans"
                    >
                      🖨️ Direct Print Protocol
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
