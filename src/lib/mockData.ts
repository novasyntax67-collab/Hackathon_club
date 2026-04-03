export type SystemRole = "admin" | "participant";

export type GlobalRole = 
  | "President" 
  | "Vice President" 
  | "Tech Lead" 
  | "Design Lead" 
  | "Social Media Lead" 
  | "Member";

export interface User {
  id: string;
  name: string;
  email: string;
  role: SystemRole;
  globalRole: GlobalRole;
  phone?: string;
  contact?: string; // Adding contact as alias for phone compatibility
  avatar?: string;
}

export interface EventCoordinator {
  id: string;
  userId: string;
  eventId: string;
  tag: string; // e.g., "Coordinator", "Volunteer", "Organizer"
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  channelId: string; // "general" or eventId
}

export interface Sponsor {
  name: string;
  logoUrl: string;
}

export interface Event {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  organizationName: string;
  organizationWebsite: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  status: "Upcoming" | "Live" | "Completed";
  mode: "Online" | "Offline";
  participationType: "Individual" | "Team";
  minTeamSize?: number;
  maxTeamSize?: number;
  venueAddress?: string;
  eventLocation?: string; 
  feeType: "Free" | "Paid";
  feeAmount?: number;
  imageUrl: string;
  rules: string[];
  timeline: { title: string; date: string; description: string }[];
  prizePool: string;
  sponsors?: Sponsor[];
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  registrationDate: string;
  timestamp: number;
  transactionId?: string;
  paymentStatus: "Pending" | "Paid";
  paymentMethod?: string;
  source?: "site" | "manual";
}

export interface TeamRegistration {
  id: string;
  eventId: string;
  teamName: string;
  leaderId: string;
  memberNames: string[];
  registrationDate: string;
  timestamp: number;
  transactionId?: string;
  paymentStatus: "Pending" | "Paid";
  paymentMethod?: string;
  source?: "site" | "manual";
  amount: number;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  date: string;
  status: "Published" | "Draft" | "Archived";
  imageCount: number;
  coverImage: string;
  size: string;
}

// --- MOCK DATA ---

export const mockUsers: User[] = [
  { 
    id: "user-1", 
    name: "Zeeshan Khan", 
    email: "zeeshan@hackclub.com", 
    role: "admin", 
    globalRole: "President", 
    avatar: "https://i.pravatar.cc/150?u=zeeshan" 
  },
  { 
    id: "user-2", 
    name: "Sarah Anderson", 
    email: "sarah@hackclub.com", 
    role: "admin", 
    globalRole: "Vice President", 
    avatar: "https://i.pravatar.cc/150?u=sarah" 
  },
  { 
    id: "user-3", 
    name: "Michael Chen", 
    email: "michael@hackclub.com", 
    role: "admin", 
    globalRole: "Tech Lead", 
    avatar: "https://i.pravatar.cc/150?u=michael" 
  },
  { 
    id: "user-4", 
    name: "Emily Rodriguez", 
    email: "emily@hackclub.com", 
    role: "admin", 
    globalRole: "Design Lead", 
    avatar: "https://i.pravatar.cc/150?u=emily" 
  },
  { 
    id: "user-5", 
    name: "Alex Thompson", 
    email: "alex@hackclub.com", 
    role: "admin", 
    globalRole: "Social Media Lead", 
    avatar: "https://i.pravatar.cc/150?u=alex" 
  },
  { 
    id: "user-6", 
    name: "John Doe", 
    email: "john@example.com", 
    role: "participant", 
    globalRole: "Member" 
  },
  { 
    id: "user-7", 
    name: "Jane Smith", 
    email: "jane@example.com", 
    role: "participant", 
    globalRole: "Member" 
  }
];

export const mockCoordinators: EventCoordinator[] = [
  { id: "coord-1", userId: "user-1", eventId: "evt-1", tag: "Organizer" },
  { id: "coord-2", userId: "user-6", eventId: "evt-1", tag: "Coordinator" },
  { id: "coord-3", userId: "user-7", eventId: "evt-2", tag: "Volunteer" }
];

