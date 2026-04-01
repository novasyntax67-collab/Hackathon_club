"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ArrowRight, Image as ImageIcon, Camera } from "lucide-react";
import { mockAlbums } from "@/lib/mockData";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      {/* Header */}
      <section className="bg-white border-b py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 bg-primary/5 text-primary border-primary/20">Hall of Fame</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">Event Gallery</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore memories from our past hackathons, meetups, and workshops. Relive the moments where ideas became reality.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockAlbums.filter(a => a.status === "Published").map((event) => (
            <Link key={event.id} href={`/gallery/${event.id}`} className="group block">
              <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 bg-white">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={event.coverImage} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5" />
                    {event.imageCount} Photos
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white/80 text-sm font-medium mb-1 drop-shadow-md">{event.date}</p>
                    <h3 className="text-white text-2xl font-bold leading-tight drop-shadow-md flex items-center gap-2 group-hover:text-primary-100 transition-colors">
                      {event.title}
                      <ArrowRight className="h-5 w-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </h3>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
