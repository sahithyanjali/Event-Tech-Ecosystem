import React, { useState, useEffect } from 'react';
import { 
  Event, Participant, Volunteer, Sponsor, SponsorshipPackage, 
  CommunicationRecord, FeedbackResponse, TaskAssignment, 
  CertificateTemplate, Achievement, ExpenseRecord, ChatMessage, Team, VolunteerShift
} from './types';
import { 
  initialEvents, initialParticipants, initialVolunteers, 
  initialSponsors, initialPackages, initialExpenses, 
  initialTasks, initialCommunications, initialFeedback, 
  initialCertificates, initialAchievements, initialChatMessages, initialTeams, initialShifts
} from './data/mockData';

// Subviews
import OrganizerView from './components/OrganizerView';
import VolunteerView from './components/VolunteerView';
import SponsorView from './components/SponsorView';
import ParticipantView from './components/ParticipantView';
import ScheduleView from './components/ScheduleView';
import LandingPage from './components/LandingPage';

import { 
  Activity, Users, Award, Shield, Landmark, Calendar, 
  Clock, RotateCcw, Sparkles, Building2, CheckSquare, Settings,
  LogIn, LogOut, User, Download, Upload
} from 'lucide-react';

export default function App() {
  // -------------------------
  // REACTIVE ECOSYSTEM STATES
  // -------------------------
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('peg_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [participants, setParticipants] = useState<Participant[]>(() => {
    const saved = localStorage.getItem('peg_participants');
    return saved ? JSON.parse(saved) : initialParticipants;
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem('peg_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [volunteers, setVolunteers] = useState<Volunteer[]>(() => {
    const saved = localStorage.getItem('peg_volunteers');
    return saved ? JSON.parse(saved) : initialVolunteers;
  });

  const [sponsors, setSponsors] = useState<Sponsor[]>(() => {
    const saved = localStorage.getItem('peg_sponsors');
    return saved ? JSON.parse(saved) : initialSponsors;
  });

  const [packages, setPackages] = useState<SponsorshipPackage[]>(() => {
    const saved = localStorage.getItem('peg_packages');
    return saved ? JSON.parse(saved) : initialPackages;
  });

  const [communications, setCommunications] = useState<CommunicationRecord[]>(() => {
    const saved = localStorage.getItem('peg_communications');
    return saved ? JSON.parse(saved) : initialCommunications;
  });

  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>(() => {
    const saved = localStorage.getItem('peg_feedbacks');
    return saved ? JSON.parse(saved) : initialFeedback;
  });

  const [tasks, setTasks] = useState<TaskAssignment[]>(() => {
    const saved = localStorage.getItem('peg_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('peg_achievements');
    return saved ? JSON.parse(saved) : initialAchievements;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('peg_chat');
    return saved ? JSON.parse(saved) : initialChatMessages;
  });

  const [certificates, setCertificates] = useState<CertificateTemplate[]>(() => {
    const saved = localStorage.getItem('peg_certificates');
    return saved ? JSON.parse(saved) : initialCertificates;
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('peg_teams');
    return saved ? JSON.parse(saved) : initialTeams;
  });

  const [shifts, setShifts] = useState<VolunteerShift[]>(() => {
    const saved = localStorage.getItem('peg_shifts');
    return shiftsSaved(saved);
  });

  // Authenticable Simulated User session state
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: 'organizer' | 'volunteer' | 'sponsor' | 'participant';
    isLoggedIn: boolean;
  } | null>(() => {
    const saved = localStorage.getItem('peg_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // Current Selected Module View: 'organizer' | 'volunteer' | 'sponsor' | 'participant' | 'schedule'
  const [activeModule, setActiveModule] = useState<'organizer' | 'volunteer' | 'sponsor' | 'participant' | 'schedule'>('organizer');

  // Helper utility for shifts loader safety
  function shiftsSaved(saved: string | null) {
     return saved ? JSON.parse(saved) : initialShifts;
  }

  // Session state synchronizer and redirector
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('peg_currentUser', JSON.stringify(currentUser));
      // Auto-set starting view matching selected role perspective
      if (currentUser.role === 'organizer') setActiveModule('organizer');
      else if (currentUser.role === 'volunteer') setActiveModule('volunteer');
      else if (currentUser.role === 'sponsor') setActiveModule('sponsor');
      else if (currentUser.role === 'participant') setActiveModule('participant');
    } else {
      localStorage.removeItem('peg_currentUser');
    }
  }, [currentUser]);

  // -------------------------
  // LOCAL STORAGE SYNC
  // -------------------------
  useEffect(() => {
    localStorage.setItem('peg_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('peg_participants', JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem('peg_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('peg_volunteers', JSON.stringify(volunteers));
  }, [volunteers]);

  useEffect(() => {
    localStorage.setItem('peg_sponsors', JSON.stringify(sponsors));
  }, [sponsors]);

  useEffect(() => {
    localStorage.setItem('peg_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('peg_communications', JSON.stringify(communications));
  }, [communications]);

  useEffect(() => {
    localStorage.setItem('peg_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem('peg_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('peg_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('peg_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('peg_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('peg_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('peg_shifts', JSON.stringify(shifts));
  }, [shifts]);

  // Restores state to default demo values instantly
  const handleResetState = () => {
    localStorage.clear();
    setEvents(initialEvents);
    setParticipants(initialParticipants);
    setExpenses(initialExpenses);
    setVolunteers(initialVolunteers);
    setSponsors(initialSponsors);
    setPackages(initialPackages);
    setCommunications(initialCommunications);
    setFeedbacks(initialFeedback);
    setTasks(initialTasks);
    setAchievements(initialAchievements);
    setChatMessages([
      {
        id: `msg-${Date.now()}`,
        senderName: 'Sandbox Security',
        senderRole: 'System',
        content: `🔄 Ecosystem state resets to default baseline specifications. Clean simulation slate initialized successfully.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setCertificates(initialCertificates);
    setTeams(initialTeams);
    setShifts(initialShifts);
  };

  // -------------------------
  // WORKFLOW CALLBACKS
  // -------------------------

  // Event creation
  const handleAddEvent = (newEvent: Event) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? { ...e, ...updatedEvent } : e));
  };

  // Log expense
  const handleAddExpense = (newExpense: ExpenseRecord) => {
    setExpenses(prev => [...prev, newExpense]);
  };

  // Check-In toggle
  const handleToggleCheckIn = (participantId: string) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === participantId) {
        const nextState = !p.checkedIn;
        // Append dynamic mock message to the system log regarding turnout
        const eventName = events.find(e => e.id === p.eventId)?.name || 'Event';
        const msg: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderName: 'Ticketing Gate Bot',
          senderRole: 'System',
          content: `Attendee ${p.name} checked in successfully for ${eventName}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prevChat => [...prevChat, msg]);
        return { ...p, checkedIn: nextState };
      }
      return p;
    }));
  };

  // Manual & Self registration
  const handleAddParticipant = (newParticipant: Participant) => {
    setParticipants(prev => [...prev, newParticipant]);

    // System log
    const eventName = events.find(e => e.id === newParticipant.eventId)?.name || 'Ecosystem';
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: 'Registration Agent',
      senderRole: 'System',
      content: `New ticket successfully issued to ${newParticipant.name} for ${eventName}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prevChat => [...prevChat, msg]);
  };

  const handleAddTeam = (newTeam: Team) => {
    setTeams(prev => [...prev, newTeam]);
    const msg: ChatMessage = {
      id: `m-tm-${Date.now()}`,
      senderName: 'Team Matchmaker Bot',
      senderRole: 'System',
      content: `New team "${newTeam.name}" has been formed! Seeking: ${newTeam.openRoles.join(', ')}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, msg]);
  };

  const handleJoinTeam = (teamId: string, participantId: string) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        if (t.members.includes(participantId)) return t;
        const participantObj = participants.find(p => p.id === participantId);
        const name = participantObj ? participantObj.name : 'Attendee';
        const msg: ChatMessage = {
          id: `m-tm-${Date.now()}`,
          senderName: 'Team Matchmaker Bot',
          senderRole: 'System',
          content: `${name} has joined the team "${t.name}"!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, msg]);
        return {
          ...t,
          members: [...t.members, participantId]
        };
      }
      return t;
    }));
  };

  // Broadcast announcements
  const handleSendCommunication = (newComm: CommunicationRecord) => {
    setCommunications(prev => [newComm, ...prev]);
  };

  // Toggle volunteer availability status block
  const handleToggleAvailability = (volunteerId: string) => {
    setVolunteers(prev => prev.map(v => {
      if (v.id === volunteerId) {
        const options: ('Available' | 'Busy' | 'Part-time')[] = ['Available', 'Busy', 'Part-time'];
        const currentIdx = options.indexOf(v.availability);
        const nextIdx = (currentIdx + 1) % options.length;
        return { ...v, availability: options[nextIdx] };
      }
      return v;
    }));
  };

  // Volunteer Task status update with automated leaderboards integration!
  const handleUpdateTaskStatus = (taskId: string, newStatus: 'Assigned' | 'In Progress' | 'Completed') => {
    setTasks(prevTasks => prevTasks.map(t => {
      if (t.id === taskId) {
        // If completed, award points and check badges
        if (newStatus === 'Completed' && t.status !== 'Completed') {
          // Increment volunteer points
          setVolunteers(prevVols => prevVols.map(v => {
            if (v.id === t.volunteerId) {
              const updatedPoints = v.points + t.points;
              
              // Trigger automated badges / achievements criteria check!
              let nextBadges = [...v.badges];
              if (updatedPoints >= 450 && !v.badges.includes('Prime Architect')) {
                nextBadges.push('Prime Architect');
                
                // Add an Achievement log entry
                const newAch: Achievement = {
                  id: `ach-${Date.now()}`,
                  volunteerId: v.id,
                  title: 'Prime Architect badge unlocked',
                  description: `Secured over 450 XP for stellar task achievements.`,
                  icon: 'Trophy',
                  unlockedAt: new Date().toISOString()
                };
                setAchievements(prevAch => [...prevAch, newAch]);

                // Global message alert
                const announcement: ChatMessage = {
                  id: `msg-${Date.now()}`,
                  senderName: 'System Architect',
                  senderRole: 'System',
                  content: `🎉 Outstanding! Volunteer ${v.name} unlocked the ELITE "Prime Architect" badge on the Leaderboard!`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setChatMessages(prevChat => [...prevChat, announcement]);
              }

              // Simple completion chat message info
              const checkMsg: ChatMessage = {
                id: `msg-${Date.now() + 1}`,
                senderName: 'Task Manager Bot',
                senderRole: 'System',
                content: `⚡ Task "${t.title}" completed by ${v.name}. Conferred +${t.points} XP.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
              setChatMessages(prev => [...prev, checkMsg]);

              return { ...v, points: updatedPoints, badges: nextBadges };
            }
            return v;
          }));
        }
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  // Assign task dynamically
  const handleAddAndAssignTask = (newTask: TaskAssignment) => {
    setTasks(prev => [...prev, newTask]);
    
    // Alert chat system
    const volName = volunteers.find(v => v.id === newTask.volunteerId)?.name || 'Volunteer';
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: 'Coordinator Scheduler',
      senderRole: 'System',
      content: `Dispatched task: "${newTask.title}" assigned directly to ${volName}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, msg]);
  };

  // Submit Feedback Survey
  const handleSubmitFeedback = (newFeedback: FeedbackResponse) => {
    setFeedbacks(prev => [newFeedback, ...prev]);
  };

  // Post dynamic Chat message
  const handlePostChatMessage = (msg: ChatMessage) => {
    setChatMessages(prev => [...prev, msg]);
  };

  // Select corporate package & matches events (Sponsor matching outcomes immediately reflected)
  const handleSelectPackage = (sponsorId: string, eventId: string, budgetAmount: number) => {
    setSponsors(prevSym => prevSym.map(s => {
      if (s.id === sponsorId) {
        // Sponsor matched! Immediately updates campaign match
        return { ...s, matchedEventId: eventId };
      }
      return s;
    }));

    // Dynamic: Sponsor selecting a package IMMEDIATELY increases the target event budget!
    setEvents(prevEv => prevEv.map(e => {
      if (e.id === eventId) {
        const updatedBudget = e.budget + budgetAmount;
        return { ...e, budget: updatedBudget };
      }
      return e;
    }));

    // Post dynamic coordination message to Chat logs
    const sponsorName = sponsors.find(s => s.id === sponsorId)?.company || 'Sponsor';
    const eventName = events.find(e => e.id === eventId)?.name || 'Event';
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: 'Financial Hub',
      senderRole: 'System',
      content: `💎 ${sponsorName} has sponsored "${eventName}" for $${budgetAmount.toLocaleString()}! Core Event Budget immediately expanded.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, msg]);
  };

  // --- Shift management callbacks ---
  const handleAddShift = (newShift: VolunteerShift) => {
    setShifts(prev => [...prev, newShift]);
    const vol = volunteers.find(v => v.id === newShift.volunteerId)?.name || 'Volunteer';
    const evt = events.find(e => e.id === newShift.eventId)?.name || 'Event';
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: 'Scheduling Office',
      senderRole: 'System',
      content: `📅 Scheduled shift for ${vol} on ${newShift.date} as "${newShift.role}" for ${evt}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, msg]);
  };

  const handleUpdateShiftStatus = (shiftId: string, status: 'Scheduled' | 'CheckedIn' | 'Completed') => {
    setShifts(prev => prev.map(s => {
      if (s.id === shiftId) {
        if (status === 'Completed' && s.status !== 'Completed') {
          // Conferred points
          setVolunteers(prevVols => prevVols.map(v => {
            if (v.id === s.volunteerId) {
              const updatedPoints = v.points + 50;
              
              // Register badge count
              let nextBadges = [...v.badges];
              if (updatedPoints >= 450 && !v.badges.includes('Prime Architect')) {
                nextBadges.push('Prime Architect');
                const newAch: Achievement = {
                  id: `ach-${Date.now()}`,
                  volunteerId: v.id,
                  title: 'Prime Architect badge unlocked',
                  description: `Secured over 450 XP for stellar milestone achievements.`,
                  icon: 'Trophy',
                  unlockedAt: new Date().toISOString()
                };
                setAchievements(prevAch => [...prevAch, newAch]);
              }

              const msg: ChatMessage = {
                id: `msg-${Date.now()}`,
                senderName: 'Milestone Rewards',
                senderRole: 'System',
                content: `🏆 Volunteer ${v.name} completed scheduled roster shift and earned +50 XP! Total XP: ${updatedPoints}.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
              setChatMessages(prev => [...prev, msg]);

              return { ...v, points: updatedPoints, badges: nextBadges };
            }
            return v;
          }));
        } else if (status === 'CheckedIn' && s.status !== 'CheckedIn') {
          // Log check in
          const volName = volunteers.find(v => v.id === s.volunteerId)?.name || 'Staff';
          const msg: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderName: 'Attendance Gate',
            senderRole: 'System',
            content: `🚪 Shift Clock-in: ${volName} successfully started active shift as "${s.role}".`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setChatMessages(prev => [...prev, msg]);
        }
        return { ...s, status };
      }
      return s;
    }));
  };

  const handleDeleteShift = (shiftId: string) => {
    setShifts(prev => prev.filter(s => s.id !== shiftId));
  };

  const handleExportPersonasAsExcel = () => {
    try {
      // BOM character for direct Excel recognition of UTF-8 text formatting
      let csv = "\uFEFF"; 

      // Section Header: Persona Roster Database
      csv += "PEOPLE DATABASE ROSTER REPORT - SMART EVENT SANDBOX\r\n";
      csv += `Generated On (UTC),${new Date().toISOString()},\r\n\r\n`;

      // Main columns
      csv += "Full Name,Email Address,Persona Role Type,Affiliation / Main College,Key Details / Tier / Ticket,Pledged / Contribution,Role Account Status\r\n";

      // 1. ADD ALL REGISTERED ATTENDEES/PARTICIPANTS
      participants.forEach(p => {
        const cleanName = (p.name || '').replace(/"/g, '""');
        const cleanEmail = (p.email || '').replace(/"/g, '""');
        const cleanCollege = (p.college || 'Smart Campus').replace(/"/g, '""');
        const cleanTicket = (p.ticketType || 'General').replace(/"/g, '""');
        const cleanStatus = p.checkedIn ? 'Checked In (Active)' : 'Registered';
        csv += `"${cleanName}","${cleanEmail}","Participant","${cleanCollege}","${cleanTicket}","₹0","${cleanStatus}"\r\n`;
      });

      // 2. ADD ALL ACTIVE VOLUNTEERS
      volunteers.forEach(v => {
        const cleanName = (v.name || '').replace(/"/g, '""');
        const cleanEmail = (v.email || '').replace(/"/g, '""');
        const cleanCollege = (v.college || 'Independent Devs').replace(/"/g, '""');
        const skillsLabel = (v.skills || []).join(' | ').replace(/"/g, '""');
        const availability = (v.availability || 'Available').replace(/"/g, '""');
        csv += `"${cleanName}","${cleanEmail}","Volunteer","${cleanCollege}","${skillsLabel}","₹0","${availability}"\r\n`;
      });

      // 3. ADD CORPORATE SPONSORS
      sponsors.forEach(s => {
        const cleanName = (s.contactName || '').replace(/"/g, '""');
        const cleanEmail = (s.contactEmail || '').replace(/"/g, '""');
        const cleanCompany = (s.company || 'Tech Corp').replace(/"/g, '""');
        const tier = (s.tier || 'Silver').replace(/"/g, '""');
        const contribution = s.contribution || 0;
        csv += `"${cleanName}","${cleanEmail}","Sponsor","${cleanCompany}","${tier}","₹${contribution.toLocaleString()}","Pledged Partner"\r\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `smart-event-personas-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const msg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderName: 'Ecosystem Auditor',
        senderRole: 'System',
        content: `📈 Excel Roster Export: Extracted ${participants.length + volunteers.length + sponsors.length} personas to an Excel-compatible spreadsheet (.csv).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, msg]);
    } catch (err: any) {
      console.error(err);
      alert('Failed to generate Excel list sheet: ' + err.message);
    }
  };

  if (!currentUser || !currentUser.isLoggedIn) {
    return (
      <LandingPage 
        onLoginSuccess={(name, email, role) => {
          setCurrentUser({
            name,
            email,
            role,
            isLoggedIn: true
          });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between animate-fade-in">
      
      {/* GLOBAL SYSTEM BAR HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 text-white shadow-xs z-10 sticky top-0">
        <div id="system-header" className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Logo badge */}
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-sm flex items-center justify-center font-black">
              <Activity className="h-5 w-5 animate-pulse" />
            </span>
            <div>
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold block leading-none">Smart Event Sandbox</span>
              <h1 className="text-base font-extrabold tracking-tight text-white mt-1 leading-none">Smart Event Management Platform</h1>
            </div>
          </div>

          {/* ACTIVE SIMULATOR USER SESSION CONTROL PANEL */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-950/40 p-2 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2 px-2 border-r border-slate-800">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white text-center select-none shadow-xs uppercase">
                {currentUser.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="font-bold text-slate-100 block leading-tight">{currentUser.name || 'Anonymous User'}</span>
                <span className="text-[9px] font-mono text-slate-400 block leading-none">{currentUser.email || 'sandbox@smartcampus.com'}</span>
              </div>
            </div>

            {/* Simulated Active Role perspective modifier */}
            <div className="flex items-center gap-1.5 px-1 bg-slate-900/80 border border-slate-750 p-1 rounded-xl">
              <span className="text-[8px] sm:text-[9px] text-slate-400 font-black uppercase tracking-wider pl-1.5">View Scope:</span>
              <select
                value={currentUser.role}
                onChange={(e) => {
                  const nextRole = e.target.value as any;
                  setCurrentUser(prev => prev ? { ...prev, role: nextRole } : null);
                }}
                className="text-xs bg-slate-950 border border-slate-850 py-0.5 px-2 rounded-lg text-white font-extrabold focus:outline-hidden cursor-pointer"
              >
                <option value="organizer">Director (Organizer)</option>
                <option value="volunteer">Volunteer Coordinator</option>
                <option value="sponsor">Corporate Sponsor</option>
                <option value="participant">Academic Attendee</option>
              </select>
            </div>

            <button
              onClick={() => {
                setCurrentUser(null);
              }}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-450 border border-slate-850 rounded-xl transition cursor-pointer font-bold flex items-center gap-1"
              title="Logout current sandbox session"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Metadata system metrics (No telemetry tech larping) */}
          <div className="flex items-center gap-3.5 text-xs font-medium text-slate-300">
            <div className="hidden xl:flex items-center gap-1.5 bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              <span>Host UTC: <b className="font-mono text-white">2026-05-26</b></span>
            </div>

            {/* Export Roster Excel Sheet Button */}
            <button
              onClick={handleExportPersonasAsExcel}
              className="flex items-center gap-1.5 bg-emerald-950/50 hover:bg-emerald-900/40 text-emerald-300 rounded-lg px-3 py-1.5 border border-emerald-900/50 transition cursor-pointer font-bold text-[10px] uppercase tracking-wider shadow-2xs"
              title="Download Excel sheet of all attendees, sponsors, and volunteers"
            >
              <Download className="h-3 w-3" />
              <span>Export Roster (Excel)</span>
            </button>

            <button
              onClick={handleResetState}
              className="flex items-center gap-1 bg-rose-950/40 hover:bg-rose-900/45 text-rose-300 rounded-lg px-2.5 py-1.5 border border-rose-900/50 transition cursor-pointer font-bold text-[10px] uppercase tracking-wider"
              title="Reset sandbox data defaults"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset State</span>
            </button>
          </div>

        </div>
      </header>

      {/* VIEW CHANGE / NAVIGATION RAIL */}
      <div className="bg-white border-b border-slate-200/60 sticky top-[73px] sm:top-[61px] z-10 shadow-3xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 overflow-x-auto whitespace-nowrap">
          
          <button
            onClick={() => setActiveModule('organizer')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-150 flex items-center gap-2 border cursor-pointer ${
              activeModule === 'organizer'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            Organizer Console
          </button>

          <button
            onClick={() => setActiveModule('schedule')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-150 flex items-center gap-2 border cursor-pointer ${
              activeModule === 'schedule'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Schedules &amp; Calendar
          </button>

          <button
            onClick={() => setActiveModule('volunteer')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-150 flex items-center gap-2 border cursor-pointer ${
              activeModule === 'volunteer'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            Volunteer Area
          </button>

          <button
            onClick={() => setActiveModule('sponsor')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-150 flex items-center gap-2 border cursor-pointer ${
              activeModule === 'sponsor'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            Sponsors Portal
          </button>

          <button
            onClick={() => setActiveModule('participant')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-150 flex items-center gap-2 border cursor-pointer ${
              activeModule === 'participant'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Participant Gate ({participants.length})
          </button>

        </div>
      </div>

      {/* CORE WORKSPACE CONSOLE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        
        {/* Render selected view module */}
        {activeModule === 'organizer' && (
          <OrganizerView 
            events={events}
            participants={participants}
            expenses={expenses}
            feedbacks={feedbacks}
            communications={communications}
            volunteers={volunteers}
            sponsors={sponsors}
            teams={teams}
            onAddEvent={handleAddEvent}
            onAddExpense={handleAddExpense}
            onToggleCheckIn={handleToggleCheckIn}
            onAddParticipant={handleAddParticipant}
            onSendCommunication={handleSendCommunication}
            onUpdateEvent={handleUpdateEvent}
          />
        )}

        {activeModule === 'volunteer' && (
          <VolunteerView 
            volunteers={volunteers}
            tasks={tasks}
            events={events}
            achievements={achievements}
            chatMessages={chatMessages}
            participants={participants}
            shifts={shifts}
            onToggleAvailability={handleToggleAvailability}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onAddAndAssignTask={handleAddAndAssignTask}
            onPostChatMessage={handlePostChatMessage}
            onToggleCheckIn={handleToggleCheckIn}
            onUpdateShiftStatus={handleUpdateShiftStatus}
          />
        )}

        {activeModule === 'sponsor' && (
          <SponsorView 
            sponsors={sponsors}
            packages={packages}
            events={events}
            onAddSponsor={handleAddSponsor => setSponsors(prev => [...prev, handleAddSponsor])}
            onSelectPackage={handleSelectPackage}
          />
        )}

        {activeModule === 'participant' && (
          <ParticipantView 
            events={events}
            participants={participants}
            feedbacks={feedbacks}
            chatMessages={chatMessages}
            certificates={certificates}
            teams={teams}
            onAddParticipant={handleAddParticipant}
            onToggleCheckIn={handleToggleCheckIn}
            onSubmitFeedback={handleSubmitFeedback}
            onPostChatMessage={handlePostChatMessage}
            onAddTeam={handleAddTeam}
            onJoinTeam={handleJoinTeam}
          />
        )}

        {activeModule === 'schedule' && (
          <ScheduleView 
            events={events}
            volunteers={volunteers}
            shifts={shifts}
            onAddEvent={handleAddEvent}
            onAddShift={handleAddShift}
            onUpdateShiftStatus={handleUpdateShiftStatus}
            onDeleteShift={handleDeleteShift}
          />
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>© 2026 Smart Event Management Suite. Ecosystem Prototype EP-1894604.</span>
          <span className="flex items-center gap-1.5 font-bold text-slate-500">
            <span className="inline-block w-2 bg-emerald-500 h-2 rounded-full animate-ping" />
            Sandbox Simulator Live and Ready
          </span>
        </div>
      </footer>

    </div>
  );
}
