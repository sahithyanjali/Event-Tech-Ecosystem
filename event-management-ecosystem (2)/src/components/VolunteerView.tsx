import React, { useState, useRef } from 'react';
import { Volunteer, TaskAssignment, Event, Achievement, ChatMessage, Participant, VolunteerShift } from '../types';
import { 
  Award, CheckCircle2, BadgeAlert, Trophy, ShieldCheck, 
  MessageSquare, Send, Calendar, Star, Sparkles, Plus, Clock, Play,
  QrCode, Video, Barcode, Search, Users, RotateCcw
} from 'lucide-react';

interface VolunteerViewProps {
  volunteers: Volunteer[];
  tasks: TaskAssignment[];
  events: Event[];
  achievements: Achievement[];
  chatMessages: ChatMessage[];
  participants?: Participant[];
  shifts?: VolunteerShift[];
  onToggleAvailability: (volunteerId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: 'Assigned' | 'In Progress' | 'Completed') => void;
  onAddAndAssignTask: (newTask: TaskAssignment) => void;
  onPostChatMessage: (msg: ChatMessage) => void;
  onToggleCheckIn?: (participantId: string) => void;
  onUpdateShiftStatus?: (shiftId: string, status: 'Scheduled' | 'CheckedIn' | 'Completed') => void;
}

