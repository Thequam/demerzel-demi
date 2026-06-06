import { useState } from "react";
import type { Connector, Policy, ConnectorTool } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import {
  Card,
  Badge,
  SegmentedControl,
  SectionLabel,
  Toggle,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  Boxes,
  Server,
  Palette,
  ShieldCheck,
  Plug,
  Lock,
  Cpu,
  KeyRound,
  WifiOff,
} from "lucide-react";

const GUN = "#6B7685";

type Tab = "providers" | "ollama" | "appearance" | "privacy" | "connectors";
type ThemePref = "light" | "dark" | "system";

const TABS: { value: Tab; label: string; icon: React.ReactNode }[] = [
  { value: "providers", label: "Providers", icon: <Boxes size={16} /> },
  { value: "ollama", label: "Ollama", icon: <Server size={16} /> },
  { value: "appearance", label: "Appearance", icon: <Palette size={16} /> },
  { value: "privacy", label: "Privacy", icon: <ShieldCheck size={16} /> },
  { value: "connectors", label: "Connectors", icon: <Plug size={16} /> },
];

/* ---------------- shared bits ---------------- */
function PanelHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-h3 text-text">{title}</h2>
      <p className="text-small text-text-secondary">{description}</p>
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  ariaLabel: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className="h-9 w-full rounded-md border border-border bg-bg-subtle px-3 font-mono text-small text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
    />
  );
}

/* ---------------- Providers ---------------- */
function ProviderRow({
  provider,
  name,
  placeholder,
}: {
  provider: string;
  name: string;
  placeholder: string;
}) {
  const key = useAppStore((s) => s.providerKeys[provider] ?? "");
  const setProviderKey = useAppStore((s) => s.setProviderKey);

  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-body font-medium text-text">{name}</span>
        <Badge dotColor={key ? "var(--success)" : GUN}>
          {key ? "connected" : "not set"}
        </Badge>
      </div>
      <TextInput
        type="password"
        value={key}
        onChange={(v) => setProviderKey(provider, v)}
        placeholder={placeholder}
        ariaLabel={`${name} API key`}
      />
      <div className="mt-1.5 inline-flex items-center gap-1.5 text-caption text-text-muted">
        <Lock size={12} aria-hidden />
        Stored in OS keychain — never written to disk or synced.
      </div>
    </Card>
  );
}

function ProvidersPanel() {
  return (
    <div>
      <PanelHeader
        title="Providers"
        description="Add cloud providers and API keys, and set default models per mode."
      />
      <div className="flex flex-col gap-3">
        <ProviderRow provider="anthropic" name="Anthropic" placeholder="sk-ant-…" />
        <ProviderRow provider="openai" name="OpenAI" placeholder="sk-…" />
        <ProviderRow provider="ollama-cloud" name="Ollama Cloud" placeholder="ollama-…" />
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-md border border-border bg-bg-subtle px-3 py-2.5 text-caption text-text-secondary">
        <KeyRound size={14} className="mt-0.5 shrink-0" aria-hidden />
        <span>
          Default models per mode — Chat:{" "}
          <span className="font-mono text-text">gemma4</span> · Cowork:{" "}
          <span className="font-mono text-text">claude-opus-4.8</span> · Code:{" "}
          <span className="font-mono text-text">qwen3-coder-next</span>
        </span>
      </div>
    </div>
  );
}

