import { useAppStore } from "@/store/useAppStore";
import { IconButton, Badge } from "@/components/ui";
import type { View } from "@/types";
import { Sun, Moon, PanelRight, Wifi } from "lucide-react";

const titles: Record<View, string> = {
  chat: "Chat",
  cowork: "Cowork",
  code: "Code",
  projects: "Projects",
  canvas: "Canvas",
  models: "Model Manager",
  customize: "Customize",
};

const subtitles: Partial<Record<View, string>> = {
  chat: "Conversational interface with streaming, thinking traces, and tool calling",
  cowork: "Agentic and scheduled tasks that knock things off your list",
  code: "Coding-agent sessions bound to a real folder on disk",
  projects: "Managed containers you can open as a real folder",
  canvas: "Generated HTML, docs, code, and live dashboards",
  models: "Browse, pull, inspect, and manage local and cloud models",
  customize: "Providers, connectors, appearance, and privacy",
};

export function TopBar() {
  const { view, theme, toggleTheme, canvasPanelOpen, toggleCanvasPanel } = useAppStore();

  return (
    <header className="metal-surface flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface/80 px-5 backdrop-blur">
      <div className="min-w-0">
        <h1 className="truncate text-h3 font-semibold leading-5">{titles[view]}</h1>
        {subtitles[view] && (
          <p className="truncate text-caption text-text-muted">{subtitles[view]}</p>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Badge className="hidden sm:inline-flex" dotColor="var(--success)">
          <Wifi size={11} /> Ollama · localhost:11434
        </Badge>
        {view === "chat" && (
          <IconButton
            active={canvasPanelOpen}
            onClick={() => toggleCanvasPanel()}
            aria-label="Toggle canvas panel"
            title="Toggle canvas panel"
          >
            <PanelRight size={17} />
          </IconButton>
        )}
        <IconButton onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </IconButton>
      </div>
    </header>
  );
}
