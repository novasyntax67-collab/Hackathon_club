"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Plus, List } from "lucide-react";
import { Button } from "@/components/ui/Button";

const events = [
  { id: 1, title: "CodeCrafters 2026", date: 15, duration: "3 Days", type: "Hackathon" },
  { id: 2, title: "UI/UX Sprint", date: 22, duration: "1 Day", type: "Workshop" },
];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4, 1)); // May 2026

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="py-6 space-y-6 max-w-7xl mx-auto min-h-screen flex flex-col relative h-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-fuchsia-600" /> Event Calendar
          </h1>
          <p className="text-sm text-slate-500 mt-1">Schedule and overview of all upcoming events and hackathons.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-200 bg-white">
            <List className="h-4 w-4 mr-2" /> List View
          </Button>
          <Button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-md shadow-fuchsia-600/20">
            <Plus className="h-4 w-4 mr-2" /> Schedule Event
          </Button>
        </div>
      </div>

      {/* Calendar Body */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm flex flex-col overflow-hidden min-h-[500px] shrink-0">
        
        {/* Calendar Controls */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800 w-48">{monthName} {year}</h2>
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button className="px-3 py-1 bg-white shadow-sm rounded-md text-sm font-semibold text-slate-800">Month</button>
              <button className="px-3 py-1 text-slate-500 text-sm font-semibold rounded-md hover:text-slate-800 transition-colors">Week</button>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={handleNextMonth} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>

        {/* Grid Header */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50 shrink-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 grid-rows-5 flex-1 overflow-y-auto">
          {paddingDays.map((_, i) => (
            <div key={`pad-${i}`} className="border-r border-b border-slate-100 bg-slate-50/30 p-2 opacity-50"></div>
          ))}
          {days.map(day => {
            const dayEvents = events.filter(e => currentMonth.getMonth() === 4 && e.date === day);
            const isToday = day === 15 && currentMonth.getMonth() === 4; // Mock today

            return (
              <div key={day} className={`border-r border-b border-slate-100 p-2 min-h-[100px] transition-colors hover:bg-slate-50/50 relative group ${isToday ? 'bg-fuchsia-50/30' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-semibold flex items-center justify-center w-7 h-7 rounded-full ${isToday ? 'bg-fuchsia-600 text-white shadow-sm' : 'text-slate-600 group-hover:bg-slate-200/50'}`}>
                    {day}
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-fuchsia-600">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-1.5 overflow-y-auto max-h-[80px] custom-scrollbar z-10 relative">
                  {dayEvents.map(evt => (
                    <div key={evt.id} className="text-xs p-1.5 rounded bg-fuchsia-100/80 text-fuchsia-800 border border-fuchsia-200/80 truncate font-medium cursor-pointer hover:bg-fuchsia-200 transition-colors" title={evt.title}>
                      <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-600 inline-block mr-1.5"></span>
                      {evt.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {/* Fill remaining cells to complete the grid visually */}
          {Array.from({ length: 35 - (paddingDays.length + days.length) }, (_, i) => (
            <div key={`end-pad-${i}`} className="border-r border-b border-slate-100 bg-slate-50/30 p-2 opacity-50"></div>
          ))}
        </div>

      </div>

      {/* Reminders and Upcoming Events Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <CalendarIcon className="h-5 w-5 text-fuchsia-600" /> Upcoming Scheduled Events
          </h2>
          <div className="space-y-3">
            {events.map(ev => (
              <div key={ev.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-fuchsia-100 text-fuchsia-600 flex flex-col items-center justify-center shrink-0">
                   <span className="text-lg font-bold leading-none">{ev.date}</span>
                   <span className="text-[10px] uppercase font-semibold">May</span>
                </div>
                <div>
                   <h4 className="text-sm font-bold text-slate-800">{ev.title}</h4>
                   <p className="text-xs text-slate-500">{ev.type} • {ev.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Clock className="h-5 w-5 text-amber-500" /> Personal Reminders
          </h2>
          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-amber-100 bg-amber-50 flex items-start gap-3">
               <div className="mt-0.5"><Clock className="h-4 w-4 text-amber-600" /></div>
               <div>
                  <h4 className="text-sm font-bold text-amber-900">Send sponsor emails</h4>
                  <p className="text-xs text-amber-700/70 mt-0.5">Deadline: May 12, 5:00 PM</p>
               </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-3">
               <div className="mt-0.5"><Clock className="h-4 w-4 text-slate-400" /></div>
               <div>
                  <h4 className="text-sm font-bold text-slate-700">Finalize judge panel</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Deadline: May 14, 10:00 AM</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
