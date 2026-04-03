import { Briefcase, Mail, Globe } from "lucide-react";
import { mockUsers } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/Card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team | HackClub",
};

export default function TeamPage() {
  // Show everyone who is not a generic 'Member' as part of the core team
  const teamMembers = mockUsers.filter(u => u.globalRole !== "Member");

  return (
    <div className="container mx-auto px-6 py-32 min-h-screen bg-[#fafafa]">
      <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-slate-900 uppercase">Our Architects</h1>
        <p className="text-xl text-slate-500 font-bold max-w-3xl mx-auto uppercase tracking-widest leading-relaxed">
          The visionary elite behind the world's most innovative hackathon ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-12">
        {teamMembers.map((member) => (
          <Card key={member.id} className="text-center border-none shadow-2xl shadow-slate-200/50 overflow-hidden group bg-white rounded-[48px] p-10 transition-all hover:-translate-y-4 duration-500 hover:shadow-indigo-500/10">
            <div className="flex justify-center mb-10">
              <div className="relative w-40 h-40 rounded-[64px] overflow-hidden border-8 border-slate-50 shadow-inner group-hover:rotate-6 transition-all duration-500">
                <img 
                  src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`} 
                  alt={member.name} 
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" 
                />
              </div>
            </div>
            <CardContent className="p-0">
              <h3 className="text-2xl font-black mb-2 text-slate-900 tracking-tight uppercase leading-none">{member.name}</h3>
              <p className="text-indigo-600 font-black text-[10px] mb-8 uppercase tracking-[0.3em]">{member.globalRole}</p>
              
              <div className="flex justify-center items-center gap-4">
                <a 
                  href="#" 
                  className="h-14 w-14 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all shadow-sm hover:shadow-indigo-100"
                >
                  <Globe className="h-6 w-6" />
                </a>
                <a 
                  href={`mailto:${member.email}`} 
                  className="h-14 w-14 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all shadow-sm hover:shadow-indigo-100"
                >
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-32 text-center p-16 bg-white rounded-[64px] border border-slate-100 shadow-2xl shadow-indigo-100/50">
         <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Want to Join the Vision?</h2>
         <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">We are always looking for hyper-talented builders.</p>
         <button className="px-12 py-5 bg-slate-900 text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-[24px] hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200">
            Apply to Core Team
         </button>
      </div>
    </div>
  );
}