/* ---------------- Ollama ---------------- */
function OllamaPanel() {
  const ollamaBaseUrl = useAppStore((s) => s.ollamaBaseUrl);
  const setOllamaBaseUrl = useAppStore((s) => s.setOllamaBaseUrl);
  const [autoStart, setAutoStart] = useState(true);

  return (
    <div>
      <PanelHeader
        title="Ollama"
        description="Local runtime connection and hardware detection."
      />
      <div className="flex flex-col gap-4">
        <div>
          <SectionLabel className="mb-1.5">Base URL</SectionLabel>
          <TextInput
            value={ollamaBaseUrl}
            onChange={setOllamaBaseUrl}
            ariaLabel="Ollama base URL"
          />
          <p className="mt-1.5 text-caption text-text-muted">
            Point at a remote host, or use{" "}
            <span className="font-mono">https://ollama.com/api</span> for cloud tags.
          </p>
        </div>

        <Card className="flex items-center justify-between p-4">
          <div>
            <div className="text-body font-medium text-text">Auto-start Ollama</div>
            <div className="text-caption text-text-muted">
              Launch and health-check the local server when Demi opens.
            </div>
          </div>
          <Toggle checked={autoStart} onChange={setAutoStart} label="Auto-start Ollama" />
        </Card>

        <Card className="p-4">
          <SectionLabel className="mb-2">Detected hardware</SectionLabel>
          <div className="flex flex-col gap-1.5 text-small text-text-secondary">
            <div className="inline-flex items-center gap-2">
              <Cpu size={14} aria-hidden />
              <span className="font-mono">NVIDIA RTX 4090 · 24 GB VRAM</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Server size={14} aria-hidden />
              <span className="font-mono">64 GB system RAM · 16 cores</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Appearance ---------------- */
function AppearancePanel() {
  const themePref = useAppStore((s) => s.themePref);
  const setThemePref = useAppStore((s) => s.setThemePref);

  return (
    <div>
      <PanelHeader title="Appearance" description="Theme, accent, and density." />
      <div className="flex flex-col gap-4">
        <Card className="flex items-center justify-between gap-3 p-4">
          <div>
            <div className="text-body font-medium text-text">Theme</div>
            <div className="text-caption text-text-muted">Light, dark, or follow the system.</div>
          </div>
          <SegmentedControl<ThemePref>
            value={themePref}
            onChange={setThemePref}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ]}
          />
        </Card>

        <Card className="flex items-center justify-between gap-3 p-4">
          <div>
            <div className="text-body font-medium text-text">Accent</div>
            <div className="text-caption text-text-muted">Gold is the single attention accent.</div>
          </div>
          <Badge dotColor="var(--accent)">Gold · fixed in v1</Badge>
        </Card>

        <Card className="flex items-center justify-between gap-3 p-4">
          <div>
            <div className="text-body font-medium text-text">Density</div>
            <div className="text-caption text-text-muted">Comfortable spacing for long reading.</div>
          </div>
          <Badge>Comfortable</Badge>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Privacy ---------------- */
function PrivacyPanel() {
  const telemetry = useAppStore((s) => s.telemetry);
  const setTelemetry = useAppStore((s) => s.setTelemetry);
  const localOnly = useAppStore((s) => s.localOnly);
  const setLocalOnly = useAppStore((s) => s.setLocalOnly);

  return (
    <div>
      <PanelHeader
        title="Privacy"
        description="Demi is local-first. Nothing leaves your machine unless you allow it."
      />
      <div className="flex flex-col gap-4">
        <Card className="flex items-center justify-between gap-3 p-4">
          <div>
            <div className="text-body font-medium text-text">Telemetry</div>
            <div className="text-caption text-text-muted">
              Off by default. No usage data is collected.
            </div>
          </div>
          <Toggle checked={telemetry} onChange={setTelemetry} label="Telemetry" />
        </Card>

        <Card
          className={cn(
            "flex items-center justify-between gap-3 p-4 transition-colors duration-200",
            localOnly && "ring-1"
          )}
          style={
            localOnly ? ({ "--tw-ring-color": "var(--accent)" } as React.CSSProperties) : undefined
          }
        >
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 text-body font-medium text-text">
              <WifiOff size={15} aria-hidden />
              Local-only mode
              {localOnly && <Badge dotColor="var(--accent)">on</Badge>}
            </div>
            <div className="text-caption text-text-muted">
              Disables all cloud calls and hides cloud models in the model switcher — only local
              Ollama models can run.
            </div>
          </div>
          <Toggle checked={localOnly} onChange={setLocalOnly} label="Local-only mode" />
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Connectors ---------------- */
const policyOptions: { value: Policy; label: string; color: string }[] = [
  { value: "allow", label: "Allow", color: "var(--success)" },
  { value: "ask", label: "Ask", color: "var(--warning)" },
  { value: "deny", label: "Deny", color: GUN },
];

function ToolRow({
  tool,
  onChange,
}: {
  tool: ConnectorTool;
  onChange: (p: Policy) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-bg-subtle px-3 py-2.5">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-small text-text">{tool.name}</span>
          {tool.readOnly ? (
            <Badge dotColor="var(--info)">read-only</Badge>
          ) : (
            <Badge dotColor="var(--warning)">state-changing</Badge>
          )}
        </div>
        <div className="text-caption text-text-muted">{tool.description}</div>
      </div>
      <SegmentedControl<Policy>
        size="sm"
        value={tool.policy}
        onChange={onChange}
        options={policyOptions}
      />
    </div>
  );
}

function ConnectorCard({
  connector,
  onToggleEnabled,
  onSetPolicy,
}: {
  connector: Connector;
  onToggleEnabled: () => void;
  onSetPolicy: (toolName: string, policy: Policy) => void;
}) {
  const readOnly = connector.tools.filter((t) => t.readOnly);
  const writeTools = connector.tools.filter((t) => !t.readOnly);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2">
          <span className="text-body font-medium text-text">{connector.name}</span>
          <Badge dotColor={connector.transport === "http" ? "var(--info)" : "var(--success)"}>
            {connector.transport}
          </Badge>
        </div>
        <Toggle
          checked={connector.enabled}
          onChange={onToggleEnabled}
          label={`Enable ${connector.name}`}
        />
      </div>

      <div className={cn("mt-3 flex flex-col gap-3", !connector.enabled && "opacity-50")}>
        {readOnly.length > 0 && (
          <div className="flex flex-col gap-2">
            <SectionLabel>Read-only tools</SectionLabel>
            {readOnly.map((t) => (
              <ToolRow key={t.name} tool={t} onChange={(p) => onSetPolicy(t.name, p)} />
            ))}
          </div>
        )}
        {writeTools.length > 0 && (
          <div className="flex flex-col gap-2">
            <SectionLabel>State-changing tools · needs approval</SectionLabel>
            {writeTools.map((t) => (
              <ToolRow key={t.name} tool={t} onChange={(p) => onSetPolicy(t.name, p)} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

function ConnectorsPanel() {
  const connectors = useAppStore((s) => s.connectors);
  const toggleConnector = useAppStore((s) => s.toggleConnector);
  const setToolPolicy = useAppStore((s) => s.setToolPolicy);

  return (
    <div>
      <PanelHeader
        title="Connectors (MCP)"
        description="Manage MCP servers and set per-tool Allow / Ask / Deny permissions."
      />
      <div className="flex flex-col gap-4">
        {connectors.map((c) => (
          <ConnectorCard
            key={c.id}
            connector={c}
            onToggleEnabled={() => toggleConnector(c.id)}
            onSetPolicy={(toolName, policy) => setToolPolicy(c.id, toolName, policy)}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- View ---------------- */
export function CustomizeView() {
  const [tab, setTab] = useState<Tab>("providers");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-h2 text-text">Customize</h1>
        <p className="text-small text-text-secondary">
          Providers, runtime, appearance, privacy, and connectors.
        </p>
      </header>

      <div className="flex min-h-0 flex-1">
        <nav className="w-56 shrink-0 border-r border-border p-3" aria-label="Settings sections">
          <div className="flex flex-col gap-1">
            {TABS.map((t) => {
              const active = t.value === tab;
              return (
                <button
                  key={t.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTab(t.value)}
                  className={cn(
                    "inline-flex items-center gap-2.5 rounded-md px-3 py-2 text-small font-medium transition-colors duration-200 ease-enter",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                    active
                      ? "bg-bg-subtle text-text"
                      : "text-text-secondary hover:bg-bg-subtle hover:text-text"
                  )}
                >
                  <span className={active ? "text-primary" : "text-text-muted"}>{t.icon}</span>
                  {t.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-2xl animate-fade-in">
            {tab === "providers" && <ProvidersPanel />}
            {tab === "ollama" && <OllamaPanel />}
            {tab === "appearance" && <AppearancePanel />}
            {tab === "privacy" && <PrivacyPanel />}
            {tab === "connectors" && <ConnectorsPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}
