"use client";

import Link from "next/link";
import { GitBranch, AtSign, Briefcase, Mail } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tighter text-primary block mb-4">
              HackClub<span className="text-foreground">.</span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Empowering students to build, innovate, and create the future through intense, collaborative hackathons and coding events.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">Events</Link></li>
              <li><Link href="/team" className="text-sm text-muted-foreground hover:text-primary transition-colors">Team</Link></li>
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://twitter.com/hackclub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><AtSign className="h-5 w-5" /></a>
              <a href="https://github.com/hackclub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><GitBranch className="h-5 w-5" /></a>
              <a href="https://linkedin.com/company/hackclub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Briefcase className="h-5 w-5" /></a>
              <a href="mailto:support@hackclub.com" className="text-muted-foreground hover:text-primary transition-colors"><Mail className="h-5 w-5" /></a>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Contact: support@hackclub.com
            </p>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} HackClub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
