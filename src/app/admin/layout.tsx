"use client";

import Link from "next/link";
import { usePathname, redirect } from "next/navigation";
import { CopySlash, LayoutDashboard, CalendarDays, Users, LogOut, Ticket, TrophyIcon, Settings, Bell, Search, MessageSquare, MessageCircle, Image as ImageIcon, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      redirect("/");
    }
  }, [user]);

  if (!user || user.role !== "admin") return null;

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "Bookings", icon: Ticket },
    { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
    { href: "/admin/events", label: "Events", icon: TrophyIcon },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
    { href: "/admin/discussions", label: "Discussions", icon: MessageCircle },
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fb] font-sans overflow-hidden">
      {/* Sidebar - Integrated with Flexbox for non-overlapping layout */}
      <aside
        className={cn(
          "bg-white border-r border-[#eaecf1] flex flex-col items-stretch z-[60] shrink-0 transition-all duration-300 ease-in-out relative",
          isSidebarOpen ? "w-[240px]" : "w-0 -translate-x-full lg:w-16 lg:translate-x-0"
        )}
      >
        {/* Toggle Overlay Handle (Desktop rail toggle when collapsed) */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-8 left-1/2 -translate-x-1/2 h-10 w-10 bg-slate-50 border border-slate-200 rounded-xl hidden lg:flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:bg-white shadow-sm z-10"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Sidebar Header */}
        <div className={cn("p-6 flex items-center justify-between gap-4 transition-all overflow-hidden whitespace-nowrap", !isSidebarOpen && "lg:opacity-0 invisible lg:visible")}>
          <div className="flex items-center gap-3">
            <div className="bg-fuchsia-600 p-1.5 rounded-lg flex items-center justify-center shadow-lg shadow-fuchsia-100">
              <CopySlash className="h-4 w-4 text-white" />
            </div>
            <Link href="/admin" className="text-lg font-black tracking-tighter text-slate-900">
              HackClub
            </Link>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="h-8 w-8 flex items-center justify-center text-slate-300 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-100 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pt-2 pb-8 custom-scrollbar overflow-x-hidden">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || (pathname === '/admin' && link.href === '/admin');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all group whitespace-nowrap",
                  active
                    ? "bg-[#fff0f7] text-fuchsia-600 shadow-sm"
                    : "text-slate-500 hover:bg-[#f8f9fb] hover:text-slate-900",
                  !isSidebarOpen && "lg:justify-center lg:px-0"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active ? "text-fuchsia-600" : "text-slate-400 group-hover:text-slate-600")} />
                <span className={cn("transition-opacity duration-200", !isSidebarOpen && "lg:hidden")}>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile / Logout Section */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={logout}
            className={cn(
              "flex items-center gap-2.5 w-full p-2 rounded-xl transition-all hover:bg-slate-50 group",
              !isSidebarOpen && "lg:justify-center lg:p-1"
            )}
          >
            <div className="h-8 w-8 rounded-lg overflow-hidden shrink-0 border-2 border-slate-50 shadow-sm ring-2 ring-slate-100/50">
              <img src="https://i.pravatar.cc/150?u=orlando" alt="Admin" className="h-full w-full object-cover" />
            </div>
            <div className={cn("text-left min-w-0 transition-all duration-300", !isSidebarOpen && "lg:w-0 lg:opacity-0 lg:hidden")}>
              <p className="text-[13px] font-black text-slate-800 leading-none mb-0.5">Orlando</p>
              <div className="flex items-center gap-1.5 opacity-50">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-fuchsia-600 transition-colors">Sign Out</p>
              </div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Container - Uses Flex for side-by-side Layout with Sidebar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Dynamic Header */}
        <header className="h-[70px] bg-[#f8f9fb]/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 relative z-50 w-full gap-8 border-b border-transparent">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">{pathname.split('/')[2] || 'Home'}</span>
          </div>

          <div className="flex items-center gap-6 justify-end flex-1">
            <nav className="hidden xl:flex items-center gap-8 mr-4">
              {['Home', 'About', 'Team', 'Events', 'Gallery'].map((l) => (
                <Link key={l} href={l === 'Home' ? '/' : `/${l.toLowerCase()}`} className="font-bold text-slate-400 hover:text-indigo-600 transition-colors tracking-tight uppercase tracking-widest text-[10px]">
                  {l}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
              <button className="h-9 w-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center relative hover:bg-white hover:shadow-lg hover:shadow-indigo-500/10 transition-all border border-transparent hover:border-indigo-100">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full ring-2 ring-indigo-50"></span>
              </button>
              <button className="h-9 w-9 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95">
                <Settings className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-right">
                <p className="text-[12px] font-[900] text-slate-900 tracking-tight leading-none">Orlando Laurentius</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 leading-none">Super Admin</p>
              </div>
              <div className="h-10 w-10 rounded-xl p-0.5 bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-xl shadow-indigo-100 group relative cursor-pointer">
                <img src="https://i.pravatar.cc/150?u=orlando" alt="Admin Badge" className="h-full w-full rounded-[0.9rem] border-2 border-white object-cover" />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content - Stays after fixed header */}
        <main className="flex-1 overflow-y-auto w-full px-8 pb-8 custom-scrollbar relative">
          <div className="max-w-[1700px] mx-auto w-full pt-4">
            {children}
          </div>

          <footer className="mt-20 border-t border-slate-200 pt-8 pb-4 text-[10px] font-black uppercase tracking-widest text-slate-300 flex flex-col md:flex-row justify-between items-center max-w-[1700px] mx-auto gap-8">
            <div className="flex flex-col gap-1 items-center md:items-start leading-none">
              <p>Copyright © 2026 HackClub - All rights reserved</p>
              <p className="text-slate-200">Production Mode 4.2.1-stable</p>
            </div>
            <div className="flex gap-10">
              <Link href="/" className="hover:text-fuchsia-600 transition-colors">Safety</Link>
              <Link href="/" className="hover:text-fuchsia-600 transition-colors">Privacy</Link>
              <Link href="/" className="hover:text-fuchsia-600 transition-colors">Terms</Link>
              <Link href="mailto:it@hackclub.com" className="hover:text-fuchsia-600 transition-colors">System Health</Link>
            </div>
          </footer>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
