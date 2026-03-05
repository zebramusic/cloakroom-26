"use client";

import { useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { normalizeRichText } from "@/lib/utils/richText";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Link2,
  Image,
  Table,
} from "lucide-react";

interface RichTextEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  id,
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const normalizedValue = useMemo(() => normalizeRichText(value), [value]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== normalizedValue) {
      editorRef.current.innerHTML = normalizedValue;
    }
  }, [normalizedValue]);

  const applyCommand = (command: string, commandValue?: string) => {
    document.execCommand(command, false, commandValue);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const addLink = () => {
    const url = window.prompt("Enter link URL");
    if (!url) return;
    applyCommand("createLink", url);
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (!url) return;
    applyCommand("insertImage", url);
  };

  const insertTable = () => {
    const tableHtml = `
      <table border="1" style="width:100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="padding:8px;">Header 1</th>
            <th style="padding:8px;">Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:8px;">Value 1</td>
            <td style="padding:8px;">Value 2</td>
          </tr>
        </tbody>
      </table>
      <p></p>
    `;
    applyCommand("insertHTML", tableHtml);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-muted/30">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => applyCommand("bold")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => applyCommand("italic")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => applyCommand("formatBlock", "<h2>")}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => applyCommand("insertUnorderedList")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => applyCommand("insertOrderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={addLink}>
          <Link2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={addImage}>
          <Image className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={insertTable}>
          <Table className="h-4 w-4" />
        </Button>
      </div>

      <div
        id={id}
        ref={editorRef}
        contentEditable
        className="min-h-[180px] rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onInput={() => onChange(editorRef.current?.innerHTML || "")}
        data-placeholder={placeholder || "Write description..."}
        suppressContentEditableWarning
      />
    </div>
  );
}
