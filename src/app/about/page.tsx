import { Rocket, Target, Trophy } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | HackClub",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">About HackClub</h1>
          <p className="text-xl text-muted-foreground">
            We are a community-driven organization dedicated to fostering innovation, collaboration, and rapid prototyping through hackathons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Target className="text-primary h-8 w-8" /> Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              To empower students and professionals by providing a comprehensive platform where they can brainstorm, build, and deploy innovative solutions to real-world problems within a competitive and supportive ecosystem.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Rocket className="text-secondary-500 h-8 w-8" /> Our Vision
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              To be the leading global network for tech enthusiasts, recognized for organizing premier hackathons that shape the next generation of industry leaders and groundbreaking startups.
            </p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur border rounded-3xl p-8 md:p-12 shadow-sm text-center">
          <h2 className="text-3xl font-bold mb-12 flex justify-center items-center gap-3">
            <Trophy className="text-amber-500 h-8 w-8" /> Our Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-extrabold text-primary mb-2">50+</div>
              <div className="font-medium text-muted-foreground">Hackathons Organized</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-primary mb-2">10,000+</div>
              <div className="font-medium text-muted-foreground">Active Members</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-primary mb-2">30+</div>
              <div className="font-medium text-muted-foreground">Partner Companies</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
