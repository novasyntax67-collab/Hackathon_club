"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Paperclip, Search, MoreVertical, Image as ImageIcon, Smile, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const initialMessages = [
  { id: 1, sender: "Orlando Laurentius", role: "Super Admin", avatar: "https://i.pravatar.cc/150?u=orlando", content: "Hey team, how are the preparations for CodeCrafters looking?", time: "10:30 AM", isMe: true },
  { id: 2, sender: "Sarah Jane", role: "Event Coordinator", avatar: "https://i.pravatar.cc/150?u=sarah", content: "Sponsors are locked in! I've uploaded the contracts to the shared drive.", time: "10:35 AM", isMe: false },
  { id: 3, sender: "David Kim", role: "Tech Lead", avatar: "https://i.pravatar.cc/150?u=david", content: "Great! Our server instances for the hackathon are fully provisioned and tested.", time: "10:40 AM", isMe: false },
  { id: 4, sender: "Orlando Laurentius", role: "Super Admin", avatar: "https://i.pravatar.cc/150?u=orlando", content: "Awesome work folks! Let's ensure the participants emails go out by tomorrow morning.", time: "10:45 AM", isMe: true },
];

const admins = [
  { name: "Orlando Laurentius", role: "Super Admin", avatar: "https://i.pravatar.cc/150?u=orlando", online: true },
  { name: "Sarah Jane", role: "Event Coordinator", avatar: "https://i.pravatar.cc/150?u=sarah", online: true },
  { name: "David Kim", role: "Tech Lead", avatar: "https://i.pravatar.cc/150?u=david", online: false },
  { name: "Emily Watson", role: "Marketing", avatar: "https://i.pravatar.cc/150?u=emily", online: true },
];

export default function DiscussionsPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showMembers, setShowMembers] = useState(true);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const nextMsg = {
      id: Date.now(),
      sender: "Orlando Laurentius",
      role: "Super Admin",
      avatar: "https://i.pravatar.cc/150?u=orlando",
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    
    setMessages([...messages, nextMsg]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/50">
      
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Admins List */}
        <div className={cn(
          "border-r border-slate-100 flex flex-col bg-slate-50/20 shrink-0 transition-all duration-300 ease-in-out",
          showMembers ? "w-[340px]" : "w-0 overflow-hidden border-none pt-0 opacity-0"
        )}>
          <div className="p-8 border-b border-slate-50">
             <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               <div className="p-2 bg-fuchsia-100 text-fuchsia-600 rounded-xl">
                 <MessageCircle className="h-5 w-5" />
               </div>
               Admin Chat
             </h2>
             <div className="relative mt-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Filter team members..." 
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-fuchsia-500/5 focus:border-fuchsia-500 transition-all text-slate-700 shadow-inner"
                />
             </div>
          </div>
          <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
             <p className="px-4 pt-4 pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Collaborators</p>
             {admins.map((admin, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-[24px] hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-pointer mb-2 group">
                   <div className="relative shrink-0">
                     <img src={admin.avatar} alt="Avatar" className="w-12 h-12 rounded-[18px] object-cover shadow-md border-2 border-white ring-4 ring-slate-50/50" />
                     <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-white shadow-sm ${admin.online ? 'bg-emerald-500' : 'bg-slate-300 shadow-inner'}`}></div>
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-slate-800 truncate group-hover:text-fuchsia-600 transition-colors uppercase tracking-tight">{admin.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 truncate uppercase mt-0.5">{admin.role}</p>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Right Chat Area */}
        <div className="flex-1 flex flex-col bg-white min-w-0 relative">
           
           {/* Chat Header */}
           <div className="h-20 border-b border-slate-50 px-10 flex items-center justify-between bg-white/80 backdrop-blur shrink-0 z-10 relative">
             <div className="flex items-center gap-4">
               <button 
                 onClick={() => setShowMembers(!showMembers)}
                 className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl border border-slate-100 transition-all hover:bg-white hover:shadow-sm"
               >
                 <Menu className="h-5 w-5" />
               </button>
               <div>
                 <h3 className="font-[900] text-slate-900 leading-tight tracking-tight uppercase text-sm">General Discussion</h3>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">4 Admins Enrolled</p>
                 </div>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <button className="h-10 w-10 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-white border border-slate-100 rounded-xl transition-all"><Search className="h-4 w-4" /></button>
               <button className="h-10 w-10 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-white border border-slate-100 rounded-xl transition-all"><Settings className="h-4 w-4" /></button>
             </div>
           </div>

           {/* Chat Messages */}
           <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-[#f8f9fb]/40">
             {messages.map((msg) => (
               <div key={msg.id} className={cn("flex group", msg.isMe ? "justify-end" : "justify-start animate-in fade-in slide-in-from-left-4")}>
                 <div className={cn("flex gap-4 max-w-[70%] xl:max-w-[60%]", msg.isMe ? "flex-row-reverse animate-in fade-in slide-in-from-right-4" : "flex-row")}>
                    <img src={msg.avatar} alt="Avatar" className="w-10 h-10 rounded-[14px] border-2 border-white shadow-lg object-cover mt-2 shrink-0 group-hover:scale-110 transition-transform" />
                    <div className={cn("flex flex-col", msg.isMe ? "items-end" : "items-start")}>
                       <div className="flex items-center gap-3 mb-2 px-1">
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{msg.sender}</span>
                          <span className="text-[9px] font-bold text-slate-300 uppercase leading-none">{msg.time}</span>
                       </div>
                       <div className={cn(
                          "p-6 rounded-[28px] text-[15px] font-bold leading-relaxed shadow-xl shadow-slate-200/20 transition-all", 
                          msg.isMe 
                            ? "bg-fuchsia-600 text-white rounded-tr-[4px] shadow-fuchsia-100/50" 
                            : "bg-white border border-slate-100 text-slate-800 rounded-tl-[4px]"
                       )}>
                          {msg.content}
                       </div>
                    </div>
                 </div>
               </div>
             ))}
             <div ref={endOfMessagesRef} />
           </div>

           {/* Chat Input Area */}
           <div className="p-8 border-t border-slate-50 bg-white shrink-0">
              <form onSubmit={handleSend} className="max-w-5xl mx-auto flex gap-4">
                 <button type="button" className="h-14 w-14 flex items-center justify-center text-slate-400 hover:text-fuchsia-600 bg-slate-50 hover:bg-white border border-slate-100 rounded-2xl transition-all shrink-0 hover:shadow-lg hover:shadow-slate-200/50">
                    <Paperclip className="h-6 w-6" />
                 </button>
                 <div className="flex-1 relative group">
                    <input 
                      type="text" 
                      placeholder="Type a secure message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-full h-14 pl-6 pr-14 bg-slate-50 border border-slate-200 rounded-2xl text-[15px] font-bold focus:outline-none focus:ring-4 focus:ring-fuchsia-500/5 focus:border-fuchsia-500 transition-all text-slate-800 shadow-inner group-hover:bg-white"
                    />
                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-amber-500 transition-colors">
                      <Smile className="h-6 w-6" />
                    </button>
                 </div>
                 <button type="submit" disabled={!newMessage.trim()} className="h-14 px-10 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-30 disabled:grayscale text-white shadow-2xl shadow-fuchsia-600/30 font-black text-sm uppercase tracking-widest rounded-2xl flex items-center gap-3 transition-all shrink-0 active:scale-95">
                    Send <Send className="h-5 w-5" />
                 </button>
              </form>
           </div>
           
        </div>
      </div>
    </div>
  );
}
