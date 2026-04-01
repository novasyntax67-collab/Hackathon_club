"use client";

import { useState } from "react";
import { MessageSquare, Star, Search, Filter, MoreVertical, ThumbsUp, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

const mockFeedback = [
  { id: 1, user: "Sarah Anderson", email: "sarah@example.com", avatar: "https://i.pravatar.cc/150?u=1", event: "CodeCrafters 2026", rating: 5, date: "2 hours ago", text: "The hackathon was amazingly well organized! Mentors were super helpful throughout the night." },
  { id: 2, user: "Mike Johnson", email: "mike@example.com", avatar: "https://i.pravatar.cc/150?u=2", event: "Web3 Meetup", rating: 4, date: "1 day ago", text: "Great networking experience. The venue was a bit tight but overall loved the energy." },
  { id: 3, user: "Elena Perez", email: "elena@example.com", avatar: "https://i.pravatar.cc/150?u=3", event: "UI/UX Sprint", rating: 5, date: "3 days ago", text: "Learned so much in just a few hours. Absolutely worth the time to attend this!" },
  { id: 4, user: "James Wilson", email: "james@example.com", avatar: "https://i.pravatar.cc/150?u=4", event: "AI Agents Hackathon", rating: 3, date: "1 week ago", text: "Interesting topics but the wifi was dropping constantly which made deploying code very frustrating." },
  { id: 5, user: "Priya Sharma", email: "priya@example.com", avatar: "https://i.pravatar.cc/150?u=5", event: "CodeCrafters 2026", rating: 5, date: "2 weeks ago", text: "Best tech event of the year hands down! I found my co-founder here." },
];

export default function FeedbackPage() {
  const [search, setSearch] = useState("");

  const filtered = mockFeedback.filter(f => 
    f.user.toLowerCase().includes(search.toLowerCase()) || 
    f.text.toLowerCase().includes(search.toLowerCase()) ||
    f.event.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
             <MessageSquare className="h-6 w-6 text-fuchsia-600" /> Participant Feedback
          </h1>
          <p className="text-sm text-slate-500 mt-1">Monitor reviews, ratings, and feedback from your event attendees.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
          <div className="text-center px-4 border-r border-slate-200">
             <p className="text-2xl font-black text-slate-800">4.8</p>
             <p className="text-xs text-slate-500 font-medium">Avg Rating</p>
          </div>
          <div className="text-center px-4">
             <p className="text-2xl font-black text-slate-800">128</p>
             <p className="text-xs text-slate-500 font-medium">Reviews</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
        <div className="relative w-full sm:max-w-md block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search feedback by keyword, user, or event..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all text-slate-700"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto custom-scrollbar">
          <Button variant="outline" className="border-slate-200 text-slate-600 shrink-0">All Feedback</Button>
          <Button variant="outline" className="border-slate-200 text-slate-600 bg-amber-50 shrink-0 border-amber-200 text-amber-700">5 <Star className="h-3.5 w-3.5 ml-1 fill-amber-500" /></Button>
          <Button variant="outline" className="border-slate-200 text-slate-600 shrink-0 border-dashed"><Filter className="h-4 w-4 mr-2" /> More Filters</Button>
        </div>
      </div>

      {/* Grid of Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col items-start gap-4">
            <div className="flex justify-between items-start w-full">
              <div className="flex items-center gap-3">
                <img src={item.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-slate-100 object-cover" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{item.user}</h4>
                  <p className="text-xs text-slate-500">{item.date}</p>
                </div>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < item.rating ? "text-amber-500 fill-amber-500" : "text-slate-200 fill-slate-200"}`} />
                ))}
              </div>
            </div>
            
            <div className="w-full">
              <span className="text-[10px] uppercase font-bold tracking-wider text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded border border-fuchsia-100 mb-2 inline-block">{item.event}</span>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">"{item.text}"</p>
            </div>

            <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-slate-100">
               <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-fuchsia-600 transition-colors">
                 <Mail className="h-3.5 w-3.5" /> Reply privately
               </button>
               <div className="flex items-center gap-1">
                 <button className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Mark Helpful">
                   <ThumbsUp className="h-4 w-4" />
                 </button>
                 <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors" title="Delete">
                   <Trash2 className="h-4 w-4" />
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
         <div className="py-24 text-center text-slate-500">
            No feedback found matching your criteria.
         </div>
      )}
    </div>
  );
}
