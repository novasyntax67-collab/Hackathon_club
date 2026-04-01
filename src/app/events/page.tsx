"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { mockEvents } from "@/lib/mockData";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type FilterStatus = "All" | "Upcoming" | "Live" | "Completed";

export default function EventsPage() {
  const [filter, setFilter] = useState<FilterStatus>("All");

  const filteredEvents = mockEvents.filter((event) =>
    filter === "All" ? true : event.status === filter
  );

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Events</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Discover and register for the latest hackathons and challenges.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex space-x-2 mt-6 md:mt-0 bg-white/50 backdrop-blur p-2 rounded-xl shadow-sm border">
          {["All", "Upcoming", "Live", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as FilterStatus)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="flex flex-col overflow-hidden group hover:-translate-y-1 transition-transform border-border/50 bg-white/60 backdrop-blur">
            <div className="h-56 overflow-hidden relative">
              <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge variant={event.status === "Live" ? "success" : event.status === "Upcoming" ? "default" : "outline"} className="shadow-sm backdrop-blur-md">
                  {event.status}
                </Badge>
                <Badge variant="secondary" className="shadow-sm backdrop-blur-md">
                  {event.feeType}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{event.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 min-h-[40px]">{event.shortDescription}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-sm flex flex-col space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-muted-foreground">Start</span>
                  <span className="font-medium">{format(new Date(event.startDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-muted-foreground">Deadline</span>
                  <span className="font-medium text-destructive">{format(new Date(event.registrationDeadline), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="font-semibold text-primary">{event.feeType === "Paid" ? `₹${event.feeAmount}` : "Free"}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href={`/events/${event.id}`} className="w-full">
                <Button className="w-full shadow-sm group-hover:shadow-md transition-all">
                  View Details & Register
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-24 bg-white/50 backdrop-blur rounded-3xl border border-dashed">
          <p className="text-lg text-muted-foreground">No events found matching the selected filter.</p>
          <Button variant="outline" className="mt-4" onClick={() => setFilter("All")}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
}
