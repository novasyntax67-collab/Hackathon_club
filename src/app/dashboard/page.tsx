"use client";

import { useAuth } from "@/context/AuthContext";
import { mockRegistrations, mockEvents } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CreditCard, Calendar, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      redirect("/"); // Simple redirect if not authenticated
    }
  }, [user]);

  if (!user) return null;

  // Get user's registrations mapped with event details
  const myRegistrations = mockRegistrations
    .filter((reg) => reg.userId === user.id)
    .map((reg) => {
      const event = mockEvents.find((e) => e.id === reg.eventId);
      return { ...reg, event };
    })
    .filter((reg) => reg.event !== undefined);

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="mb-12 border-b pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome back, {user.name}</h1>
        <p className="text-xl text-muted-foreground">Manage your hackathon journey here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left Column - Profile Info */}
        <div className="space-y-8">
          <Card className="bg-white/50 backdrop-blur shadow-sm">
            <CardHeader>
              <CardTitle>Profile Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground font-medium mb-1">Name</div>
                <div className="font-semibold text-foreground p-3 bg-muted/50 rounded-lg">{user.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground font-medium mb-1">Email</div>
                <div className="font-semibold text-foreground p-3 bg-muted/50 rounded-lg">{user.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground font-medium mb-1">Role</div>
                <Badge variant="outline" className="mt-1 capitalize px-3 py-1 font-semibold">{user.role}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Registered Events */}
        <div className="md:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold tracking-tight border-b pb-4 border-border/50">My Events</h2>

          {myRegistrations.length === 0 ? (
            <div className="text-center py-16 bg-white/50 backdrop-blur border border-dashed rounded-3xl">
              <p className="text-lg text-muted-foreground mb-4">You haven't registered for any events yet.</p>
              <Link href="/events">
                <Button>Explore Events</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myRegistrations.map((reg) => (
                <Card key={reg.id} className="flex flex-col sm:flex-row shadow-sm hover:shadow-md transition-shadow bg-white/80 backdrop-blur">
                  <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 relative p-4">
                    <img src={reg.event?.imageUrl} alt={reg.event?.title} className="w-full h-full object-cover rounded-xl shadow-sm" />
                  </div>
                  <div className="flex-grow p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Link href={`/events/${reg.event?.id}`} className="hover:underline">
                          <h3 className="text-xl font-bold">{reg.event?.title}</h3>
                        </Link>
                        <Badge variant={reg.event?.status === "Live" ? "success" : "default"}>
                          {reg.event?.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground space-x-4 mb-4">
                        <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {format(new Date(reg.event!.startDate), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-border/50 bg-secondary/20 -m-6 px-6 pb-6 pt-4 rounded-b-2xl">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        Payment Status:
                        {reg.paymentStatus === "Paid" ? (
                          <Badge variant="success" className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Paid</Badge>
                        ) : reg.paymentStatus === "Pending" ? (
                          <Badge variant="warning">Pending</Badge>
                        ) : (
                          <Badge variant="outline">Not Required</Badge>
                        )}
                      </div>

                      {reg.paymentStatus === "Pending" && (
                        <Link href={`/events/${reg.event?.id}`}>
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20">
                            Pay Now <CreditCard className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