export default function VolunteerView({
  volunteers,
  tasks,
  events,
  achievements,
  chatMessages,
  participants = [],
  shifts = [],
  onToggleAvailability,
  onUpdateTaskStatus,
  onAddAndAssignTask,
  onPostChatMessage,
  onToggleCheckIn,
  onUpdateShiftStatus,
}: VolunteerViewProps) {
  // Current active logged-in volunteer simulator selection
  const [activeVolId, setActiveVolId] = useState<string>(volunteers[0]?.id || '');
  
  // Custom Task Creation
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskEventId, setNewTaskEventId] = useState(events[0]?.id || '');
  const [newTaskPoints, setNewTaskPoints] = useState(80);
  const [newTaskVolunteer, setNewTaskVolunteer] = useState(volunteers[0]?.id || '');

  // Chat message input
  const [draftMessage, setDraftMessage] = useState('');

  // Ticket QR scanner states
  const [isScanning, setIsScanning] = useState(false);
  const [scanMethod, setScanMethod] = useState<'simulation' | 'camera'>('simulation');
  const [scanAttendeeSelect, setScanAttendeeSelect] = useState('');
  const [scanFeedback, setScanFeedback] = useState<{status: 'idle' | 'scanning' | 'success' | 'refused', message: string}>({status: 'idle', message: ''});
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const playBeep = (freq = 900, duration = 0.12) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch {
      // Audio permission blocking
    }
  };

  const startCameraScanner = async () => {
    setScanFeedback({status: 'scanning', message: 'Setting up active lens feeds...'});
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setScanFeedback({status: 'scanning', message: 'Camera active. Point lens at ticket SVG code.'});
    } catch {
      setScanFeedback({status: 'refused', message: 'Lens blocked. Switched to high fidelity simulation.'});
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

  const executeCheckInScan = () => {
    if (!scanAttendeeSelect) {
      setScanFeedback({status: 'scanning', message: 'Choose registered attendee credentials.'});
      return;
    }

    setScanFeedback({status: 'scanning', message: 'Validating cryptographic security signatures...'});
    setTimeout(() => {
      const selectedPart = participants.find(p => p.id === scanAttendeeSelect);
      if (selectedPart) {
        playBeep(1000, 0.15);
        
        if (onToggleCheckIn) {
          onToggleCheckIn(selectedPart.id);
        }

        setScanFeedback({
          status: 'success',
          message: `ACCESS MATCHED! Code: TIX-SEC-${selectedPart.id}. Checked in ${selectedPart.name} of ${selectedPart.college}. Status synchronized on central server!`
        });
      } else {
        playBeep(220, 0.35);
        setScanFeedback({status: 'refused', message: 'Cryptographic ticket parsing failed. Code rejected!'});
      }
    }, 1300);
  };

  // Find active volunteer details
  const currentVol = volunteers.find(v => v.id === activeVolId);
  const currentVolTasks = tasks.filter(t => t.volunteerId === activeVolId);
  const currentVolAchievements = achievements.filter(a => a.volunteerId === activeVolId);

  // Sorted Leaderboard (points descending)
  const rankedVolunteers = [...volunteers].sort((a, b) => b.points - a.points);

  const handlePostChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftMessage.trim() || !currentVol) return;

    onPostChatMessage({
      id: `msg-${Date.now()}`,
      senderName: `${currentVol.name} (Volunteer)`,
      senderRole: 'Volunteer',
      content: draftMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setDraftMessage('');
  };

  const handleTaskDefine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskDesc.trim()) return;

    onAddAndAssignTask({
      id: `ts-${Date.now()}`,
      eventId: newTaskEventId,
      volunteerId: newTaskVolunteer,
      title: newTaskTitle,
      description: newTaskDesc,
      status: 'Assigned',
      points: Number(newTaskPoints),
      deadline: '2026-06-12'
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    alert('Dynamic task delegated & assigned successfully!');
  };

  return (
    <div id="volunteer-workspace" className="space-y-6">
      
      {/* SIMULATOR SWITCHER BANNER */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-black px-2 py-0.5 rounded bg-indigo-950 border border-indigo-900/50">
              Role Simulation Active
            </span>
            <h2 className="text-lg font-extrabold tracking-tight text-white mt-1.5 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
               Volunteer & Task Assignment Center
            </h2>
            <p className="text-xs text-slate-400 mt-1">Simulate distinct student coordinates, submit dynamic progress updates and trigger reward point achievements.</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-300 font-bold pl-2">Logged in as:</span>
            <select 
              value={activeVolId}
              onChange={(e) => setActiveVolId(e.target.value)}
              className="text-xs font-semibold bg-slate-900 border-none text-white focus:ring-0 p-1.5 rounded-lg cursor-pointer"
            >
              {volunteers.map(vol => (
                <option key={vol.id} value={vol.id}>{vol.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {currentVol ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMN 1: Volunteer Card, Availability, Unlocked Badges */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{currentVol.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">{currentVol.email}</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-xl text-center">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">Points</span>
                  <span className="text-xl font-black text-indigo-600 font-mono">{currentVol.points}xp</span>
                </div>
              </div>

              {/* Toggle availability */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Duty Status</span>
                  <span className={`text-xs font-semibold ${
                    currentVol.availability === 'Available' ? 'text-emerald-600' : 'text-amber-500'
                  }`}>
                    🟢 Active & {currentVol.availability}
                  </span>
                </div>
                <button 
                  onClick={() => onToggleAvailability(currentVol.id)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Change Shifts
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tagged Competencies</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentVol.skills.map((s, idx) => (
                    <span key={idx} className="bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Shifts assigned to the volunteer */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-indigo-500" />
                Assigned Logistics Shifts ({shifts.filter(s => s.volunteerId === activeVolId).length})
              </h4>
              <div className="space-y-3">
                {shifts.filter(s => s.volunteerId === activeVolId).map(sh => {
                  const evName = events.find(e => e.id === sh.eventId)?.name || 'Ecosystem Event';
                  return (
                    <div key={sh.id} className="p-3 bg-slate-50 border border-slate-250/60 rounded-xl space-y-2 text-slate-700">
                      <div className="flex justify-between items-center gap-1">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 block truncate max-w-40">
                          {evName}
                        </span>
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          sh.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' :
                          sh.status === 'CheckedIn' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {sh.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-600 leading-normal">
                        <p>🧑‍🚀 <b>Role:</b> {sh.role}</p>
                        <p className="mt-0.5 select-none text-slate-400">⏱️ <b className="font-mono text-slate-500">{sh.date} &bull; {sh.startTime} - {sh.endTime}</b></p>
                      </div>
                      
                      {/* Active Actions button inside Volunteer area */}
                      {onUpdateShiftStatus && sh.status !== 'Completed' && (
                        <div className="pt-1.5 border-t border-slate-200/50 flex gap-2">
                          {sh.status === 'Scheduled' ? (
                            <button
                              type="button"
                              onClick={() => onUpdateShiftStatus(sh.id, 'CheckedIn')}
                              className="w-full py-1 text-[9px] font-bold text-center bg-blue-600 hover:bg-blue-750 text-white rounded-lg transition-colors cursor-pointer"
                            >
                              🚪 Clock-In Active Shift
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onUpdateShiftStatus(sh.id, 'Completed')}
                              className="w-full py-1 text-[9px] font-bold text-center bg-emerald-600 hover:bg-emerald-750 text-white rounded-lg transition-colors cursor-pointer"
                            >
                              ✓ Complete and Close (+50 XP)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {shifts.filter(s => s.volunteerId === activeVolId).length === 0 && (
                  <p className="text-xs text-slate-450 italic text-center py-2 leading-relaxed">No shift rosters assigned for this volunteer. See Schedules &amp; Calendar tab to register new schedules.</p>
                )}
              </div>
            </div>

            {/* Dynamic Badges and achievements list */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-tight flex items-center gap-1">
                <Award className="h-4 w-4 text-emerald-500" />
                Badge Achievement Room ({currentVolAchievements.length})
              </h4>
              <div className="space-y-3">
                {currentVolAchievements.map(ach => (
                  <div key={ach.id} className="p-3 bg-linear-to-r from-emerald-50/50 to-teal-50/50 rounded-xl border border-emerald-100/60 flex items-start gap-2.5">
                    <span className="p-1.5 bg-white text-emerald-600 rounded-lg shadow-3xs shrink-0 mt-0.5">
                      <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                    </span>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{ach.title}</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{ach.description}</p>
                      <span className="text-[8px] text-slate-400 mt-1 block font-mono">Awarded On Duty</span>
                    </div>
                  </div>
                ))}
                {currentVolAchievements.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-2">No achievements unlocked yet. Overcome assigned tasks above 450 XP to trigger elite templates.</p>
                )}
              </div>
            </div>
          </div>

          {/* COLUMN 2: Assigned Tasks and Allocation Controls */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Task lists for selected Volunteer */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Clock className="h-4.5 w-4.5 text-indigo-600 animate-spin-pulse" />
                Active Assigned Task Assignments
              </h3>

              <div className="space-y-3">
                {currentVolTasks.map(t => {
                  const evName = events.find(e => e.id === t.eventId)?.name || 'Ecosystem Wide';
                  return (
                    <div key={t.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100/80 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[9px] font-extrabold uppercase text-indigo-600 block">{evName}</span>
                          <h4 className="font-bold text-sm text-slate-800 mt-0.5">{t.title}</h4>
                        </div>
                        <span className="text-xs font-bold font-mono text-emerald-600 bg-white px-2.5 py-1 rounded-md shadow-3xs shrink-0">
                          +{t.points} XP
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-600 leading-relaxed">{t.description}</p>
                      
                      <div className="pt-2 border-t border-slate-200/50 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Status: <b>{t.status}</b></span>
                        
                        <div className="flex items-center gap-1.5 self-end">
                          {t.status === 'Assigned' && (
                            <button 
                              onClick={() => onUpdateTaskStatus(t.id, 'In Progress')}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[10px] rounded-lg transition flex items-center gap-1 cursor-pointer"
                            >
                              <Play className="h-3 w-3" /> Set In-Progress
                            </button>
                          )}
                          {t.status !== 'Completed' && (
                            <button 
                              onClick={() => onUpdateTaskStatus(t.id, 'Completed')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-lg transition flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="h-3 w-3" /> Mark Completed
                            </button>
                          )}
                          {t.status === 'Completed' && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-sm">
                              ✓ Verified Accomplished
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {currentVolTasks.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6 italic bg-slate-50/50 rounded-xl">No active assignments. Create a task in the dynamic task allocator panel to kick off the stream.</p>
                )}
              </div>
            </div>

            {/* VOLUNTEER ON-DUTY TICKET SCANNER STATION */}
            <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h4 className="text-sm font-extrabold tracking-tight flex items-center gap-2 text-white">
                    <span className="p-1 rounded bg-indigo-950 text-indigo-400 border border-indigo-900">
                      <QrCode className="h-4.5 w-4.5" />
                    </span>
                    Duty Desk: Gate Ticket QR Decryption
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Validate participant ticket matrices and assign attendance timestamps.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const next = !isScanning;
                    setIsScanning(next);
                    if (next && scanMethod === 'camera') {
                      startCameraScanner();
                    } else {
                      stopCameraScanner();
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                    isScanning ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-slate-800'
                  }`}
                >
                  {isScanning ? (
                    <>
                      <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                      Deactivate Scanner
                    </>
                  ) : (
                    <>
                      <Video className="h-3.5 w-3.5" />
                      On-Shift Scanner
                    </>
                  )}
                </button>
              </div>

              {isScanning ? (
                <div className="bg-slate-905/60 p-4 rounded-xl border border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                  
                  {/* Scanner Viewfinder overlay */}
                  <div className="relative aspect-video md:aspect-auto md:h-44 bg-black rounded-lg overflow-hidden border border-slate-800 flex flex-col items-center justify-center">
                    {scanMethod === 'camera' ? (
                      <video ref={videoRef} className="w-full h-full object-cover" playsInline />
                    ) : (
                      <div className="p-3 text-center space-y-1.5">
                        <Barcode className="h-9 w-9 text-indigo-400 mx-auto animate-pulse" />
                        <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Simulated Viewfinder Ready</span>
                      </div>
                    )}
                    
                    {/* Glowing Laser Scan beam line */}
                    <div className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981] animate-bounce top-1/3 pointer-events-none" />
                    
                    {/* Corners */}
                    <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-emerald-400" />
                    <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-emerald-400" />
                    <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-emerald-400" />
                    <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-emerald-400" />
                  </div>

                  {/* Settings & Execution block */}
                  <div className="space-y-3 flex flex-col justify-between text-xs text-white">
                    <div>
                      <div className="grid grid-cols-2 gap-1.5 p-1 bg-black rounded-lg border border-slate-800/80 mb-2">
                        <button
                          type="button"
                          onClick={() => {
                            stopCameraScanner();
                            setScanMethod('simulation');
                          }}
                          className={`py-1 text-[9px] font-black uppercase rounded ${
                            scanMethod === 'simulation' ? 'bg-indigo-600' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Simulated
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setScanMethod('camera');
                            startCameraScanner();
                          }}
                          className={`py-1 text-[9px] font-black uppercase rounded ${
                            scanMethod === 'camera' ? 'bg-indigo-600' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Real Webcam
                        </button>
                      </div>

                      {scanMethod === 'simulation' ? (
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 block uppercase">Decode Attendee Pass</label>
                          <select
                            value={scanAttendeeSelect}
                            onChange={e => setScanAttendeeSelect(e.target.value)}
                            className="w-full bg-black/50 border border-slate-800 rounded-lg p-2 text-white text-xs"
                          >
                            <option value="">-- Choose target barcode --</option>
                            {participants.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.college}) - {p.checkedIn ? '✓ Verified Checked' : '⏳ Awaiting Register'}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          Hold any digital SVG badge to the webcam window to trigger instant synchronization loops.
                        </p>
                      )}
                    </div>

                    {scanFeedback.status !== 'idle' && (
                      <div className={`p-2 rounded-lg border text-[10px] ${
                        scanFeedback.status === 'success' 
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' 
                          : scanFeedback.status === 'refused'
                          ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                          : 'bg-indigo-950/40 border-indigo-900/40 text-indigo-300'
                      }`}>
                        {scanFeedback.message}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={executeCheckInScan}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg uppercase text-[9px] tracking-widest cursor-pointer"
                    >
                      ⚡ Execute Optical Scan Decode
                    </button>
                  </div>

                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-black/40 p-3 rounded-xl border border-slate-900">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block pb-1">Verified Checked-In Passes</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      {participants.filter(p => p.checkedIn).length}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Checked out of {participants.length} registered</span>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-slate-900">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block pb-1">Recent Active Gates</span>
                    <span className="text-xs font-semibold text-slate-300 line-clamp-1">
                      {participants.filter(p => p.checkedIn).slice(-1)[0]?.name || 'No recent checks'}
                    </span>
                    <span className="text-[9px] text-slate-500 block">Ready on system grid</span>
                  </div>
                </div>
              )}
            </div>

            {/* Collaboration Chat & Support Stream */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-4">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1">
                <MessageSquare className="h-4.5 w-4.5 text-indigo-600" />
                Collaboration Hub Live Stream
              </h4>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-56 overflow-y-auto space-y-3.5">
                {chatMessages.map(msg => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-slate-700">{msg.senderName}</span>
                      <span className="text-slate-400 font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-100 p-2.5 rounded-lg">
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={handlePostChat} className="flex gap-2">
                <input 
                  type="text" 
                  value={draftMessage}
                  onChange={e => setDraftMessage(e.target.value)}
                  placeholder="Share high priority logs or ping support coordinate..."
                  className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  required
                />
                <button 
                  type="submit"
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shrink-0 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

          </div>

        </div>
      ) : null}

      {/* GLOBAL LEADERBOARDS & ADD TASK COLUMN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEADERBOARDS COLUMN */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-amber-500" />
              Ecosystem Volunteer Merit Leaderboard
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Total Points Tracked</span>
          </div>

          <div className="divide-y divide-slate-100 whitespace-nowrap">
            {rankedVolunteers.map((v, index) => (
              <div key={v.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    index === 0 ? 'bg-amber-100 text-amber-800' : index === 1 ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-800 text-xs">{v.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2">({v.availability})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {v.badges.map((b, bIdx) => (
                      <span key={bIdx} className="bg-emerald-50 text-emerald-700 text-[8px] border border-emerald-100 px-1.5 py-0.5 rounded-sm">
                        {b}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700">{v.points} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TASK ALLOCATOR GATE */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 lg:col-span-1 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <Plus className="h-4.5 w-4.5 text-indigo-600" />
            Define & Assign Tasks
          </h3>
          <p className="text-[11px] text-slate-500">Deconstruct project workloads into discrete microtasks and coordinate duty assignments to capable roster members.</p>

          <form onSubmit={handleTaskDefine} className="space-y-3 font-sans text-xs">
            <div className="space-y-1">
              <label className="font-bold uppercase text-slate-400">Task Title</label>
              <input 
                type="text" 
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Test Wi-Fi Subnets" 
                className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-slate-50"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase text-slate-400">Brief Instruction Description</label>
              <textarea 
                value={newTaskDesc}
                onChange={e => setNewTaskDesc(e.target.value)}
                placeholder="Requirements and verification checklists..."
                className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-slate-50 h-16 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-400">Related Event</label>
                <select 
                  value={newTaskEventId}
                  onChange={e => setNewTaskEventId(e.target.value)}
                  className="w-full text-[10px] rounded-xl border border-slate-200 p-2 bg-slate-50"
                >
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-400">Assign To</label>
                <select 
                  value={newTaskVolunteer}
                  onChange={e => setNewTaskVolunteer(e.target.value)}
                  className="w-full text-[10px] rounded-xl border border-slate-200 p-2 bg-slate-50"
                >
                  {volunteers.map(vol => (
                    <option key={vol.id} value={vol.id}>{vol.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase text-slate-400">Points Assigned Value</label>
              <input 
                type="number" 
                value={newTaskPoints}
                onChange={e => setNewTaskPoints(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-slate-50"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 font-bold uppercase text-white rounded-xl transition text-[9px] cursor-pointer"
            >
              Delegate Volunteer Task
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
