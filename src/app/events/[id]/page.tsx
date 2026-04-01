"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Clock, Trophy, FileText, CheckCircle2, Globe, Building2, MapPin, Users, User, Laptop, ExternalLink, Info, CreditCard, ShieldCheck, Mail, Phone, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { mockEvents, mockRegistrations, mockUsers } from "@/lib/mockData";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : null;
  const { user } = useAuth();
  const event = mockEvents.find((e) => e.id === eventId);
  
  const [activeTab, setActiveTab] = useState<"Overview" | "Participants" | "Payments">("Overview");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  
  // Registration data for the current user
  const [localReg, setLocalReg] = useState(user ? mockRegistrations.find(r => r.eventId === event?.id && r.userId === user.id) : undefined);

  if (!event) notFound();

  const handlePay = () => setPaymentModalOpen(true);
  const simulatePaymentSuccess = () => {
    if (localReg) {
      setLocalReg({ ...localReg, paymentStatus: "Paid", transactionId: `txn_mock_${Date.now()}` });
    }
    setPaymentModalOpen(false);
  };

  const isRegistrationOpen = new Date() < new Date(event.registrationDeadline) && event.status !== "Completed";

  // Mock participants for demo
  const participants = mockRegistrations
    .filter(r => r.eventId === event.id)
    .map(r => ({
      ...r,
      user: mockUsers.find(u => u.id === r.userId)
    }));

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      {/* Dynamic Header / Hero */}
      <div className="relative h-[480px] w-full overflow-hidden shrink-0">
        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover scale-105 blur-[2px] opacity-40 absolute inset-0 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/90 to-[#0f172a]" />
        
        <div className="absolute inset-0 flex flex-col">
          <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-12">
            <div className="max-w-6xl w-full mx-auto space-y-8">
              <div className="flex flex-wrap gap-3">
                <Badge className={cn(
                  "px-5 py-2 text-xs font-black uppercase tracking-tighter rounded-xl border-none shadow-2xl",
                  event.status === "Live" ? "bg-emerald-500 text-white" : "bg-fuchsia-600 text-white"
                )}>
                  {event.status}
                </Badge>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-3xl border border-white/20 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-inner">
                  {event.mode === "Online" ? <Laptop className="h-4 w-4" /> : <MapPin className="h-4 w-4" />} {event.mode}
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-3xl border border-white/20 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-inner uppercase tracking-wide">
                  {event.participationType === "Team" ? <Users className="h-4 w-4" /> : <User className="h-4 w-4" />} {event.participationType}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
                <div className="lg:col-span-8 space-y-6">
                  <h1 className="text-5xl md:text-7xl font-[900] tracking-tight text-white leading-[1.05] drop-shadow-2xl">
                    {event.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-8 pt-2">
                    <div className="flex items-center gap-4 group">
                      <div className="h-14 w-14 bg-white/95 rounded-2xl flex items-center justify-center p-2 shadow-2xl transition-transform group-hover:scale-105">
                        <Building2 className="h-8 w-8 text-fuchsia-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-400/80 mb-0.5">Organized by</p>
                        <a href={event.organizationWebsite} target="_blank" rel="noopener noreferrer" className="text-xl font-black text-white hover:text-fuchsia-300 transition-colors flex items-center gap-2">
                          {event.organizationName} <ExternalLink className="h-4 w-4 opacity-50" />
                        </a>
                      </div>
                    </div>
                    
                    <div className="h-12 w-[1px] bg-white/10 hidden md:block" />
                    
                    <div className="flex items-center gap-4">
                       <div className="p-3.5 bg-amber-400/20 rounded-2xl border border-amber-400/30 backdrop-blur-md shadow-xl"><Trophy className="h-7 w-7 text-amber-400" /></div>
                       <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-0.5">Prize Pool</p>
                         <p className="text-2xl font-[900] text-amber-400 tracking-tight">{event.prizePool}</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-0 z-[40] bg-white border-b border-slate-200/60 shadow-sm backdrop-blur-md bg-white/95">
        <div className="container mx-auto px-6 max-w-6xl">
          <nav className="flex items-center gap-10 h-20">
            {(["Overview", "Participants", "Payments"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative h-full px-2 text-sm font-black tracking-widest uppercase transition-all flex items-center gap-2 group",
                  activeTab === tab ? "text-fuchsia-600" : "text-slate-400 hover:text-slate-800"
                )}
              >
                {tab === "Overview" && <Info className="h-4 w-4" />}
                {tab === "Participants" && <Users className="h-4 w-4" />}
                {tab === "Payments" && <CreditCard className="h-4 w-4" />}
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-fuchsia-600 shadow-lg shadow-fuchsia-500/30 rounded-t-full" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Responsive Layout */}
      <div className="flex-1 w-full bg-[#f8fafc]">
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Tab Contents */}
            <div className="lg:col-span-8">
              
              {activeTab === "Overview" && (
                <div className="space-y-12">
                  {/* Detailed Information Card */}
                  <div className="bg-white rounded-[40px] border border-slate-200/70 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] space-y-12">
                    <section>
                      <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4">
                        <div className="h-4 w-4 bg-fuchsia-600 rounded-full shadow-lg shadow-fuchsia-500/40" /> Overview
                      </h2>
                      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-xl font-medium">
                        <p>{event.description}</p>
                      </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                      <div className="p-8 bg-slate-50/80 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Users className="h-24 w-24 text-fuchsia-600" /></div>
                        <h3 className="font-black text-slate-900 mb-6 flex items-center gap-3">
                          <Users className="h-6 w-6 text-fuchsia-600" /> Participation Model
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-slate-200/60">
                            <span className="text-sm font-bold text-slate-500">FORMAT</span> 
                            <span className="font-black text-slate-900">{event.participationType}</span>
                          </div>
                          {event.participationType === "Team" && (
                            <div className="flex justify-between items-center py-2">
                              <span className="text-sm font-bold text-slate-500">TEAM CONSTRAINTS</span> 
                              <Badge className="bg-fuchsia-100 text-fuchsia-700 border-none font-black">{event.minTeamSize} - {event.maxTeamSize} Members</Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-8 bg-slate-50/80 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                          {event.mode === "Online" ? <Laptop className="h-24 w-24 text-blue-600" /> : <MapPin className="h-24 w-24 text-rose-600" />}
                        </div>
                        <h3 className="font-black text-slate-900 mb-6 flex items-center gap-3">
                          {event.mode === "Online" ? <Laptop className="h-6 w-6 text-blue-600" /> : <MapPin className="h-6 w-6 text-rose-600" />} 
                          Logistics & Mode
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                            <span className="text-sm font-bold text-slate-500">OPPORTUNITY MODE</span> 
                            <span className="font-black text-slate-900 uppercase tracking-wide">{event.mode}</span>
                          </div>
                          {event.mode === "Offline" && (
                            <div className="pt-2">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Venue</p>
                              <p className="text-sm font-bold text-slate-800 leading-snug">{event.venueAddress}</p>
                              <a href={event.eventLocation} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-blue-600 text-xs font-black hover:text-blue-700 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                                Open Google Maps <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <section className="pt-8">
                      <h2 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
                        <div className="h-4 w-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/40" /> Timeline & Milestones
                      </h2>
                      <div className="relative ml-6 border-l-[3px] border-slate-100/80 pl-12 space-y-12">
                        {event.timeline.map((item, idx) => (
                          <div key={idx} className="relative group">
                            <div className="absolute -left-[63px] top-0 h-10 w-10 bg-white border-[3px] border-slate-100 rounded-2xl flex items-center justify-center p-2.5 transition-all group-hover:border-fuchsia-400 group-hover:scale-110 shadow-sm overflow-hidden">
                               <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                               <Calendar className="h-full w-full text-slate-400 group-hover:text-fuchsia-600 relative z-10" />
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-4">
                                <Badge className="bg-fuchsia-600 text-white border-none py-1 px-4 text-[10px] font-black tracking-widest uppercase rounded-lg">
                                  {item.date}
                                </Badge>
                              </div>
                              <h3 className="text-2xl font-black text-slate-900 group-hover:text-fuchsia-700 transition-colors">{item.title}</h3>
                              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Eligibility & Rules */}
                    <section className="pt-8 border-t border-slate-100/60">
                      <h2 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
                        <div className="h-4 w-4 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/40" /> Rules of Engagement
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {event.rules.map((rule, idx) => (
                          <div key={idx} className="flex items-start gap-5 p-6 rounded-[28px] bg-white border border-slate-100 shadow-sm hover:border-fuchsia-200 hover:shadow-xl hover:shadow-fuchsia-500/5 transition-all group">
                            <div className="h-10 w-10 rounded-[14px] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                              <ShieldCheck className="h-6 w-6" />
                            </div>
                            <span className="text-slate-700 font-bold leading-relaxed">{rule}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Sponsors Section */}
                  {event.sponsors && event.sponsors.length > 0 && (
                    <div className="bg-white rounded-[40px] border border-slate-200/70 p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] text-center">
                      <h2 className="text-xl font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Premier Partners</h2>
                      <div className="flex flex-wrap items-center justify-center gap-16">
                        {event.sponsors.map((s, i) => (
                          <div key={i} className="flex flex-col items-center gap-6 group">
                            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:shadow-2xl transition-all duration-500">
                              <img src={s.logoUrl} alt={s.name} title={s.name} className="h-14 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                            </div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Participants" && (
                <div className="space-y-8">
                  <div className="bg-white rounded-[40px] border border-slate-200/70 p-10 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                       <h2 className="text-[28px] font-[900] text-slate-900 tracking-tight">Active Registrations</h2>
                       <Badge className="bg-slate-100 text-slate-600 border-none px-5 py-2 rounded-xl text-xs font-black">{participants.length} TOTAL</Badge>
                    </div>

                    <div className="space-y-4">
                      {participants.length === 0 ? (
                        <div className="py-20 text-center space-y-4 rounded-3xl bg-slate-50/50 border-2 border-dashed border-slate-200">
                           <Users className="h-12 w-12 text-slate-300 mx-auto" />
                           <p className="text-slate-500 font-bold">No participants registered yet.</p>
                        </div>
                      ) : (
                        participants.map((reg) => (
                          <div key={reg.id} className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-fuchsia-300 hover:shadow-2xl hover:shadow-fuchsia-500/5 transition-all">
                             <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex items-center gap-5">
                                   <div className="h-16 w-16 bg-[#e0e7ff] rounded-2xl flex items-center justify-center p-1 border-[3px] border-white shadow-lg overflow-hidden shrink-0">
                                      <img src={`https://i.pravatar.cc/150?u=${reg.userId}`} alt={reg.user?.name} className="w-full h-full object-cover rounded-xl" />
                                   </div>
                                   <div>
                                      <h4 className="text-xl font-black text-slate-900 group-hover:text-fuchsia-600 transition-colors uppercase tracking-tight">{reg.user?.name}</h4>
                                      <p className="text-sm font-bold text-slate-500 flex items-center gap-1.5"><Mail className="h-3 w-3" /> {reg.user?.email}</p>
                                   </div>
                                </div>
                                <div className="flex flex-row md:flex-col justify-between items-end gap-2">
                                   <Badge className={cn(
                                     "px-4 py-1.5 rounded-lg border-none font-black text-[10px] uppercase tracking-widest",
                                     reg.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                   )}>
                                     {reg.paymentStatus}
                                   </Badge>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase">Registered {format(new Date(reg.registrationDate), 'MMM d, p')}</p>
                                </div>
                             </div>
                             
                             {event.participationType === "Team" && (
                               <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="p-4 bg-fuchsia-50/50 rounded-2xl border border-fuchsia-100/50">
                                     <p className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-1">Position</p>
                                     <p className="text-sm font-black text-fuchsia-700 uppercase">Team Leader</p>
                                  </div>
                                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Internal Reference</p>
                                     <p className="text-sm font-black text-slate-800 uppercase">#{reg.id.split('-')[1]}</p>
                                  </div>
                               </div>
                             )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Payments" && (
                <div className="space-y-8">
                  <div className="bg-white rounded-[40px] border border-slate-200/70 p-10 shadow-sm">
                    <h2 className="text-[28px] font-[900] text-slate-900 tracking-tight mb-10">Financial Tracking</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                       <div className="p-6 bg-emerald-500 rounded-3xl text-white shadow-xl shadow-emerald-500/20">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Total Collected</p>
                          <p className="text-3xl font-[900]">₹{participants.filter(p => p.paymentStatus === "Paid").length * (event.feeAmount || 0)}</p>
                       </div>
                       <div className="p-6 bg-amber-500 rounded-3xl text-white shadow-xl shadow-amber-500/20">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Pending Dues</p>
                          <p className="text-3xl font-[900]">₹{participants.filter(p => p.paymentStatus === "Pending").length * (event.feeAmount || 0)}</p>
                       </div>
                       <div className="p-6 bg-[#34446a] rounded-3xl text-white shadow-xl shadow-slate-200">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Registration Goal</p>
                          <p className="text-3xl font-[900]">82%</p>
                       </div>
                    </div>

                    <div className="overflow-hidden rounded-[28px] border border-slate-100">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr className="text-[11px] font-[900] text-slate-400 uppercase tracking-widest">
                            <th className="px-6 py-4">Transaction Details</th>
                            <th className="px-6 py-4">Participant</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {participants.map((reg) => (
                            <tr key={reg.id} className="group hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-5">
                                 <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">#{reg.transactionId || 'PENDING'}</p>
                              </td>
                              <td className="px-6 py-5">
                                 <p className="text-sm font-bold text-slate-700">{reg.user?.name}</p>
                              </td>
                              <td className="px-6 py-5">
                                 <div className="flex items-center gap-2">
                                    <div className={cn("h-2 w-2 rounded-full", reg.paymentStatus === "Paid" ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
                                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{reg.paymentStatus}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-5 text-right font-black text-slate-900">
                                 ₹{event.feeAmount || 0}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Sticky Panel */}
            <div className="lg:col-span-4 lg:self-start sticky top-[104px]">
              <div className="space-y-8">
                {/* Checkout Experience Panel */}
                <div className="bg-slate-900 text-white p-10 rounded-[48px] shadow-[0_40px_80px_rgba(15,23,42,0.3)] border border-slate-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-10 blur-xl group-hover:scale-125 transition-transform duration-1000"><Trophy className="h-64 w-64 text-fuchsia-600" /></div>
                  
                  <div className="relative z-10 space-y-10">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-fuchsia-400 uppercase tracking-[0.3em]">Official Entry Fee</p>
                       <div className="flex items-baseline gap-2">
                          <p className="text-6xl font-[900] tracking-tighter text-white">{event.feeType === "Paid" ? `₹${event.feeAmount}` : "FREE"}</p>
                          {event.feeType === "Paid" && <span className="text-slate-400 font-bold">/ Person</span>}
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-800/80">
                      <div className="space-y-1">
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><Clock className="h-3 w-3 text-emerald-400" /> Timer</p>
                        <p className="font-black text-emerald-400 text-lg">2 Days Left</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><Users className="h-3 w-3 text-blue-400" /> Reach</p>
                        <p className="font-black text-white text-lg">1,240+</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      {localReg ? (
                        <div className="space-y-4">
                          <div className="bg-emerald-500/10 text-emerald-400 p-6 rounded-[24px] border border-emerald-500/20 text-center font-black flex items-center justify-center gap-3 shadow-inner">
                            <CheckCircle2 className="h-6 w-6" /> You Are Registered
                          </div>
                          {event.feeType === "Paid" && localReg.paymentStatus === "Pending" && (
                            <Button onClick={handlePay} size="lg" className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white h-16 rounded-[24px] shadow-2xl shadow-fuchsia-600/30 text-lg font-black transition-all hover:scale-[1.02] active:scale-95">
                              Complete Payment
                            </Button>
                          )}
                        </div>
                      ) : isRegistrationOpen ? (
                        <Link href={`/events/${event.id}/register`} className="w-full block">
                          <Button size="lg" className="w-full h-16 rounded-[24px] bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-2xl shadow-fuchsia-600/30 text-lg font-black transition-all hover:scale-[1.02] active:scale-95">
                            Secure Spot Now <ChevronRight className="h-5 w-5 ml-1" />
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled size="lg" className="w-full h-16 rounded-[24px] opacity-30 bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed">
                          Registration Closed
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Logistics at a glance */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
                   <h4 className="font-black text-slate-900 flex items-center gap-3 text-lg uppercase tracking-tight">
                     <Calendar className="h-5 w-5 text-fuchsia-600" /> Event Timeline
                   </h4>
                   <div className="space-y-6">
                      <div className="flex gap-5 group">
                         <div className="h-14 w-14 shrink-0 bg-[#f1f5f9] rounded-2xl flex flex-col items-center justify-center border-2 border-white shadow-md group-hover:border-fuchsia-100 transition-colors">
                            <span className="text-[10px] font-[900] text-slate-400 uppercase tracking-widest">{format(new Date(event.startDate), 'MMM')}</span>
                            <span className="text-xl font-black text-slate-900 leading-none">{format(new Date(event.startDate), 'd')}</span>
                         </div>
                         <div className="space-y-0.5">
                            <p className="text-sm font-black text-slate-900 uppercase">Commencement</p>
                            <p className="text-xs font-bold text-slate-500">{format(new Date(event.startDate), 'hh:mm a')} onwards</p>
                         </div>
                      </div>
                      <div className="flex gap-5 group">
                         <div className="h-14 w-14 shrink-0 bg-[#f1f5f9] rounded-2xl flex flex-col items-center justify-center border-2 border-white shadow-md group-hover:border-rose-100 transition-colors">
                            <span className="text-[10px] font-[900] text-slate-400 uppercase tracking-widest">{format(new Date(event.endDate), 'MMM')}</span>
                            <span className="text-xl font-black text-slate-900 leading-none">{format(new Date(event.endDate), 'd')}</span>
                         </div>
                         <div className="space-y-0.5">
                            <p className="text-sm font-black text-slate-900 uppercase">Conclusion</p>
                            <p className="text-xs font-bold text-slate-500">Scheduled till {format(new Date(event.endDate), 'hh:mm a')}</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Success Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-3xl px-4 animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-lg rounded-[56px] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-slate-100 animate-in zoom-in-95 duration-500 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><CreditCard className="h-64 w-64 text-fuchsia-600" /></div>
             
             <div className="text-center relative z-10 space-y-8">
                <div className="h-28 w-28 bg-fuchsia-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 border-2 border-fuchsia-100 shadow-xl shadow-fuchsia-500/10 rotate-3">
                   <CreditCard className="h-12 w-12 text-fuchsia-600 -rotate-3" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-[900] text-slate-900 tracking-tight leading-none">Checkout Securely</h2>
                  <p className="text-slate-500 font-bold text-lg leading-relaxed px-4">
                    Ready to compete? Finish your entry by paying the registration fee of <br />
                    <span className="text-slate-900 text-3xl font-[900] block mt-4 px-6 py-4 bg-slate-50 inline-block rounded-3xl border border-slate-100">₹{event.feeAmount}</span>
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <Button onClick={() => setPaymentModalOpen(false)} variant="outline" className="h-18 rounded-[28px] font-black text-lg border-slate-200 uppercase tracking-widest py-6">
                     Dismiss
                  </Button>
                  <Button onClick={simulatePaymentSuccess} className="h-18 rounded-[28px] bg-slate-900 text-white font-black text-lg hover:bg-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.2)] uppercase tracking-widest py-6">
                     Approve Pay
                  </Button>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pt-4">
                   <ShieldCheck className="h-4 w-4" /> SSL Encrypted Session
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

