export type Role = "admin" | "participant";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
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
  eventLocation?: string; // Current location link or coordinates
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
  paymentStatus: "Paid" | "Unpaid" | "Pending" | "Not Required";
  transactionId?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  linkedin: string;
  email: string;
}

export const mockUsers: User[] = [
  { id: "admin-1", name: "Admin User", email: "admin@hackathonclub.com", role: "admin" },
  { id: "part-1", name: "John Doe", email: "john@example.com", role: "participant" },
  { id: "part-2", name: "Jane Smith", email: "jane@example.com", role: "participant" },
];

export const mockEvents: Event[] = [
  {
    id: "evt-1",
    title: "CodeCrafters 2026",
    shortDescription: "A 48-hour global hackathon aimed at building sustainable solutions.",
    description: "CodeCrafters 2026 is our flagship event where developers, designers, and innovators come together to solve real-world problems. Participants will have 48 hours to ideate, prototype, and build applications focused on sustainability.",
    organizationName: "HackClub Global",
    organizationWebsite: "https://hackclub.com",
    startDate: "2026-05-15T09:00:00Z",
    endDate: "2026-05-17T18:00:00Z",
    registrationDeadline: "2026-05-10T23:59:59Z",
    status: "Upcoming",
    mode: "Online",
    participationType: "Team",
    minTeamSize: 2,
    maxTeamSize: 4,
    feeType: "Paid",
    feeAmount: 250,
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1000",
    rules: ["Maximum team size is 4.", "All code must be written during the hackathon.", "Open source libraries are allowed."],
    timeline: [
      { title: "Opening Ceremony", date: "May 15, 9:00 AM", description: "Kickoff and theme announcement." },
      { title: "Hacking Begins", date: "May 15, 10:00 AM", description: "Start working on your projects." },
      { title: "Submission Deadline", date: "May 17, 10:00 AM", description: "Submit your project on the portal." },
      { title: "Closing & Awards", date: "May 17, 6:00 PM", description: "Winners announced." }
    ],
    prizePool: "₹50,000 + Swags",
    sponsors: [
      { name: "Google Cloud", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" },
      { name: "GitHub", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" }
    ]
  },
  {
    id: "evt-2",
    title: "AI Innovate Challenge",
    shortDescription: "Build next-generation AI agents and applications.",
    description: "Dive into the world of Artificial Intelligence. Create models, agents, and smart tools that can revolutionize tech. Open to all skill levels.",
    organizationName: "AI Research Lab",
    organizationWebsite: "https://ai-lab.io",
    startDate: "2026-03-30T10:00:00Z",
    endDate: "2026-04-02T10:00:00Z",
    registrationDeadline: "2026-03-29T23:59:59Z",
    status: "Live",
    mode: "Offline",
    participationType: "Individual",
    venueAddress: "Tech Hub, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
    eventLocation: "https://maps.app.goo.gl/q6K1N7F2M7i9pQ6",
    feeType: "Free",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
    rules: ["Solo participation allowed.", "Pre-trained models can be used."],
    timeline: [
      { title: "Kickoff", date: "March 30, 10:00 AM", description: "Event starts." }
    ],
    prizePool: "₹20,000 Component Kits"
  },
  {
    id: "evt-3",
    title: "Web3 Builders Fiesta",
    shortDescription: "Decentralized apps creation and networking event.",
    description: "Explore blockchain technologies, build dApps, and connect with Web3 enthusiasts.",
    organizationName: "Crypto Connect",
    organizationWebsite: "https://cryptoconnect.org",
    startDate: "2025-10-10T09:00:00Z",
    endDate: "2025-10-12T18:00:00Z",
    registrationDeadline: "2025-10-05T23:59:59Z",
    status: "Completed",
    mode: "Online",
    participationType: "Individual",
    feeType: "Paid",
    feeAmount: 500,
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f4fced0?auto=format&fit=crop&q=80&w=1000",
    rules: ["Teams only.", "Deploy on testnet."],
    timeline: [
      { title: "Kickoff", date: "Oct 10, 9:00 AM", description: "Event starts." }
    ],
    prizePool: "Crypto rewards equivalent to $1000"
  }
];

export const mockRegistrations: Registration[] = [
  { id: "reg-1", eventId: "evt-1", userId: "part-1", registrationDate: "2026-02-15T10:00:00Z", paymentStatus: "Paid", transactionId: "txn_12345" },
  { id: "reg-2", eventId: "evt-2", userId: "part-1", registrationDate: "2026-03-20T14:30:00Z", paymentStatus: "Not Required" }
];

export const mockTeamMembers: TeamMember[] = [
  { id: "t-1", name: "Alice Johnson", role: "President", imageUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d", linkedin: "https://linkedin.com/in/alice", email: "alice@hackclub.com" },
  { id: "t-2", name: "Bob Smith", role: "Vice President", imageUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d", linkedin: "https://linkedin.com/in/bob", email: "bob@hackclub.com" },
  { id: "t-3", name: "Charlie Davis", role: "Tech Lead", imageUrl: "https://i.pravatar.cc/150?u=a04258114e29026702d", linkedin: "https://linkedin.com/in/charlie", email: "charlie@hackclub.com" },
  { id: "t-4", name: "Diana Prince", role: "Design Lead", imageUrl: "https://i.pravatar.cc/150?u=a04258114e29026708c", linkedin: "https://linkedin.com/in/diana", email: "diana@hackclub.com" }
];

export interface GalleryAlbum {
  id: string;
  title: string;
  date: string;
  status: "Published" | "Draft" | "Archived";
  imageCount: number;
  coverImage: string;
  size: string;
}

export const mockAlbums: GalleryAlbum[] = [
  { id: "evt-1", title: "CodeCrafters 2026", date: "Jan 15, 2026", status: "Published", imageCount: 42, coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000", size: "450 MB" },
  { id: "evt-2", title: "AI Innovate Challenge", date: "Mar 30, 2026", status: "Draft", imageCount: 18, coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000", size: "120 MB" },
  { id: "evt-3", title: "Web3 Builders Fiesta", date: "Oct 10, 2025", status: "Published", imageCount: 24, coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f4fced0?auto=format&fit=crop&q=80&w=1000", size: "210 MB" },
  { id: "evt-4", title: "UI/UX Sprint", date: "Mar 10, 2025", status: "Published", imageCount: 56, coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000", size: "620 MB" },
  { id: "evt-5", title: "Game Jam 2024", date: "Dec 12, 2024", status: "Archived", imageCount: 30, coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000", size: "340 MB" },
  { id: "evt-6", title: "Open Source Day", date: "Nov 05, 2024", status: "Published", imageCount: 15, coverImage: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=1000", size: "90 MB" },
  { id: "evt-7", title: "Cloud Native Conf", date: "Oct 18, 2024", status: "Published", imageCount: 35, coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000", size: "410 MB" },
];
