import { Briefcase, Mail } from "lucide-react";
import { mockTeamMembers } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/Card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team | HackClub",
};

export default function TeamPage() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Meet the Team</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The passionate individuals working tirelessly behind the scenes to bring you the best hackathon experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {mockTeamMembers.map((member) => (
          <Card key={member.id} className="text-center border-none shadow-md overflow-hidden group bg-white/50 backdrop-blur">
            <div className="pt-8 pb-4 flex justify-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-md group-hover:scale-105 transition-transform">
                <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <CardContent>
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-primary font-medium text-sm mb-6">{member.role}</p>
              <div className="flex justify-center space-x-3">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#0A66C2] transition-colors p-2 bg-background rounded-full hover:shadow-sm">
                  <Briefcase className="h-5 w-5" />
                </a>
                <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary transition-colors p-2 bg-background rounded-full hover:shadow-sm">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
