import { useState } from "react";
import { ModelSwitcher } from "./ModelSwitcher";
import { cn } from "@/lib/utils";
import { Plus, Mic, ArrowUp, PenLine, GraduationCap, FolderOpen } from "lucide-react";

const quickActions = [
  { icon: <PenLine size={14} />, label: "Write" },
  { icon: <GraduationCap size={14} />, label: "Learn" },
  { icon: <FolderOpen size={14} />, label: "From Folder" },
];

export function Composer({ placeholder = "Message Demi…" }: { placeholder?: string }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="mx-auto max-w-3xl">
        <div
          className={cn(
            "rounded-lg border bg-surface-raised shadow-md transition-shadow duration-200",
            focused ? "border-focus-ring shadow-glow" : "border-border"
          )}
        >
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rows={2}
            placeholder={placeholder}
            className="w-full resize-none bg-transparent px-4 pt-3 text-body text-text outline-none placeholder:text-text-muted"
          />
          <div className="flex items-center gap-2 px-3 pb-2.5">
            <button className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-subtle hover:text-text">
              <Plus size={18} />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-subtle hover:text-text">
              <Mic size={17} />
            </button>
            <div className="ml-auto flex items-center gap-2">
              <ModelSwitcher />
              <button
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                  value.trim()
                    ? "bg-primary text-primary-fg hover:bg-primary-hover"
                    : "bg-bg-subtle text-text-muted"
                )}
              >
                <ArrowUp size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-2 flex items-center justify-center gap-2">
          {quickActions.map((q) => (
            <button
              key={q.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-caption text-text-secondary transition-colors hover:bg-bg-subtle hover:text-text"
            >
              {q.icon}
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
