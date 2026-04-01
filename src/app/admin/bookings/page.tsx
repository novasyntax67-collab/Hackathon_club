"use client";

import { useState } from "react";
import { Search, Filter, MoreVertical, Ticket, CheckCircle2, Clock, XCircle, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const mockBookings = [
  { id: "BKG-101", user: "Alice Johnson", email: "alice@example.com", event: "CodeCrafters 2026", date: "Jan 12, 2026", status: "Confirmed", amount: "$50", ticketType: "General" },
  { id: "BKG-102", user: "Bob Smith", email: "bob@example.com", event: "Web3 Meetup", date: "Jan 14, 2026", status: "Pending", amount: "$0", ticketType: "Free" },
  { id: "BKG-103", user: "Charlie Davis", email: "charlie@example.com", event: "UI/UX Sprint", date: "Jan 15, 2026", status: "Cancelled", amount: "$25", ticketType: "Student" },
  { id: "BKG-104", user: "Diana Prince", email: "diana@example.com", event: "CodeCrafters 2026", date: "Jan 16, 2026", status: "Confirmed", amount: "$100", ticketType: "VIP" },
  { id: "BKG-105", user: "Evan Wright", email: "evan@example.com", event: "AI Agents Hackathon", date: "Feb 02, 2026", status: "Confirmed", amount: "$50", ticketType: "General" },
  { id: "BKG-106", user: "Fiona Gallagher", email: "fiona@example.com", event: "Game Jam 2025", date: "Feb 10, 2026", status: "Pending", amount: "$50", ticketType: "General" },
];

export default function BookingsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockBookings.filter(b => 
    b.user.toLowerCase().includes(search.toLowerCase()) || 
    b.event.toLowerCase().includes(search.toLowerCase()) ||
    b.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Ticket className="h-6 w-6 text-fuchsia-600" /> Event Bookings
          </h1>
          <p className="text-sm text-slate-500 mt-1">Review and manage all participant registrations and ticket sales.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-200 bg-white">
            Export CSV
          </Button>
          <Button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-md shadow-fuchsia-600/20">
            Create Booking
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search bookings by ID, name, or event..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all"
          />
        </div>
        <Button variant="outline" className="border-slate-200 text-slate-600 w-full sm:w-auto">
          <Filter className="h-4 w-4 mr-2" /> Filter
        </Button>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Booking Info</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Participant</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Event</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm tracking-tight">{booking.id}</span>
                      <span className="text-xs text-slate-500 mt-0.5">{booking.date} • {booking.ticketType}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-700 text-sm">{booking.user}</span>
                      <span className="text-xs text-slate-500">{booking.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700 text-sm">{booking.event}</span>
                      <span className="text-xs font-semibold text-slate-500">{booking.amount}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {booking.status === "Confirmed" && (
                      <Badge variant="success" className="bg-emerald-50 text-emerald-600 shadow-none border border-emerald-200/50 flex w-fit items-center gap-1.5 px-2.5 py-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed
                      </Badge>
                    )}
                    {booking.status === "Pending" && (
                      <Badge variant="secondary" className="bg-amber-50 text-amber-600 shadow-none border border-amber-200/50 flex w-fit items-center gap-1.5 px-2.5 py-1">
                        <Clock className="h-3.5 w-3.5" /> Pending
                      </Badge>
                    )}
                    {booking.status === "Cancelled" && (
                      <Badge variant="destructive" className="bg-rose-50 text-rose-600 shadow-none border border-rose-200/50 flex w-fit items-center gap-1.5 px-2.5 py-1">
                        <XCircle className="h-3.5 w-3.5" /> Cancelled
                      </Badge>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="text-fuchsia-600 hover:text-fuchsia-700 p-2 hover:bg-fuchsia-50 rounded-lg transition-colors" title="View details">
                         <ArrowUpRight className="h-4 w-4" />
                       </button>
                       <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                         <MoreVertical className="h-4 w-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No bookings found. Try adjusting your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-between items-center text-sm text-slate-500">
            <span>Showing {filtered.length} results</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="h-8">Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