export const mockEvents: Event[] = [
  {
    id: "evt-1",
    title: "CodeCrafters 2026",
    shortDescription: "A 48-hour global hackathon aimed at building sustainable solutions.",
    description: "CodeCrafters 2026 is our flagship event where developers, designers, and innovators come together to solve real-world problems.",
    organizationName: "HackClub Global",
    organizationWebsite: "https://hackclub.com",
    startDate: "2026-05-15T09:00:00Z",
    endDate: "2026-05-17T18:00:00Z",
    registrationDeadline: "2026-05-10T23:59:59Z",
    status: "Upcoming",
    mode: "Online",
    participationType: "Team",
    feeType: "Paid",
    feeAmount: 250,
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1000",
    rules: ["Maximum team size is 4.", "All code must be written during the hackathon."],
    timeline: [{ title: "Opening Ceremony", date: "May 15, 9:00 AM", description: "Kickoff." }],
    prizePool: "₹50,000 + Swags"
  },
  {
    id: "evt-2",
    title: "AI Innovate Challenge",
    shortDescription: "Build next-generation AI agents and applications.",
    description: "Dive into the world of Artificial Intelligence.",
    organizationName: "AI Research Lab",
    organizationWebsite: "https://ai-lab.io",
    startDate: "2026-03-30T10:00:00Z",
    endDate: "2026-04-02T10:00:00Z",
    registrationDeadline: "2026-03-29T23:59:59Z",
    status: "Live",
    mode: "Offline",
    participationType: "Individual",
    feeType: "Free",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
    rules: ["Solo participation allowed."],
    timeline: [{ title: "Kickoff", date: "March 30, 10:00 AM", description: "Event starts." }],
    prizePool: "₹20,000 Component Kits"
  }
];

export const mockMessages: ChatMessage[] = [
  { id: "msg-1", senderId: "user-1", content: "Welcome to the general chat!", timestamp: "2026-04-03T10:00:00Z", channelId: "general" },
  { id: "msg-2", senderId: "user-2", content: "Great to be here!", timestamp: "2026-04-03T10:05:00Z", channelId: "general" },
  { id: "msg-3", senderId: "user-1", content: "CodeCrafters planning starts today.", timestamp: "2026-04-03T11:00:00Z", channelId: "evt-1" },
  { id: "msg-4", senderId: "user-6", content: "The coordinator tasks are ready.", timestamp: "2026-04-03T11:15:00Z", channelId: "evt-1" }
];

export const mockRegistrations: Registration[] = [
  { id: "reg-1", eventId: "evt-1", userId: "user-6", registrationDate: "2026-04-01T10:00:00Z", timestamp: 1736658000000, paymentStatus: "Paid", transactionId: "TXN_12345", source: "site" },
  { id: "reg-2", eventId: "evt-1", userId: "user-7", registrationDate: "2026-04-02T11:00:00Z", timestamp: 1736744400000, paymentStatus: "Paid", transactionId: "TXN_12346", source: "site" },
  { id: "reg-3", eventId: "evt-2", userId: "user-6", registrationDate: "2026-03-29T09:00:00Z", timestamp: 1736485200000, paymentStatus: "Paid", transactionId: "TXN_12347", source: "site" },
  { id: "reg-4", eventId: "evt-2", userId: "user-1", registrationDate: "2026-03-31T15:30:00Z", timestamp: 1736683200000, paymentStatus: "Paid", transactionId: "TXN_12348", source: "site" },
  { id: "reg-5", eventId: "evt-1", userId: "user-2", registrationDate: "2026-04-03T08:20:00Z", timestamp: 1736916000000, paymentStatus: "Pending", source: "site" }
];

export const mockTeamRegistrations: TeamRegistration[] = [
  {
    id: "team-reg-1",
    eventId: "evt-1",
    teamName: "Neural Ninjas",
    leaderId: "user-6",
    memberNames: ["Alice", "Bob", "Charlie"],
    registrationDate: "2026-04-01T12:00:00Z",
    timestamp: 1736658000000,
    paymentStatus: "Paid",
    transactionId: "TXN_TEAM_1",
    source: "site",
    amount: 1000
  },
  {
    id: "team-reg-2",
    eventId: "evt-1",
    teamName: "Byte Busters",
    leaderId: "user-7",
    memberNames: ["David", "Eve"],
    registrationDate: "2026-04-02T14:00:00Z",
    timestamp: 1736744400000,
    paymentStatus: "Pending",
    source: "site",
    amount: 1000
  },
  {
    id: "team-reg-3",
    eventId: "evt-2",
    teamName: "AI Explorers",
    leaderId: "user-1",
    memberNames: ["Frank", "Grace"],
    registrationDate: "2026-03-30T10:00:00Z",
    timestamp: 1736485200000,
    paymentStatus: "Paid",
    transactionId: "TXN_TEAM_2",
    source: "site",
    amount: 0
  }
];

export const mockAlbums: GalleryAlbum[] = [
  { id: "evt-1", title: "CodeCrafters 2026", date: "Jan 15, 2026", status: "Published", imageCount: 42, coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000", size: "450 MB" },
  { id: "evt-2", title: "AI Innovate Challenge", date: "Mar 30, 2026", status: "Draft", imageCount: 18, coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000", size: "120 MB" }
];
