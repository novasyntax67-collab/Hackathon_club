"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Upload, Star, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// Mock Data for a single album's media
const initialMedia = [
  { id: 101, title: "Main Stage Setup", url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1000", inHallOfFame: true, date: "2024-01-15" },
  { id: 102, title: "Team Brainstorming", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000", inHallOfFame: false, date: "2024-01-15" },
  { id: 103, title: "Winner Announcement", url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000", inHallOfFame: true, date: "2024-01-16" },
];

export default function ManageEventGallery() {
  const params = useParams();
  const eventId = params.id;
  
  // State
  const [mediaList, setMediaList] = useState(initialMedia);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [inHallOfFame, setInHallOfFame] = useState(false);

  // Helper mock title based on ID
  const eventTitle = "CodeCrafters 2024"; // Mock title

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !newTitle) return;

    const newMedia = {
      id: Date.now(),
      title: newTitle,
      url: newUrl,
      inHallOfFame,
      date: new Date().toISOString().split("T")[0]
    };

    setMediaList([newMedia, ...mediaList]);
    setNewTitle("");
    setNewUrl("");
    setInHallOfFame(false);
    setShowAddForm(false);
  };

  const handleDelete = (id: number) => {
    setMediaList(mediaList.filter(m => m.id !== id));
  };

  const toggleHallOfFame = (id: number) => {
    setMediaList(mediaList.map(m => 
      m.id === id ? { ...m, inHallOfFame: !m.inHallOfFame } : m
    ));
  };

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/admin/gallery" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Gallery
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            Manage Media
            <Badge variant="secondary" className="font-medium bg-slate-100 text-slate-600">ID: {eventId}</Badge>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Organize photos for <strong className="text-slate-700">{eventTitle}</strong></p>
        </div>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-md shadow-fuchsia-600/20">
            <Plus className="h-4 w-4 mr-2" />
            Add New Media
          </Button>
        )}
      </div>

      {/* Add Media Form */}
      {showAddForm && (
        <Card className="p-6 border-fuchsia-100 bg-[#fdfaff] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-fuchsia-500"></div>
          <div className="flex justify-between items-start mb-6">
             <div>
               <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 <Upload className="h-5 w-5 text-fuchsia-600" /> Upload New Media
               </h3>
               <p className="text-sm text-slate-500 mt-1">Add a new photo to this event's gallery.</p>
             </div>
             <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">Cancel</Button>
          </div>
          
          <form onSubmit={handleAddMedia} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Image URL</label>
                <input 
                  type="url" 
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg" 
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all placeholder:text-slate-400 text-slate-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Media Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Prize Distribution" 
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all placeholder:text-slate-400 text-slate-700"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200/60 shadow-sm mt-2">
              <input 
                type="checkbox" 
                id="hallOfFame"
                checked={inHallOfFame}
                onChange={(e) => setInHallOfFame(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-fuchsia-600 focus:ring-fuchsia-500 transition-colors cursor-pointer accent-fuchsia-600"
              />
              <div className="flex flex-col">
                <label htmlFor="hallOfFame" className="text-sm font-bold text-slate-800 cursor-pointer flex items-center gap-1.5">
                  Show in Hall of Fame <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                </label>
                <p className="text-xs text-slate-500">This image will be featured on the public home page.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white min-w-[120px]">
                Save Media
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Media List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {mediaList.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200 border-dashed">
             <div className="bg-slate-50 p-4 rounded-full mb-3">
               <ImageIcon className="h-8 w-8 text-slate-400" />
             </div>
             <h3 className="text-lg font-bold text-slate-700">No media yet</h3>
             <p className="text-sm text-slate-500 max-w-sm mt-1 mb-4">You haven't added any photos for this event. Upload your first image to get started.</p>
             <Button onClick={() => setShowAddForm(true)} variant="outline" className="border-slate-200">
               <Plus className="h-4 w-4 mr-2" /> Add Media
             </Button>
          </div>
        )}

        {mediaList.map((media) => (
          <div key={media.id} className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col relative">
            <div className="relative h-48 bg-slate-100 overflow-hidden group">
              <img src={media.url} alt={media.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {media.inHallOfFame && (
                <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="h-3 w-3 fill-white" /> Hall of Fame
                </div>
              )}
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                <button 
                  onClick={() => toggleHallOfFame(media.id)}
                  className="bg-white/90 hover:bg-white text-slate-800 p-2.5 rounded-full shadow-lg transition-transform hover:scale-110" 
                  title={media.inHallOfFame ? "Remove from Hall of Fame" : "Add to Hall of Fame"}
                >
                  <Star className={cn("h-4 w-4", media.inHallOfFame ? "text-amber-500 fill-amber-500" : "text-slate-600")} />
                </button>
                <button 
                  onClick={() => handleDelete(media.id)}
                  className="bg-rose-500 hover:bg-rose-600 text-white p-2.5 rounded-full shadow-lg transition-transform hover:scale-110" 
                  title="Delete media"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-md font-bold text-slate-800 leading-tight mb-1">{media.title}</h3>
              <p className="text-xs text-slate-500 font-medium.">Added: {media.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
