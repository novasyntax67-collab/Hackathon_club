"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Link as LinkIcon, Users, Phone, ShieldCheck, Plus, Trash2, XCircle } from "lucide-react";
import Link from "next/link";
import { mockEvents } from "@/lib/mockData";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function EventRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : null;

  const event = mockEvents.find((e) => e.id === eventId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  
  // Team registration state
  const isTeamEvent = event?.participationType === "Team";
  const [teamSize, setTeamSize] = useState(event?.minTeamSize || 2);
  const [members, setMembers] = useState(Array(teamSize - 1).fill({ name: "", email: "" }));

  if (!event) return null;

  const handleTeamSizeChange = (val: number) => {
    setTeamSize(val);
    const memberCount = val - 1;
    const newMembers = [...members];
    if (newMembers.length < memberCount) {
      for (let i = newMembers.length; i < memberCount; i++) {
        newMembers.push({ name: "", email: "" });
      }
    } else {
      newMembers.length = memberCount;
    }
    setMembers(newMembers);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPaymentStatus("processing");

    // Simulate payment gateway redirect and callback
    setTimeout(() => {
      // 90% success rate for simulation
      const isSuccessful = Math.random() > 0.1;

      if (isSuccessful) {
        setPaymentStatus("success");
        setIsSubmitting(false);
        // In a real app, the registration would be created on the backend 
        // after the payment callback.
        setTimeout(() => {
          router.push(`/dashboard`);
        }, 3000);
      } else {
        setPaymentStatus("failed");
        setIsSubmitting(false);
      }
    }, 2000);
  };

  if (paymentStatus === "success") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4">
        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl max-w-lg w-full text-center border border-emerald-100 animate-in zoom-in-95 duration-300">
           <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
           </div>
           <h2 className="text-3xl font-black text-slate-900 mb-3">Payment Successful!</h2>
           <p className="text-slate-500 font-medium mb-8">Your registration for <strong>{event.title}</strong> is confirmed. {isTeamEvent ? "Your team details have been saved." : "Welcome aboard!"}</p>
           <div className="flex flex-col items-center gap-2">
             <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 animate-progress" />
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Redirecting to Dashboard</p>
           </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4">
        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl max-w-lg w-full text-center border border-rose-100 animate-in zoom-in-95 duration-300">
           <div className="w-24 h-24 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
             <XCircle className="w-12 h-12" />
           </div>
           <h2 className="text-3xl font-black text-slate-900 mb-3">Payment Failed</h2>
           <p className="text-slate-500 font-medium mb-8">We couldn't process your payment. Please retry to complete your registration for {event.title}.</p>
           <div className="flex flex-col gap-3">
             <Button 
               onClick={() => setPaymentStatus("idle")}
               className="bg-slate-900 hover:bg-slate-800 text-white h-14 rounded-2xl font-bold w-full"
             >
               Retry Payment
             </Button>
             <Link href={`/events/${eventId}`} className="text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors">
               Cancel and go back
             </Link>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href={`/events/${eventId}`} className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-fuchsia-600 transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" /> Back to Event Details
        </Link>
        
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 px-8 py-10 md:px-12 md:py-12 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Users className="h-32 w-32" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">Registration Form</h1>
            <p className="text-white/60 font-medium max-w-xl">Registering for <strong className="text-fuchsia-400 font-black">{event.title}</strong> organized by {event.organizationName}.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
            
            {/* Conditional: Individual or Team Header */}
            {!isTeamEvent ? (
              <section className="space-y-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-fuchsia-50 rounded-lg"><User className="w-5 h-5 text-fuchsia-600" /></div> Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
                    <input required type="text" placeholder="John Doe" className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition-all text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
                    <input required type="email" placeholder="john@example.com" className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition-all text-slate-900" />
                  </div>
                </div>
              </section>
            ) : (
              <section className="space-y-10">
                {/* Team Basic Info */}
                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div> Team Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 lg:col-span-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Team Name *</label>
                      <input required type="text" placeholder="e.g. Pixel Pioneers" className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Number of Members *</label>
                      <select 
                        value={teamSize}
                        onChange={(e) => handleTeamSizeChange(parseInt(e.target.value))}
                        className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900 appearance-none"
                      >
                        {Array.from({ length: (event.maxTeamSize || 4) - (event.minTeamSize || 2) + 1 }, (_, i) => (event.minTeamSize || 2) + i).map(num => (
                          <option key={num} value={num}>{num} Members</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Team Leader Details */}
                <div className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 space-y-8">
                  <h4 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm"><ShieldCheck className="h-5 w-5 text-emerald-500" /></div> 
                    Team Leader (You)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leader Name *</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                        <input required type="text" placeholder="Full Name" className="w-full pl-12 pr-5 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leader Gmail *</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                        <input required type="email" placeholder="example@gmail.com" className="w-full pl-12 pr-5 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                        <input required type="tel" placeholder="+91 XXXXX XXXXX" className="w-full pl-12 pr-5 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Members Details */}
                {members.length > 0 && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-bold text-slate-800 px-2">Team Member Details</h4>
                    <div className="space-y-4">
                      {members.map((_, i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white border border-slate-200 rounded-3xl group hover:border-blue-200 transition-colors">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              Member #{i + 2} Name
                            </label>
                            <input required type="text" placeholder={`Member ${i + 2} Name`} className="w-full px-5 py-3 bg-slate-50/30 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-400 transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Member #{i + 2} Email
                            </label>
                            <input required type="email" placeholder={`Member ${i + 2} Email`} className="w-full px-5 py-3 bg-slate-50/30 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-400 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total to Pay</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-black text-slate-900">{event.feeType === "Paid" ? `₹${event.feeAmount}` : "FREE"}</p>
                  {event.feeType === "Paid" && <Badge className="bg-emerald-500 text-white border-none px-2 rounded-lg">Pay Securely</Badge>}
                </div>
              </div>
              <Button type="submit" size="lg" disabled={isSubmitting} className={cn(
                "w-full md:w-auto h-16 md:px-12 rounded-2xl text-lg font-bold shadow-2xl transition-all",
                isTeamEvent ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20" : "bg-fuchsia-600 hover:bg-fuchsia-700 shadow-fuchsia-500/20"
              )}>
                {isSubmitting ? (
                   <span className="flex items-center gap-2">
                     <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     Redirecting to Payment...
                   </span>
                ) : event.feeType === "Paid" ? "Pay & Register" : "Register Now"}
              </Button>
            </div>
          </form>
        </div>
        
        <p className="text-center text-slate-400 text-xs mt-8 px-12">
          By submitting this form, you agree to the event rules and our terms of service. Registration is only complete after successful payment processing.
        </p>
      </div>
    </div>
  );
}
