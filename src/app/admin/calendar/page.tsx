"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Plus, List, X, Edit2, Trash2, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, parseISO, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface CalendarItem {
  id: string;
  title: string;
  date: string; // ISO string
  time?: string;
  description: string;
  type: "Event" | "Reminder";
  category?: string; // e.g. Hackathon, Workshop
}

const INITIAL_ITEMS: CalendarItem[] = [
  { id: "1", title: "CodeCrafters 2026", date: "2026-05-15", time: "09:00", description: "Global hackathon for sustainable solutions.", type: "Event", category: "Hackathon" },
  { id: "2", title: "UI/UX Sprint", date: "2026-05-22", time: "10:00", description: "Workshop on modern design patterns.", type: "Event", category: "Workshop" },
  { id: "3", title: "Send sponsor emails", date: "2026-05-12", time: "17:00", description: "Follow up with potential partners.", type: "Reminder" },
  { id: "4", title: "Finalize judge panel", date: "2026-05-14", time: "10:00", description: "Confirm all tech judges.", type: "Reminder" },
];

export default function CalendarPage() {
  const [items, setItems] = useState<CalendarItem[]>(INITIAL_ITEMS);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // May 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CalendarItem | null>(null);
  const [activeItem, setActiveItem] = useState<CalendarItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    type: "Event" as "Event" | "Reminder",
    category: "Hackathon",
  });

  // Calendar Helpers
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  const startDay = getDay(firstDayOfMonth);
  const paddingDays = Array.from({ length: startDay }, (_, i) => i);

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const itemsOnDate = (date: Date) => {
    return items.filter(item => isSameDay(parseISO(item.date), date));
  };

  const upcomingEvents = useMemo(() => {
    return items
      .filter(i => i.type === "Event")
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [items]);

  const personalReminders = useMemo(() => {
    return items
      .filter(i => i.type === "Reminder")
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [items]);

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      time: "",
      description: "",
      type: "Event",
      category: "Hackathon",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: CalendarItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      date: item.date,
      time: item.time || "",
      description: item.description,
      type: item.type,
      category: item.category || "Hackathon",
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...i, ...formData } : i));
    } else {
      const newItem = { ...formData, id: Math.random().toString(36).substr(2, 9) } as CalendarItem;
      setItems([...items, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event/reminder?")) {
      setItems(items.filter(i => i.id !== id));
      setActiveItem(null);
    }
  };

  const navigateToItem = (item: CalendarItem) => {
    const itemDate = parseISO(item.date);
    setCurrentDate(startOfMonth(itemDate));
    setSelectedDate(itemDate);
    setActiveItem(item);
    setView("calendar");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="py-6 space-y-6 max-w-7xl mx-auto min-h-screen flex flex-col relative px-4 sm:px-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-xl shadow-slate-100/50 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-fuchsia-100 rounded-xl">
              <CalendarIcon className="h-6 w-6 text-fuchsia-600" />
            </div>
            Schedule Hub
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Coordinate events and manage personal task reminders.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setView(view === "calendar" ? "list" : "calendar")}
            className="border-slate-200 bg-white hover:bg-slate-50 font-bold rounded-xl h-11"
          >
            {view === "calendar" ? <><List className="h-4 w-4 mr-2" /> List View</> : <><CalendarIcon className="h-4 w-4 mr-2" /> Calendar View</>}
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200 font-bold rounded-xl h-11 px-6 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-5 w-5 mr-2" /> Schedule Event
          </Button>
        </div>
      </div>

      {view === "calendar" ? (
        <div className="bg-white rounded-[40px] border border-slate-200/60 shadow-xl shadow-slate-100/50 flex flex-col overflow-hidden shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Calendar Controls */}
          <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-6">
              <h2 className="text-2xl font-black text-slate-800 min-w-[220px]">{format(currentDate, "MMMM yyyy")}</h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={prevMonth}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-600 shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">{format(subMonths(currentDate, 1), "MMM")}</span>
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:bg-slate-50 transition-all shadow-sm">Today</button>
              <button
                onClick={nextMonth}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-600 shadow-sm"
              >
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">{format(addMonths(currentDate, 1), "MMM")}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Grid Header */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50 shrink-0">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {day}
              </div>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 flex-1 min-h-[600px] bg-slate-50/30">
            {paddingDays.map((_, i) => (
              <div key={`pad-${i}`} className="border-r border-b border-white/50 bg-slate-100/30"></div>
            ))}
            {days.map(day => {
              const dayItems = itemsOnDate(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "border-r border-b border-slate-100 p-4 min-h-[140px] transition-all relative group cursor-pointer",
                    isSelected ? "bg-fuchsia-50/50 ring-2 ring-fuchsia-500/10 ring-inset" : "bg-white hover:bg-slate-50/50"
                  )}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={cn(
                      "text-sm font-black flex items-center justify-center w-8 h-8 rounded-2xl transition-all",
                      isCurrentDay ? "bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-200" :
                        isSelected ? "bg-slate-900 text-white" : "text-slate-400 group-hover:text-slate-900 group-hover:scale-110"
                    )}>
                      {format(day, "d")}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCreate(); }}
                      className="opacity-0 group-hover:opacity-100 transition-all p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-fuchsia-600 hover:border-fuchsia-200 hover:shadow-sm"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-[80px] overflow-hidden">
                    {dayItems.map(item => (
                      <div
                        key={item.id}
                        onClick={(e) => { e.stopPropagation(); setActiveItem(item); }}
                        className={cn(
                          "text-[10px] p-2 rounded-xl border font-bold truncate transition-all active:scale-95",
                          item.type === "Event" ? "bg-fuchsia-100/60 text-fuchsia-700 border-fuchsia-200/50 hover:bg-fuchsia-200/60" : "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100",
                          activeItem?.id === item.id && "ring-2 ring-offset-1 ring-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className={cn("w-1.5 h-1.5 rounded-full", item.type === "Event" ? "bg-fuchsia-500" : "bg-amber-500")}></div>
                          {item.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {items.sort((a, b) => a.date.localeCompare(b.date)).map(item => (
            <div
              key={item.id}
              className="group bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-16 h-16 rounded-[24px] flex flex-col items-center justify-center shrink-0 border",
                  item.type === "Event" ? "bg-fuchsia-50 border-fuchsia-100 text-fuchsia-600" : "bg-amber-50 border-amber-100 text-amber-600"
                )}>
                  <span className="text-xl font-black leading-none">{format(parseISO(item.date), "dd")}</span>
                  <span className="text-[10px] uppercase font-black tracking-widest">{format(parseISO(item.date), "MMM")}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-black text-slate-800 tracking-tight">{item.title}</h4>
                    <Badge className={cn("text-[9px] font-black tracking-widest uppercase border-none", item.type === "Event" ? "bg-fuchsia-100 text-fuchsia-600" : "bg-amber-100 text-amber-600")}>
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">{item.description}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <Clock className="h-3 w-3" /> {item.time || "No time"}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <CalendarIcon className="h-3 w-3" /> {format(parseISO(item.date), "EEEE")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateToItem(item)} className="rounded-xl font-bold border-slate-100 text-slate-500 h-10 px-4">View</Button>
                <Button variant="outline" size="sm" onClick={() => handleEdit(item)} className="rounded-xl h-10 w-10 p-0 border-slate-100 text-slate-400 hover:text-fuchsia-600"><Edit2 className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)} className="rounded-xl h-10 w-10 p-0 border-slate-100 text-slate-300 hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 shrink-0">
        <div className="bg-white rounded-[40px] border border-slate-200/60 shadow-sm p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-fuchsia-50 rounded-xl"><CalendarIcon className="h-5 w-5 text-fuchsia-600" /></div>
              Upcoming Events
            </h2>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{upcomingEvents.length} Total</span>
          </div>
          <div className="space-y-4">
            {upcomingEvents.slice(0, 3).map(ev => (
              <div
                key={ev.id}
                onClick={() => navigateToItem(ev)}
                className="group p-5 rounded-[28px] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1 transition-all flex items-center gap-5 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 text-slate-800 flex flex-col items-center justify-center shrink-0 shadow-sm">
                  <span className="text-lg font-black leading-none">{format(parseISO(ev.date), "dd")}</span>
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider font-mono">{format(parseISO(ev.date), "MMM")}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-black text-slate-800 tracking-tight group-hover:text-fuchsia-600 transition-colors">{ev.title}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{ev.category} • {ev.time}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-slate-200 group-hover:text-fuchsia-400 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-200/60 shadow-sm p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-xl"><Clock className="h-5 w-5 text-amber-500" /></div>
              Personal Reminders
            </h2>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{personalReminders.length} Pending</span>
          </div>
          <div className="space-y-4">
            {personalReminders.slice(0, 3).map(rem => (
              <div
                key={rem.id}
                onClick={() => navigateToItem(rem)}
                className="group p-5 rounded-[28px] border border-amber-50 bg-amber-50/30 hover:bg-white hover:shadow-xl hover:shadow-amber-100 hover:-translate-y-1 transition-all flex items-start gap-4 cursor-pointer"
              >
                <div className="mt-1 p-2 bg-amber-100 rounded-xl"><Clock className="h-4 w-4 text-amber-600" /></div>
                <div className="flex-1">
                  <h4 className="text-base font-black text-amber-900 tracking-tight group-hover:text-amber-600 transition-colors">{rem.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <AlertCircle className="h-3 w-3 text-amber-400" />
                    <p className="text-xs text-amber-700/60 font-medium">{format(parseISO(rem.date), "MMMM d")} • {rem.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Item Details Popup */}
      {activeItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[44px] w-full max-w-lg overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white/20 animate-in zoom-in-95 duration-300">
            <div className={cn(
              "p-10 text-white relative flex flex-col",
              activeItem.type === "Event" ? "bg-fuchsia-600" : "bg-amber-500"
            )}>
              <button onClick={() => setActiveItem(null)} className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><X className="h-5 w-5" /></button>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-white/15 rounded-2xl backdrop-blur-md shadow-inner">
                  {activeItem.type === "Event" ? <CalendarIcon className="h-8 w-8 text-white" /> : <Clock className="h-8 w-8 text-white" />}
                </div>
                <div>
                  <Badge className="bg-white/20 text-white border-none text-[10px] font-black px-2.5 h-6 mb-2 tracking-widest uppercase">{activeItem.type}</Badge>
                  <h2 className="text-3xl font-black tracking-tight leading-tight">{activeItem.title}</h2>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/10 rounded-2xl px-5 py-3 flex items-center gap-3">
                  <CalendarIcon className="h-4 w-4 text-white/60" />
                  <span className="text-sm font-bold">{format(parseISO(activeItem.date), "EEEE, MMM d, yyyy")}</span>
                </div>
                {activeItem.time && (
                  <div className="bg-white/10 rounded-2xl px-5 py-3 flex items-center gap-3">
                    <Clock className="h-4 w-4 text-white/60" />
                    <span className="text-sm font-bold">{activeItem.time}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-10 space-y-8">
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">About this {activeItem.type}</p>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">{activeItem.description}</p>
              </div>

              <div className="pt-4 flex gap-4">
                <Button onClick={() => handleDelete(activeItem.id)} variant="outline" className="flex-1 h-16 rounded-2xl border-slate-100 text-rose-500 hover:bg-rose-50 hover:border-rose-100 font-black tracking-tight uppercase text-xs">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
                <Button onClick={() => { handleEdit(activeItem); setActiveItem(null); }} className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white font-black h-16 rounded-2xl shadow-xl shadow-slate-200 uppercase text-xs tracking-widest">
                  <Edit2 className="h-4 w-4 mr-2" /> Edit Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[44px] w-full max-w-xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="p-10 pb-0 flex justify-between items-start">
              <div>
                <Badge className="bg-slate-100 text-slate-400 border-none text-[9px] font-black px-2 h-5 mb-3 tracking-widest uppercase">{editingItem ? "Edit Existing" : "Schedule New"}</Badge>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{formData.type} Details</h2>
                <p className="text-sm text-slate-500 font-medium mt-2">Fill in the information to keep your schedule updated.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="flex bg-slate-100 p-1.5 rounded-[20px] mb-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "Event" })}
                  className={cn("flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all tracking-widest uppercase", formData.type === "Event" ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600")}
                >
                  Project Event
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "Reminder" })}
                  className={cn("flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all tracking-widest uppercase", formData.type === "Reminder" ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600")}
                >
                  Personal Reminder
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Title *</label>
                  <input
                    required
                    type="text"
                    placeholder="Grand Final Hackathon"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-fuchsia-500/10 text-sm font-bold text-slate-800 placeholder:text-slate-300 transition-all shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Date *</label>
                    <input
                      required
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-fuchsia-500/10 text-sm font-bold text-slate-800 transition-all shadow-inner"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Time</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={e => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-fuchsia-500/10 text-sm font-bold text-slate-800 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Short Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Briefly describe the objective..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-6 py-5 bg-slate-50 border-none rounded-[28px] focus:ring-4 focus:ring-fuchsia-500/10 text-sm font-medium text-slate-600 transition-all shadow-inner resize-none"
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline" className="flex-1 h-16 rounded-2xl border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  Cancel
                </Button>
                <Button type="submit" className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white font-black h-16 rounded-2xl shadow-2xl shadow-slate-200 uppercase text-[10px] tracking-[0.2em]">
                  {editingItem ? "Update Details" : "Confirm Schedule"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

