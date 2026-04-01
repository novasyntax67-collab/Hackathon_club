"use client";

import { mockUsers } from "@/lib/mockData";
import { Badge } from "@/components/ui/Badge";
import { Search } from "lucide-react";

export default function AdminParticipantsPage() {
  const participants = mockUsers.filter(u => u.role === "participant");

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Manage Participants</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-muted/20 flex items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search participants..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold text-muted-foreground">ID</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Name</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Email</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-foreground">
              {participants.map(user => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{user.id}</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant="success">Active</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
