import { 
  mockUsers, 
  mockEvents, 
  mockRegistrations, 
  mockTeamRegistrations, 
  mockMessages, 
  mockAlbums,
  mockCoordinators,
  type User,
  type Event as EventType,
  type Registration,
  type TeamRegistration,
  type ChatMessage,
  type GalleryAlbum,
  type EventCoordinator
} from "./mockData";

export type { 
  User, 
  EventType as Event, 
  Registration, 
  TeamRegistration, 
  ChatMessage, 
  GalleryAlbum, 
  EventCoordinator 
};

const STORAGE_KEYS = {
  USERS: "hc_users",
  EVENTS: "hc_events",
  REGISTRATIONS: "hc_registrations",
  TEAM_REGISTRATIONS: "hc_team_registrations",
  MESSAGES: "hc_messages",
  ALBUMS: "hc_albums",
  COORDINATORS: "hc_coordinators",
  CALENDAR_EVENTS: "hc_calendar_events",
};

// --- INITIALIZATION ---
export const initStorage = () => {
  if (typeof window === "undefined") return;

  const initValue = (key: string, data: any) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  initValue(STORAGE_KEYS.USERS, mockUsers);
  initValue(STORAGE_KEYS.EVENTS, mockEvents);
  initValue(STORAGE_KEYS.REGISTRATIONS, mockRegistrations);
  initValue(STORAGE_KEYS.TEAM_REGISTRATIONS, mockTeamRegistrations);
  initValue(STORAGE_KEYS.MESSAGES, mockMessages);
  initValue(STORAGE_KEYS.ALBUMS, mockAlbums);
  initValue(STORAGE_KEYS.COORDINATORS, mockCoordinators);
  initValue(STORAGE_KEYS.CALENDAR_EVENTS, [
    {
      id: "ev_1",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 3).toISOString(),
      title: "Panel Discussion",
      subtitle: "Tech Beyond 2024",
      description: "A deep dive into the future of technology.",
      type: "Event",
      category: "Technology",
      time: "10:00",
      color: "blue"
    },
    {
      id: "ev_2",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString(),
      title: "Live Concert",
      subtitle: "Echo Beats Festival",
      description: "Music festival featuring local artists.",
      type: "Event",
      category: "Music",
      time: "18:00",
      color: "pink"
    }
  ]);
};

// --- GENERIC HELPERS ---
const getData = <T>(key: string): T[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

const saveData = <T>(key: string, data: T[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
  // Dispatch a custom event to notify other components of changes
  window.dispatchEvent(new Event("storage-update"));
};

// --- API-LIKE METHODS ---

// Events
export const getEvents = () => getData<EventType>(STORAGE_KEYS.EVENTS);
export const saveEvent = (event: EventType) => {
  const events = getEvents();
  const index = events.findIndex(e => e.id === event.id);
  if (index > -1) {
    events[index] = event;
  } else {
    events.push(event);
  }
  saveData(STORAGE_KEYS.EVENTS, events);
};
export const deleteEvent = (id: string) => {
  const events = getEvents().filter(e => e.id !== id);
  saveData(STORAGE_KEYS.EVENTS, events);
};

// Registrations
export const getRegistrations = () => getData<Registration>(STORAGE_KEYS.REGISTRATIONS);
export const saveRegistration = (reg: Registration) => {
  const regs = getRegistrations();
  regs.push(reg);
  saveData(STORAGE_KEYS.REGISTRATIONS, regs);
};
export const deleteRegistration = (id: string) => {
  const regs = getRegistrations().filter(r => r.id !== id);
  saveData(STORAGE_KEYS.REGISTRATIONS, regs);
};

// Team Registrations
export const getTeamRegistrations = () => getData<TeamRegistration>(STORAGE_KEYS.TEAM_REGISTRATIONS);
export const saveTeamRegistration = (tr: TeamRegistration) => {
  const trs = getTeamRegistrations();
  trs.push(tr);
  saveData(STORAGE_KEYS.TEAM_REGISTRATIONS, trs);
};

// Users
export const getUsers = () => getData<User>(STORAGE_KEYS.USERS);
export const saveUser = (user: User) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index > -1) users[index] = user;
  else users.push(user);
  saveData(STORAGE_KEYS.USERS, users);
};
export const deleteUser = (id: string) => {
  const users = getUsers().filter(u => u.id !== id);
  saveData(STORAGE_KEYS.USERS, users);
};

// Messages
export const getMessages = () => getData<ChatMessage>(STORAGE_KEYS.MESSAGES);
export const saveMessage = (msg: ChatMessage) => {
  const msgs = getMessages();
  msgs.push(msg);
  saveData(STORAGE_KEYS.MESSAGES, msgs);
};

// Albums
export const getAlbums = () => getData<GalleryAlbum>(STORAGE_KEYS.ALBUMS);
export const saveAlbum = (album: GalleryAlbum) => {
  const albums = getAlbums();
  const index = albums.findIndex(a => a.id === album.id);
  if (index > -1) albums[index] = album;
  else albums.unshift(album);
  saveData(STORAGE_KEYS.ALBUMS, albums);
};
export const deleteAlbum = (id: string) => {
  const albums = getAlbums().filter(a => a.id !== id);
  saveData(STORAGE_KEYS.ALBUMS, albums);
};

// Calendar Events
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO string
  time?: string;
  description: string;
  type: "Event" | "Reminder";
  category?: string;
  color?: string;
  subtitle?: string; // keeping for dashboard compatibility
}
export const getCalendarEvents = () => getData<CalendarEvent>(STORAGE_KEYS.CALENDAR_EVENTS);
export const saveCalendarEvent = (ev: CalendarEvent) => {
  const evs = getCalendarEvents();
  evs.push(ev);
  saveData(STORAGE_KEYS.CALENDAR_EVENTS, evs);
};
export const deleteCalendarEvent = (id: string) => {
  const evs = getCalendarEvents().filter(e => e.id !== id);
  saveData(STORAGE_KEYS.CALENDAR_EVENTS, evs);
};

// Coordinators
export const getCoordinators = () => getData<EventCoordinator>(STORAGE_KEYS.COORDINATORS);
export const saveCoordinator = (coord: EventCoordinator) => {
  const coords = getCoordinators();
  coords.push(coord);
  saveData(STORAGE_KEYS.COORDINATORS, coords);
};
