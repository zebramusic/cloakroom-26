"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils/cn";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-slate max-w-none", className)}>
      <ReactMarkdown
        components={{
        // Disable dangerous HTML
        html: () => null,
        // Style headings
        h1: ({ node, ...props }) => (
          <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />
        ),
        // Style paragraphs
        p: ({ node, ...props }) => (
          <p className="mb-4 leading-relaxed" {...props} />
        ),
        // Style lists
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-4 space-y-1" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />
        ),
        // Style links
        a: ({ node, ...props }) => (
          <a
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        // Style code
        code: ({ node, inline, ...props }: any) =>
          inline ? (
            <code
              className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
              {...props}
            />
          ) : (
            <code
              className="block bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono mb-4"
              {...props}
            />
          ),
        // Style blockquotes
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-primary pl-4 italic my-4"
            {...props}
          />
        ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
