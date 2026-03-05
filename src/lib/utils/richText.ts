export function hasHtmlContent(value?: string | null): boolean {
  if (!value) return false;
  return /<\s*\/?[a-z][^>]*>/i.test(value);
}

export function markdownToHtml(markdown?: string | null): string {
  if (!markdown) return "";

  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) {
      html.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      html.push("</ol>");
      inOl = false;
    }
  };

  const inline = (text: string) =>
    text
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      closeLists();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      closeLists();
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    const ul = line.match(/^[-*]\s+(.+)$/);
    if (ul) {
      if (!inUl) {
        closeLists();
        html.push("<ul>");
        inUl = true;
      }
      html.push(`<li>${inline(ul[1])}</li>`);
      continue;
    }

    const ol = line.match(/^\d+\.\s+(.+)$/);
    if (ol) {
      if (!inOl) {
        closeLists();
        html.push("<ol>");
        inOl = true;
      }
      html.push(`<li>${inline(ol[1])}</li>`);
      continue;
    }

    closeLists();
    html.push(`<p>${inline(line)}</p>`);
  }

  closeLists();

  return html.join("\n");
}

export function sanitizeRichHtml(html?: string | null): string {
  if (!html) return "";

  let safe = html;

  safe = safe.replace(/<\s*\/?\s*(script|style|iframe|object|embed|link|meta)[^>]*>/gi, "");
  safe = safe.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "");
  safe = safe.replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "");
  safe = safe.replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "");
  safe = safe.replace(/javascript:/gi, "");

  return safe.trim();
}

export function normalizeRichText(value?: string | null): string {
  if (!value) return "";

  const html = hasHtmlContent(value) ? value : markdownToHtml(value);
  return sanitizeRichHtml(html);
}
