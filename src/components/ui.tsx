import React from "react";
import { cn } from "@/lib/utils";
import type { Capability, RunStatus } from "@/types";
import { Eye, Wrench, Brain } from "lucide-react";

/* ---------------- Button ---------------- */
type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-7 px-3 text-small gap-1.5",
  md: "h-9 px-4 text-body gap-2",
  lg: "h-11 px-5 text-body-lg gap-2",
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-fg shadow-sm hover:bg-primary-hover",
  secondary: "border border-border-strong text-text hover:bg-bg-subtle",
  accent: "bg-accent text-accent-fg shadow-sm hover:brightness-95",
  ghost: "text-text-secondary hover:bg-bg-subtle hover:text-text",
  danger: "bg-danger text-white hover:brightness-95",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 ease-enter",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
        "disabled:opacity-40 disabled:pointer-events-none",
        buttonSizes[size],
        buttonVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------------- IconButton ---------------- */
export function IconButton({
  className,
  active,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
        active
          ? "bg-bg-subtle text-text"
          : "text-text-muted hover:bg-bg-subtle hover:text-text",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------------- Card ---------------- */
export function Card({
  className,
  raised,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { raised?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-md border border-border",
        raised ? "bg-surface-raised shadow-md" : "bg-surface shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ---------------- Badge / Pill ---------------- */
export function Badge({
  className,
  children,
  dotColor,
}: {
  className?: string;
  children: React.ReactNode;
  dotColor?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm bg-bg-subtle px-2 py-0.5 text-caption font-mono text-text-secondary",
        className
      )}
    >
      {dotColor && <span className="h-1.5 w-1.5 rounded-full" style={{ background: dotColor }} />}
      {children}
    </span>
  );
}

export function Pill({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-caption font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- Capability badges ---------------- */
const capMeta: Record<Capability, { icon: React.ReactNode; label: string; color: string }> = {
  vision: { icon: <Eye size={11} />, label: "vision", color: "#1E6FE0" },
  tools: { icon: <Wrench size={11} />, label: "tools", color: "#C29318" },
  thinking: { icon: <Brain size={11} />, label: "thinking", color: "#06A6CC" },
};

export function CapabilityBadges({ caps }: { caps: Capability[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {caps.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1 rounded-sm bg-bg-subtle px-1.5 py-0.5 text-[10px] font-mono text-text-secondary"
          title={capMeta[c].label}
        >
          <span style={{ color: capMeta[c].color }}>{capMeta[c].icon}</span>
          {capMeta[c].label}
        </span>
      ))}
    </div>
  );
}

/* ---------------- ProgressBar ---------------- */
export function ProgressBar({
  value,
  className,
  color = "var(--info)",
}: {
  value: number;
  className?: string;
  color?: string;
}) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-bg-subtle", className)}>
      <div
        className="h-full rounded-full transition-[width] duration-300 ease-enter"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
      />
    </div>
  );
}

/* ---------------- Status dot ---------------- */
const statusMeta: Record<RunStatus, { color: string; label: string }> = {
  success: { color: "var(--success)", label: "Success" },
  warn: { color: "var(--warning)", label: "Warning" },
  fail: { color: "var(--error)", label: "Failed" },
  running: { color: "var(--info)", label: "Running" },
};

export function StatusDot({ status, withLabel }: { status: RunStatus; withLabel?: boolean }) {
  const m = statusMeta[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn("h-2 w-2 rounded-full", status === "running" && "animate-live-pulse")}
        style={{ background: m.color }}
      />
      {withLabel && <span className="text-small text-text-secondary">{m.label}</span>}
    </span>
  );
}

/* ---------------- Segmented control ---------------- */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: { value: T; label: React.ReactNode; color?: string }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
}) {
  return (
    <div className="inline-flex rounded-md border border-border bg-bg-subtle p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-[7px] font-medium transition-colors duration-200",
              size === "sm" ? "px-2.5 py-1 text-caption" : "px-3 py-1.5 text-small",
              active ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"
            )}
            style={active && opt.color ? { color: opt.color } : undefined}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Section heading ---------------- */
export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("text-caption font-semibold uppercase tracking-wide text-text-muted", className)}>
      {children}
    </div>
  );
}

/* ---------------- Empty state ---------------- */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {icon && <div className="text-text-muted">{icon}</div>}
      <div className="text-h3 text-text">{title}</div>
      {description && <p className="max-w-sm text-body text-text-secondary">{description}</p>}
      {action}
    </div>
  );
}
