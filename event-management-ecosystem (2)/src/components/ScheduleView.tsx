import React, { useState } from 'react';
import { Event, Volunteer, VolunteerShift } from '../types';
import { 
  Calendar as CalendarIcon, Clock, User, Users, Plus, Search, 
  CheckCircle, Trash2, AlertCircle, Award, Sparkles, MapPin,
  ChevronLeft, ChevronRight, Briefcase
} from 'lucide-react';

interface ScheduleViewProps {
  events: Event[];
  volunteers: Volunteer[];
  shifts: VolunteerShift[];
  onAddEvent: (newEvent: Event) => void;
  onAddShift: (newShift: VolunteerShift) => void;
  onUpdateShiftStatus: (shiftId: string, status: 'Scheduled' | 'CheckedIn' | 'Completed') => void;
  onDeleteShift: (shiftId: string) => void;
}

export default function ScheduleView({
  events,
  volunteers,
  shifts,
  onAddEvent,
  onAddShift,
  onUpdateShiftStatus,
  onDeleteShift
}: ScheduleViewProps) {
  // --- Calendar State ---
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 5, 1)); // Default June 2026 (month index 5 is June)
  const [selectedCalendarDateStr, setSelectedCalendarDateStr] = useState<string>('2026-06-12');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // --- New Event Modal / Panel State ---
  const [newEventName, setNewEventName] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventVenue, setNewEventVenue] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'Hackathon' | 'Workshop' | 'College Event'>('Hackathon');
  const [newEventBudget, setNewEventBudget] = useState(5000);
  const [showEventForm, setShowEventForm] = useState(false);

  // --- New Shift State ---
  const [newShiftVolunteerId, setNewShiftVolunteerId] = useState(volunteers[0]?.id || '');
  const [newShiftEventId, setNewShiftEventId] = useState(events[0]?.id || '');
  const [newShiftDate, setNewShiftDate] = useState('2026-06-12');
  const [newShiftStartTime, setNewShiftStartTime] = useState('09:00 AM');
  const [newShiftEndTime, setNewShiftEndTime] = useState('05:00 PM');
  const [newShiftRole, setNewShiftRole] = useState('System Support');
  const [newShiftNotes, setNewShiftNotes] = useState('');
  const [showShiftForm, setShowShiftForm] = useState(false);

  // --- Shifts Roster Filters ---
  const [rosterVolFilter, setRosterVolFilter] = useState('all');
  const [rosterEvtFilter, setRosterEvtFilter] = useState('all');

  // Month navigation helpers
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar dates math
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0: Sun, 1: Mon...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create grid cells
  const dayCells: (Date | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    dayCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    dayCells.push(new Date(year, month, d));
  }

  const formatLocalDate = (dateObj: Date): string => {
    const yStr = dateObj.getFullYear();
    const mStr = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dStr = String(dateObj.getDate()).padStart(2, '0');
    return `${yStr}-${mStr}-${dStr}`;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Map events to selected date or render in grid
  const getEventsForDate = (dateStr: string) => {
    return events.filter(e => {
      const matchDate = e.date === dateStr;
      const matchCat = categoryFilter === 'all' || e.category === categoryFilter;
      const matchSearch = !searchQuery.trim() || 
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.venue.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDate && matchCat && matchSearch;
    });
  };

  const getShiftsForDate = (dateStr: string) => {
    return shifts.filter(s => s.date === dateStr);
  };

  const handleDaySelect = (dateObj: Date) => {
    const dStr = formatLocalDate(dateObj);
    setSelectedCalendarDateStr(dStr);
    setNewShiftDate(dStr);
  };

  // Submit handers
  const submitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim() || !newEventVenue.trim()) return;

    const brandColors = [
      'from-blue-600 to-indigo-900',
      'from-emerald-600 to-teal-900',
      'from-purple-600 to-fuchsia-900',
      'from-rose-600 to-pink-950',
      'from-amber-600 to-orange-950'
    ];
    const pickedColor = brandColors[Math.floor(Math.random() * brandColors.length)];

    onAddEvent({
      id: `evt-${Date.now()}`,
      name: newEventName,
      description: newEventDesc || 'Coordinators custom schedule description on Campus.',
      date: selectedCalendarDateStr,
      venue: newEventVenue,
      category: newEventCategory,
      budget: Number(newEventBudget),
      bannerColor: pickedColor,
      status: 'Planning',
      timeline: []
    });

    setNewEventName('');
    setNewEventDesc('');
    setNewEventVenue('');
    setNewEventCategory('Hackathon');
    setNewEventBudget(5000);
    setShowEventForm(false);
  };

  const submitShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShiftRole.trim()) return;

    onAddShift({
      id: `shft-${Date.now()}`,
      volunteerId: newShiftVolunteerId,
      eventId: newShiftEventId,
      date: newShiftDate,
      startTime: newShiftStartTime,
      endTime: newShiftEndTime,
      role: newShiftRole,
      notes: newShiftNotes,
      status: 'Scheduled'
    });

    setNewShiftRole('System Support');
    setNewShiftNotes('');
    setShowShiftForm(false);
  };

  // Stats summaries
  const todayDateStr = formatLocalDate(new Date());
  const activeUnfinishedShiftsCount = shifts.filter(s => s.status !== 'Completed').length;
  const completedShiftsCount = shifts.filter(s => s.status === 'Completed').length;

  return (
    <div id="schedule-portal" className="space-y-6 font-sans">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold px-2 py-0.5 rounded bg-indigo-950 border border-indigo-900/50">
              Coordinators Hub &amp; Planner
            </span>
            <h2 className="text-xl font-black text-white mt-1.5 flex items-center gap-2">
              <CalendarIcon className="h-5.5 w-5.5 text-indigo-400 animate-pulse" />
              Interactive Calendar &amp; Volunteer Scheduling
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Synchronize major academic activations, allocate dedicated student shifts, and track clock-ins against scheduled times.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="bg-slate-850 border border-slate-800 px-3 py-2 rounded-xl text-center min-w-28">
              <span className="text-[9px] font-bold text-slate-500 uppercase block leading-none">Unfinished Shifts</span>
              <span className="text-sm font-black text-amber-500 mt-1 block leading-none font-mono">{activeUnfinishedShiftsCount} Pending</span>
            </div>
            <div className="bg-slate-850 border border-slate-800 px-3 py-2 rounded-xl text-center min-w-28">
              <span className="text-[9px] font-bold text-slate-500 uppercase block leading-none">Completed Drills</span>
              <span className="text-sm font-black text-emerald-400 mt-1 block leading-none font-mono">{completedShiftsCount} Accomplished</span>
            </div>
          </div>
        </div>
      </div>

      {/* CORE WORKSPACE: CALENDAR ENGINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLUMNS: CALENDAR GRID */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-3xs space-y-4">
            
            {/* Calendar Controls Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-3 border-b border-slate-100">
              {/* Date Pagination */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1 px-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 transition cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <h3 className="font-extrabold text-sm text-slate-800 min-w-32 text-center">
                  {monthNames[month]} {year}
                </h3>
                <button 
                  onClick={handleNextMonth}
                  className="p-1 px-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 transition cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Dynamic Operations Search Bar & Category filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-xl md:justify-end">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search events by name or venue..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-8 pr-7 py-2 border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-medium text-slate-700 placeholder-slate-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 font-bold text-xs"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Selector */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-2 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden cursor-pointer font-medium animate-fade-in"
                  >
                    <option value="all">🌐 All Categories</option>
                    <option value="Hackathon">🏆 Hackathons</option>
                    <option value="Workshop">⚡ Workshops</option>
                    <option value="College Event">🎭 College Events</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Search results jump engine */}
            {searchQuery.trim() && (
              <div className="bg-indigo-50/30 p-3 rounded-xl border border-indigo-100/70 space-y-2 animate-fade-in text-xs">
                <span className="text-[10px] uppercase font-black tracking-wider text-indigo-700 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Fast Jump Engine ({
                    events.filter(e => 
                      (categoryFilter === 'all' || e.category === categoryFilter) &&
                      (e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       e.venue.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).length
                  } matches)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {events
                    .filter(e => 
                      (categoryFilter === 'all' || e.category === categoryFilter) &&
                      (e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       e.venue.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map(e => {
                      const dateParts = e.date.split('-');
                      const yearVal = parseInt(dateParts[0], 10);
                      const monthVal = parseInt(dateParts[1], 10) - 1; // Month index starts at 0
                      return (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() => {
                            setSelectedCalendarDateStr(e.date);
                            setNewShiftDate(e.date);
                            if (!isNaN(yearVal) && !isNaN(monthVal)) {
                              setCurrentDate(new Date(yearVal, monthVal, 1));
                            }
                          }}
                          className={`p-2 bg-white hover:bg-indigo-50/60 border rounded-lg text-left transition duration-150 flex items-center justify-between gap-1.5 cursor-pointer ${
                            selectedCalendarDateStr === e.date ? 'border-indigo-500 ring-1 ring-indigo-500/20' : 'border-slate-150'
                          }`}
                        >
                          <div className="truncate min-w-0">
                            <span className="font-bold text-slate-800 block truncate text-[11px] leading-tight">{e.name}</span>
                            <span className="text-[9px] text-slate-500 block truncate">📍 {e.venue}</span>
                          </div>
                          <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono font-bold shrink-0 self-center">
                            {e.date}
                          </span>
                        </button>
                      );
                    })}
                  {events.filter(e => 
                    (categoryFilter === 'all' || e.category === categoryFilter) &&
                    (e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     e.venue.toLowerCase().includes(searchQuery.toLowerCase()))
                  ).length === 0 && (
                    <span className="text-slate-400 italic text-[10px] col-span-2 text-center py-1">No matching active events or venues in scope.</span>
                  )}
                </div>
              </div>
            )}

            {/* Calendar Days of Week Row */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-slate-400 uppercase select-none">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Grid Cells */}
            <div className="grid grid-cols-7 gap-2">
              {dayCells.map((day, idx) => {
                if (!day) {
                  return <div key={`empty-${idx}`} className="bg-slate-50/40 rounded-xl aspect-square border border-dotted border-slate-100" />;
                }

                const dateStr = formatLocalDate(day);
                const dayEvents = getEventsForDate(dateStr);
                const dayShifts = getShiftsForDate(dateStr);
                const isSelected = dateStr === selectedCalendarDateStr;
                const isTodayStr = dateStr === todayDateStr;

                return (
                  <button
                    key={`day-${dateStr}`}
                    type="button"
                    onClick={() => handleDaySelect(day)}
                    className={`p-1.5 rounded-xl text-left flex flex-col justify-between aspect-square border transition-all relative ${
                      isSelected 
                        ? 'bg-indigo-50/80 border-indigo-500 shadow-3xs ring-1 ring-indigo-500/30' 
                        : isTodayStr 
                          ? 'bg-amber-50/50 border-amber-300 font-bold' 
                          : 'bg-white hover:bg-slate-50/50 border-slate-200/70'
                    }`}
                  >
                    {/* Day Number */}
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[11px] font-mono font-bold leading-none ${
                        isSelected 
                          ? 'text-indigo-600 bg-indigo-100 rounded-md p-1 min-w-5 text-center' 
                          : isTodayStr
                            ? 'text-amber-800 bg-amber-100 rounded-md p-1 min-w-5 text-center' 
                            : 'text-slate-700'
                      }`}>
                        {day.getDate()}
                      </span>
                      {dayShifts.length > 0 && (
                        <span className="text-[7px] font-bold px-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 uppercase" title={`${dayShifts.length} Shift Assigned`}>
                          👥 {dayShifts.length}
                        </span>
                      )}
                    </div>

                    {/* Brief visual bullets for items (max 2) */}
                    <div className="space-y-0.5 mt-1 overflow-hidden w-full select-none">
                      {dayEvents.slice(0, 2).map(ev => (
                        <div 
                          key={ev.id} 
                          className={`text-[8px] truncate font-extrabold px-1 rounded-sm border ${
                            ev.category === 'Hackathon' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                            ev.category === 'Workshop' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                            'bg-violet-50 border-violet-200 text-violet-700'
                          }`}
                        >
                          {ev.name}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[7px] text-slate-500 font-bold block text-right">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Helper Legend */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-150 text-[10px] text-slate-400">
              <span className="italic">💡 Click on a date block to filter, launch a new event on campus, or allocate volunteer shift rosters on that day.</span>
              <div className="flex items-center gap-3 font-semibold">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-blue-100 border border-blue-300 inline-block" /> Hackathons</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-emerald-100 border border-emerald-300 inline-block" /> Workshops</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-violet-100 border border-violet-300 inline-block" /> Culturals</span>
              </div>
            </div>

          </div>

          {/* ACTIVE SHIFTS LISTED ON THE SELECTED CALENDAR DATE */}
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-3xs space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[9px] font-mono text-indigo-400 font-black uppercase">Schedule Ledger details</span>
                <h4 className="text-xs font-extrabold text-slate-800">
                  Activations Listed for date <b className="font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{selectedCalendarDateStr}</b>
                </h4>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowEventForm(!showEventForm)}
                  className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 font-bold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-1 uppercase tracking-wider"
                >
                  <Plus className="h-3 w-3" /> Event Here
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewShiftDate(selectedCalendarDateStr);
                    setShowShiftForm(!showShiftForm);
                  }}
                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 font-bold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-1 uppercase tracking-wider"
                >
                  <Plus className="h-3 w-3" /> Shift Here
                </button>
              </div>
            </div>

            {/* EVENT DRAFT SUBMIT FORM ON SELECTED CELL */}
            {showEventForm && (
              <form onSubmit={submitEvent} className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-3 font-sans text-xs animate-fade-in">
                <div className="flex justify-between items-center border-b border-indigo-100 pb-2">
                  <span className="font-extrabold text-indigo-750 uppercase text-[9px] tracking-wider">Configure New Activation - Date: {selectedCalendarDateStr}</span>
                  <button type="button" onClick={() => setShowEventForm(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕ Close</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[9px]">Event Title *</label>
                    <input 
                      type="text" 
                      value={newEventName}
                      onChange={(e) => setNewEventName(e.target.value)}
                      placeholder="Nexus Hackathon 2.0"
                      className="w-full text-xs rounded-lg bg-white border border-slate-250 p-2 text-slate-800 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[9px]">Campus Venue Location *</label>
                    <input 
                      type="text" 
                      value={newEventVenue}
                      onChange={(e) => setNewEventVenue(e.target.value)}
                      placeholder="Innovation Hall Room 311"
                      className="w-full text-xs rounded-lg bg-white border border-slate-250 p-2 text-slate-800 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[9px]">Brief Agenda / Description</label>
                    <input 
                      type="text" 
                      value={newEventDesc}
                      onChange={(e) => setNewEventDesc(e.target.value)}
                      placeholder="A comprehensive workshop with hands-on lab notebooks..."
                      className="w-full text-xs rounded-lg bg-white border border-slate-250 p-2 text-slate-800 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[9px]">Fiscal Allocated Budget (₹)</label>
                    <input 
                      type="number" 
                      value={newEventBudget}
                      onChange={(e) => setNewEventBudget(Number(e.target.value))}
                      className="w-full text-xs rounded-lg bg-white border border-slate-250 p-2 text-slate-800 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase text-[9px]">Classification Category Group</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="w-full text-xs rounded-lg bg-white border border-slate-250 p-2 text-slate-850 font-medium focus:outline-hidden"
                  >
                    <option value="Hackathon">🏆 Hackathon (48-hr Challenge)</option>
                    <option value="Workshop">⚡ Technical Training Workshop</option>
                    <option value="College Event">🎭 Cultural college flagship activations</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[9px] uppercase tracking-widest cursor-pointer transition-colors"
                >
                  🚀 Activate Event Schedule Date
                </button>
              </form>
            )}

            {/* SHIFT SCHEDULER DRAFT FORM */}
            {showShiftForm && (
              <form onSubmit={submitShift} className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-3 font-sans text-xs animate-fade-in">
                <div className="flex justify-between items-center border-b border-emerald-100 pb-2">
                  <span className="font-extrabold text-emerald-750 uppercase text-[9px] tracking-wider">Allocate Custom Staff Shift - Date: {newShiftDate}</span>
                  <button type="button" onClick={() => setShowShiftForm(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕ Close</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[9px]">Assigned Event Scope</label>
                    <select
                      value={newShiftEventId}
                      onChange={(e) => setNewShiftEventId(e.target.value)}
                      className="w-full text-xs rounded-lg bg-white border border-slate-250 p-2 text-slate-800 focus:outline-hidden font-medium"
                    >
                      {events.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.name} ({ev.date})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[9px]">Select Student Volunteer *</label>
                    <select
                      value={newShiftVolunteerId}
                      onChange={(e) => setNewShiftVolunteerId(e.target.value)}
                      className="w-full text-xs rounded-lg bg-white border border-slate-250 p-2 text-slate-800 focus:outline-hidden font-medium"
                    >
                      {volunteers.map(vol => (
                        <option key={vol.id} value={vol.id}>{vol.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[9px]">Shift Date (YYYY-MM-DD)</label>
                    <input 
                      type="text" 
                      value={newShiftDate}
                      onChange={(e) => setNewShiftDate(e.target.value)}
                      placeholder="e.g. 2026-06-12"
                      className="w-full text-xs rounded-lg bg-white border border-slate-250 p-2 text-slate-800 font-mono text-center focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[9px]">Time Starts</label>
                    <input 
                      type="text" 
                      value={newShiftStartTime}
                      onChange={(e) => setNewShiftStartTime(e.target.value)}
                      placeholder="09:00 AM"
                      className="w-full text-xs rounded-lg bg-white border border-slate-250 p-2 text-slate-800 font-mono text-center focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[9px]">Time Concludes</label>
                    <input 
                      type="text" 
                      value={newShiftEndTime}
                      onChange={(e) => setNewShiftEndTime(e.target.value)}
                      placeholder="05:00 PM"
                      className="w-full text-xs rounded-lg bg-white border border-slate-250 p-2 text-slate-800 font-mono text-center focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[9px]">Rostered Duty Assignment *</label>
                    <input 
                      type="text" 
                      value={newShiftRole}
                      onChange={(e) => setNewShiftRole(e.target.value)}
                      placeholder="e.g. Media Desk, Food Court Sec"
                      className="w-full text-xs rounded-lg bg-white border border-slate-250 p-2 text-slate-800 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[9px]">Special Logistics Instructions</label>
                    <input 
                      type="text" 
                      value={newShiftNotes}
                      onChange={(e) => setNewShiftNotes(e.target.value)}
                      placeholder="Ensure lanyards are categorized before gate opens at 08:30 AM..."
                      className="w-full text-xs rounded-lg bg-white border border-slate-250 p-2 text-slate-800 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[9px] uppercase tracking-widest cursor-pointer transition-colors"
                >
                  ⚡ Assign Roster Shift to Volunteer
                </button>
              </form>
            )}

            {/* List Events & Shifts for chosen date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Event activations on day */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Activations Scheduled ({getEventsForDate(selectedCalendarDateStr).length})</span>
                <div className="space-y-2">
                  {getEventsForDate(selectedCalendarDateStr).length === 0 ? (
                    <div className="bg-slate-50 p-4 text-center rounded-xl border border-dashed border-slate-200">
                      <p className="text-xs font-semibold text-slate-400">No events on this date.</p>
                      <button 
                        onClick={() => setShowEventForm(true)}
                        className="text-[10px] text-indigo-600 font-bold hover:underline mt-1 cursor-pointer block mx-auto"
                      >
                        Schedule Event here
                      </button>
                    </div>
                  ) : (
                    getEventsForDate(selectedCalendarDateStr).map(evt => (
                      <div key={evt.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                        <span className={`h-2.5 w-2.5 rounded-full bg-indigo-600 shrink-0 mt-1`} />
                        <div className="space-y-0.5">
                          <h5 className="font-bold text-xs text-slate-850 leading-tight">{evt.name}</h5>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            {evt.venue}
                          </p>
                          <span className="text-[8px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase inline-block">
                            {evt.category}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Roster shifts on day */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Volunteer Shifts Assigned ({getShiftsForDate(selectedCalendarDateStr).length})</span>
                <div className="space-y-2">
                  {getShiftsForDate(selectedCalendarDateStr).length === 0 ? (
                    <div className="bg-slate-50 p-4 text-center rounded-xl border border-dashed border-slate-200">
                      <p className="text-xs font-semibold text-slate-400">No assigned shifts on this date.</p>
                      <button 
                        onClick={() => {
                          setNewShiftDate(selectedCalendarDateStr);
                          setShowShiftForm(true);
                        }}
                        className="text-[10px] text-emerald-600 font-bold hover:underline mt-1 cursor-pointer block mx-auto"
                      >
                        Assign volunteer shift here
                      </button>
                    </div>
                  ) : (
                    getShiftsForDate(selectedCalendarDateStr).map(sh => {
                      const vol = volunteers.find(v => v.id === sh.volunteerId);
                      const evName = events.find(e => e.id === sh.eventId)?.name || 'Event';
                      return (
                        <div key={sh.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
                          <div className="flex justify-between items-start gap-1">
                            <div className="flex items-center gap-1.5">
                              <span className="bg-white px-2 py-0.5 rounded text-[10px] font-bold text-slate-700 border border-slate-200">
                                🧑‍💼 {vol?.name || 'Unknown'}
                              </span>
                            </div>
                            <span className={`text-[8px] tracking-wide uppercase font-extrabold px-1.5 py-0.5 rounded-sm shrink-0 font-mono ${
                              sh.status === 'Completed' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' :
                              sh.status === 'CheckedIn' ? 'bg-blue-50 border border-blue-200 text-blue-700' :
                              'bg-amber-50 border border-amber-200 text-amber-700'
                            }`}>
                              {sh.status}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 font-medium">
                            <b>Role:</b> {sh.role} &bull; <span className="font-mono">{sh.startTime} - {sh.endTime}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* RIGHT 1 COLUMN: LIVE VOLUNTEER SHIFT SCHEDULER BOARD */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* ASSIGN QUICK SHIFT FORM (Shorthand Sidebar) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-3xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-emerald-600" />
                Shift Dispatcher Unit
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                Easily delegate localized workloads, allocate check-in slots for security teams, or staff hospitality guide stations.
              </p>
            </div>

            <form onSubmit={submitShift} className="space-y-3 font-sans text-xs text-slate-700">
              <div className="space-y-1">
                <label className="font-bold uppercase text-[9px] text-slate-400">Target Campus Event</label>
                <select
                  value={newShiftEventId}
                  onChange={(e) => setNewShiftEventId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-slate-800 font-medium leading-none"
                >
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-[9px] text-slate-400">Allocated Staff Volunteer</label>
                <select
                  value={newShiftVolunteerId}
                  onChange={(e) => setNewShiftVolunteerId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-slate-800 font-medium leading-none"
                >
                  {volunteers.map(vol => (
                    <option key={vol.id} value={vol.id}>{vol.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold uppercase text-[9px] text-slate-400">Shift Date</label>
                  <input 
                    type="date"
                    value={newShiftDate}
                    onChange={(e) => setNewShiftDate(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-slate-800"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase text-[9px] text-slate-400">Starting Hours</label>
                  <input 
                    type="text"
                    value={newShiftStartTime}
                    onChange={(e) => setNewShiftStartTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full text-xs text-center font-mono rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-[9px] text-slate-400">Duty Designation</label>
                <input 
                  type="text"
                  value={newShiftRole}
                  onChange={(e) => setNewShiftRole(e.target.value)}
                  placeholder="AV Control Desk / Registrar Admin"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-[9px] text-slate-400">Logistics Notes</label>
                <textarea
                  value={newShiftNotes}
                  onChange={(e) => setNewShiftNotes(e.target.value)}
                  placeholder="Specific shift instructions or checkpoints..."
                  className="w-full text-[11px] rounded-xl border border-slate-200 p-2 bg-slate-50 h-14 resize-none focus:outline-hidden"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition cursor-pointer shadow-3xs"
              >
                ⚡ Issue Volunteer Duty Shift
              </button>
            </form>
          </div>

          {/* QUICK EXPLANATORY NOTES */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-700 font-extrabold text-[10px] uppercase">
              <Award className="h-4 w-4 text-emerald-500" />
              Volunteer Gamified Rewards
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-normal">
              When student volunteers clock-in and complete their shifts successfully, they receive a **bonus points credit (+50 bonus XP)** that immediately advances their positions on the real-time Volunteer Leaderboards!
            </p>
          </div>

        </div>
      </div>

      {/* FOOTER SECTION: ACTIVE SHIFTS BOARD ROSTER */}
      <div id="shifts-roster-board" className="bg-white p-6 rounded-2xl border border-slate-150 shadow-3xs space-y-4">
        
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase tracking-wider block">Unified Operations</span>
            <h3 className="font-extrabold text-sm text-slate-850 flex items-center gap-1.5 mt-0.5">
              <Users className="h-4.5 w-4.5 text-indigo-600" />
              Active Volunteer Shift Rosters Board
            </h3>
            <p className="text-xs text-slate-400">Oversee shift duty, execute on-duty clock-in, and award achievements based on verified completions.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Volunteer */}
            <select
              value={rosterVolFilter}
              onChange={(e) => setRosterVolFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl focus:outline-hidden cursor-pointer font-medium"
            >
              <option value="all">🧑 All Volunteers ({volunteers.length})</option>
              {volunteers.map(vol => (
                <option key={vol.id} value={vol.id}>{vol.name}</option>
              ))}
            </select>

            {/* Filter by Event */}
            <select
              value={rosterEvtFilter}
              onChange={(e) => setRosterEvtFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl focus:outline-hidden cursor-pointer font-medium"
            >
              <option value="all">🏆 All Events ({events.length})</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Shfits Lists Card Deck */}
        {(() => {
          const filteredShifts = shifts.filter(sh => {
            const matchesVol = rosterVolFilter === 'all' || sh.volunteerId === rosterVolFilter;
            const matchesEvt = rosterEvtFilter === 'all' || sh.eventId === rosterEvtFilter;
            return matchesVol && matchesEvt;
          });

          if (filteredShifts.length === 0) {
            return (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2 select-none">
                <AlertCircle className="h-8 w-8 text-slate-400 mx-auto animate-pulse" />
                <h4 className="text-xs font-extrabold text-slate-700">No Roster Shifts Matched</h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">Adjust the filters above or use the dispatcher sidebar to issue fresh staff appointments.</p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredShifts.map(sh => {
                const vol = volunteers.find(v => v.id === sh.volunteerId);
                const evt = events.find(e => e.id === sh.eventId);

                return (
                  <div 
                    key={sh.id} 
                    className={`p-4 rounded-2xl border flex flex-col justify-between space-y-4 transition hover:shadow-xs relative bg-white ${
                      sh.status === 'Completed' ? 'border-emerald-250 bg-emerald-500/[0.01]' :
                      sh.status === 'CheckedIn' ? 'border-blue-250 bg-blue-500/[0.01]' :
                      'border-slate-200 hover:border-slate-350'
                    }`}
                  >
                    {/* Shift Card Header */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-1">
                        <span className={`text-[8px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded font-black border ${
                          sh.status === 'Completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-[0_0_4px_rgba(16,185,129,0.15)]' :
                          sh.status === 'CheckedIn' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                          'bg-amber-50 border-amber-200 text-amber-700'
                        }`}>
                          {sh.status}
                        </span>

                        <button
                          type="button"
                          onClick={() => onDeleteShift(sh.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition border border-transparent hover:border-rose-100 cursor-pointer"
                          title="Cancel scheduled shift"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-500 block">
                          {evt?.name || 'Unknown Activation'}
                        </span>
                        <h4 className="font-extrabold text-xs text-slate-800 mt-0.5">
                          🧑‍💼 {vol?.name || 'Unassigned Staff'}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          ✉️ {vol?.email || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Shift Location / Time Info */}
                    <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
                        <Clock className="h-3.5 w-3.5 text-slate-400 inline shrink-0" />
                        <span className="font-mono text-[9px] text-slate-800">
                          📅 {sh.date} &bull; {sh.startTime} - {sh.endTime}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-600 font-medium">
                        <b>Duty Assignment:</b> <span className="text-slate-850 font-bold">{sh.role}</span>
                      </div>
                      {sh.notes && (
                        <p className="text-[9px] text-slate-400 leading-normal border-t border-slate-100 pt-1 mt-1 font-light italic">
                          📝 {sh.notes}
                        </p>
                      )}
                    </div>

                    {/* Check In / Complete Buttons Roster Actions */}
                    <div className="pt-2 border-t border-slate-150 flex gap-1.5">
                      {sh.status === 'Scheduled' && (
                        <button
                          type="button"
                          onClick={() => onUpdateShiftStatus(sh.id, 'CheckedIn')}
                          className="flex-1 py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg transition text-center cursor-pointer"
                        >
                          🚪 Clock-In Staff
                        </button>
                      )}

                      {sh.status === 'CheckedIn' && (
                        <button
                          type="button"
                          onClick={() => onUpdateShiftStatus(sh.id, 'Completed')}
                          className="flex-1 py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg transition text-center cursor-pointer flex items-center justify-center gap-1 font-sans"
                        >
                          <CheckCircle className="h-3 w-3 shrink-0" /> Complete Roster (+50 XP)
                        </button>
                      )}

                      {sh.status === 'Completed' && (
                        <span className="w-full text-center py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 font-black text-[9px] uppercase tracking-wider rounded-lg block">
                          ✓ Duty Closed and Conferred
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

      </div>

    </div>
  );
}
