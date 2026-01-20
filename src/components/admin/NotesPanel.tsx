"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

export interface Note {
  id: string;
  content: string;
  created_at: string;
  user_name?: string;
}

interface NotesPanelProps {
  notes: Note[];
  onAddNote: (content: string) => Promise<void>;
  isLoading?: boolean;
}

export function NotesPanel({
  notes,
  onAddNote,
  isLoading = false,
}: NotesPanelProps) {
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddNote(newNote.trim());
      setNewNote("");
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Notes & Comments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Note Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="Add a note or comment..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            disabled={isSubmitting}
            rows={3}
          />
          <Button
            type="submit"
            disabled={isSubmitting || !newNote.trim()}
            size="sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Add Note
              </>
            )}
          </Button>
        </form>

        {/* Notes List */}
        <div className="space-y-4 mt-6">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading notes...
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No notes yet. Add one above to get started.
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-gray-50 rounded-lg p-4 space-y-2"
              >
                <p className="text-gray-900 whitespace-pre-wrap">
                  {note.content}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {note.user_name && (
                    <span className="font-medium">{note.user_name}</span>
                  )}
                  <span>•</span>
                  <time>{formatDate(note.created_at, "ro")}</time>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
