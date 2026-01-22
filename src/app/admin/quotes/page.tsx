"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

interface Quote {
  id: string;
  quote_number: string;
  client_name: string;
  client_email: string;
  client_company: string;
  estimated_attendees: number;
  status: string;
  created_at: string;
}

const quoteColumns: Column<Quote>[] = [
  {
    key: "quote_number",
    label: "Quote #",
    sortable: true,
  },
  {
    key: "client_name",
    label: "Customer",
    sortable: true,
  },
  {
    key: "client_email",
    label: "Email",
    sortable: true,
  },
  {
    key: "client_company",
    label: "Company",
    sortable: true,
  },
  {
    key: "estimated_attendees",
    label: "Attendees",
    sortable: true,
    render: (value) => value?.toLocaleString() || "-",
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value) => <StatusBadge type="quote" status={value} />,
  },
  {
    key: "created_at",
    label: "Date",
    sortable: true,
    render: (value) => formatDate(value, "ro"),
  },
];

export default function QuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const response = await fetch("/api/quotes");
      if (!response.ok) throw new Error("Failed to fetch quotes");
      const { quotes: data } = await response.json();

      // Transform MongoDB data to match display format
      const transformedQuotes = data.map((q: any) => ({
        id: q._id,
        quote_number: q.quoteNumber,
        client_name: q.clientName,
        client_email: q.clientEmail,
        client_company: q.clientCompany || "-",
        estimated_attendees: q.estimatedParticipants,
        status: q.status,
        created_at: q.createdAt,
      }));

      setQuotes(transformedQuotes);
    } catch (error) {
      console.error("Failed to load quotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (quote: Quote) => {
    router.push(`/admin/quotes/${quote.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quotes</h1>
          <p className="text-gray-600 mt-1">Manage customer quote requests</p>
        </div>
      </div>

      {/* Quotes Table */}
      <DataTable
        data={quotes}
        columns={quoteColumns}
        searchPlaceholder="Search quotes..."
        emptyMessage="No quotes found"
        onRowClick={handleRowClick}
      />
    </div>
  );
}
