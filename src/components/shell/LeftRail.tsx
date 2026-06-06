import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import type { View } from "@/types";
import { Badge, SectionLabel } from "@/components/ui";
import {
  MessageSquare,
  Sparkles,
  Code2,
  FolderKanban,
  LayoutPanelLeft,
  Boxes,
  Settings2,
  Plus,
  Pin,
  Search,
} from "lucide-react";

const modes: { view: View; label: string; icon: React.ReactNode }[] = [
  { view: "chat", label: "Chat", icon: <MessageSquare size={18} /> },
  { view: "cowork", label: "Cowork", icon: <Sparkles size={18} /> },
  { view: "code", label: "Code", icon: <Code2 size={18} /> },
];

const nav: { view: View; label: string; icon: React.ReactNode }[] = [
  { view: "projects", label: "Projects", icon: <FolderKanban size={18} /> },
  { view: "canvas", label: "Canvas", icon: <LayoutPanelLeft size={18} /> },
  { view: "models", label: "Model Manager", icon: <Boxes size={18} /> },
  { view: "customize", label: "Customize", icon: <Settings2 size={18} /> },
];

function RailItem({
  active,
  icon,
  label,
  onClick,
  trailing,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-body transition-colors duration-200",
        active
          ? "bg-bg-subtle font-medium text-text"
          : "text-text-secondary hover:bg-bg-subtle hover:text-text"
      )}
    >
      <span className={cn(active ? "text-primary" : "text-text-muted group-hover:text-text")}>
        {icon}
      </span>
      <span className="flex-1 text-left">{label}</span>
      {trailing}
    </button>
  );
}

export function LeftRail() {
  const { view, setView, activeConversationId, setActiveConversation } = useAppStore();
  const conversations = useAppStore((s) => s.conversations);
  const createConversation = useAppStore((s) => s.createConversation);
  const pinned = conversations.filter((c) => c.pinned);
  const recents = conversations.filter((c) => !c.pinned);

  return (
    <aside className="metal-rail flex w-[264px] shrink-0 flex-col border-r border-border bg-surface">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-4">
        <img
          src="/demi-logo.png"
          alt="Demerzel"
          className="h-11 w-11 object-contain"
        />
        <div className="leading-tight">
          <div className="text-h3 font-bold tracking-tight">Demerzel</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            local-first agent
          </div>
        </div>
      </div>

      {/* New */}
      <div className="px-3 pb-2">
        <button
          onClick={() => createConversation()}
          className="flex w-full items-center gap-2 rounded-md border border-border-strong px-3 py-2 text-body font-medium text-text transition-colors hover:bg-bg-subtle"
        >
          <Plus size={16} /> New
          <span className="ml-auto flex items-center gap-1 text-text-muted">
            <Search size={13} />
          </span>
        </button>
      </div>

      {/* Modes */}
      <div className="px-3 py-1">
        <SectionLabel className="px-3 pb-1.5 pt-2">Modes</SectionLabel>
        <div className="space-y-0.5">
          {modes.map((m) => (
            <RailItem
              key={m.view}
              active={view === m.view}
              icon={m.icon}
              label={m.label}
              onClick={() => setView(m.view)}
            />
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="px-3 py-1">
        <div className="space-y-0.5">
          {nav.map((n) => (
            <RailItem
              key={n.view}
              active={view === n.view}
              icon={n.icon}
              label={n.label}
              onClick={() => setView(n.view)}
            />
          ))}
        </div>
      </div>

      {/* Conversations */}
      <div className="mt-2 flex-1 overflow-y-auto px-3">
        {pinned.length > 0 && (
          <>
            <SectionLabel className="flex items-center gap-1.5 px-3 pb-1.5 pt-3">
              <Pin size={11} /> Pinned
            </SectionLabel>
            <div className="space-y-0.5">
              {pinned.map((c) => (
                <RailItem
                  key={c.id}
                  active={view === "chat" && activeConversationId === c.id}
                  icon={<MessageSquare size={16} />}
                  label={c.title}
                  onClick={() => setActiveConversation(c.id)}
                />
              ))}
            </div>
          </>
        )}
        <SectionLabel className="px-3 pb-1.5 pt-3">Recents</SectionLabel>
        <div className="space-y-0.5 pb-3">
          {recents.map((c) => (
            <RailItem
              key={c.id}
              active={view === "chat" && activeConversationId === c.id}
              icon={<MessageSquare size={16} />}
              label={c.title}
              onClick={() => setActiveConversation(c.id)}
            />
          ))}
        </div>
      </div>

      {/* Footer account */}
      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-caption font-bold text-white">
            K
          </div>
          <div className="flex-1 leading-tight">
            <div className="text-small font-medium text-text">Kwame</div>
            <div className="text-caption text-text-muted">Local · offline-ready</div>
          </div>
          <Badge className="bg-gold-500/15 text-gold-500" dotColor="var(--accent)">
            Pro
          </Badge>
        </div>
      </div>
    </aside>
  );
}
