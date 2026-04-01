"use client";

import { mockRegistrations, mockEvents, mockUsers } from "@/lib/mockData";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";

export default function AdminPaymentsPage() {
  const paidRegistrations = mockRegistrations.filter(r => r.paymentStatus === "Paid");

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Payment History</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Transaction ID</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Participant</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Event</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Amount</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Date</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-foreground">
              {paidRegistrations.map(reg => {
                const user = mockUsers.find(u => u.id === reg.userId);
                const event = mockEvents.find(e => e.id === reg.eventId);
                return (
                  <tr key={reg.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{reg.transactionId || 'N/A'}</td>
                    <td className="px-6 py-4 font-medium">{user?.name}</td>
                    <td className="px-6 py-4">{event?.title}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">
                      ₹{event?.feeAmount}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(reg.registrationDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">Settled</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {paidRegistrations.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No payment records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
