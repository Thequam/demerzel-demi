import { useAppStore } from "@/store/useAppStore";
import { IconButton } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { View } from "@/types";
import { Sun, Moon, PanelRight, Wifi, WifiOff, Loader2 } from "lucide-react";

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

function OllamaStatus() {
  const status = useAppStore((s) => s.ollamaStatus);
  const version = useAppStore((s) => s.ollamaVersion);
  const refresh = useAppStore((s) => s.refreshOllama);

  const config = {
    unknown: { icon: <Wifi size={11} />, label: "Ollama", color: "var(--text-muted)" },
    checking: { icon: <Loader2 size={11} className="animate-spin" />, label: "Connecting…", color: "var(--text-muted)" },
    online: { icon: <Wifi size={11} />, label: version ? `Ollama ${version}` : "Ollama online", color: "var(--success)" },
    offline: { icon: <WifiOff size={11} />, label: "Ollama offline", color: "var(--warning)" },
  }[status];

  return (
    <button
      onClick={() => void refresh()}
      title={
        status === "online"
          ? "Connected to local Ollama — click to refresh"
          : "Ollama not detected — click to retry. Start Ollama and set OLLAMA_ORIGINS to allow this origin."
      }
      className={cn(
        "hidden items-center gap-1.5 rounded-full border border-border bg-bg-subtle px-2.5 py-1 text-caption font-medium text-text-secondary transition-colors hover:bg-surface sm:inline-flex"
      )}
    >
      <span className="flex h-1.5 w-1.5 rounded-full" style={{ background: config.color }} aria-hidden />
      {config.icon}
      {config.label}
    </button>
  );
}

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
        <OllamaStatus />
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
