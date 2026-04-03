"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Calendar as CalendarIcon, FileImage, Trophy, ListChecks, Info, Plus, Trash2, Globe, Building2, MapPin, Users, User, Laptop } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { mockEvents } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : null;

  const event = mockEvents.find((e) => e.id === eventId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageUrl, setImageUrl] = useState<string>(event?.imageUrl || "");
  const [participationType, setParticipationType] = useState<"Individual" | "Team">(event?.participationType || "Individual");
  const [mode, setMode] = useState<"Online" | "Offline">(event?.mode || "Online");
  const [sponsors, setSponsors] = useState<{ name: string; logoUrl: string }[]>(event?.sponsors || []);

  const handleAddSponsor = () => setSponsors([...sponsors, { name: "", logoUrl: "" }]);
  const handleRemoveSponsor = (index: number) => setSponsors(sponsors.filter((_, i) => i !== index));
  const handleSponsorChange = (index: number, field: "name" | "logoUrl", value: string) => {
    const newSponsors = [...sponsors];
    newSponsors[index] = { ...newSponsors[index], [field]: value };
    setSponsors(newSponsors);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
    }
  };

  const handleRemoveImage = () => setImageUrl("");

  if (!event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      router.push("/admin/events");
    }, 1500);
  };

  return (
    <div className="py-6 space-y-8 max-w-5xl mx-auto px-4">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
        <div>
          <Link href="/admin/events" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Events
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Opportunity</h1>
          <p className="text-sm text-slate-500 mt-1">Update details for <strong className="text-slate-700">{event.title}</strong>.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none border-slate-200 bg-white rounded-xl" onClick={() => router.push("/admin/events")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 md:flex-none bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-xl shadow-fuchsia-600/20 rounded-xl">
            {isSubmitting ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">

        {/* Basic & Organization Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-8">
                <div className="p-2 bg-fuchsia-50 rounded-lg"><Info className="h-5 w-5 text-fuchsia-600" /></div>
                Basic Information
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Opportunity Title <span className="text-rose-500">*</span></label>
                  <input required type="text" defaultValue={event.title} placeholder="e.g. CodeCrafters Global Hackathon" className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition-all text-slate-900 font-medium placeholder:text-slate-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Organization Name <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <input required type="text" defaultValue={event.organizationName} placeholder="e.g. HackClub Global" className="w-full pl-12 pr-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition-all text-slate-900 placeholder:text-slate-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Organization Website</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <input type="url" defaultValue={event.organizationWebsite} placeholder="https://example.com" className="w-full pl-12 pr-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition-all text-slate-900 placeholder:text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Opportunity Description <span className="text-rose-500">*</span></label>
                  <textarea required rows={8} defaultValue={event.description} placeholder="Describe the opportunity in detail..." className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition-all text-slate-800 custom-scrollbar resize-none"></textarea>
                </div>
              </div>
            </div>

            {/* Mode & Participation */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-8">Opportunity Mode & Participation Type</h2>

              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700">Participation Type <span className="text-rose-500">*</span></label>
                  <div className="flex flex-wrap gap-4">
                    <button
                      type="button"
                      onClick={() => setParticipationType("Individual")}
                      className={cn(
                        "flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all font-semibold text-base",
                        participationType === "Individual"
                          ? "bg-fuchsia-50 border-fuchsia-500 text-fuchsia-700"
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                    >
                      <User className="h-5 w-5" /> Individual
                    </button>
                    <button
                      type="button"
                      onClick={() => setParticipationType("Team")}
                      className={cn(
                        "flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all font-semibold text-base",
                        participationType === "Team"
                          ? "bg-fuchsia-50 border-fuchsia-500 text-fuchsia-700"
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                    >
                      <Users className="h-5 w-5" /> Team Participation
                    </button>
                  </div>
                </div>

                {participationType === "Team" && (
                  <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Min team size</label>
                      <input type="number" min={1} defaultValue={event.minTeamSize || 2} className="w-full px-5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Max team size</label>
                      <input type="number" min={1} defaultValue={event.maxTeamSize || 4} className="w-full px-5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20" />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700">Mode of Opportunity <span className="text-rose-500">*</span></label>
                  <div className="flex flex-wrap gap-4">
                    <button
                      type="button"
                      onClick={() => setMode("Online")}
                      className={cn(
                        "flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all font-semibold text-base",
                        mode === "Online"
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                    >
                      <Laptop className="h-5 w-5" /> Online
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("Offline")}
                      className={cn(
                        "flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all font-semibold text-base",
                        mode === "Offline"
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                    >
                      <MapPin className="h-5 w-5" /> Offline
                    </button>
                  </div>
                </div>

                {mode === "Offline" && (
                  <div className="space-y-6 p-6 bg-blue-50/30 rounded-2xl border border-blue-100">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Venue Address</label>
                      <input required type="text" defaultValue={event.venueAddress} placeholder="Enter complete address..." className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Event Location (Google Maps Link)</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                        <input type="url" defaultValue={event.eventLocation} placeholder="https://maps.google.com/..." className="w-full pl-12 pr-5 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar Config */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                <CalendarIcon className="h-5 w-5 text-fuchsia-600" /> Key Timelines
              </h2>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
                  <input required type="datetime-local" defaultValue={event.startDate.slice(0, 16)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 text-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">End Date</label>
                  <input required type="datetime-local" defaultValue={event.endDate.slice(0, 16)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 text-slate-800" />
                </div>
                <div className="space-y-1.5 pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-rose-600 uppercase tracking-wider">Registration Deadline</label>
                  <input required type="datetime-local" defaultValue={event.registrationDeadline.slice(0, 16)} className="w-full px-4 py-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                <Trophy className="h-5 w-5 text-amber-500" /> Rewards
              </h2>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prize Pool</label>
                  <input type="text" defaultValue={event.prizePool} placeholder="e.g. ₹1,00,000 Cash" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-800" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fee Type</label>
                    <select defaultValue={event.feeType} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none">
                      <option value="Free">Free</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</label>
                    <input type="number" defaultValue={event.feeAmount} placeholder="0" className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Sponsors</h2>
                <Button type="button" variant="outline" size="sm" onClick={handleAddSponsor} className="h-8 rounded-lg text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>

              <div className="space-y-4">
                {sponsors.length === 0 && (
                  <p className="text-xs text-center text-slate-400 py-4 border border-dashed rounded-xl">No sponsors added</p>
                )}
                {sponsors.map((sponsor, index) => (
                  <div key={index} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3 relative group">
                    <button type="button" onClick={() => handleRemoveSponsor(index)} className="absolute -top-2 -right-2 bg-white text-rose-500 p-1.5 rounded-full shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-3 w-3" />
                    </button>
                    <input
                      type="text"
                      placeholder="Sponsor Name"
                      value={sponsor.name}
                      onChange={(e) => handleSponsorChange(index, "name", e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white border border-slate-200 border-dashed rounded-lg flex items-center justify-center p-2 text-[10px] text-slate-500 cursor-pointer hover:bg-slate-50">
                        <FileImage className="h-3 w-3 mr-1" /> Upload Logo
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Cover Image</h3>
                {imageUrl && (
                  <button 
                    type="button" 
                    onClick={handleRemoveImage}
                    className="text-xs text-rose-500 font-bold hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              {imageUrl ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 group border border-slate-100">
                  <img src={imageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label htmlFor="cover-upload" className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-sm">
                      Replace Image
                    </label>
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center mb-4 bg-slate-50/50">
                  <div className="p-3 bg-slate-100 rounded-xl mb-2">
                    <FileImage className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">No cover image uploaded</p>
                </div>
              )}
              
              <input type="file" className="hidden" id="cover-upload" onChange={handleImageUpload} accept="image/*" />
              {!imageUrl && (
                <label htmlFor="cover-upload" className="block w-full bg-fuchsia-600 text-white text-center font-bold py-3 rounded-xl cursor-pointer hover:bg-fuchsia-700 shadow-lg shadow-fuchsia-600/20 transition-all">
                  Upload Image
                </label>
              )}
              {imageUrl && (
                <p className="text-[10px] text-center text-slate-400 font-medium">Recommended resolution: 1920x1080px</p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

