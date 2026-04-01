"use client";

import { useState, useMemo } from "react";
import { format, subDays, isAfter, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isSameMonth } from "date-fns";
import {
  Calendar, CheckCircle2, ChevronDown,
  ChevronLeft, ChevronRight, Circle, Clock, MoreHorizontal, Bell, Plus, X
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { mockEvents, mockRegistrations, mockUsers } from "@/lib/mockData";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const COLORS = ['#e84fff', '#34446a', '#efebfc', '#ef3a72', '#9a4aff', '#f59e0b', '#10b981'];

export default function AdminDashboardPage() {
  const [regFilter, setRegFilter] = useState("This Month");
  const [revFilter, setRevFilter] = useState("Last Month");
  const [selectedEventId, setSelectedEventId] = useState("All");

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date>(new Date());
  const [reminderInput, setReminderInput] = useState("");

  const [schedule, setSchedule] = useState(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return [
      {
        id: "ev_1",
        dateValue: new Date(currentYear, currentMonth, 3).toISOString(),
        title: "Panel Discussion",
        subtitle: "Tech Beyond 2024",
        category: "Technology",
        time: "10:00 AM - 12:00 PM",
        color: "blue"
      },
      {
        id: "ev_2",
        dateValue: new Date(currentYear, currentMonth, 5).toISOString(),
        title: "Live Concert",
        subtitle: "Echo Beats Festival",
        category: "Music",
        time: "6:00 PM - 11:00 PM",
        color: "pink"
      },
      {
        id: "ev_3",
        dateValue: new Date(currentYear, currentMonth, 23).toISOString(),
        title: "Fashion Showcase",
        subtitle: "Spring Trends Runway Show",
        category: "Fashion",
        time: "3:00 PM - 5:00 PM",
        color: "blue"
      }
    ];
  });

  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const prevMonthEnd = endOfMonth(subMonths(currentDate, 1));
  const prevMonthDays = Array.from({ length: startDayOfWeek }, (_, i) => ({
    date: new Date(prevMonthEnd.getFullYear(), prevMonthEnd.getMonth(), prevMonthEnd.getDate() - startDayOfWeek + 1 + i),
    isCurrentMonth: false
  }));
  const currentMonthDays = daysInMonth.map(d => ({ date: d, isCurrentMonth: true }));
  const calendarDays = [...prevMonthDays, ...currentMonthDays];

  const visibleEvents = schedule
    .filter(ev => isSameMonth(new Date(ev.dateValue), currentDate))
    .sort((a, b) => new Date(a.dateValue).getTime() - new Date(b.dateValue).getTime());

  // Top Metrics
  const upcomingEventsCount = mockEvents.filter(e => e.status === "Upcoming").length;
  const pastEventsCount = mockEvents.filter(e => e.status === "Completed").length;
  const totalRegistrations = mockRegistrations.length;

  // Global Event Filter options
  const eventOptions = [{ id: "All", title: "All Events" }, ...mockEvents];

  // Pie Chart Data (Registrations per event)
  const pieData = useMemo(() => {
    // Mock filter logic
    return mockEvents.map(event => {
      let count = mockRegistrations.filter(r => r.eventId === event.id).length;
      // Pretend to apply filter math for MVP
      if (regFilter === "Last 3 Days") count = Math.max(0, count - 1);
      if (regFilter === "This Week") count = Math.max(0, count);
      return { name: event.title, value: count };
    }).filter(d => d.value > 0);
  }, [regFilter]);

  const totalPieValue = useMemo(() => pieData.reduce((acc, curr) => acc + curr.value, 0), [pieData]);

  // Bar Chart Data (Revenue over time)
  const barData = useMemo(() => {
    // In a real app we'd group registrations by date.
    // For MVP, we'll generate mock timeline data that changes based on filters
    const baseData = [
      { date: '1', Revenue: 500 }, { date: '5', Revenue: 1200 },
      { date: '10', Revenue: 800 }, { date: '15', Revenue: 2500 },
      { date: '20', Revenue: 1800 }, { date: '25', Revenue: 3200 },
      { date: '30', Revenue: 1500 }
    ];

    // Apply Global selected event filter mock effect
    let multiplier = selectedEventId === "All" ? 1 : 0.4;

    // Apply time filter
    let points = baseData.length;
    if (revFilter === "Last 3 Days") points = 3;
    if (revFilter === "Last Week") points = 4;
    if (revFilter === "Last 15 Days") points = 5;

    return baseData.slice(baseData.length - points).map((d, i) => ({
      name: revFilter === "Last Month" ? d.date : `Day ${i + 1}`,
      Revenue: d.Revenue * multiplier + (Math.random() * 200)
    }));
  }, [revFilter, selectedEventId]);

  // Popular Events (Top 5)
  const popularEvents = [...mockEvents].map(event => {
    const regs = mockRegistrations.filter(r => r.eventId === event.id).length;
    return { ...event, regs };
  }).sort((a, b) => b.regs - a.regs).slice(0, 5);
  const maxRegs = Math.max(...popularEvents.map(e => e.regs), 1);

  // Unchanged sections mock data
  const recentBookings = mockRegistrations.map(r => {
    const user = mockUsers.find(u => u.id === r.userId);
    const event = mockEvents.find(e => e.id === r.eventId);
    return { ...r, user, event };
  }).slice(0, 5);

  const ongoingEvent = mockEvents.find(e => e.status === "Live") || mockEvents[0];
  const nextUpcomingEvent = mockEvents.find(e => e.status === "Upcoming") || mockEvents[0];

  // Calendar Logic
  const handleDateClick = (date: Date) => {
    setSelectedCalendarDate(date);
  };

  const addReminder = () => {
    if (!reminderInput.trim()) return;
    const newEvent = {
      id: `rem_${Date.now()}`,
      dateValue: selectedCalendarDate.toISOString(),
      title: reminderInput,
      subtitle: "Custom Reminder",
      category: "Personal reminder",
      time: "All Day",
      color: "blue"
    };
    setSchedule(prev => [...prev, newEvent]);
    setReminderInput("");
  };

  const removeEvent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSchedule(prev => prev.filter(ev => ev.id !== id));
  };

  return (
    <div className="animate-in fade-in duration-300 relative -top-20 pt-4">

      {/* Dynamic Header Injected to Layout Top Row Area */}
      <div className="absolute top-0 left-0 w-full h-[60px] pointer-events-none z-20 flex flex-col justify-center">
        <h1 className="text-[22px] font-extrabold text-[#2d3a60] tracking-tight leading-tight pointer-events-auto">Dashboard</h1>
        <p className="text-[11px] text-slate-500 font-medium pointer-events-auto">Hello Admin, here is your overview</p>
      </div>

      {/* Offset content below header */}
      <div className="mt-[60px]">



        {/* TOP METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-[16px] p-4 shadow-[0px_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 flex items-center gap-4 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="h-11 w-11 rounded-xl bg-[#ffeeff] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
              <Calendar className="h-5 w-5 text-[#e84fff]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-0.5">Upcoming Events</p>
              <h3 className="text-xl font-bold text-slate-800">{upcomingEventsCount}</h3>
              <p className="text-[9px] text-emerald-500 font-bold mt-0.5">+2 this week</p>
            </div>
          </div>
          <div className="bg-white rounded-[16px] p-4 shadow-[0px_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 flex items-center gap-4 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="h-11 w-11 rounded-xl bg-[#ffeaf2] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-5 w-5 text-[#ef3a72]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-0.5">Past Events</p>
              <h3 className="text-xl font-bold text-slate-800">{pastEventsCount}</h3>
            </div>
          </div>
          <div className="bg-white rounded-[16px] p-4 shadow-[0px_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 flex items-center gap-4 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="h-11 w-11 rounded-xl bg-[#f0f9ff] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
              <Clock className="h-5 w-5 text-sky-500" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-0.5">Total Registrations</p>
              <h3 className="text-xl font-bold text-slate-800">{totalRegistrations}</h3>
              <p className="text-[9px] text-emerald-500 font-bold mt-0.5">+15% vs last month</p>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN (Analytics & Lists) */}
          <div className="lg:col-span-8 space-y-6">

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* REGISTRATIONS PIE CHART */}
              <div className="bg-white rounded-[16px] p-5 shadow-[0px_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col h-full min-h-[380px]">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-base font-bold text-slate-800">Total registrations</h3>
                  <div className="relative">
                    <select
                      className="appearance-none bg-[#f4f5fa] border-none text-[12px] font-bold text-[#4f5b80] pl-3 pr-8 py-2 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      value={regFilter}
                      onChange={(e) => setRegFilter(e.target.value)}
                    >
                      <option>Last 3 Days</option>
                      <option>This Week</option>
                      <option>This Month</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#4f5b80] pointer-events-none" />
                  </div>
                </div>
                <div className="w-full relative h-[220px] mb-4">
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                    <p className="text-[11px] text-slate-400 font-medium">Total Registrations</p>
                    <p className="text-2xl font-extrabold text-[#2d3a60] leading-tight">{totalPieValue.toLocaleString()}</p>
                  </div>
                  <div className="h-full w-full min-w-0">
                    <ResponsiveContainer width="100%" height={220} minHeight={220} minWidth={0}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={75}
                          outerRadius={105}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                          cornerRadius={4}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(val: any) => val ? Number(val).toLocaleString() : ''} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-auto w-full">
                  {pieData.map((item, idx) => {
                    const percentage = totalPieValue > 0 ? Math.round((item.value / totalPieValue) * 100) : 0;
                    return (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-8 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                          <div className="text-left">
                            <p className="text-[11px] text-slate-500 font-medium leading-tight max-w-[130px] truncate" title={item.name}>{item.name}</p>
                            <p className="text-[15px] font-bold text-slate-800 leading-tight mt-0.5">{item.value.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="bg-[#f3f4f6] rounded-xl px-3.5 py-2 text-[15px] font-bold text-slate-700 min-w-[3.5rem] text-center">
                          {percentage}%
                        </div>
                      </div>
                    )
                  })}
                  {pieData.length === 0 && <span className="text-sm text-slate-400 text-center w-full">No data</span>}
                </div>
              </div>

              {/* REVENUE BAR CHART */}
              <div className="bg-white rounded-[20px] p-6 shadow-[0px_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col h-full min-h-[420px]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Revenue Analytics</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">Total Revenue</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <div className="relative w-48">
                      <select
                        className="w-full appearance-none pl-3 pr-8 py-1.5 bg-white border border-fuchsia-200 rounded-lg text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 shadow-sm cursor-pointer hover:border-fuchsia-300 transition-colors"
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                      >
                        {eventOptions.map(opt => (
                          <option key={opt.id} value={opt.id}>{opt.title}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-fuchsia-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <select
                        className="appearance-none bg-[#f8f9fb] border-none text-[11px] font-bold text-indigo-600 pl-3 pr-8 py-1.5 rounded-lg cursor-pointer focus:outline-none hover:bg-slate-100 transition-colors"
                        value={revFilter}
                        onChange={(e) => setRevFilter(e.target.value)}
                      >
                        <option>Last 3 Days</option>
                        <option>Last Week</option>
                        <option>Last 15 Days</option>
                        <option>Last Month</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-indigo-600 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full relative h-[250px] min-h-[250px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%" minHeight={250} minWidth={0}>
                    <BarChart data={barData} barGap={4} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} dy={5} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} tickFormatter={(val) => val === 0 ? '0' : `$${val}`} />
                      <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} formatter={(v: any) => v ? `$${Number(v).toFixed(0)}` : ''} />
                      <Bar dataKey="Revenue" fill="#e84fff" radius={[4, 4, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* POPULAR EVENTS */}
            <div className="bg-white rounded-[16px] p-5 shadow-[0px_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50">
              <h3 className="text-base font-extrabold text-[#1f2937] mb-5">Top 5 Popular Events</h3>
              <div className="space-y-4">
                {popularEvents.map((event, idx) => {
                  const percent = maxRegs > 0 ? Math.round((event.regs / maxRegs) * 100) : 0;
                  return (
                    <div key={event.id} className="flex items-center gap-5">
                      <span className="w-40 shrink-0 text-[12px] font-bold text-[#4b5563] truncate" title={event.title}>{event.title}</span>
                      <div className="flex-1 h-7 rounded-full bg-[#f4f5f9] relative flex items-center px-3 overflow-hidden">
                        {percent > 0 && (
                          <div
                            className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: COLORS[idx % COLORS.length]
                            }}
                          />
                        )}
                        <div className="relative z-10 flex justify-between w-full items-center pointer-events-none">
                          <span className={cn("text-[10px] font-bold tracking-wide", percent > 0 ? "text-white" : "opacity-0")}>
                            {percent}%
                          </span>
                          <span className={cn("text-[11px] font-bold tracking-wide", percent > 0 ? "text-white/80" : "text-[#6b7280]")}>
                            <span className={percent > 0 ? "text-white font-extrabold" : "text-[#1f2937] font-extrabold"}>{event.regs}</span> Regs
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ALL EVENTS ROW (UNCHANGED SECTION) */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-800">All Events</h3>
                <button className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                  View All Events
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white rounded-[16px] pb-4 shadow-[0px_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative h-32">
                    <img src="https://images.unsplash.com/photo-1540331547168-8b63109225b7?auto=format&fit=crop&q=80&w=600" alt="Card 1" className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700">Sport</div>
                  </div>
                  <div className="px-4 pt-3">
                    <h4 className="font-bold text-[13px] text-slate-800 mb-1 leading-tight">Champions League Screening Night</h4>
                    <p className="text-[11px] font-medium text-slate-500 mb-3 line-clamp-1">SkyDome Stadium, Toronto, ON</p>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                      <div className="flex items-center text-slate-500 gap-1.5 text-[11px] font-semibold">
                        <Calendar className="h-3 w-3" /> Apr 20, 2029
                      </div>
                      <span className="text-sm font-extrabold text-[#e84fff]">$30</span>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-[20px] pb-4 shadow-[0px_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative h-36">
                    <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600" alt="Card 2" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold text-slate-700">Food & Culinary</div>
                  </div>
                  <div className="px-4 pt-4">
                    <h4 className="font-bold text-[15px] text-slate-800 mb-1 leading-tight">Culinary Delights Festival</h4>
                    <p className="text-[12px] font-medium text-slate-500 mb-4 line-clamp-1">Gourmet Plaza, San Francisco, CA</p>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex items-center text-slate-500 gap-1.5 text-[12px] font-semibold">
                        <Calendar className="h-3.5 w-3.5" /> Mar 3, 2029
                      </div>
                      <span className="text-base font-extrabold text-[#e84fff]">$40</span>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-[20px] pb-4 shadow-[0px_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative h-36">
                    <img src="https://images.unsplash.com/photo-1533134486753-c833f6248238?auto=format&fit=crop&q=80&w=600" alt="Card 3" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold text-slate-700">Fashion</div>
                  </div>
                  <div className="px-4 pt-4">
                    <h4 className="font-bold text-[15px] text-slate-800 mb-1 leading-tight">Artistry Unveiled: Modern Art Expo</h4>
                    <p className="text-[12px] font-medium text-slate-500 mb-4 line-clamp-1">Vogue Hall, Los Angeles, CA</p>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex items-center text-slate-500 gap-1.5 text-[12px] font-semibold">
                        <Calendar className="h-3.5 w-3.5" /> Mar 10, 2029
                      </div>
                      <span className="text-base font-extrabold text-[#e84fff]">$110</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT BOOKINGS ROW (UNCHANGED) */}
            <div className="bg-white rounded-[16px] p-5 shadow-[0px_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-bold text-slate-800">Recent Bookings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-400 border-b border-slate-100">
                      <th className="pb-3 px-2">Invoice ID</th>
                      <th className="pb-3 px-2">Name</th>
                      <th className="pb-3 px-2">Event</th>
                      <th className="pb-3 px-2">Amount</th>
                      <th className="pb-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-[12px] text-slate-600 font-medium">
                    {recentBookings.map((reg, idx) => (
                      <tr key={reg.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-2 tracking-wide font-mono text-[10px]">INV100{11 + idx}</td>
                        <td className="py-3 px-2 font-bold text-slate-700">{reg.user?.name}</td>
                        <td className="py-3 px-2">
                          <div className="leading-tight">
                            <div className="font-bold text-slate-700 truncate max-w-[200px]">{reg.event?.title}</div>
                            <div className="text-[10px] text-slate-400">{reg.event?.feeType}</div>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-bold">${reg.event?.feeAmount || 0}</td>
                        <td className="py-3 px-2">
                          {reg.paymentStatus === "Paid" && <span className="bg-[#ffeaf2] text-[#ef3a72] px-2.5 py-0.5 rounded-full text-[10px] font-bold">Confirmed</span>}
                          {reg.paymentStatus === "Pending" && <span className="bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Pending</span>}
                          {reg.paymentStatus === "Not Required" && <span className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Free</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (Event Highlights & Calendar) */}
          <div className="lg:col-span-4 space-y-6">

            {/* ONGOING EVENT HIGHLIGHT (NEW) */}
            {ongoingEvent && (
              <div>
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="text-[18px] font-bold text-[#2d3a60] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Ongoing Event
                  </h3>
                  <MoreHorizontal className="h-5 w-5 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
                </div>
                <div className="rounded-[24px] border border-[#e84fff]/30 bg-[#f8f7fc] flex flex-col overflow-hidden shadow-sm">
                  <div className="relative h-[200px] w-full">
                    <img src={ongoingEvent.imageUrl} alt={ongoingEvent.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-white px-3.5 py-1.5 rounded-full text-[13px] font-bold text-slate-700 shadow-sm">Live Now</div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="text-[17px] font-bold text-[#2d3a60] leading-tight mb-1">{ongoingEvent.title}</h4>
                    <p className="text-[12px] text-slate-500 font-medium mb-3">Virtual Event / Online</p>
                    <p className="text-[13px] text-slate-600 mb-5 line-clamp-2 leading-relaxed">
                      {ongoingEvent.shortDescription}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2.5 rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-[#34446a]" />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-[#2d3a60]">{format(new Date(ongoingEvent.startDate), 'MMM dd, yyyy')}</p>
                          <p className="text-[12px] text-slate-500 font-medium">{format(new Date(ongoingEvent.startDate), 'hh:mm a')} - {format(new Date(ongoingEvent.endDate || ongoingEvent.startDate), 'hh:mm a')}</p>
                        </div>
                      </div>
                      <Link href={`/events/${ongoingEvent.id}`}>
                        <button className="bg-emerald-500 hover:bg-emerald-600 transition-colors text-white text-[13px] font-bold px-5 py-2.5 rounded-full shadow-sm">
                          Ongoing
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* UPCOMING EVENT (SINGLE CARD) */}
            {nextUpcomingEvent && (
              <div className="mt-5">
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="text-[18px] font-bold text-[#2d3a60]">Upcoming Event</h3>
                  <MoreHorizontal className="h-5 w-5 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
                </div>
                <div className="rounded-[24px] border border-[#e84fff]/30 bg-[#f8f7fc] flex flex-col overflow-hidden shadow-sm">
                  <div className="relative h-[200px] w-full">
                    <img src={nextUpcomingEvent.imageUrl} alt={nextUpcomingEvent.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-white px-3.5 py-1.5 rounded-full text-[13px] font-bold text-slate-700 shadow-sm">Code</div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h4 className="text-[20px] font-bold text-[#2d3a60] leading-tight mb-1">{nextUpcomingEvent.title}</h4>
                    <p className="text-[13px] text-slate-500 font-medium mb-4">Innovation Hub, San Francisco, CA</p>
                    <p className="text-[14px] text-slate-600 mb-6 line-clamp-2 leading-relaxed">
                      {nextUpcomingEvent.shortDescription}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2.5 rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-[#34446a]" />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-[#2d3a60]">{format(new Date(nextUpcomingEvent.startDate), 'MMM dd, yyyy')}</p>
                          <p className="text-[12px] text-slate-500 font-medium">{format(new Date(nextUpcomingEvent.startDate), 'hh:mm a')} - {format(new Date(nextUpcomingEvent.endDate || nextUpcomingEvent.startDate), 'hh:mm a')}</p>
                        </div>
                      </div>
                      <Link href={`/events/${nextUpcomingEvent.id}`}>
                        <button className="bg-[#e84fff] hover:bg-[#d43ceb] transition-colors text-white text-[13px] font-bold px-5 py-2.5 rounded-full shadow-sm">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CALENDAR VIEW & INTERACTION MAP */}
            <div className="bg-white rounded-[20px] p-6 shadow-[0px_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50">
              <div className="flex justify-between items-center mb-6">
                <div className="relative inline-flex items-center group cursor-pointer">
                  <select
                    value={currentDate.getFullYear()}
                    onChange={(e) => setCurrentDate(new Date(Number(e.target.value), currentDate.getMonth(), 1))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Select Year"
                  >
                    {Array.from({ length: 21 }, (_, i) => 2020 + i).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <h3 className="text-base font-bold text-[#1f2937] group-hover:text-slate-600 transition-colors">
                    {format(currentDate, 'MMMM')} <span className="text-slate-400 font-normal">{format(currentDate, 'yyyy')}</span><ChevronDown className="inline h-4 w-4 text-slate-400 ml-1 group-hover:text-slate-600 transition-colors" />
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <Link href="/admin/calendar">
                    <Button variant="outline" size="sm" className="h-8 px-3 text-[11px] border-fuchsia-200 text-fuchsia-700 hover:bg-fuchsia-50 hidden sm:flex">View Full Calendar</Button>
                  </Link>
                  <div className="flex gap-2">
                    <button onClick={handlePrevMonth} className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                    <button onClick={handleNextMonth} className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"><ChevronRight className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 text-center text-[14px] mb-8 gap-y-4 gap-x-1">
                <div className="text-slate-600 font-medium mb-2">Su</div>
                <div className="text-slate-600 font-medium mb-2">Mo</div>
                <div className="text-slate-600 font-medium mb-2">Tu</div>
                <div className="text-slate-600 font-medium mb-2">We</div>
                <div className="text-slate-600 font-medium mb-2">Th</div>
                <div className="text-slate-600 font-medium mb-2">Fr</div>
                <div className="text-slate-600 font-medium mb-2">Sa</div>

                {calendarDays.map((d, i) => {
                  const isEvent = d.isCurrentMonth && schedule.some(ev => isSameDay(new Date(ev.dateValue), d.date));
                  const isSelected = d.isCurrentMonth && isSameDay(selectedCalendarDate, d.date);
                  return (
                    <div key={i} onClick={() => d.isCurrentMonth && handleDateClick(d.date)} className="flex flex-col items-center relative h-10 w-full cursor-pointer group">
                      <div className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-full text-[13px] transition-colors relative z-10",
                        !d.isCurrentMonth ? "text-slate-300 cursor-default" : isSelected ? "bg-[#e84fff] text-white font-bold shadow-md shadow-[#e84fff]/30" : "text-slate-700 group-hover:bg-slate-100"
                      )}>
                        {format(d.date, 'd')}
                      </div>
                      {isEvent && (
                        <div className="absolute bottom-0 w-1 h-1 rounded-full bg-[#e84fff]"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Schedule Events List */}
              <div className="flex flex-col gap-4">
                {visibleEvents.map((ev, i) => {
                  const isPink = ev.color === "pink";
                  const bgClass = isPink ? "bg-[#f8f0ff]" : "bg-[#f8f9fa]";
                  const dateBg = isPink ? "bg-[#e84fff]" : "bg-[#3b4b72]";

                  return (
                    <div key={ev.id} className={cn("rounded-[20px] p-3 flex gap-4 border border-slate-50/50 group relative", bgClass)}>
                      <div className={cn("w-14 h-[72px] rounded-[14px] flex flex-col items-center justify-center shrink-0 shadow-sm", dateBg)}>
                        <span className="text-[22px] font-bold text-white leading-none mb-0.5">{format(new Date(ev.dateValue), 'd')}</span>
                        <span className="text-[12px] font-medium text-white/90">{format(new Date(ev.dateValue), 'EEE')}</span>
                      </div>
                      <div className="flex flex-col justify-center flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-[14px] font-bold text-[#1f2937] leading-tight mb-0.5">{ev.title}</h4>
                          <button onClick={(e) => removeEvent(ev.id, e)} className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium mb-2.5">{ev.subtitle}</p>
                        <div className="flex items-center gap-3.5 text-[12px] font-medium text-slate-500">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-70">
                              <circle cx="3.5" cy="3.5" r="2.5" />
                              <circle cx="10.5" cy="3.5" r="2.5" />
                              <circle cx="3.5" cy="10.5" r="2.5" />
                              <circle cx="10.5" cy="10.5" r="2.5" />
                            </svg>
                            {ev.category}
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-500"><Clock className="h-3.5 w-3.5 opacity-70" /> {ev.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {visibleEvents.length === 0 && (
                  <p className="text-[13px] text-slate-400 font-medium text-center py-4">No events scheduled.</p>
                )}
              </div>

              {/* Reminders Input */}
              <div className="flex gap-2 relative mt-6 pt-6 border-t border-slate-100">
                <input
                  type="text"
                  value={reminderInput}
                  onChange={e => setReminderInput(e.target.value)}
                  placeholder={`Add reminder for ${format(selectedCalendarDate, 'MMM d, yyyy')}...`}
                  className="w-full text-[13px] font-medium bg-[#f8f9fb] border border-slate-100 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                  onKeyDown={e => e.key === 'Enter' && addReminder()}
                />
                <Button size="sm" onClick={addReminder} disabled={!reminderInput.trim()} className="shrink-0 h-auto rounded-xl px-4 bg-[#e84fff] hover:bg-[#d43ceb] text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
