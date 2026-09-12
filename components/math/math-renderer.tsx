"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface MathRendererProps {
  content: string;
  className?: string;
}

/**
 * Normalizes LaTeX block math delimiters for remark-math parser.
 * remark-math requires $$ block fences to be isolated with line endings.
 * If $$\begin{aligned} is written on one line, remark-math treats \begin{aligned}
 * as fence metadata, stripping it from the math AST and causing KaTeX parse errors (rendered in red).
 */
function normalizeMathContent(raw: string): string {
  if (!raw) return "";

  let res = raw;

  // 1. Ensure $$ followed by \begin{...} has a newline after $$
  res = res.replace(/\$\$\s*(\\begin\{[a-zA-Z*]+\})/g, (_m, p1) => `$$\n${p1}`);

  // 2. Ensure \end{...} followed by $$ has a newline before $$
  res = res.replace(/(\\end\{[a-zA-Z*]+\})\s*\$\$/g, (_m, p1) => `${p1}\n$$`);

  return res;
}

export function MathRenderer({ content, className = "" }: MathRendererProps) {
  const normalizedContent = normalizeMathContent(content);

  return (
    <div
      className={`prose prose-invert max-w-none text-slate-200 leading-relaxed
        [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-6 [&_h1]:mb-3
        [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-slate-800 [&_h2]:pb-2
        [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-indigo-300 [&_h3]:mt-4 [&_h3]:mb-2
        [&_p]:my-3 [&_p]:text-slate-300 [&_p]:leading-7
        [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ul]:text-slate-300
        [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5 [&_ol]:text-slate-300
        [&_li]:text-slate-300
        [&_strong]:text-white [&_strong]:font-semibold
        [&_blockquote]:bg-slate-900/60 [&_blockquote]:border [&_blockquote]:border-slate-800 [&_blockquote]:rounded-xl [&_blockquote]:p-4 [&_blockquote]:text-slate-300 [&_blockquote]:my-4
        [&_code]:bg-slate-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-indigo-300 [&_code]:text-xs [&_code]:font-mono
        [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-slate-800 [&_pre]:overflow-x-auto
        ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}
