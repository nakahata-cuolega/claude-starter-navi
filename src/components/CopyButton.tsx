"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="shrink-0 rounded-md border border-stone-500 bg-stone-800 px-2.5 py-1 text-xs font-medium text-stone-200 hover:bg-stone-700"
      aria-label="コマンドをコピー"
    >
      {copied ? "✓ コピーしました" : "コピー"}
    </button>
  );
}
