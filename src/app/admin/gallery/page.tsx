"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  Image as ImageIcon, 
  Search, 
  Upload, 
  FolderPlus, 
  MoreVertical, 
  Trash2, 
  Grid, 
  List as ListIcon, 
  Calendar, 
  ArrowUpRight,
  Edit2,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { getAlbums, saveAlbum, deleteAlbum as removeAlbumFromStorage } from "@/lib/storage";
import { GalleryAlbum } from "@/lib/mockData";

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);

  const loadData = () => {
    setAlbums(getAlbums());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage-update", loadData);
    return () => window.removeEventListener("storage-update", loadData);
  }, []);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    status: "Draft" as GalleryAlbum["status"],
    coverImage: ""
  });

  const filteredAlbums = useMemo(() => {
    return albums.filter(album =>
      album.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [albums, searchQuery]);

  const handleOpenModal = (album?: GalleryAlbum) => {
    if (album) {
      setEditingAlbum(album);
      setFormData({
        title: album.title,
        date: album.date,
        status: album.status,
        coverImage: album.coverImage
      });
    } else {
      setEditingAlbum(null);
      setFormData({
        title: "",
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }),
        status: "Draft",
        coverImage: "https://images.unsplash.com/photo-1540331547168-8b63109225b7?auto=format&fit=crop&q=80&w=1000"
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAlbum(null);
  };

  const handleSaveAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAlbum) {
      saveAlbum({ ...editingAlbum, ...formData });
    } else {
      const newAlbum: GalleryAlbum = {
        id: `evt-${Math.random().toString(36).substr(2, 5)}`,
        imageCount: 0,
        size: "0 MB",
        ...formData
      };
      saveAlbum(newAlbum);
    }
    handleCloseModal();
  };

  const handleDeleteAlbum = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the album "${title}"?`)) {
      removeAlbumFromStorage(id);
    }
  };

  const handleStatusChange = (id: string, status: GalleryAlbum["status"]) => {
    const album = albums.find(a => a.id === id);
    if (album) {
      saveAlbum({ ...album, status });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none mb-2">Gallery Management</h1>
          <p className="text-slate-500 font-bold text-sm">Organize and curate media for all event highlights</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-black uppercase tracking-widest text-[10px] h-12 px-6 rounded-2xl shadow-lg shadow-fuchsia-200 transition-all active:scale-95"
        >
          <FolderPlus className="mr-2 h-4 w-4" /> New Event Album
        </Button>
      </div>

      {/* Analytics Brief */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-none shadow-sm bg-white ring-1 ring-slate-100 flex items-center gap-4">
          <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Published</p>
            <p className="text-2xl font-black text-slate-900 leading-none">{albums.filter(a => a.status === 'Published').length}</p>
          </div>
        </Card>
        <Card className="p-6 border-none shadow-sm bg-white ring-1 ring-slate-100 flex items-center gap-4">
          <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Drafts</p>
            <p className="text-2xl font-black text-slate-900 leading-none">{albums.filter(a => a.status === 'Draft').length}</p>
          </div>
        </Card>
        <Card className="p-6 border-none shadow-sm bg-white ring-1 ring-slate-100 flex items-center gap-4">
          <div className="h-12 w-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
            <ImageIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Total Assets</p>
            <p className="text-2xl font-black text-slate-900 leading-none">
              {albums.reduce((acc, a) => acc + a.imageCount, 0)}
            </p>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ring-1 ring-slate-50">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:bg-white transition-all placeholder:text-slate-300"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-px bg-slate-100 mx-2 hidden md:block" />
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === "grid" ? "bg-white text-fuchsia-600 shadow-sm ring-1 ring-slate-200" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === "list" ? "bg-white text-fuchsia-600 shadow-sm ring-1 ring-slate-200" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAlbums.map((album) => (
            <Card key={album.id} className="group border-none shadow-sm hover:shadow-xl hover:shadow-fuchsia-500/5 transition-all duration-500 rounded-[32px] overflow-hidden bg-white ring-1 ring-slate-100">
              <div className="relative h-56 overflow-hidden">
                <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Status Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Badge 
                    className={cn(
                      "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-none shadow-lg",
                      album.status === 'Published' ? "bg-emerald-500 text-white" : 
                      album.status === 'Draft' ? "bg-amber-500 text-white" : "bg-slate-500 text-white"
                    )}
                  >
                    {album.status}
                  </Badge>
                </div>

                {/* Quick Actions Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                  <Link href={`/admin/gallery/${album.id}`}>
                    <Button size="sm" className="bg-white/90 backdrop-blur-md hover:bg-white text-slate-900 font-black text-[9px] uppercase tracking-widest h-9 rounded-xl border-none">
                      Manage Content
                    </Button>
                  </Link>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenModal(album)}
                      className="h-9 w-9 bg-white/90 backdrop-blur-md hover:bg-white text-slate-800 flex items-center justify-center rounded-xl shadow-lg transition-transform hover:scale-105"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-fuchsia-600 transition-colors">{album.title}</h3>
                    <p className="text-[11px] font-bold text-slate-400 flex items-center gap-2 mt-1.5 uppercase tracking-wide">
                      <Calendar className="h-3.5 w-3.5" /> {album.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-4 text-slate-500">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Assets</span>
                      <span className="text-sm font-black text-slate-700 leading-none">{album.imageCount} Items</span>
                    </div>
                    <div className="h-6 w-px bg-slate-100" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Storage</span>
                      <span className="text-sm font-black text-slate-700 leading-none">{album.size}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteAlbum(album.id, album.title)}
                    className="h-10 w-10 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden border-none shadow-sm rounded-[32px] ring-1 ring-slate-100 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50/50 border-b border-slate-50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Album</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assets / size</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredAlbums.map(album => (
                  <tr key={album.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 ring-1 ring-slate-200/50">
                          <img src={album.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <span className="font-bold text-slate-800 text-base">{album.title}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-slate-500">{album.date}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700">{album.imageCount} items</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{album.size}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <Badge 
                        variant={album.status === 'Published' ? "success" : album.status === 'Draft' ? "secondary" : "default"}
                        className="px-3 py-1 rounded-lg text-[9px] font-black uppercase border-none tracking-widest"
                      >
                        {album.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/gallery/${album.id}`}>
                          <button className="h-10 px-4 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 font-black uppercase text-[10px] tracking-widest transition-all">
                            Manage
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleOpenModal(album)}
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-fuchsia-600 hover:bg-fuchsia-50 transition-all"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteAlbum(album.id, album.title)}
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-10 animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center mb-8 shrink-0">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">
                  {editingAlbum ? "Edit Album" : "New Event Album"}
                </h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                  Configure album metadata and visibility
                </p>
              </div>
              <button 
                onClick={handleCloseModal}
                className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveAlbum} className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Album Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:bg-white transition-all shadow-inner"
                  placeholder="e.g. CodeCrafters 2026 Highlights"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Date</label>
                  <input 
                    type="text" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:bg-white transition-all shadow-inner"
                    placeholder="Jan 15, 2026"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visibility Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cover Image URL</label>
                <input 
                  type="url" 
                  required
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:bg-white transition-all shadow-inner"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="pt-6 flex gap-4 shrink-0 mt-auto">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1 h-14 rounded-2xl border-slate-100 text-slate-400 font-black uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-200"
                >
                  {editingAlbum ? "Update Album" : "Create Album"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
