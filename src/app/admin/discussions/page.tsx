"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Search, 
  Settings, 
  Menu, 
  ChevronRight, 
  Trophy, 
  Globe, 
  UserPlus, 
  X, 
  ShieldCheck,
  Crown,
  Zap,
  MoreVertical
} from "lucide-react";
import { 
  getMessages, 
  saveMessage, 
  getUsers, 
  getEvents, 
  getCoordinators, 
  saveCoordinator 
} from "@/lib/storage";
import { 
  User,
  ChatMessage,
  EventCoordinator,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

// --- Mock Current User (President for full access demonstration) ---
const getMe = (users: User[]) => users.find(u => u.globalRole === "President") || users[0];

export default function DiscussionsPage() {
  const [activeChannelId, setActiveChannelId] = useState<string>("general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [coordinators, setCoordinators] = useState<EventCoordinator[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChannels, setShowChannels] = useState(true);
  const [isCoordModalOpen, setIsCoordModalOpen] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const ME = useMemo(() => getMe(users), [users]);

  const loadData = () => {
    setMessages(getMessages());
    setCoordinators(getCoordinators());
    setEvents(getEvents());
    setUsers(getUsers());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage-update", loadData);
    return () => window.removeEventListener("storage-update", loadData);
  }, []);

  // --- Dynamic Channel Resolution ---
  
  const activeChannel = useMemo(() => {
    if (activeChannelId === "general") return { id: "general", title: "General Chat", type: "global" };
    const evt = events.find(e => e.id === activeChannelId);
    return evt ? { id: evt.id, title: evt.title, type: "event" } : null;
  }, [activeChannelId, events]);

  const filteredMessages = useMemo(() => {
    return messages.filter(m => m.channelId === activeChannelId);
  }, [messages, activeChannelId]);

  // --- RBAC Enforcement Logic ---
  
  const hasAccess = useMemo(() => {
    if (!activeChannel) return false;
    
    // Rule 1: General Chat restricted to Executive Global Roles
    if (activeChannel.id === "general") {
      return ["President", "Vice President", "Tech Lead", "Design Lead", "Social Media Lead"].includes(ME.globalRole);
    }
    
    // Rule 2: Event Discusssions accessible to ALL global roles OR assigned coordinators for that specific event
    if (activeChannel.type === "event") {
      const isGlobalExecutive = ["President", "Vice President", "Tech Lead", "Design Lead", "Social Media Lead"].includes(ME.globalRole);
      const isAssignedCoordinator = coordinators.some(c => c.eventId === activeChannel.id && c.userId === ME.id);
      return isGlobalExecutive || isAssignedCoordinator;
    }
    
    return false;
  }, [activeChannel, coordinators]);

  // --- Helper Functions ---

  const getCoordinatorTag = (userId: string, eventId: string) => {
    return coordinators.find(c => c.userId === userId && c.eventId === eventId)?.tag;
  };

  const getDisplayIdentity = (user: User) => {
    const eventTag = activeChannel?.type === "event" ? getCoordinatorTag(user.id, activeChannel.id) : null;
    if (eventTag) return `${user.name} (${eventTag})`;
    if (user.globalRole !== "Member") return `${user.name} (${user.globalRole})`;
    return user.name;
  };

  // --- Real-time Interaction Handlers ---

  useEffect(() => {
    if (hasAccess) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredMessages, hasAccess]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !hasAccess) return;
    
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: ME.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      channelId: activeChannelId
    };
    
    saveMessage(msg);
    setNewMessage("");
  };

  const handleAddCoordinator = (userId: string, tag: string) => {
    // Permission check for coordinator assignment (President/VP only)
    if (ME.globalRole !== "President" && ME.globalRole !== "Vice President") return;
    
    const newCoord: EventCoordinator = {
      id: `coord-${Date.now()}`,
      userId,
      eventId: activeChannelId,
      tag
    };
    saveCoordinator(newCoord);
  };

  const handleRemoveCoordinator = (coordId: string) => {
    // Permission check for coordinator removal (President/VP only)
    if (ME.globalRole !== "President" && ME.globalRole !== "Vice President") return;
    setCoordinators(prev => prev.filter(c => c.id !== coordId));
  };

  // --- Sub-Components ---

  const MessageBubble = ({ msg }: { msg: ChatMessage }) => {
    const sender = users.find(u => u.id === msg.senderId) || users[0];
    const isMe = msg.senderId === ME.id;
    const identity = getDisplayIdentity(sender);

    return (
      <div className={cn("flex group", isMe ? "justify-end" : "justify-start animate-in fade-in slide-in-from-left-4")}>
        <div className={cn("flex gap-3 max-w-[80%] md:max-w-[70%]", isMe ? "flex-row-reverse" : "flex-row")}>
          <div className="h-10 w-10 rounded-2xl overflow-hidden shrink-0 ring-2 ring-white shadow-sm self-end">
            <img src={sender.avatar || `https://ui-avatars.com/api/?name=${sender.name}`} alt="" className="w-full h-full object-cover" />
          </div>
          <div className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
            <div className="flex items-center gap-2 mb-1.5 px-1 whitespace-nowrap">
              <span className="text-[10px] font-black text-slate-900 tracking-tight uppercase">{identity}</span>
              <span className="text-[9px] font-bold text-slate-300 uppercase shrink-0">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className={cn(
              "p-5 rounded-[24px] text-[14px] font-bold leading-relaxed shadow-lg transition-all",
              isMe 
                ? "bg-slate-900 text-white rounded-tr-[4px] shadow-slate-200" 
                : "bg-white border border-slate-100 text-slate-800 rounded-tl-[4px] shadow-slate-50 hover:border-slate-200"
            )}>
              {msg.content}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-slate-50/50 rounded-[48px] overflow-hidden border border-slate-200/60 shadow-2xl relative animate-in fade-in duration-700">
      
      {/* Channels Sidebar */}
      <div className={cn(
        "bg-white border-r border-slate-100 flex flex-col shrink-0 transition-all duration-500 ease-in-out z-20",
        showChannels ? "w-[360px]" : "w-0 overflow-hidden opacity-0"
      )}>
        <div className="p-10 pb-6">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 px-1">Navigation Console</h2>
          
          <div className="space-y-2">
            <button 
              onClick={() => setActiveChannelId("general")}
              className={cn(
                "w-full flex items-center gap-4 p-5 rounded-3xl transition-all group border-2",
                activeChannelId === "general" 
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100" 
                  : "bg-white border-transparent hover:border-slate-100 text-slate-500"
              )}
            >
              <div className={cn("p-2.5 rounded-2xl transition-colors", activeChannelId === "general" ? "bg-white/20" : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100")}>
                <Globe className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black tracking-tight uppercase">General Chat</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <ShieldCheck className={cn("h-2.5 w-2.5", activeChannelId === "general" ? "text-indigo-200" : "text-slate-300")} />
                   <p className={cn("text-[9px] font-bold uppercase", activeChannelId === "general" ? "text-indigo-100" : "text-slate-400")}>Executives Only</p>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-12">
            <div className="flex items-center justify-between mb-6 px-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment Syncs</h3>
              <div className="h-5 w-5 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-[9px] font-black">
                {events.length}
              </div>
            </div>
            
            <div className="space-y-3 pr-2 custom-scrollbar overflow-y-auto max-h-[40vh]">
              {events.map(evt => (
                <button 
                  key={evt.id}
                  onClick={() => setActiveChannelId(evt.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-3xl transition-all group border-2 min-w-0",
                    activeChannelId === evt.id 
                      ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200" 
                      : "bg-white border-transparent hover:border-slate-100 text-slate-500"
                  )}
                >
                  <div className={cn("p-2 rounded-xl transition-colors shrink-0", activeChannelId === evt.id ? "bg-white/10" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200")}>
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-xs font-black tracking-tight uppercase truncate">{evt.title}</p>
                    <p className={cn("text-[9px] font-bold uppercase mt-0.5 truncate", activeChannelId === evt.id ? "text-slate-400" : "text-slate-300")}>
                      {getCoordinatorTag(ME.id, evt.id) || "Platform Access"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Identity Insight */}
        <div className="mt-auto p-10 border-t border-slate-50 bg-slate-50/20">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-2xl overflow-hidden shadow-md ring-2 ring-white shrink-0">
                <img src={ME.avatar} alt="" className="w-full h-full object-cover" />
             </div>
             <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-900 truncate uppercase">{ME.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Crown className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest leading-none">{ME.globalRole}</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Primary Message Matrix */}
      <div className="flex-1 flex flex-col bg-white min-w-0 relative">
        
        {/* Sync Header */}
        <div className="h-24 border-b border-slate-50 px-12 flex items-center justify-between z-10 bg-white/95 backdrop-blur shadow-sm">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowChannels(!showChannels)}
              className="h-12 w-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl border border-slate-100 transition-all active:scale-95 hover:bg-white hover:shadow-sm"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase truncate">
                  {activeChannel?.title}
                </h1>
                {hasAccess ? (
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase px-3 py-1 shrink-0">Authorized Access</Badge>
                ) : (
                  <Badge className="bg-rose-50 text-rose-600 border-none font-black text-[9px] uppercase px-3 py-1 shrink-0">Authorization Required</Badge>
                )}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                <ShieldCheck className="h-3 w-3" />
                {activeChannelId === 'general' ? 'Executive End-to-End Encryption Active' : 'Verified Personnel Only • Audit Trail Enabled'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {activeChannel?.type === 'event' && hasAccess && (ME.globalRole === "President" || ME.globalRole === "Vice President") && (
              <Button 
                onClick={() => setIsCoordModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] px-6 h-12 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95"
              >
                <UserPlus className="h-4 w-4 mr-2" /> Configure ACL
              </Button>
            )}
            <button className="h-12 w-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl border border-slate-100 transition-all"><Settings className="h-5 w-5" /></button>
          </div>
        </div>

        {/* Communication Stream */}
        {hasAccess ? (
          <>
            <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-[#f8f9fb]/40 scroll-smooth">
              {filteredMessages.length > 0 ? (
                filteredMessages.map(msg => <MessageBubble key={msg.id} msg={msg} />)
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 animate-in fade-in duration-1000">
                  <div className="p-8 bg-white rounded-[40px] shadow-2xl shadow-slate-100 mb-8 border border-slate-50 ring-1 ring-slate-100">
                    <MessageCircle className="h-20 w-20 text-indigo-300" />
                  </div>
                  <p className="text-2xl font-black text-slate-400 uppercase tracking-[0.2em]">Transmission Stream Empty</p>
                  <p className="text-sm font-bold text-slate-300 mt-2 uppercase tracking-widest">Awaiting executive initialization...</p>
                </div>
              )}
              <div ref={endOfMessagesRef} />
            </div>

            {/* Transcription Matrix Input */}
            <div className="p-10 border-t border-slate-50 bg-white shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.05)]">
              <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-6">
                <button type="button" className="h-16 w-16 shrink-0 flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-100 rounded-[28px] hover:bg-white hover:text-indigo-600 border-indigo-50 hover:shadow-xl hover:shadow-indigo-50 transition-all active:scale-90">
                  <Paperclip className="h-7 w-7" />
                </button>
                <div className="flex-1 relative group">
                  <input 
                    type="text" 
                    placeholder={`Broadcast pulse as ${ME.name}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full h-16 pl-8 pr-12 bg-slate-50 border-2 border-slate-100 rounded-[28px] text-[15px] font-bold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-800 shadow-inner placeholder:text-slate-300 group-hover:bg-white"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="h-16 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-[28px] shadow-2xl shadow-indigo-100 transition-all disabled:opacity-20 disabled:grayscale flex items-center gap-4 active:scale-95 group"
                >
                  INITIATE PULSE <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-24 text-center bg-[#fff8f8]/40 animate-in zoom-in-95 duration-500">
            <div className="p-10 bg-white text-rose-500 rounded-[60px] shadow-2xl shadow-rose-100/50 mb-12 border-4 border-rose-50 relative">
              <ShieldCheck className="h-28 w-28 animate-pulse" />
              <div className="absolute top-2 right-2 h-6 w-6 bg-rose-500 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                 <X className="h-3 w-3 text-white font-black" />
              </div>
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight uppercase leading-none mb-8">Access Forbidden</h2>
            <div className="max-w-md space-y-6">
              <p className="text-slate-500 font-bold text-xl leading-relaxed">
                This secure channel is restricted to <span className="text-rose-600">Executive Global Roles</span> or <span className="text-rose-600">Verified Personnel</span> for this unit.
              </p>
              <div className="pt-10 flex flex-col items-center gap-5">
                <Badge className="bg-slate-900 text-white font-black px-8 py-3 rounded-2xl uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-slate-300 border-none">Security Clearance Failed</Badge>
                <div className="flex items-center gap-1.5 opacity-40">
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Audit Reference #403-ACL-001</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ACL Configuration Terminal */}
      {isCoordModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-slate-900/90 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-5xl rounded-[72px] shadow-2xl p-16 animate-in zoom-in-95 duration-500 border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-14 shrink-0 px-2">
              <div>
                <div className="flex items-center gap-5 mb-5">
                  <div className="p-5 bg-amber-50 text-amber-600 rounded-[32px] ring-1 ring-amber-100 shadow-xl shadow-amber-50">
                    <ShieldCheck className="h-9 w-9" />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">Event ACL Matrix</h2>
                </div>
                <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.4em] ml-2">Executive Access Control List for {activeChannel?.title}</p>
              </div>
              <button 
                onClick={() => setIsCoordModalOpen(false)}
                className="h-16 w-16 rounded-[32px] bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90"
              >
                <X className="h-8 w-8" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="p-12 bg-slate-50 rounded-[60px] border-2 border-dashed border-slate-200 group hover:bg-slate-100/50 transition-colors">
                  <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 px-2 flex items-center gap-3">
                    <UserPlus className="h-4 w-4" /> Appoint Deployment Identity
                  </h3>
                  <div className="space-y-8">
                    <div className="relative group">
                      <select className="w-full px-10 py-6 rounded-[32px] border-2 border-slate-100 bg-white text-sm font-black text-slate-700 outline-none focus:border-indigo-600 transition-all appearance-none cursor-pointer shadow-sm group-hover:bg-slate-50">
                        <option>Select Deployment Target...</option>
                        {users.filter(u => !coordinators.some(c => c.userId === u.id && c.eventId === activeChannelId)).map(u => (
                          <option key={u.id} value={u.id}>{u.name} — {u.globalRole}</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 rotate-90 pointer-events-none group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                      {(["Coordinator", "Volunteer", "Organizer"] as const).map(tag => (
                        <button 
                          key={tag}
                          onClick={() => handleAddCoordinator(users.find(u => u.globalRole === "Member")?.id || users[1].id, tag)}
                          className="py-6 rounded-[28px] text-[10px] font-black uppercase tracking-widest bg-white border-2 border-slate-100 text-slate-400 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all active:scale-95"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-12 bg-indigo-50/20 rounded-[60px] border border-indigo-100/40">
                  <h3 className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-10 px-2 flex items-center gap-3">
                    <Crown className="h-4 w-4" /> Authorized Sync Personnel
                  </h3>
                  <div className="space-y-5 custom-scrollbar overflow-y-auto max-h-[350px] pr-4">
                    {coordinators.filter(c => c.eventId === activeChannelId).length > 0 ? (
                      coordinators.filter(c => c.eventId === activeChannelId).map(c => {
                        const user = users.find(u => u.id === c.userId);
                        return (
                          <div key={c.id} className="flex items-center justify-between p-6 bg-white rounded-[32px] shadow-sm border border-slate-50 group hover:shadow-xl hover:shadow-indigo-50/50 transition-all animate-in slide-in-from-right-4">
                            <div className="flex items-center gap-5">
                              <div className="h-12 w-12 rounded-[20px] bg-slate-100 flex items-center justify-center text-sm font-black text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                                {user?.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                 <p className="text-sm font-black text-slate-800 uppercase tracking-tight truncate">{user?.name}</p>
                                 <Badge className="bg-indigo-50 text-indigo-600 px-3 py-1 text-[8px] font-black uppercase mt-1.5 border-none shadow-sm">Certified {c.tag}</Badge>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleRemoveCoordinator(c.id)}
                              className="h-12 w-12 flex items-center justify-center text-slate-200 hover:text-rose-600 hover:bg-rose-50 rounded-[20px] transition-all hover:scale-110 active:scale-75"
                            >
                              <Trash2Icon className="h-6 w-6" />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-20 text-center opacity-40 flex flex-col items-center">
                        <Zap className="h-12 w-12 mb-4 text-indigo-200" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Unit Appointments</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-12 border-t border-slate-100 text-center shrink-0">
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em]">DEEP OPTICS GOVERNANCE OVERSIGHT ACTIVE • ALL UNIT SYNC AUDITED</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("px-2 py-1 rounded text-xs font-medium inline-block", className)}>
      {children}
    </span>
  );
}

function Trash2Icon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
    </svg>
  );
}
