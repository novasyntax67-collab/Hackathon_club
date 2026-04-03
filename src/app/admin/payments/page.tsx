"use client";

import { useState, useEffect } from "react";
import { getRegistrations, getEvents, getUsers } from "@/lib/storage";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CreditCard, Search, Download, Calendar as CalendarIcon, User as UserIcon, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminPaymentsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const loadData = () => {
    setRegistrations(getRegistrations());
    setEvents(getEvents());
    setUsers(getUsers());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage-update", loadData);
    return () => window.removeEventListener("storage-update", loadData);
  }, []);

  const paidRegistrations = registrations.filter(reg => {
    const user = users.find(u => u.id === reg.userId);
    const event = events.find(e => e.id === reg.eventId);
    const matchesSearch = 
      (user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (event?.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (reg.transactionId || "").toLowerCase().includes(search.toLowerCase());
    return reg.paymentStatus === "Paid" && matchesSearch;
  });

  return (
    <div className="py-6 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
          <CreditCard className="h-24 w-24" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 leading-none">
            <div className="p-2.5 bg-emerald-100 rounded-2xl">
              <CreditCard className="h-7 w-7 text-emerald-600" />
            </div>
            Payment Records
          </h1>
          <p className="text-sm text-slate-500 mt-3 font-medium">Tracking and reconciling all event registration fees and transaction IDs.</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 font-bold rounded-xl h-12 px-6 flex items-center gap-2">
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 ring-1 ring-slate-50">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
          <input 
            type="text" 
            placeholder="Search by participant, event, or transaction ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white transition-all placeholder:text-slate-300"
          />
        </div>
      </div>
      
      {/* Table Content */}
      <div className="bg-white rounded-[40px] border border-slate-200/60 shadow-xl shadow-slate-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction / Source</th>
                <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Participant Info</th>
                <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Event Applied</th>
                <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fee Collected</th>
                <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paidRegistrations.map(reg => {
                const user = users.find(u => u.id === reg.userId);
                const event = events.find(e => e.id === reg.eventId);
                return (
                  <tr key={reg.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="py-6 px-8">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-mono text-[11px] font-black text-slate-400 uppercase tracking-tight">{reg.transactionId || '--- N/A ---'}</span>
                        <div className="flex items-center gap-2">
                          <Badge className={cn(
                            "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border-none",
                            reg.source === 'manual' ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"
                          )}>
                            {reg.source || 'Online'}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs shadow-inner">
                          {user?.name?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800 text-sm tracking-tight">{user?.name || "Deleted User"}</span>
                          <span className="text-[11px] font-medium text-slate-400">{user?.email || "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-slate-300" />
                        <span className="text-sm font-bold text-slate-600">{event?.title || "Unknown Event"}</span>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-black text-emerald-600">₹{event?.feeAmount || 0}</span>
                        <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black h-4 px-1">SUCCESS</Badge>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-2 text-slate-400">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span className="text-xs font-bold">{format(new Date(reg.registrationDate), 'MMM dd, yyyy')}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {paidRegistrations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="p-6 bg-slate-50 rounded-[32px] ring-1 ring-slate-100">
                <CreditCard className="h-12 w-12 text-slate-200" />
              </div>
              <div className="text-center">
                <p className="text-slate-500 font-black text-lg">No processed payments found</p>
                <p className="text-slate-400 text-sm font-medium mt-1">Try adjusting your filters or search query.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
