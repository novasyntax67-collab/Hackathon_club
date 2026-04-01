"use client";

import Link from "next/link";
import { ArrowRight, Code, Users, Zap, Trophy, Rocket, Cpu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockEvents, mockAlbums } from "@/lib/mockData";
import { format } from "date-fns";

export default function Home() {
  const activeEvents = mockEvents.filter((e) => e.status !== "Completed").slice(0, 3);
  const pastEvents = mockEvents.filter((e) => e.status === "Completed").slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-40">
        <div className="container px-4 mx-auto relative z-10 text-center flex flex-col items-center">
          <Badge variant="outline" className="mb-6 bg-white/50 backdrop-blur border-primary/20 text-primary">
            Empowering the next generation
          </Badge>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary-500 pb-2">
            Build, Innovate, and Shape the Future.
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
            Join the ultimate hackathon club. Compete in thrilling events, collaborate with top talent, and transform your wild ideas into reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/events">
              <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/25">
                Explore Events <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/50 backdrop-blur-sm">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Background Decorative */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-md border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-primary">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-sm text-muted-foreground font-medium">Events Hosted</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-sm text-muted-foreground font-medium">Participants</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">₹1M+</div>
              <div className="text-sm text-muted-foreground font-medium">Prizes Awarded</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-sm text-muted-foreground font-medium">Projects Built</div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Events */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Upcoming & Live Events</h2>
            <p className="text-muted-foreground">Register now and secure your spot.</p>
          </div>
          <Link href="/events" className="hidden sm:block text-primary hover:underline font-medium">
            View All Events &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeEvents.map((event) => (
            <Card key={event.id} className="flex flex-col overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="h-48 overflow-hidden relative">
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 gap-2 flex">
                  <Badge variant={event.status === "Live" ? "success" : "default"} className="shadow-sm">
                    {event.status}
                  </Badge>
                  <Badge variant="secondary" className="shadow-sm">
                    {event.feeType}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{event.shortDescription}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-sm font-medium flex flex-col space-y-2 text-muted-foreground">
                  <div><span className="text-foreground">Start:</span> {format(new Date(event.startDate), 'MMM dd, yyyy HH:mm')}</div>
                  <div><span className="text-foreground">Prize Pool:</span> {event.prizePool}</div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href={`/events/${event.id}`} className="w-full">
                  <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Join HackClub?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide the perfect ecosystem for developers, designers, and creators to thrive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/60 backdrop-blur shadow-none border-primary/10 border-0">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Code className="h-6 w-6" />
                </div>
                <CardTitle>Skill Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Tackle real-world problems and learn cutting-edge tools. Every hackathon pushes your boundaries and accelerates your learning.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur shadow-none border-secondary-500/10 border-0">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-secondary-500/10 text-secondary-500 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>Networking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Connect with like-minded peers, industry experts, and potential mentors. Build a network that lasts a lifetime.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur shadow-none border-emerald-500/10 border-0">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6" />
                </div>
                <CardTitle>Prizes & Glory</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Compete for massive cash prizes, cool swags, and bragging rights. Validate your skills on a grand stage.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Past Events Gallery */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex justify-between items-end mb-16">
          <div className="text-left">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Hall of Fame</h2>
            <p className="text-muted-foreground max-w-2xl">
              A glimpse into our previous successful hackathons and events.
            </p>
          </div>
          <Link href="/gallery" className="hidden sm:block text-primary hover:underline font-medium">
            View Full Gallery &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockAlbums.filter(a => a.status === "Published").slice(0, 4).map((album, idx) => {
            const isLarge = idx === 0 || idx === 3;
            const aspectClass = idx === 0 ? "aspect-[4/3] md:aspect-auto" : idx === 3 ? "aspect-[2/1]" : "aspect-square";
            const colClass = isLarge ? "col-span-1 sm:col-span-2 lg:col-span-2" : "";
            const rowClass = idx === 0 ? "row-span-2" : "";
            return (
              <Link key={album.id} href={`/gallery/${album.id}`} className={`${colClass} ${rowClass} relative group overflow-hidden rounded-2xl ${aspectClass} block`}>
                <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                  <h3 className="text-white font-semibold text-lg md:text-xl line-clamp-1">{album.title}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-16">What Participants Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-primary-foreground/10 p-8 rounded-2xl backdrop-blur-sm">
              <p className="italic mb-6 opacity-90">"The best hackathon experience I've ever had. The mentors were incredibly helpful and the energy was unmatched."</p>
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-primary-foreground/20 rounded-full flex items-center justify-center font-bold">SA</div>
                <div>
                  <div className="font-semibold">Sarah Anderson</div>
                  <div className="text-sm opacity-75">Winner, CodeCrafters 2025</div>
                </div>
              </div>
            </div>
            <div className="bg-primary-foreground/10 p-8 rounded-2xl backdrop-blur-sm">
              <p className="italic mb-6 opacity-90">"I joined as a complete beginner and left with a working prototype and a great team. HackClub changed my perspective on coding."</p>
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-primary-foreground/20 rounded-full flex items-center justify-center font-bold">MJ</div>
                <div>
                  <div className="font-semibold">Mike Johnson</div>
                  <div className="text-sm opacity-75">Participant</div>
                </div>
              </div>
            </div>
            <div className="bg-primary-foreground/10 p-8 rounded-2xl backdrop-blur-sm">
              <p className="italic mb-6 opacity-90">"The scale and organization of Web3 Builders Fiesta was mind-blowing. Can't wait for the next event!"</p>
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-primary-foreground/20 rounded-full flex items-center justify-center font-bold">EP</div>
                <div>
                  <div className="font-semibold">Elena Perez</div>
                  <div className="text-sm opacity-75">Web3 Developer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
