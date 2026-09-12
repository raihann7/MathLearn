"use client";

import { useMemo } from "react";
import { ListTree } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const headings = useMemo(() => {
    const lines = content.split("\n");
    const items: TOCItem[] = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length; // 2 for ##, 3 for ###
        // Remove markdown formatting like **bold** or inline math for display
        const rawText = match[2]
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\$(.*?)\$/g, "$1")
          .trim();

        const id = rawText
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");

        items.push({ id, text: rawText, level });
      }
    });

    return items;
  }, [content]);

  if (headings.length === 0) return null;

  const scrollToHeading = (text: string) => {
    // Look for heading element containing the text
    const elements = Array.from(document.querySelectorAll("h2, h3, h4"));
    const target = elements.find((el) =>
      el.textContent?.toLowerCase().includes(text.toLowerCase())
    );
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
      <div className="flex items-center gap-2 font-semibold text-slate-300 mb-3 uppercase tracking-wider text-[11px]">
        <ListTree className="w-3.5 h-3.5 text-indigo-400" />
        <span>Daftar Isi Materi</span>
      </div>
      <nav className="space-y-1.5">
        {headings.map((item, i) => (
          <button
            key={i}
            onClick={() => scrollToHeading(item.text)}
            className={`block w-full text-left transition hover:text-indigo-400 line-clamp-1 ${
              item.level === 3
                ? "pl-3 text-slate-400 text-[11px]"
                : "font-medium text-slate-300"
            }`}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
