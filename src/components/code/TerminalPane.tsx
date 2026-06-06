import { terminalLines } from "@/data/mock";
import { cn } from "@/lib/utils";
import { TerminalSquare } from "lucide-react";

const lineColor: Record<(typeof terminalLines)[number]["kind"], string> = {
  cmd: "text-lg-100",
  out: "text-gun-200",
  ok: "text-turq-300",
  err: "text-error-400",
};

export function TerminalPane() {
  return (
    <div className="flex min-h-0 flex-col bg-gun-900">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-gun-700 px-3 py-1.5">
        <TerminalSquare size={13} className="text-gun-300" />
        <span className="font-mono text-caption uppercase tracking-wide text-gun-300">
          Terminal
        </span>
      </div>

      {/* Output */}
      <div className="min-h-0 flex-1 overflow-auto p-3 font-mono text-[13px] leading-[1.55]">
        {terminalLines.map((line, i) => (
          <div key={i} className={cn("whitespace-pre-wrap", lineColor[line.kind])}>
            {line.text}
          </div>
        ))}
        <div className="flex items-center text-lg-100">
          <span>$&nbsp;</span>
          <span
            className="inline-block h-[1.05em] w-[7px] bg-lg-100 animate-live-pulse"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
