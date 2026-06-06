import { useState } from "react";
import { cn } from "@/lib/utils";
import { Brain, ChevronRight } from "lucide-react";

export function ThinkingTrace({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3 border-l-2 border-cyan-500/60 pl-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-caption font-medium text-text-muted transition-colors hover:text-text-secondary"
      >
        <Brain size={13} className="text-cyan-500" />
        Thinking
        <ChevronRight
          size={13}
          className={cn("transition-transform duration-200", open && "rotate-90")}
        />
      </button>
      {open && (
        <p className="mt-1.5 animate-fade-in font-mono text-small leading-relaxed text-text-muted">
          {text}
        </p>
      )}
    </div>
  );
}
