import { useState } from "react";
import type { FileNode } from "@/types";
import { cn } from "@/lib/utils";
import { ChevronRight, Folder, FolderOpen, File } from "lucide-react";

function TreeNode({
  node,
  depth,
  activePath,
  onSelect,
}: {
  node: FileNode;
  depth: number;
  activePath: string;
  onSelect: (node: FileNode) => void;
}) {
  const [open, setOpen] = useState(depth < 2);
  const isDir = node.kind === "dir";
  const isActive = node.path === activePath;
  const indent = 8 + depth * 12;

  if (isDir) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          style={{ paddingLeft: indent }}
          className={cn(
            "flex w-full items-center gap-1.5 rounded-sm py-1 pr-2 text-small text-text-secondary transition-colors",
            "hover:bg-bg-subtle hover:text-text",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          )}
        >
          <ChevronRight
            size={14}
            className={cn(
              "shrink-0 text-text-muted transition-transform duration-200",
              open && "rotate-90"
            )}
          />
          {open ? (
            <FolderOpen size={14} className="shrink-0 text-primary" />
          ) : (
            <Folder size={14} className="shrink-0 text-text-muted" />
          )}
          <span className="truncate font-mono text-small">{node.name}</span>
        </button>
        {open && node.children && (
          <div>
            {node.children.map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                depth={depth + 1}
                activePath={activePath}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(node)}
      style={{ paddingLeft: indent + 16 }}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "flex w-full items-center gap-1.5 rounded-sm py-1 pr-2 text-small transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
        isActive
          ? "bg-bg-subtle text-text"
          : "text-text-secondary hover:bg-bg-subtle hover:text-text"
      )}
    >
      <File
        size={14}
        className={cn("shrink-0", isActive ? "text-primary" : "text-text-muted")}
      />
      <span className="truncate font-mono text-small">{node.name}</span>
    </button>
  );
}

export function FileTree({
  nodes,
  activePath,
  onSelect,
}: {
  nodes: FileNode[];
  activePath: string;
  onSelect: (node: FileNode) => void;
}) {
  return (
    <nav aria-label="File explorer" className="flex flex-col gap-0.5 p-2">
      {nodes.map((node) => (
        <TreeNode
          key={node.path}
          node={node}
          depth={0}
          activePath={activePath}
          onSelect={onSelect}
        />
      ))}
    </nav>
  );
}
