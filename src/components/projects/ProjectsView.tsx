import { projects } from "@/data/mock";
import type { Project } from "@/types";
import { Card, Button, Badge, Pill } from "@/components/ui";
import { relativeTime } from "@/lib/utils";
import { Folder, FolderOpen, MessageSquare, FileText, Plus, Cpu } from "lucide-react";

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col gap-3 p-4 transition-colors duration-200 ease-enter hover:border-border-strong animate-fade-in">
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="truncate text-h3 text-text">{project.name}</h3>
          <span className="shrink-0 text-caption text-text-muted">{relativeTime(project.updatedAt)}</span>
        </div>
        <p className="mt-1 text-small text-text-secondary">{project.description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {project.folderPath && (
          <Badge className="bg-tan-500/15 text-tan-500">
            <Folder size={12} aria-hidden />
            {project.folderPath}
          </Badge>
        )}
        <Pill className="bg-bg-subtle text-text-secondary">
          <Cpu size={12} aria-hidden />
          <span className="font-mono">{project.defaultModel}</span>
        </Pill>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3 text-caption text-text-muted">
          <span className="inline-flex items-center gap-1">
            <MessageSquare size={13} aria-hidden />
            <span className="font-mono tabular">{project.chatCount}</span> chats
          </span>
          <span className="inline-flex items-center gap-1">
            <FileText size={13} aria-hidden />
            <span className="font-mono tabular">{project.canvasCount}</span> canvases
          </span>
        </div>
        <Button variant="secondary" size="sm">
          <FolderOpen size={14} style={{ color: "var(--link)" }} aria-hidden />
          Open as Folder
        </Button>
      </div>
    </Card>
  );
}

export function ProjectsView() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
        <div>
          <h1 className="text-h2 text-text">Projects</h1>
          <p className="text-small text-text-secondary">
            Managed containers for chats and canvases. Open one as a real folder on disk.
          </p>
        </div>
        <Button size="sm">
          <Plus size={15} aria-hidden />
          New project
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}

          <button
            type="button"
            className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border-strong bg-surface text-text-muted transition-colors duration-200 ease-enter hover:border-primary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <Plus size={22} aria-hidden />
            <span className="text-small font-medium">New project</span>
            <span className="text-caption text-text-muted">Promote a chat or start fresh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
