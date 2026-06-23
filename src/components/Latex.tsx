"use client";
import katex from "katex";

function renderLatex(text: string): string {
  // Replace display math $$...$$ first
  let result = text.replace(/\$\$(.*?)\$\$/g, (_, expr) => {
    try {
      return katex.renderToString(expr, { displayMode: true, throwOnError: false });
    } catch { return expr; }
  });
  // Replace inline math $...$
  result = result.replace(/\$(.*?)\$/g, (_, expr) => {
    try {
      return katex.renderToString(expr, { displayMode: false, throwOnError: false });
    } catch { return expr; }
  });
  return result;
}

export default function Latex({ children }: { children: string }) {
  return <span dangerouslySetInnerHTML={{ __html: renderLatex(children) }} />;
}
