"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/Button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, login, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null; // Admin has its own sidebar

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/team", label: "Team" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tighter text-primary">
          HackClub<span className="text-foreground">.</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                <Button variant="outline" size="sm">
                  {user.role === "admin" ? "Admin Dashboard" : "My Dashboard"}
                </Button>
              </Link>
              <Button onClick={logout} variant="ghost" size="sm">
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button onClick={() => login("participant")} variant="ghost" size="sm">
                Login
              </Button>
              <Button onClick={() => login("admin")} size="sm">
                Join as Admin
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-background p-4 absolute w-full flex flex-col space-y-4 shadow-lg top-16">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          {user ? (
            <div className="flex flex-col space-y-2">
              <Link
                href={user.role === "admin" ? "/admin" : "/dashboard"}
                onClick={() => setIsOpen(false)}
              >
                <Button variant="outline" className="w-full justify-start">
                  {user.role === "admin" ? "Admin Dashboard" : "My Dashboard"}
                </Button>
              </Link>
              <Button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start text-destructive"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => {
                  login("participant");
                  setIsOpen(false);
                }}
                variant="outline"
                className="w-full justify-start"
              >
                Login as Participant
              </Button>
              <Button
                onClick={() => {
                  login("admin");
                  setIsOpen(false);
                }}
                className="w-full justify-start"
              >
                Login as Admin
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
