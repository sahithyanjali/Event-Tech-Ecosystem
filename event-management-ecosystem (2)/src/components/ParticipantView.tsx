import React, { useState, useRef } from 'react';
import { Participant, Event, FeedbackResponse, ChatMessage, CertificateTemplate, Team } from '../types';
import { 
  QrCode, UserPlus, FileBadge, MessageCirclePlus, Star, 
  MapPin, Calendar, Heart, GraduationCap, ArrowRight, Share2, 
  UserCheck2, FileCheck2, LayoutTemplate, Search, Users, ShieldAlert,
  Video, Barcode, Zap, CheckCircle2, RotateCcw, Sparkles, Filter, PlusCircle
} from 'lucide-react';

interface ParticipantViewProps {
  events: Event[];
  participants: Participant[];
  feedbacks: FeedbackResponse[];
  chatMessages: ChatMessage[];
  certificates: CertificateTemplate[];
  teams: Team[];
  onAddParticipant: (newParticipant: Participant) => void;
  onToggleCheckIn: (participantId: string) => void;
  onSubmitFeedback: (newFeedback: FeedbackResponse) => void;
  onPostChatMessage: (msg: ChatMessage) => void;
  onAddTeam: (newTeam: Team) => void;
  onJoinTeam: (teamId: string, participantId: string) => void;
}

