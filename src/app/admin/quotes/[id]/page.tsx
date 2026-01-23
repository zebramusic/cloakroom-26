"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Timeline, TimelineEvent } from "@/components/admin/Timeline";
import { NotesPanel, Note } from "@/components/admin/NotesPanel";
import {
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  Building2,
  Users,
  MapPin,
  FileText,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import { formatDate } from "@/lib/utils/format";

interface Quote {
  id: string;
  quote_number: string;
  event_type: string;
  event_date_from: string;
  event_date_to: string | null;
  estimated_attendees: number;
  location: string;
  description: string | null;
  services: string[];
  client_name: string;
  client_email: string;
  client_phone: string;
  client_company: string | null;
  client_role: string | null;
  budget_range: string | null;
  referral_source: string | null;
  status: string;
  total_price: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  responded_at: string | null;
}

export default function QuoteDetailPage({ params }: any) {
  const router = useRouter();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const loadQuote = useCallback(async () => {
    try {
      const response = await fetch(`/api/quotes/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch quote");
      const { quote: data } = await response.json();

      // Transform MongoDB data to match display format
      const quoteData: Quote = {
        id: data._id,
        quote_number: data.quoteNumber,
        event_type: data.eventType,
        event_date_from: data.startDate,
        event_date_to: data.endDate,
        estimated_attendees: data.estimatedParticipants,
        location: data.location,
        description: data.notes,
        services: [
          data.needsCloakroom && "cloakroom",
          data.needsVip && "vip",
          data.needsBackstage && "backstage",
          data.needsBagCheck && "bag_check",
          data.needsInfrastructure && "infrastructure",
        ].filter(Boolean) as string[],
        client_name: data.clientName,
        client_email: data.clientEmail,
        client_phone: data.clientPhone,
        client_company: data.clientCompany,
        client_role: data.clientRole,
        budget_range: data.budgetRange,
        referral_source: data.referralSource,
        status: data.status,
        total_price: data.totalPrice,
        notes: data.internalNotes,
        created_at: data.createdAt,
        updated_at: data.updatedAt,
        responded_at: data.respondedAt,
      };

      setQuote(quoteData);
      setStatus(quoteData.status);
      setTotalPrice(quoteData.total_price?.toString() || "");
      setAdminNotes(quoteData.notes || "");
    } catch (error) {
      console.error("Failed to load quote:", error);
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  const handleUpdateQuote = async () => {
    if (!quote) return;

    setIsSaving(true);
    try {
      const updates: any = {
        status,
        notes: adminNotes || null,
      };

      if (totalPrice) {
        updates.total_price = parseFloat(totalPrice);
      }

      if (status !== quote.status && !quote.responded_at) {
        updates.responded_at = new Date().toISOString();
      }

      const response = await fetch(`/api/quotes/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update quote");

      const { quote: updatedQuote } = await response.json();
      setQuote(updatedQuote);
      router.refresh();
    } catch (error) {
      console.error("Failed to update quote:", error);
      alert("Failed to update quote. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuote = async () => {
    if (!confirm("Are you sure you want to delete this quote?")) return;

    try {
      const response = await fetch(`/api/quotes/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete quote");

      router.push("/admin/quotes");
    } catch (error) {
      console.error("Failed to delete quote:", error);
      alert("Failed to delete quote. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Quote not found</p>
          <Button onClick={() => router.push("/admin/quotes")} className="mt-4">
            Back to Quotes
          </Button>
        </div>
      </div>
    );
  }

  // Generate timeline events
  const timelineEvents: TimelineEvent[] = [
    {
      id: "1",
      title: "Quote created",
      description: `Quote request received from ${quote.client_name}`,
      timestamp: quote.created_at,
      type: "info",
    },
  ];

  if (quote.responded_at) {
    timelineEvents.push({
      id: "2",
      title: "Status updated",
      description: `Quote status changed to ${quote.status}`,
      timestamp: quote.responded_at,
      type: "success",
    });
  }

  // Mock notes (in real app, these would come from a separate notes table)
  const mockNotes: Note[] = [];

  const handleAddNote = async (content: string) => {
    // In a real app, this would save to a notes table
    console.log("Adding note:", content);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/quotes")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{quote.quote_number}</h1>
            <p className="text-gray-600 mt-1">Quote Request Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge type="quote" status={quote.status} />
          <Button variant="destructive" size="sm" onClick={handleDeleteQuote}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="manage">Manage</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              {/* Event Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Event Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-gray-600">Event Type</Label>
                    <p className="font-medium capitalize">
                      {quote.event_type.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Attendees</Label>
                    <p className="font-medium flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {quote.estimated_attendees.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Date From</Label>
                    <p className="font-medium">
                      {formatDate(quote.event_date_from, "ro")}
                    </p>
                  </div>
                  {quote.event_date_to && (
                    <div>
                      <Label className="text-gray-600">Date To</Label>
                      <p className="font-medium">
                        {formatDate(quote.event_date_to, "ro")}
                      </p>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <Label className="text-gray-600">Location</Label>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {quote.location}
                    </p>
                  </div>
                  {quote.description && (
                    <div className="sm:col-span-2">
                      <Label className="text-gray-600">Description</Label>
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {quote.description}
                      </p>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <Label className="text-gray-600">Services Requested</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {quote.services.map((service) => (
                        <span
                          key={service}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-gray-600">Name</Label>
                    <p className="font-medium">{quote.client_name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Email</Label>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <a
                        href={`mailto:${quote.client_email}`}
                        className="text-purple-600 hover:underline"
                      >
                        {quote.client_email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Phone</Label>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <a
                        href={`tel:${quote.client_phone}`}
                        className="text-purple-600 hover:underline"
                      >
                        {quote.client_phone}
                      </a>
                    </p>
                  </div>
                  {quote.client_company && (
                    <div>
                      <Label className="text-gray-600">Company</Label>
                      <p className="font-medium">{quote.client_company}</p>
                    </div>
                  )}
                  {quote.client_role && (
                    <div>
                      <Label className="text-gray-600">Role</Label>
                      <p className="font-medium">{quote.client_role}</p>
                    </div>
                  )}
                  {quote.budget_range && (
                    <div>
                      <Label className="text-gray-600">Budget Range</Label>
                      <p className="font-medium">{quote.budget_range}</p>
                    </div>
                  )}
                  {quote.referral_source && (
                    <div>
                      <Label className="text-gray-600">How They Found Us</Label>
                      <p className="font-medium capitalize">
                        {quote.referral_source}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Manage Tab */}
            <TabsContent value="manage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Quote Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="quoted">Quoted</SelectItem>
                        <SelectItem value="won">Won</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Total Price (RON)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={totalPrice}
                      onChange={(e) => setTotalPrice(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Admin Notes</Label>
                    <textarea
                      id="notes"
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Internal notes..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={handleUpdateQuote}
                    disabled={isSaving}
                    className="w-full"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <Timeline events={timelineEvents} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <Label className="text-gray-600">Created</Label>
                <p className="font-medium">
                  {formatDate(quote.created_at, "ro")}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Last Updated</Label>
                <p className="font-medium">
                  {formatDate(quote.updated_at, "ro")}
                </p>
              </div>
              {quote.responded_at && (
                <div>
                  <Label className="text-gray-600">Responded</Label>
                  <p className="font-medium">
                    {formatDate(quote.responded_at, "ro")}
                  </p>
                </div>
              )}
              {quote.total_price && (
                <div>
                  <Label className="text-gray-600">Quote Value</Label>
                  <p className="font-medium text-lg text-green-600">
                    {quote.total_price.toLocaleString()} RON
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes Panel */}
          <NotesPanel notes={mockNotes} onAddNote={handleAddNote} />
        </div>
      </div>
    </div>
  );
}
