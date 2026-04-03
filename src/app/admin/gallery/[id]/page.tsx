"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Upload, 
  Star, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  X, 
  Info, 
  Calendar,
  Maximize2,
  Edit3
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// Mock Data for a single album's media
interface MediaItem {
  id: number;
  title: string;
  url: string;
  inHallOfFame: boolean;
  date: string;
  description: string;
}

const initialMedia: MediaItem[] = [
  { 
    id: 101, 
    title: "Main Stage Setup", 
    url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1000", 
    inHallOfFame: true, 
    date: "2024-01-15",
    description: "The impressive main stage setup featuring high-refresh LED screens and immersive lighting for the opening ceremony."
  },
  { 
    id: 102, 
    title: "Team Brainstorming", 
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000", 
    inHallOfFame: false, 
    date: "2024-01-15",
    description: "Participants collaborating on their innovative solutions during the 48-hour development sprint."
  },
  { 
    id: 103, 
    title: "Winner Announcement", 
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000", 
    inHallOfFame: true, 
    date: "2024-01-16",
    description: "The emotional moment when the grand prize winners were announced on the final day."
  },
];

export default function ManageEventGallery() {
  const params = useParams();
  const eventId = params.id;
  
  // State
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  
  // Form State
  const [formState, setFormState] = useState({
    title: "",
    url: "",
    description: "",
    inHallOfFame: false
  });

  // Helper mock title based on ID
  const eventTitle = "CodeCrafters 2024";

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.url || !formState.title) return;

    const newMedia: MediaItem = {
      id: Date.now(),
      title: formState.title,
      url: formState.url,
      description: formState.description || "No description provided.",
      inHallOfFame: formState.inHallOfFame,
      date: new Date().toISOString().split("T")[0]
    };

    setMediaList([newMedia, ...mediaList]);
    setFormState({ title: "", url: "", description: "", inHallOfFame: false });
    setShowAddForm(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this media asset permanently?")) {
      setMediaList(mediaList.filter(m => m.id !== id));
      if (selectedMedia?.id === id) setSelectedMedia(null);
    }
  };

  const toggleHallOfFame = (id: number) => {
    setMediaList(mediaList.map(m => 
      m.id === id ? { ...m, inHallOfFame: !m.inHallOfFame } : m
    ));
    if (selectedMedia?.id === id) setSelectedMedia(prev => prev ? { ...prev, inHallOfFame: !prev.inHallOfFame } : null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link href="/admin/gallery" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-fuchsia-600 transition-colors mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Albums
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
            Manage Media <span className="text-slate-300 ml-2 font-light">#{eventId}</span>
          </h1>
          <p className="text-sm font-bold text-slate-500">Curation workflow for <span className="text-slate-800">{eventTitle}</span></p>
        </div>
        {!showAddForm && (
          <Button 
            onClick={() => setShowAddForm(true)} 
            className="bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] h-12 px-6 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Media Asset
          </Button>
        )}
      </div>

      {/* Add Media Form */}
      {showAddForm && (
        <Card className="border-none ring-1 ring-slate-100 bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200/50 animate-in slide-in-from-top duration-500">
          <div className="p-8 md:p-12">
            <div className="flex justify-between items-center mb-10">
               <div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                   <Upload className="h-6 w-6 text-fuchsia-600" /> Upload New Asset
                 </h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">New entry for the event gallery</p>
               </div>
               <button 
                onClick={() => setShowAddForm(false)} 
                className="h-10 w-10 bg-slate-50 text-slate-400 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
               >
                 <X className="h-5 w-5" />
               </button>
            </div>
            
            <form onSubmit={handleAddMedia} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Direct Image URL</label>
                  <input 
                    type="url" 
                    required
                    value={formState.url}
                    onChange={(e) => setFormState({ ...formState, url: e.target.value })}
                    placeholder="https://images.unsplash.com/your-image..." 
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:bg-white transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Media Title</label>
                  <input 
                    type="text" 
                    required
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    placeholder="e.g. Grand Prize Ceremony" 
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:bg-white transition-all shadow-inner"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description (Internal / Detail View)</label>
                  <textarea 
                    rows={3}
                    value={formState.description}
                    onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                    placeholder="Describe the context of this photo..." 
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:bg-white transition-all shadow-inner resize-none"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Star className={cn("h-5 w-5 transition-colors", formState.inHallOfFame ? "text-amber-500 fill-amber-500" : "text-slate-300")} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 leading-none mb-1">Feature in Hall of Fame</h4>
                    <p className="text-xs font-medium text-slate-500">Publicly showcase this asset on the landing page</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormState({ ...formState, inHallOfFame: !formState.inHallOfFame })}
                  className={cn(
                    "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 ring-transparent",
                    formState.inHallOfFame ? "bg-fuchsia-600 ring-fuchsia-500/20" : "bg-slate-200"
                  )}
                >
                  <span className={cn(
                    "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm",
                    formState.inHallOfFame ? "translate-x-6" : "translate-x-1"
                  )} />
                </button>
              </div>

              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                  className="h-14 px-8 rounded-2xl border-slate-100 text-slate-400 font-black uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-200"
                >
                  Finalize & Upload
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {mediaList.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-white rounded-[40px] border-2 border-slate-100 border-dashed">
             <div className="bg-slate-50 p-6 rounded-[24px] mb-4">
               <ImageIcon className="h-10 w-10 text-slate-300" />
             </div>
             <h3 className="text-xl font-black text-slate-800 tracking-tight">Gallery is static</h3>
             <p className="text-sm font-bold text-slate-400 max-w-sm mt-2 mb-8">No visual assets have been indexed for this event yet. Start by uploading the first highlight.</p>
             <Button onClick={() => setShowAddForm(true)} className="bg-fuchsia-600 hover:bg-fuchsia-700 h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px]">
               Launch Upload Wizard
             </Button>
          </div>
        )}

        {mediaList.map((media) => (
          <Card 
            key={media.id} 
            className="group border-none shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 rounded-[32px] overflow-hidden bg-white ring-1 ring-slate-100 flex flex-col cursor-pointer"
            onClick={() => setSelectedMedia(media)}
          >
            <div className="relative h-64 overflow-hidden bg-slate-50">
              <img src={media.url} alt={media.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {media.inHallOfFame && (
                <div className="absolute top-4 left-4 bg-amber-500 text-white text-[9px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg shadow-amber-500/20">
                  <Star className="h-3 w-3 fill-white" /> Featured
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity group-hover:scale-100 scale-90 duration-300 pointer-events-none">
                <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white">
                  <Maximize2 className="h-5 w-5" />
                </div>
              </div>

              <div className="absolute bottom-4 right-4 flex gap-2 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleHallOfFame(media.id); }}
                  className="h-10 w-10 bg-white/90 backdrop-blur-md hover:bg-white text-slate-800 flex items-center justify-center rounded-xl shadow-lg transition-transform hover:scale-105"
                >
                  <Star className={cn("h-4 w-4", media.inHallOfFame ? "text-amber-500 fill-amber-500" : "text-slate-400")} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(media.id); }}
                  className="h-10 w-10 bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center rounded-xl shadow-lg transition-transform hover:scale-105"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-black text-slate-800 leading-tight mb-2 truncate">{media.title}</h3>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" /> {media.date}
                </p>
                <div className="flex -space-x-2">
                  <div className="h-6 w-6 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center">
                    <Info className="h-3 w-3 text-indigo-400" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Image Detail Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-300">
          <button 
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 h-14 w-14 rounded-full bg-white/10 text-white/50 hover:text-white flex items-center justify-center hover:bg-white/20 transition-all z-[210]"
          >
            <X className="h-8 w-8" />
          </button>

          <div className="bg-white w-full max-w-6xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]">
            <div className="flex-1 bg-black flex items-center justify-center relative group min-h-[300px] md:min-h-0">
               <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-full object-contain" />
               <div className="absolute top-6 left-6 flex gap-2">
                 {selectedMedia.inHallOfFame && (
                   <div className="bg-amber-500 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-amber-500/20">
                     <Star className="h-4 w-4 fill-white" /> Featured Highlight
                   </div>
                 )}
               </div>
            </div>

            <div className="w-full md:w-[400px] bg-white p-8 md:p-12 overflow-y-auto shrink-0 flex flex-col border-l border-slate-50">
              <div className="mb-10">
                <div className="flex items-center gap-2 text-fuchsia-600 mb-4">
                  <Badge variant="outline" className="border-fuchsia-100 text-fuchsia-600 bg-fuchsia-50/50 font-black text-[9px] uppercase tracking-tighter px-3 py-1">Asset Internal Metadata</Badge>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-loose mb-2">{selectedMedia.title}</h2>
                <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                  <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Catch date: {selectedMedia.date}</span>
                </div>
              </div>

              <div className="space-y-8 flex-1">
                <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Edit3 className="h-3.5 w-3.5" /> Description / Context
                  </h4>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed italic">
                    "{selectedMedia.description}"
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => toggleHallOfFame(selectedMedia.id)}
                    className={cn(
                      "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all",
                      selectedMedia.inHallOfFame 
                        ? "bg-amber-50 text-amber-600 ring-1 ring-amber-100" 
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    <Star className={cn("h-4 w-4", selectedMedia.inHallOfFame ? "fill-amber-500" : "")} />
                    {selectedMedia.inHallOfFame ? "Remove from Highlights" : "Add to Highlights"}
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedMedia.id)}
                    className="w-full h-14 rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-100 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-rose-100 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                    Purge from Gallery
                  </button>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-50">
                 <Button 
                   onClick={() => setSelectedMedia(null)}
                   className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px]"
                 >
                   Close Viewer
                 </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