export default function ParticipantView({
  events,
  participants,
  feedbacks,
  chatMessages,
  certificates,
  teams,
  onAddParticipant,
  onToggleCheckIn,
  onSubmitFeedback,
  onPostChatMessage,
  onAddTeam,
  onJoinTeam,
}: ParticipantViewProps) {
  // Simulator State: Logged-in participant email for lookup
  const [sessionEmail, setSessionEmail] = useState<string>('aron.foster@university.edu');
  const [lookupDone, setLookupDone] = useState(true);

  // Team Finder and Search State
  const [teamSearch, setTeamSearch] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');
  
  // Team Creation State
  const [showCreateTeamPanel, setShowCreateTeamPanel] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [newTeamRolesInput, setNewTeamRolesInput] = useState('');
  const [newTeamTagsInput, setNewTeamTagsInput] = useState('');
  const [newTeamContact, setNewTeamContact] = useState('');

  // Attendee Search and Scan connections directory
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [connections, setConnections] = useState<Participant[]>([]);
  
  // Custom Badge Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [scanMethod, setScanMethod] = useState<'simulation' | 'camera'>('simulation');
  const [scanAttendeeSelect, setScanAttendeeSelect] = useState('');
  const [scanFeedback, setScanFeedback] = useState<{status: 'idle' | 'scanning' | 'success' | 'refused', message: string}>({status: 'idle', message: ''});
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const playBeep = (freq = 880, duration = 0.1) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.log('Audio feedback not supported by browser security constraints yet.', e);
    }
  };

  // Self Registration form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCollege, setRegCollege] = useState('');
  const [regTicket, setRegTicket] = useState<'General' | 'VIP' | 'Observer'>('General');
  const [regEventId, setRegEventId] = useState(events[0]?.id || '');

  // Feedback form
  const [surveyEventId, setSurveyEventId] = useState(events[1]?.id || '');
  const [surveyRating, setSurveyRating] = useState(5);
  const [surveyComment, setSurveyComment] = useState('');

  // Chat message state
  const [networkingDraft, setNetworkingDraft] = useState('');

  // Selected certificate template styling
  const [certStyle, setCertStyle] = useState<'classic' | 'modern' | 'academic'>('academic');

  // Computed: Look up current profile
  const matchedAttendee = participants.find(p => p.email.toLowerCase().trim() === sessionEmail.toLowerCase().trim());
  const matchedEvent = matchedAttendee ? events.find(e => e.id === matchedAttendee.eventId) : null;
  const eligibleCertificates = matchedAttendee && matchedAttendee.checkedIn 
    ? certificates.filter(c => c.eventId === matchedAttendee.eventId)
    : [];

  const handleSelfRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    const newId = `p-${participants.length + 1}`;
    onAddParticipant({
      id: newId,
      name: regName,
      email: regEmail,
      college: regCollege || 'Independent Tech Builder',
      ticketType: regTicket,
      eventId: regEventId,
      registeredAt: new Date().toISOString(),
      checkedIn: false,
      paymentStatus: regTicket === 'VIP' ? 'Paid' : 'Free'
    });

    setSessionEmail(regEmail);
    setLookupDone(true);
    
    // Clear form
    setRegName('');
    setRegEmail('');
    setRegCollege('');
    alert('Congratulations! Your Ticket has been issued. Check your dashboard space below.');
  };

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyComment.trim()) return;

    const sentimentScore = surveyRating >= 4 ? 'Positive' : surveyRating >= 3 ? 'Neutral' : 'Negative';

    onSubmitFeedback({
      id: `fb-${Date.now()}`,
      eventId: surveyEventId,
      rating: surveyRating,
      comment: surveyComment,
      sentiment: sentimentScore as any,
      submittedAt: new Date().toISOString()
    });

    setSurveyComment('');
    alert('Thank you! Your survey results have been logged onto the organizer dashboard instantly.');
  };

  const handlePostNetworkMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!networkingDraft.trim() || !matchedAttendee) return;

    onPostChatMessage({
      id: `msg-${Date.now()}`,
      senderName: `${matchedAttendee.name} (Attendee)`,
      senderRole: 'Participant',
      content: networkingDraft,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setNetworkingDraft('');
  };

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedAttendee) {
      alert('Please enter your registered email in the Access Gate above first to form teams!');
      return;
    }
    if (!newTeamName.trim() || !newTeamDesc.trim()) return;

    const roles = newTeamRolesInput.split(',').map(r => r.trim()).filter(Boolean);
    const tags = newTeamTagsInput.split(',').map(t => t.trim()).filter(Boolean);
    
    const colors = [
      'text-indigo-600 bg-indigo-50 border-indigo-200',
      'text-emerald-600 bg-emerald-50 border-emerald-200',
      'text-purple-600 bg-purple-50 border-purple-200',
      'text-rose-600 bg-rose-50 border-rose-200',
      'text-amber-600 bg-amber-50 border-amber-200',
      'text-sky-600 bg-sky-50 border-sky-200'
    ];
    const pickedColor = colors[Math.floor(Math.random() * colors.length)];

    onAddTeam({
      id: `team-${Date.now()}`,
      name: newTeamName,
      projectDescription: newTeamDesc,
      eventId: matchedAttendee.eventId,
      members: [matchedAttendee.id],
      openRoles: roles.length > 0 ? roles : ['General Hackers'],
      tags: tags.length > 0 ? tags : ['React', 'Dev'],
      contactEmail: newTeamContact || matchedAttendee.email,
      logoColor: pickedColor
    });

    setNewTeamName('');
    setNewTeamDesc('');
    setNewTeamRolesInput('');
    setNewTeamTagsInput('');
    setNewTeamContact('');
    setShowCreateTeamPanel(false);
    playBeep(660, 0.25);
    alert(`Success! Team "${newTeamName}" has been formed and logged to the searchable board.`);
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(teamSearch.toLowerCase()) || 
      team.projectDescription.toLowerCase().includes(teamSearch.toLowerCase()) ||
      team.tags.some(t => t.toLowerCase().includes(teamSearch.toLowerCase())) ||
      team.openRoles.some(r => r.toLowerCase().includes(teamSearch.toLowerCase()));
    
    const matchesEvent = selectedEventFilter === 'all' || team.eventId === selectedEventFilter;
    return matchesSearch && matchesEvent;
  });

  const startCameraScanner = async () => {
    setScanFeedback({status: 'scanning', message: 'Initializing Camera stream...'});
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setScanFeedback({status: 'scanning', message: 'Camera feed live. Direct lens towards attendee QR badge!'});
    } catch (e) {
      setScanFeedback({status: 'refused', message: 'Camera feed block. Falling back to High fidelity simulated scan.'});
      setScanMethod('simulation');
    }
  };

  const stopCameraScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setScanFeedback({status: 'idle', message: ''});
  };

  const executeTicketScan = () => {
    if (!scanAttendeeSelect) {
      setScanFeedback({status: 'scanning', message: 'Please select an attendee ticket to decode!'});
      return;
    }

    setScanFeedback({status: 'scanning', message: 'Analyzing points matrix...'});
    
    setTimeout(() => {
      const selectedPart = participants.find(p => p.id === scanAttendeeSelect);
      if (selectedPart) {
        playBeep(1200, 0.15);
        
        // Add to direct connections
        if (!connections.some(c => c.id === selectedPart.id)) {
          setConnections(prev => [...prev, selectedPart]);
        }

        setScanFeedback({
          status: 'success',
          message: `SCAN SUCCESS! Code: PASS-TIX-${selectedPart.id}. Name: ${selectedPart.name} (${selectedPart.college}). Connected on networking grid!`
        });

        // Auto check in if they selected themselves or someone scanned gate
        if (!selectedPart.checkedIn) {
          onToggleCheckIn(selectedPart.id);
        }
      } else {
        playBeep(330, 0.3);
        setScanFeedback({
          status: 'refused',
          message: 'Error decoding matrix segment. Check credentials.'
        });
      }
    }, 1200);
  };

  return (
    <div id="participant-workspace" className="space-y-6">
      
      {/* SESSION LOGIN BANNER */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 block shrink-0">
              <QrCode className="h-5 w-5" />
            </span>
            Attendee Ticket & Certificate Access Gate
          </h2>
          <p className="text-xs text-slate-500">Provide your registered email to pull your tickets, perform self-checkin, generate academic certificates, or network.</p>
        </div>

        <div className="flex gap-2 min-w-[280px]">
          <input 
            type="email" 
            placeholder="Type registered email..." 
            value={sessionEmail}
            onChange={e => setSessionEmail(e.target.value)}
            className="flex-1 text-xs border border-slate-200 rounded-xl px-3 bg-slate-50 font-mono focus:outline-hidden"
          />
          <button 
            onClick={() => {
              if (sessionEmail.trim() === '') return;
              setLookupDone(true);
            }} 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Access
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* COLUMN 1: Self Ticket Display and Checkin Scanner */}
        {lookupDone && matchedAttendee && matchedEvent ? (
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs relative">
              <div className="h-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                
                {/* Visual Barcode Column */}
                <div className="md:col-span-1 bg-slate-50 p-5 rounded-xl border border-slate-200/60 flex flex-col items-center justify-center text-center space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 font-bold block mb-1">
                    Digital Pass
                  </span>
                  
                  {/* High Fidelity Simulated QR Gate Component */}
                  <div className="bg-white p-3.5 rounded-xl shadow-3xs border border-slate-100 flex flex-col items-center">
                    <svg className="w-24 h-24" viewBox="0 0 100 100" fill="currentColor">
                      {/* Stylized QR points matrix simulating active checkin status */}
                      <rect x="10" y="10" width="30" height="30" className={matchedAttendee.checkedIn ? 'fill-emerald-600' : 'fill-slate-800'} />
                      <rect x="15" y="15" width="20" height="20" fill="white" />
                      <rect x="18" y="18" width="14" height="14" className={matchedAttendee.checkedIn ? 'fill-emerald-600' : 'fill-slate-800'} />
                      
                      <rect x="60" y="10" width="30" height="30" className={matchedAttendee.checkedIn ? 'fill-emerald-600' : 'fill-slate-800'} />
                      <rect x="65" y="15" width="20" height="20" fill="white" />
                      <rect x="68" y="18" width="14" height="14" className={matchedAttendee.checkedIn ? 'fill-emerald-600' : 'fill-slate-800'} />

                      <rect x="10" y="60" width="30" height="30" className={matchedAttendee.checkedIn ? 'fill-emerald-600' : 'fill-slate-800'} />
                      <rect x="15" y="65" width="20" height="20" fill="white" />
                      <rect x="18" y="68" width="14" height="14" className={matchedAttendee.checkedIn ? 'fill-emerald-600' : 'fill-slate-800'} />

                      {/* Random dynamic bits */}
                      <rect x="50" y="50" width="10" height="10" fill="currentColor" />
                      <rect x="65" y="60" width="15" height="15" fill="currentColor" />
                      <rect x="80" y="80" width="10" height="10" fill="currentColor" />
                      <rect x="55" y="75" width="20" height="10" fill="currentColor" />
                      <rect x="75" y="50" width="15" height="10" fill="currentColor" />
                    </svg>

                    <span className="font-mono text-[9px] text-slate-400 mt-2 block font-extrabold">PASS-TIX-0902</span>
                  </div>

                  <button
                    onClick={() => onToggleCheckIn(matchedAttendee.id)}
                    className={`mt-3 py-1.5 w-full text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                      matchedAttendee.checkedIn 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200'
                    }`}
                  >
                    <UserCheck2 className="h-3.5 w-3.5" />
                    {matchedAttendee.checkedIn ? 'Active: Checked-In' : 'Click to Self-CheckIn'}
                  </button>
                </div>

                {/* Main Pass details */}
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-[9px] uppercase tracking-wide">
                      {matchedAttendee.ticketType} PASS LEVEL
                    </span>
                    <h3 className="font-black text-slate-900 text-lg tracking-tight mt-1.5 leading-tight">
                      {matchedEvent.name}
                    </h3>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      Venue: <b>{matchedEvent.venue}</b>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      Scheduled Setup Date: <b>{matchedEvent.date}</b>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Attendee Registered Name: <b className="text-slate-600 font-bold">{matchedAttendee.name}</b> • ID Block: <b className="font-mono">{matchedAttendee.id}</b>
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block pb-0.5">Academic College Block</span>
                      <span className="font-extrabold text-slate-800">{matchedAttendee.college}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block pb-0.5">Gate Status</span>
                      <span className={`font-extrabold ${matchedAttendee.checkedIn ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {matchedAttendee.checkedIn ? '🟢 Active Checked Attendance' : '⏳ Awaiting Gate'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* HIGH RESOLUTION ACADEMIC CERTIFICATE PREVIEW WORKFLOW */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="font-extrabold text-slate-950 text-base flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-indigo-600" />
                    Automated Academic Certificates Workspace
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Checked-in attendees instantly unlock customized accomplishment certificates issued directly here.</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <LayoutTemplate className="h-3.5 w-3.5" /> Format:
                  </span>
                  <select 
                    value={certStyle}
                    onChange={e => setCertStyle(e.target.value as any)}
                    className="text-xs border border-slate-200 bg-slate-50 p-1.5 rounded-lg cursor-pointer font-semibold"
                  >
                    <option value="academic">🎓 Classic Academic</option>
                    <option value="modern">⚡ Elite Startup</option>
                    <option value="classic">🏵️ Vintage Certificate</option>
                  </select>
                </div>
              </div>

              {eligibleCertificates.length > 0 ? (
                <div className="space-y-4">
                  {eligibleCertificates.map(crt => (
                    <div 
                      key={crt.id} 
                      className={`p-8 border-4 rounded-xl shadow-xs text-center space-y-5 relative overflow-hidden transition-all duration-300 ${
                        certStyle === 'academic' 
                          ? 'border-indigo-900 bg-linear-to-b from-amber-50/50 via-white to-amber-50/40 font-serif' 
                          : certStyle === 'modern' 
                          ? 'border-slate-900 bg-linear-to-r from-slate-950 to-slate-900 text-white font-sans'
                          : 'border-amber-700 bg-amber-50/10 font-serif border-double'
                      }`}
                    >
                      {/* Stylized background ribbons */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="space-y-1">
                        <span className={`text-[11px] font-bold uppercase tracking-widest ${certStyle === 'modern' ? 'text-teal-400' : 'text-amber-800'}`}>
                          🎓 Verification Certificate of Accomplishment
                        </span>
                        <h4 className={`text-2xl font-black ${certStyle === 'modern' ? 'text-white' : 'text-slate-900'}`}>
                          {crt.title}
                        </h4>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs text-slate-400 block italic">Is highly conferred upon the outstanding student build performance of:</span>
                        <h5 className={`text-2xl font-bold tracking-tight uppercase ${certStyle === 'modern' ? 'text-emerald-400' : 'text-indigo-950'}`}>
                          {matchedAttendee.name}
                        </h5>
                        <p className="text-xs max-w-lg mx-auto leading-relaxed text-slate-500">
                          For successful deployment and testing coordinates along key innovative streams at the grand <b>{matchedEvent.name}</b> program host events. Verified by the Academic Committee.
                        </p>
                      </div>

                      <div className="pt-6 border-t border-slate-100/55 grid grid-cols-2 gap-4 text-xs">
                        <div className="text-left">
                          <span className="text-[10px] text-slate-400 block">Conferred Signature</span>
                          <span className={`font-semibold ${certStyle === 'modern' ? 'text-slate-300' : 'text-slate-800'}`}>{crt.signatureName}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Issued Timestamp</span>
                          <span className={`font-semibold font-mono ${certStyle === 'modern' ? 'text-slate-300' : 'text-slate-800'}`}>{crt.issueDate}</span>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-center gap-3">
                        <button 
                          onClick={() => alert('Certificate PDF package compiled! Direct printable copy dispatched to local storage.')}
                          className="px-4 py-1.5 bg-indigo-100 hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <FileCheck2 className="h-4 w-4" /> Download Certified Draft PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-slate-50/70 border border-slate-200/50 rounded-xl text-center text-slate-400 space-y-2">
                  <p className="text-xs font-semibold">Self-Certifications unavailable or Locked.</p>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    To claim electronic certificates, you must first register with your target email and click <b>"Click to Self-CheckIn"</b> above to audit your gate checked attendance first!
                  </p>
                </div>
              )}
            {/* INTEGRATED QR PASS SCANNER STATION & TEAM FINDER HUD */}
            <div className="space-y-6">
              
              {/* SECTION A: TICKET QR SCANNER GATE & NETWORKING CENTER */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <h4 className="font-extrabold text-sm tracking-tight flex items-center gap-2 text-white">
                      <span className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/40">
                        <QrCode className="h-4 w-4" />
                      </span>
                      Gate Check-In & Ticket QR Scanner Console
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">Scan other participants' ticket barcodes to connect, or trigger checkin verification on the ecosystem.</p>
                  </div>

                  <button
                    onClick={() => {
                      const next = !isScanning;
                      setIsScanning(next);
                      if (next && scanMethod === 'camera') {
                        startCameraScanner();
                      } else {
                        stopCameraScanner();
                      }
                    }}
                    className={`px-4 py-1.5 rounded-xl font-bold text-xs tracking-wide transition cursor-pointer flex items-center gap-1.5 ${
                      isScanning 
                        ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                        : 'bg-indigo-600 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isScanning ? (
                      <>
                        <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                        Close Scanner
                      </>
                    ) : (
                      <>
                        <Video className="h-3.5 w-3.5" />
                        Launch Ticket Scanner
                      </>
                    )}
                  </button>
                </div>

                {isScanning ? (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Capture / Viewfinder Column */}
                    <div className="relative aspect-video md:aspect-auto md:h-48 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex flex-col items-center justify-center">
                      
                      {scanMethod === 'camera' ? (
                        <video 
                          ref={videoRef} 
                          className="w-full h-full object-cover"
                          playsInline
                        />
                      ) : (
                        <div className="absolute inset-0 bg-radial from-slate-900 to-black flex flex-col items-center justify-center text-center p-4">
                          <Barcode className="h-10 w-10 text-indigo-400 animate-pulse mb-2" />
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Viewfinder Ready</span>
                          <span className="text-[11px] text-indigo-300 font-semibold mt-1">Select simulated pass to scan on the right</span>
                        </div>
                      )}

                      {/* Moving laser scan beam line */}
                      <div className="absolute left-0 right-0 h-0.5 bg-indigo-500/80 shadow-[0_0_10px_#6366f1] animate-bounce top-1/2 pointer-events-none" />
                      
                      {/* Stylized camera corner targets */}
                      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-indigo-500" />
                      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-indigo-500" />
                      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-indigo-500" />
                      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-indigo-500" />
                    </div>

                    {/* Controls & Scrambler Decoding Panel */}
                    <div className="space-y-3.5 flex flex-col justify-between text-xs">
                      <div>
                        <div className="flex gap-2 mb-3 bg-slate-900 p-1 rounded-lg border border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              stopCameraScanner();
                              setScanMethod('simulation');
                            }}
                            className={`flex-1 text-[10px] font-bold py-1 px-2 rounded-md ${
                              scanMethod === 'simulation' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            💻 Simulated Scan
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setScanMethod('camera');
                              startCameraScanner();
                            }}
                            className={`flex-1 text-[10px] font-bold py-1 px-2 rounded-md ${
                              scanMethod === 'camera' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            📷 Optical Webcam
                          </button>
                        </div>

                        {scanMethod === 'simulation' ? (
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block">Select Attendee Ticket to Scan</label>
                            <select 
                              value={scanAttendeeSelect}
                              onChange={e => setScanAttendeeSelect(e.target.value)}
                              className="w-full rounded-lg bg-slate-900 border border-slate-800 text-white text-xs p-2 font-medium"
                            >
                              <option value="">-- Choose Ticket barcode --</option>
                              {participants.map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({p.college} - {p.checkedIn ? 'Checked' : 'Awaiting'})</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <p className="text-slate-400 text-[11px] leading-relaxed">
                            Bring any participant's SVG barcode (VIP or General digital pass) close to your browser camera to allow checkin.
                          </p>
                        )}
                      </div>

                      {scanFeedback.status !== 'idle' && (
                        <div className={`p-2.5 rounded-lg border ${
                          scanFeedback.status === 'success' 
                            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' 
                            : scanFeedback.status === 'refused'
                            ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                            : 'bg-indigo-950/40 border-indigo-900/40 text-indigo-300'
                        } text-[11px] leading-relaxed font-semibold`}>
                          <span className="block font-black uppercase text-[9px] tracking-wide mb-1 flex items-center gap-1">
                            {scanFeedback.status === 'scanning' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />}
                            Scanner Feedback Log:
                          </span>
                          {scanFeedback.message}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={executeTicketScan}
                        className="w-full py-2 bg-indigo-500 hover:bg-slate-700 text-white font-bold rounded-lg uppercase tracking-wider text-[10px] transition cursor-pointer"
                      >
                        ⚡ Simulate Optical Check-In
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Connections list */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Connected network contacts (Scanned)</span>
                      
                      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2 max-h-36 overflow-y-auto">
                        {connections.length > 0 ? (
                          connections.map(conn => {
                            const eventName = events.find(e => e.id === conn.eventId)?.name || 'Event';
                            return (
                              <div key={conn.id} className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
                                <div className="space-y-0.5">
                                  <span className="font-bold text-white text-xs block leading-tight">{conn.name}</span>
                                  <span className="text-[10px] text-indigo-400 block font-mono">{conn.college}</span>
                                </div>
                                <span className="text-[9px] bg-indigo-950 border border-indigo-900 text-indigo-300 font-extrabold px-1.5 py-0.5 rounded uppercase">{conn.ticketType} PASS</span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-4 text-slate-500 text-[11px] space-y-1">
                            <p>No connections scanned or logged yet.</p>
                            <p className="text-[9px] text-slate-600">Click Launcher above, choose simulated attendees, and verify their passes!</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chat messaging logs */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Ecosystem chat channels (Attendee)</span>
                      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 max-h-36 overflow-y-auto space-y-2 text-[11px]">
                        {chatMessages.filter(m => m.senderRole === 'Participant' || m.senderRole === 'System').slice(-4).map(m => (
                          <div key={m.id} className="space-y-0.5 border-b border-slate-800/50 pb-1 last:border-0 last:pb-0">
                            <div className="flex justify-between text-[9px]">
                              <span className={`font-black ${m.senderRole === 'System' ? 'text-amber-400' : 'text-indigo-400'}`}>{m.senderName}</span>
                              <span className="text-slate-500 font-mono">{m.timestamp}</span>
                            </div>
                            <p className="text-slate-300 italic">"{m.content}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION B: TEAM FINDER & DISCOVERY SEARCH HUB */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-5">
                
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <h4 className="font-extrabold text-base tracking-tight flex items-center gap-2 text-slate-950">
                      <Users className="h-5 w-5 text-indigo-600" />
                      Hackathon Team Finder & Discovery Board
                    </h4>
                    <p className="text-xs text-slate-500">Search active team configurations, request matchmaking positions, or list your new project team.</p>
                  </div>

                  <button
                    onClick={() => setShowCreateTeamPanel(!showCreateTeamPanel)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    {showCreateTeamPanel ? 'View Existing Teams' : 'Register New Team'}
                  </button>
                </div>

                {showCreateTeamPanel ? (
                  <form onSubmit={handleCreateTeamSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3.5">
                    <h5 className="font-black text-slate-900 tracking-tight text-xs uppercase text-indigo-600 border-b border-slate-200 pb-1.5">Create Innovative Builder Team</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 uppercase">Team Name</label>
                        <input
                          type="text"
                          placeholder="e.g. CyberGuardians"
                          value={newTeamName}
                          onChange={e => setNewTeamName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-2 bg-white text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 uppercase">Contact Email / Slack</label>
                        <input
                          type="email"
                          placeholder="e.g. contact@cyberguardians.com"
                          value={newTeamContact}
                          onChange={e => setNewTeamContact(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-2 bg-white text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-500 uppercase">Project Mission Description</label>
                      <textarea
                        placeholder="What problem are you solving? What tech ecosystem coordinates are you deploying?"
                        value={newTeamDesc}
                        onChange={e => setNewTeamDesc(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2 bg-white text-sm h-16 resize-none focus:outline-hidden"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 uppercase">Open Recruiting Roles (Comma spaced)</label>
                        <input
                          type="text"
                          placeholder="e.g. ML Specialist, Frontend Developer, Slide Pitcher"
                          value={newTeamRolesInput}
                          onChange={e => setNewTeamRolesInput(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-2 bg-white text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 uppercase">Tech Stack & Tags (Comma spaced)</label>
                        <input
                          type="text"
                          placeholder="e.g. React, Gemini, Tailwind, Node"
                          value={newTeamTagsInput}
                          onChange={e => setNewTeamTagsInput(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-2 bg-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 hover:bg-slate-800 text-white font-black rounded-lg transition text-[10px] uppercase tracking-wider cursor-pointer"
                      >
                        Launch Team Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateTeamPanel(false)}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold rounded-lg text-[10px] uppercase cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    
                    {/* Search & Filter Toolbar */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Search teams by project name, stack tags, or recruited roles..."
                          value={teamSearch}
                          onChange={e => setTeamSearch(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs bg-slate-50 focus:outline-hidden"
                        />
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      </div>

                      <div className="flex gap-2">
                        <select
                          value={selectedEventFilter}
                          onChange={e => setSelectedEventFilter(e.target.value)}
                          className="rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 text-xs font-semibold"
                        >
                          <option value="all">🌐 All Events</option>
                          {events.map(ev => (
                            <option key={ev.id} value={ev.id}>{ev.name} ({ev.category})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Team Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredTeams.map(team => {
                        const evt = events.find(e => e.id === team.eventId);
                        const isMember = matchedAttendee && team.members.includes(matchedAttendee.id);
                        
                        return (
                          <div key={team.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between space-y-3 shadow-3xs hover:border-indigo-200 transition">
                            
                            <div className="space-y-2">
                              {/* Header & Logo bar */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`p-2 rounded-lg font-black font-mono text-xs ${team.logoColor || 'text-indigo-600 bg-indigo-50 border border-indigo-200'}`}>
                                    {team.name.slice(0, 2).toUpperCase()}
                                  </span>
                                  <div>
                                    <h5 className="font-bold text-slate-950 text-xs tracking-tight">{team.name}</h5>
                                    {evt && (
                                      <span className="text-[10px] text-slate-400 font-medium tracking-tight block">{evt.name}</span>
                                    )}
                                  </div>
                                </div>

                                <span className="text-[10px] bg-slate-200 border border-slate-300 text-slate-800 font-bold font-mono px-2 py-0.5 rounded-md">
                                  👥 {team.members.length} member{team.members.length !== 1 && 's'}
                                </span>
                              </div>

                              <p className="text-xs text-slate-600 leading-relaxed font-sans">{team.projectDescription}</p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1 pt-1">
                                {team.tags.map((tg, i) => (
                                  <span key={i} className="text-[9px] bg-white border border-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-mono">
                                    {tg}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-slate-400 block pb-0.5">Seeking Talent:</span>
                                <div className="flex flex-wrap gap-1">
                                  {team.openRoles.map((role, i) => (
                                    <span key={i} className="text-[9px] text-indigo-700 font-extrabold bg-indigo-50 px-1 rounded-sm">
                                      🔍 {role}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                {isMember ? (
                                  <span className="text-[10px] px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 font-black rounded-lg uppercase tracking-wide inline-block">
                                    ✓ Joined Team
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => {
                                      if (!matchedAttendee) {
                                        alert('Please access or register with an email in the top Gate Access block first!');
                                        return;
                                      }
                                      onJoinTeam(team.id, matchedAttendee.id);
                                    }}
                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
                                  >
                                    Join Team
                                  </button>
                                )}
                              </div>
                            </div>

                          </div>
                        );
                      })}

                      {filteredTeams.length === 0 && (
                        <div className="col-span-full py-10 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 space-y-1.5">
                          <p className="text-xs font-semibold">No target teams matching your search filter parameters.</p>
                          <p className="text-[11px] text-slate-400">Be the pioneer! Click <b>"Register New Team"</b> above to list your unique coordinates first.</p>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>

            </div>
            </div>

          </div>
        ) : (
          lookupDone && (
            <div className="lg:col-span-2 bg-slate-50/70 border border-slate-200/60 p-10 rounded-2xl text-center space-y-3">
              <span className="p-3 bg-white text-indigo-600 rounded-full inline-block shadow-3xs">
                <GraduationCap className="h-6 w-6" />
              </span>
              <h4 className="font-bold text-slate-800 text-sm">No Active Registration Profile Found: "{sessionEmail}"</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Complete the automated self-registration onboarding node on the right to receive digital barcodes, gate access and certificates!
              </p>
            </div>
          )
        )}

        {/* COLUMN 2: Self Onboarding Intake Portal & Target Satisfaction surveys */}
        <div className="space-y-6">
          
          {/* Intake Portal */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <UserPlus className="h-4.5 w-4.5 text-indigo-600" />
              Easy Self-Registration Onboarding
            </h3>
            <p className="text-xs text-slate-500">Pick an active workshop, enter your academic information, and configure your pass level instantly.</p>

            <form onSubmit={handleSelfRegister} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-500">Your Full Name</label>
                <input 
                  type="text" 
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder="e.g. Aron Foster"
                  className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-500">Academic Email Address</label>
                <input 
                  type="email" 
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="foster@polytech.edu"
                  className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-sm font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-500">University / College Corp</label>
                <input 
                  type="text" 
                  value={regCollege}
                  onChange={e => setRegCollege(e.target.value)}
                  placeholder="e.g. State Polytech Office"
                  className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold uppercase text-slate-500">Select Event</label>
                  <select 
                    value={regEventId}
                    onChange={e => setRegEventId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-xs"
                  >
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.name} ({ev.category})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase text-slate-500">Pass level</label>
                  <select 
                    value={regTicket}
                    onChange={e => setRegTicket(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-xs"
                  >
                    <option value="General">General Ticket</option>
                    <option value="VIP">VIP Ticket (Lounge access)</option>
                    <option value="Observer">Observer Seat Only</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-slate-800 text-white text-[10px] uppercase font-bold tracking-widest rounded-xl transition cursor-pointer"
              >
                Register & Issue Ticket
              </button>
            </form>
          </div>

          {/* Satisfaction Survey Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <MessageCirclePlus className="h-4.5 w-4.5 text-emerald-500" />
              Satisfaction Survey Terminal
            </h3>
            <p className="text-[11px] text-slate-500">Tell us what you think! Your inputs are shared on the real-time organizer feedback log dashboard.</p>

            <form onSubmit={handleSubmitSurvey} className="space-y-3 font-sans text-xs">
              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-500">Select Rated Event</label>
                <select 
                  value={surveyEventId}
                  onChange={e => setSurveyEventId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 bg-slate-50 text-xs"
                >
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-500">Satisfaction Score</label>
                <div className="flex gap-2 items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <input 
                    type="range" 
                    min={1} 
                    max={5} 
                    value={surveyRating}
                    onChange={e => setSurveyRating(Number(e.target.value))}
                    className="flex-1 cursor-pointer"
                  />
                  <span className="font-black text-indigo-600 shrink-0 font-mono text-xs w-8 text-right">{surveyRating} ★</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-500">Feedback / Critique</label>
                <textarea 
                  value={surveyComment}
                  onChange={e => setSurveyComment(e.target.value)}
                  placeholder="Write honest reviews..."
                  className="w-full rounded-xl border border-slate-200 p-2 bg-slate-50 h-16 resize-none focus:outline-hidden"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase rounded-xl transition text-[9px] cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
