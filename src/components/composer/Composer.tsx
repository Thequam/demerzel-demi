import { useState } from "react";
import { ModelSwitcher } from "./ModelSwitcher";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Plus, Mic, ArrowUp, Square, PenLine, GraduationCap, FolderOpen } from "lucide-react";

const quickActions = [
  { icon: <PenLine size={14} />, label: "Write", prompt: "Write a short product update announcing Demi's local-first agent harness." },
  { icon: <GraduationCap size={14} />, label: "Learn", prompt: "Explain how mixture-of-experts routing works, simply." },
  { icon: <FolderOpen size={14} />, label: "From Folder", prompt: "Build a usage dashboard from the metrics in my project folder." },
];

export function Composer({ placeholder = "Message Demi…" }: { placeholder?: string }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const sendMessage = useAppStore((s) => s.sendMessage);
  const stopGeneration = useAppStore((s) => s.stopGeneration);
  const streaming = useAppStore((s) => s.streamingConvoId != null);

  const submit = (text?: string) => {
    const payload = (text ?? value).trim();
    if (!payload || streaming) return;
    sendMessage(payload);
    setValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const canSend = value.trim().length > 0 && !streaming;

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
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rows={2}
            placeholder={streaming ? "Demi is responding…" : placeholder}
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
                onClick={() => (streaming ? stopGeneration() : submit())}
                disabled={!streaming && !canSend}
                aria-label={streaming ? "Stop generating" : "Send message"}
                title={streaming ? "Stop generating" : "Send message"}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                  streaming || canSend
                    ? "bg-primary text-primary-fg hover:bg-primary-hover"
                    : "bg-bg-subtle text-text-muted"
                )}
              >
                {streaming ? <Square size={14} /> : <ArrowUp size={17} />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-2 flex items-center justify-center gap-2">
          {quickActions.map((q) => (
            <button
              key={q.label}
              onClick={() => submit(q.prompt)}
              disabled={streaming}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-caption text-text-secondary transition-colors hover:bg-bg-subtle hover:text-text disabled:opacity-40"
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
