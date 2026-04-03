"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Ticket, ArrowUpRight, X, CreditCard, Calendar as CalendarIcon, User as UserIcon, Hash, Download, Plus, Smartphone, Mail, Layout, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

import { useEffect } from "react";
import { 
  getRegistrations, 
  getUsers, 
  getEvents, 
  saveRegistration, 
  deleteRegistration 
} from "@/lib/storage";
import { type Registration } from "@/lib/storage";

const ITEMS_PER_PAGE = 10;

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("All Events");
  const [bookings, setBookings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sorting State
  const [sortField, setSortField] = useState<"id" | "user" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // New Booking State
  const [newBooking, setNewBooking] = useState({
    user: "",
    email: "",
    contact: "",
    eventId: "",
    amount: "₹0",
  });

  const loadData = () => {
    const allRegs = getRegistrations();
    const allUsers = getUsers();
    const allEvents = getEvents();
    
    setEvents(allEvents);

    const transformedBookings = allRegs.map(reg => {
      const user = allUsers.find(u => u.id === reg.userId);
      const event = allEvents.find(e => e.id === reg.eventId);
      return {
        id: reg.id,
        user: user?.name || "Unknown User",
        email: user?.email || "N/A",
        event: event?.title || "Unknown Event",
        date: new Date(reg.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: reg.timestamp,
        amount: reg.paymentStatus === "Paid" ? `₹${event?.feeAmount || 0}` : "₹0",
        transactionId: reg.transactionId || "N/A",
        paymentMethod: reg.paymentMethod || "N/A",
        contact: user?.contact || "N/A",
        source: reg.source || "site"
      };
    });
    setBookings(transformedBookings);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage-update", loadData);
    return () => window.removeEventListener("storage-update", loadData);
  }, []);

  // Filter & Sort Logic
  const filteredAndSorted = useMemo(() => {
    let result = bookings.filter(b => {
      const matchesSearch = 
        b.user.toLowerCase().includes(search.toLowerCase()) || 
        b.event.toLowerCase().includes(search.toLowerCase()) ||
        b.id.toLowerCase().includes(search.toLowerCase());
      
      const matchesEvent = eventFilter === "All Events" || b.event === eventFilter;
      
      return matchesSearch && matchesEvent;
    });

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        comparison = a.timestamp - b.timestamp;
      } else {
        comparison = a[sortField].localeCompare(b[sortField]);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [bookings, search, eventFilter, sortField, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const paginatedData = filteredAndSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: "id" | "user" | "date") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Booking ID", "Participant", "Email", "Event", "Amount", "Date", "Source"];
    const rows = filteredAndSorted.map(b => [b.id, b.user, b.email, b.event, b.amount, b.date, b.source === "site" ? "On Site" : "Manual"]);
    
    const csvContent = headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `BKG-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    
    // In a real app, we'd also create a user or link to existing one.
    // Here we'll just create a registration with a placeholder userId.
    const createdBooking: Registration = {
      id,
      userId: `user-manual-${Math.random().toString(36).substr(2, 5)}`,
      eventId: newBooking.eventId,
      timestamp: now.getTime(),
      registrationDate: now.toISOString(),
      paymentStatus: "Paid",
      transactionId: `txn_manual_${Math.random().toString(36).substr(2, 9)}`,
      paymentMethod: "Manual Cash",
      source: "manual"
    };

    saveRegistration(createdBooking);
    setIsCreating(false);
    setNewBooking({ user: "", email: "", contact: "", eventId: "", amount: "₹0" });
    setCurrentPage(1);
  };

  const handleDeleteBooking = (id: string) => {
    if (window.confirm("Are you sure you want to remove this booking?")) {
      deleteRegistration(id);
      if (selectedBooking?.id === id) setSelectedBooking(null);
    }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 opacity-20" />;
    return sortOrder === "asc" ? <ArrowUp className="h-3 w-3 text-fuchsia-500" /> : <ArrowDown className="h-3 w-3 text-fuchsia-500" />;
  };

  return (
    <div className="py-6 space-y-6 max-w-7xl mx-auto px-4 sm:px-6 mb-20 md:mb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
          <Ticket className="h-24 w-24" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-fuchsia-100 rounded-xl">
              <Ticket className="h-7 w-7 text-fuchsia-600" />
            </div>
            Event Bookings
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Review and manage all participant registrations and processed payments.</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button 
            variant="outline" 
            onClick={handleExportCSV}
            className="border-slate-200 bg-white hover:bg-slate-50 font-bold rounded-xl h-11 flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200 font-bold rounded-xl h-11 px-6 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-5 w-5" /> Create Booking
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm relative z-20">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
          <input 
            type="text" 
            placeholder="Search bookings by ID, name, or email..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 text-slate-700 placeholder:text-slate-400 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
             <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fuchsia-400" />
             <select 
               value={eventFilter}
               onChange={(e) => {
                 setEventFilter(e.target.value);
                 setCurrentPage(1);
               }}
               className="w-full sm:w-64 pl-11 pr-8 py-3 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 appearance-none cursor-pointer hover:bg-slate-50 transition-all"
             >
                <option>All Events</option>
                {events.map(e => <option key={e.id}>{e.title}</option>)}
              </select>
          </div>
          {eventFilter !== "All Events" && (
            <button 
              onClick={() => {
                setEventFilter("All Events");
                setCurrentPage(1);
              }}
              className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-colors"
              title="Clear Filter"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-xl shadow-slate-100/50 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-5 px-6 group cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleSort("id")}>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Booking ID <SortIcon field="id" />
                  </div>
                </th>
                <th className="py-5 px-6 group cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleSort("user")}>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Participant <SortIcon field="user" />
                  </div>
                </th>
                <th className="py-5 px-6 group">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Event Info
                  </div>
                </th>
                <th className="py-5 px-6 group cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleSort("date")}>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Reg. Date <SortIcon field="date" />
                  </div>
                </th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedData.map((booking) => (
                <tr key={booking.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                  <td className="py-5 px-6">
                    <span className="font-bold text-slate-800 text-sm tracking-tight">{booking.id}</span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 text-sm">{booking.user}</span>
                      <span className="text-[11px] font-medium text-slate-400">{booking.email}</span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 text-sm">{booking.event}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="w-fit text-[10px] font-bold bg-slate-100 text-slate-600 border-none px-2 h-5">Registered</Badge>
                        {booking.source === "manual" && <Badge className="bg-amber-100 text-amber-600 border-none text-[9px] font-bold px-1.5 h-4">Manual</Badge>}
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-emerald-600">{booking.amount === "₹0" ? "Free" : booking.amount}</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-0.5">{booking.date}</span>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedBooking(booking)}
                        className="text-fuchsia-600 hover:text-white p-2.5 hover:bg-fuchsia-600 rounded-xl transition-all shadow-sm hover:shadow-fuchsia-200" 
                        title="View details"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="text-slate-300 hover:text-rose-600 p-2.5 hover:bg-rose-50 rounded-xl transition-all" 
                        title="Remove booking"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAndSorted.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <Search className="h-8 w-8 text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-bold">No results matching your filters</p>
                      <p className="text-slate-400 text-sm">Clear fields to show all bookings</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination UI */}
        {filteredAndSorted.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                Page {currentPage} of {totalPages}
              </span>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">
                Showing {paginatedData.length} of {filteredAndSorted.length} entries
              </span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-10 px-5 rounded-xl border-slate-200 text-xs font-black text-slate-600 hover:bg-white disabled:opacity-30 transition-all"
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-10 px-5 rounded-xl border-slate-200 text-xs font-black text-slate-600 hover:bg-white disabled:opacity-30 transition-all"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Booking Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="p-8 pb-0 flex justify-between items-start">
               <div>
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Manual Booking</h2>
                 <p className="text-sm text-slate-500 font-medium">Add a participant manually for offline/direct registrations.</p>
               </div>
               <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                 <X className="h-5 w-5" />
               </button>
            </div>
            
            <form onSubmit={handleCreateBooking} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name *</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. John Wick"
                      value={newBooking.user}
                      onChange={e => setNewBooking({ ...newBooking, user: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-fuchsia-500/20 text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input 
                      required 
                      type="email" 
                      placeholder="wick@example.com"
                      value={newBooking.email}
                      onChange={e => setNewBooking({ ...newBooking, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-fuchsia-500/20 text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Phone *</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input 
                      required 
                      type="tel" 
                      placeholder="+91 XXXXX XXXXX"
                      value={newBooking.contact}
                      onChange={e => setNewBooking({ ...newBooking, contact: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-fuchsia-500/20 text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Event *</label>
                  <div className="relative">
                    <Layout className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <select 
                      required 
                      value={newBooking.eventId}
                      onChange={e => setNewBooking({ ...newBooking, eventId: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-fuchsia-500/20 text-sm font-bold appearance-none text-slate-700"
                    >
                      <option value="" disabled>Select Event...</option>
                      {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Paid (Manual)</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="e.g. ₹250"
                    value={newBooking.amount}
                    onChange={e => setNewBooking({ ...newBooking, amount: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-fuchsia-500/20 text-sm font-black text-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                 <Button type="button" onClick={() => setIsCreating(false)} variant="outline" className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-500 font-bold">
                   Cancel
                 </Button>
                 <Button type="submit" className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white font-black h-14 rounded-2xl shadow-xl shadow-slate-200">
                   Confirm Registration
                 </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className={cn(
              "p-8 text-white relative",
              selectedBooking.source === "manual" ? "bg-amber-600" : "bg-slate-900"
            )}>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
               >
                 <X className="h-4 w-4 text-white" />
               </button>
               <div className="flex items-center gap-4 mb-6">
                 <div className="p-3 bg-white/10 rounded-2xl shadow-lg">
                   <CreditCard className="h-6 w-6 text-white" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-black tracking-tight">Payment Details</h2>
                   <div className="flex items-center gap-2 mt-0.5">
                     <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.15em]">{selectedBooking.id}</p>
                     <Badge className="bg-white/20 text-white border-none text-[8px] font-black px-1.5 h-4 uppercase">
                       {selectedBooking.source === "manual" ? "Manual Booking" : "Registered on Site"}
                     </Badge>
                   </div>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/10 rounded-2xl p-4">
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Paid Amount</p>
                   <p className="text-xl font-black text-white">{selectedBooking.amount}</p>
                 </div>
                 <div className="bg-white/10 rounded-2xl p-4">
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Status</p>
                   <p className="text-xl font-black text-white/90">Success</p>
                 </div>
               </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-50 rounded-xl"><UserIcon className="h-5 w-5 text-slate-400" /></div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Participant Info</p>
                    <p className="text-base font-bold text-slate-800">{selectedBooking.user}</p>
                    <p className="text-sm font-medium text-slate-500">{selectedBooking.email}</p>
                    <p className="text-sm font-medium text-slate-500">{selectedBooking.contact}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-50 rounded-xl"><CalendarIcon className="h-5 w-5 text-slate-400" /></div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Event Details</p>
                    <p className="text-base font-bold text-slate-800">{selectedBooking.event}</p>
                    <p className="text-sm font-medium text-slate-500">{selectedBooking.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-50 rounded-xl"><Hash className="h-5 w-5 text-slate-400" /></div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Transaction Details</p>
                    <div className="flex flex-col gap-2 mt-2">
                       <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                         <span className="text-xs font-bold text-slate-500">Transaction ID</span>
                         <span className="text-xs font-mono font-bold text-slate-700">{selectedBooking.transactionId}</span>
                       </div>
                       <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                         <span className="text-xs font-bold text-slate-500">Method</span>
                         <span className="text-xs font-bold text-slate-700">{selectedBooking.paymentMethod}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={() => setSelectedBooking(null)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-14 rounded-2xl shadow-xl shadow-slate-200"
                >
                  Close Receipt
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper for conditional classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
