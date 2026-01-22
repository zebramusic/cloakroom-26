"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MoveUp, MoveDown, Trash2 } from "lucide-react";

interface NavigationItem {
  id: string;
  type: "link" | "dropdown";
  label: string;
  href?: string;
  visibility: "public" | "logged_in_customer" | "hidden";
  orderIndex: number;
  children?: NavigationItem[];
}

interface NavigationItemEditorProps {
  item: NavigationItem;
  onUpdate: (updates: Partial<NavigationItem>) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canEdit: boolean;
}

export function NavigationItemEditor({
  item,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canEdit,
}: NavigationItemEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onMoveUp && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onMoveUp}
              disabled={!canEdit}
            >
              <MoveUp className="h-4 w-4" />
            </Button>
          )}
          {onMoveDown && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onMoveDown}
              disabled={!canEdit}
            >
              <MoveDown className="h-4 w-4" />
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            #{item.orderIndex}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          disabled={!canEdit}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`label-${item.id}`}>Label</Label>
          <Input
            id={`label-${item.id}`}
            value={item.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            disabled={!canEdit}
          />
        </div>

        <div>
          <Label htmlFor={`type-${item.id}`}>Type</Label>
          <Select
            value={item.type}
            onValueChange={(value: "link" | "dropdown") =>
              onUpdate({ type: value })
            }
            disabled={!canEdit}
          >
            <SelectTrigger id={`type-${item.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="link">Link</SelectItem>
              <SelectItem value="dropdown">
                Dropdown (Not implemented in MVP)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {item.type === "link" && (
        <div>
          <Label htmlFor={`href-${item.id}`}>URL</Label>
          <Input
            id={`href-${item.id}`}
            value={item.href || ""}
            onChange={(e) => onUpdate({ href: e.target.value })}
            placeholder="/page or https://example.com"
            disabled={!canEdit}
          />
        </div>
      )}

      <div>
        <Label htmlFor={`visibility-${item.id}`}>Visibility</Label>
        <Select
          value={item.visibility}
          onValueChange={(value: NavigationItem["visibility"]) =>
            onUpdate({ visibility: value })
          }
          disabled={!canEdit}
        >
          <SelectTrigger id={`visibility-${item.id}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="logged_in_customer">Logged In Only</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
