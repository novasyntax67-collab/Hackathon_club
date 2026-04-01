"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, Search, Upload, FolderPlus, MoreVertical, Trash2, Grid, List as ListIcon, Calendar, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockAlbums } from "@/lib/mockData";

export default function AdminGalleryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlbums = mockAlbums.filter(album =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Gallery Media Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and organize photos for all your hackathons and events.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-md shadow-fuchsia-600/20">
            <FolderPlus className="h-4 w-4 mr-2" />
            New Event Album
          </Button>
        </div>
      </div>

      {/* Filters and Views */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
        <div className="relative w-full sm:max-w-xs block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search event albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all text-slate-700"
          />
        </div>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <button
            onClick={() => setViewMode("grid")}
            className={cn("p-2 rounded-lg transition-colors duration-200", viewMode === "grid" ? "bg-fuchsia-50 text-fuchsia-600" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600")}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn("p-2 rounded-lg transition-colors duration-200", viewMode === "list" ? "bg-fuchsia-50 text-fuchsia-600" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600")}
          >
            <ListIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => (
            <div key={album.id} className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3">
                  <Badge variant={album.status === 'Published' ? "success" : album.status === 'Draft' ? "secondary" : "default"} className="bg-white/90 backdrop-blur pointer-events-none text-slate-800 border-0 shadow-sm">
                    {album.status}
                  </Badge>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">{album.title}</h3>
                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center text-xs text-slate-500 mb-4 gap-3">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {album.date}</span>
                </div>

                <div className="flex items-center justify-between text-sm mt-auto border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-4 text-slate-500">
                    <span className="flex items-center gap-1.5"><ImageIcon className="h-4 w-4 text-slate-400" /> <span className="font-semibold text-slate-700">{album.imageCount}</span> items</span>
                    <span className="text-xs">{album.size}</span>
                  </div>
                  <Link href={`/admin/gallery/${album.id}`} className="text-fuchsia-600 font-semibold text-sm hover:text-fuchsia-700 flex items-center gap-1">
                    Manage <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Event Album</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Items / Size</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlbums.map(album => (
                <tr key={album.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                        <img src={album.coverImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-slate-800">{album.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {album.date}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col justify-center">
                      <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5 text-slate-400" /> {album.imageCount} items</span>
                      <span className="text-xs text-slate-400">{album.size}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <Badge variant={album.status === 'Published' ? "success" : album.status === 'Draft' ? "secondary" : "default"} className="shadow-none">
                      {album.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/gallery/${album.id}`}>
                        <Button variant="outline" size="sm" className="h-8 shadow-sm">Manage</Button>
                      </Link>
                      <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
