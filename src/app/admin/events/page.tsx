"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Settings, Users, IndianRupee, Eye, MoreVertical, Trophy, Building2, X, Info, FileText, Globe, CheckCircle2, Calendar, Clock, MapPin, Share2 } from "lucide-react";
import { mockEvents, mockRegistrations, mockUsers } from "@/lib/mockData";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function AdminEventsPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"Overview" | "Participants" | "Payments">("Overview");

  const eventsWithStats = mockEvents.map(event => {
    const eventRegs = mockRegistrations.filter(r => r.eventId === event.id);
    const paidRegs = eventRegs.filter(r => r.paymentStatus === "Paid").length;
    return { ...event, totalParticipants: eventRegs.length, paidUsers: paidRegs };
  });

  const selectedEvent = eventsWithStats.find(e => e.id === selectedEventId);

  return (
    <div className="relative min-h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Events</h1>
        <Link href="/admin/events/create">
          <Button className="shadow-md bg-indigo-600 text-white hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Create New Event
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsWithStats.map(event => (
          <Card key={event.id} className="border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden bg-white">
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg leading-tight line-clamp-1 mb-1 text-slate-800">{event.title}</h3>
                  <Badge className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold uppercase", event.status === "Live" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600")}>{event.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <Users className="h-3 w-3 mr-1 text-indigo-500" /> Participants
                  </div>
                  <div className="text-xl font-black text-slate-900">{event.totalParticipants}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <IndianRupee className="h-3 w-3 mr-1 text-emerald-500" /> Paid
                  </div>
                  <div className="text-xl font-black text-slate-900">{event.paidUsers}</div>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <Button variant="outline" size="sm" className="w-full h-10 flex items-center justify-center bg-white border-slate-200 text-slate-600 font-bold" onClick={() => setSelectedEventId(event.id)}>
                  <Eye className="mr-2 h-4 w-4" /> Details
                </Button>
                <Link href={`/admin/events/${event.id}/edit`} className="w-full">
                  <Button variant="secondary" size="sm" className="w-full h-10 flex items-center justify-center bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100 border-none font-bold">
                    <Settings className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Page-Specific Action Bar for Event Details Dashboard */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] bg-[#f8f9fb] animate-in fade-in zoom-in-95 duration-300 pointer-events-none">
          <div className="flex flex-col h-full pointer-events-auto">
            {/* 1. Spacer for the GLOBAL main navbar (80px) */}
            <div className="h-[80px] w-full flex-shrink-0" />
            
            {/* 2. Event-Specific Action Bar (Drawn immediately below Global Navbar) */}
            <div className="h-[70px] bg-white border-y border-slate-200 flex items-center justify-between px-12 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedEventId(null)}
                    className="h-10 px-6 rounded-xl bg-slate-950 text-white font-bold flex items-center gap-2.5 transition-all hover:bg-slate-800 shadow-lg shadow-slate-900/20"
                  >
                    <X className="h-4 w-4" /> Back to List
                  </button>
                  <div className="h-6 w-px bg-slate-200 mx-2" />
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none">Event Insight</span>
                </div>
                
                <div className="flex gap-3">
                   <button className="h-10 w-10 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm">
                      <Share2 className="h-4 w-4" />
                   </button>
                   <Link href={`/admin/events/${selectedEvent.id}/edit`}>
                     <button className="h-10 px-6 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold shadow-lg shadow-fuchsia-600/20 transition-all flex items-center gap-2">
                        <Settings className="h-4 w-4" /> Edit Event
                     </button>
                   </Link>
                </div>
            </div>

            {/* 3. Main Dashboard Content (Scrollable area) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
               {/* Impact Cover Header */}
               <div className="relative h-[240px] w-full bg-slate-900">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-slate-900 to-fuchsia-900 opacity-90" />
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
               </div>

               {/* Analytics Overlap Section */}
               <div className="max-w-[1400px] mx-auto px-12 -mt-36 pb-20 relative z-10">
                  {/* Title Floating Card */}
                  <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col md:flex-row justify-between items-end gap-8 mb-10">
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[10px] tracking-widest uppercase px-3 py-1 ring-1 ring-emerald-200">{selectedEvent.status}</Badge>
                           <span className="text-slate-400 font-bold text-[11px] flex items-center gap-2 uppercase tracking-wide"><Building2 className="h-4 w-4" /> {selectedEvent.organizationName}</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-[900] text-slate-900 tracking-tight leading-[1.1]">{selectedEvent.title}</h2>
                        <div className="flex items-center gap-6 text-slate-500 font-bold text-xs">
                           <span className="flex items-center gap-2 uppercase tracking-tight"><MapPin className="h-4 w-4 text-rose-500" /> {selectedEvent.mode} Mode</span>
                           <span className="flex items-center gap-2 uppercase tracking-tight"><Trophy className="h-4 w-4 text-amber-500" /> {selectedEvent.prizePool}</span>
                        </div>
                     </div>
                     
                     {/* Dashboard Tabs */}
                     <nav className="flex items-center bg-slate-50 p-2 rounded-[24px] border border-slate-100 shadow-inner shrink-0">
                        {(["Overview", "Participants", "Payments"] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                              "px-10 py-3.5 rounded-[18px] text-[13px] font-black transition-all flex items-center gap-2.5",
                              activeTab === tab 
                                ? "bg-white text-indigo-600 shadow-lg shadow-indigo-100 ring-1 ring-slate-100" 
                                : "text-slate-400 hover:text-slate-600"
                            )}
                          >
                            {tab === "Overview" && <Info className="h-4 w-4" />}
                            {tab === "Participants" && <Users className="h-4 w-4" />}
                            {tab === "Payments" && <IndianRupee className="h-4 w-4" />}
                            {tab}
                          </button>
                        ))}
                     </nav>
                  </div>

                  {/* Dynamic Tab Body */}
                  {activeTab === "Overview" && (
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                        <div className="lg:col-span-2 space-y-8">
                           <Card className="p-12 border-none shadow-sm space-y-6">
                              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 leading-none uppercase tracking-tight"><FileText className="h-5 w-5 text-indigo-600" /> Core Overview</h3>
                              <p className="text-slate-500 text-lg leading-relaxed font-bold">{selectedEvent.description}</p>
                           </Card>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <Card className="p-8 border-none shadow-sm">
                                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 leading-none">Participation Logic</h4>
                                 <div className="space-y-4">
                                    <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                       <span className="text-[10px] font-black text-slate-400 uppercase">Current Mode</span>
                                       <span className="font-black text-slate-800 uppercase text-xs">{selectedEvent.mode} Participation</span>
                                    </div>
                                    {selectedEvent.mode === "Offline" && (
                                      <div className="p-5 border-2 border-dashed border-slate-100 rounded-2xl bg-indigo-50/10">
                                         <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Detailed Address</p>
                                         <p className="text-xs font-bold text-slate-800 leading-snug">{selectedEvent.venueAddress}</p>
                                      </div>
                                    )}
                                 </div>
                              </Card>
                              <Card className="p-8 border-none shadow-sm">
                                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 leading-none">Billing Information</h4>
                                 <div className="space-y-4">
                                    <div className="flex justify-between items-center p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                                       <span className="text-[10px] font-black text-indigo-400 uppercase leading-none">Registration Fee</span>
                                       <span className="font-black text-indigo-700 text-xl tracking-tight leading-none">₹{selectedEvent.feeAmount || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                                       <span className="text-[10px] font-black text-emerald-400 uppercase leading-none">Prize Pool</span>
                                       <span className="font-black text-emerald-700 text-xs uppercase">{selectedEvent.prizePool}</span>
                                    </div>
                                 </div>
                              </Card>
                           </div>
                        </div>

                        <div className="space-y-8">
                           <div className="bg-slate-900 p-10 rounded-[44px] text-white shadow-2xl relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 transition-transform group-hover:scale-110"><Calendar className="h-64 w-64" /></div>
                              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-12">Deadlines & Roadmap</h4>
                              <div className="space-y-12 relative z-10">
                                 <div className="flex gap-6">
                                    <div className="h-16 w-16 bg-white/10 rounded-[22px] flex flex-col items-center justify-center border border-white/10 backdrop-blur-md">
                                       <span className="text-[10px] font-black text-white/50 uppercase">{format(new Date(selectedEvent.startDate), 'MMM')}</span>
                                       <span className="text-2xl font-[900] leading-none">{format(new Date(selectedEvent.startDate), 'd')}</span>
                                    </div>
                                    <div>
                                       <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Launch Date</p>
                                       <p className="text-base font-black text-white/90 leading-none">{format(new Date(selectedEvent.startDate), 'PPP')}</p>
                                    </div>
                                 </div>
                                 <div className="flex gap-6">
                                    <div className="h-16 w-16 bg-white/10 rounded-[22px] flex flex-col items-center justify-center border border-white/10 backdrop-blur-md">
                                       <span className="text-[10px] font-black text-white/50 uppercase">{format(new Date(selectedEvent.endDate), 'MMM')}</span>
                                       <span className="text-2xl font-[900] leading-none">{format(new Date(selectedEvent.endDate), 'd')}</span>
                                    </div>
                                    <div>
                                       <p className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-1">Close Date</p>
                                       <p className="text-base font-black text-white/90 leading-none">{format(new Date(selectedEvent.endDate), 'PPP')}</p>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <Card className="p-8 rounded-[44px] border-none shadow-sm space-y-6 text-center group">
                              <div className="h-24 w-24 bg-fuchsia-50 text-fuchsia-600 rounded-[32px] mx-auto flex items-center justify-center ring-8 ring-white shadow-xl shadow-fuchsia-100/50 group-hover:scale-105 transition-transform duration-500">
                                 <Globe className="h-12 w-12" />
                              </div>
                              <div>
                                 <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">Form Status</h4>
                                 <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Accepting New Submissions</p>
                              </div>
                              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border border-slate-100 shadow-inner">
                                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Publicity</span>
                                 <div className="flex items-center gap-2 text-emerald-500">
                                    <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[9px] px-3 py-1 uppercase tracking-widest">Visible</Badge>
                                 </div>
                              </div>
                           </Card>
                        </div>
                     </div>
                  )}

                  {/* Rest of the participant/payment tabs go here as before... */}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
