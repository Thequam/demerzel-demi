import { useState } from "react";
import type { Connector, Policy, ConnectorTool } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import {
  Card,
  Badge,
  Button,
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
  Wifi,
  Plus,
  Trash2,
  Info,
  Loader2,
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
  const status = useAppStore((s) => s.ollamaStatus);
  const version = useAppStore((s) => s.ollamaVersion);
  const installed = useAppStore((s) => s.ollamaInstalled);
  const refresh = useAppStore((s) => s.refreshOllama);
  const [autoStart, setAutoStart] = useState(true);

  const online = status === "online";

  return (
    <div>
      <PanelHeader
        title="Ollama"
        description="Local runtime connection and hardware detection."
      />
      <div className="flex flex-col gap-4">
        <Card className="flex items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 text-body font-medium text-text">
              {online ? (
                <Wifi size={15} aria-hidden style={{ color: "var(--success)" }} />
              ) : status === "checking" ? (
                <Loader2 size={15} aria-hidden className="animate-spin" />
              ) : (
                <WifiOff size={15} aria-hidden style={{ color: "var(--warning)" }} />
              )}
              {online
                ? `Connected · Ollama ${version ?? ""}`
                : status === "checking"
                ? "Checking connection…"
                : "Not connected"}
            </div>
            <div className="text-caption text-text-muted">
              {online
                ? `${installed.length} model${installed.length === 1 ? "" : "s"} installed locally.`
                : "Start Ollama and set OLLAMA_ORIGINS to allow this origin."}
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => void refresh()}>
            {status === "checking" ? (
              <Loader2 size={14} aria-hidden className="animate-spin" />
            ) : (
              <Wifi size={14} aria-hidden />
            )}
            Test connection
          </Button>
        </Card>

        <div>
          <SectionLabel className="mb-1.5">Base URL</SectionLabel>
          <TextInput
            value={ollamaBaseUrl}
            onChange={setOllamaBaseUrl}
            ariaLabel="Ollama base URL"
          />
          <p className="mt-1.5 text-caption text-text-muted">
            Point at a remote host, or use{" "}
            <span className="font-mono">https://ollama.com/api</span> for cloud tags. For browser
            access set <span className="font-mono">OLLAMA_ORIGINS</span> to allow this origin.
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
  onRemove,
}: {
  connector: Connector;
  onToggleEnabled: () => void;
  onSetPolicy: (toolName: string, policy: Policy) => void;
  onRemove?: () => void;
}) {
  const readOnly = connector.tools.filter((t) => t.readOnly);
  const writeTools = connector.tools.filter((t) => !t.readOnly);
  const isLocal = connector.transport === "stdio";

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2">
            <span className="text-body font-medium text-text">{connector.name}</span>
            <Badge dotColor={isLocal ? "var(--success)" : "var(--info)"}>
              {connector.transport}
            </Badge>
            {connector.custom && <Badge>custom</Badge>}
          </div>
          {connector.url && (
            <div className="truncate font-mono text-caption text-text-muted">{connector.url}</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Toggle
            checked={connector.enabled}
            onChange={onToggleEnabled}
            label={`Enable ${connector.name}`}
          />
          {onRemove && (
            <button
              onClick={onRemove}
              aria-label={`Remove ${connector.name}`}
              title="Remove connector"
              className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-subtle hover:text-danger"
            >
              <Trash2 size={15} aria-hidden />
            </button>
          )}
        </div>
      </div>

      <div className={cn("mt-3 flex flex-col gap-3", !connector.enabled && "opacity-50")}>
        {connector.tools.length === 0 ? (
          <div className="flex items-start gap-2 rounded-md border border-border bg-bg-subtle px-3 py-2.5 text-caption text-text-secondary">
            <Info size={13} className="mt-0.5 shrink-0" aria-hidden />
            {isLocal
              ? "Local (stdio) servers run via the Demi desktop host; tools appear here once it connects."
              : "Tools are discovered from the MCP server on first connect. Permissions will appear here."}
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </Card>
  );
}

function AddConnectorForm() {
  const addConnector = useAppStore((s) => s.addConnector);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [transport, setTransport] = useState<"http" | "sse">("http");

  const valid = name.trim().length > 0 && /^https?:\/\//.test(url.trim());

  const submit = () => {
    if (!valid) return;
    addConnector({ name, url, transport });
    setName("");
    setUrl("");
    setTransport("http");
    setOpen(false);
  };

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <Plus size={15} aria-hidden /> Add custom connector
      </Button>
    );
  }

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Plug size={15} className="text-primary" aria-hidden />
        <span className="text-small font-semibold text-text">New MCP connector</span>
      </div>
      <div className="flex flex-col gap-2">
        <SectionLabel>Name</SectionLabel>
        <TextInput value={name} onChange={setName} placeholder="e.g. Notion" ariaLabel="Connector name" />
      </div>
      <div className="flex flex-col gap-2">
        <SectionLabel>Server URL (remote MCP over HTTP/SSE)</SectionLabel>
        <TextInput
          value={url}
          onChange={setUrl}
          placeholder="https://mcp.example.com/sse"
          ariaLabel="Connector URL"
        />
      </div>
      <div className="flex flex-col gap-2">
        <SectionLabel>Transport</SectionLabel>
        <SegmentedControl<"http" | "sse">
          size="sm"
          value={transport}
          onChange={setTransport}
          options={[
            { value: "http", label: "Streamable HTTP" },
            { value: "sse", label: "SSE" },
          ]}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={submit} disabled={!valid}>
          Add connector
        </Button>
        <Button variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </Card>
  );
}

function ConnectorsPanel() {
  const connectors = useAppStore((s) => s.connectors);
  const toggleConnector = useAppStore((s) => s.toggleConnector);
  const setToolPolicy = useAppStore((s) => s.setToolPolicy);
  const removeConnector = useAppStore((s) => s.removeConnector);

  return (
    <div>
      <PanelHeader
        title="Connectors (MCP)"
        description="Connect MCP servers for tools, and set per-tool Allow / Ask / Deny permissions."
      />
      <div className="mb-4 flex items-start gap-2 rounded-md border border-border bg-bg-subtle px-3 py-2.5 text-caption text-text-secondary">
        <Info size={14} className="mt-0.5 shrink-0" aria-hidden />
        <span>
          Remote MCP servers (HTTP/SSE) can be added here and reached directly. Local{" "}
          <span className="font-mono">stdio</span> servers (Filesystem, Postgres, …) require the Demi
          desktop host to spawn the process — they're shown as examples in the browser build.
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {connectors.map((c) => (
          <ConnectorCard
            key={c.id}
            connector={c}
            onToggleEnabled={() => toggleConnector(c.id)}
            onSetPolicy={(toolName, policy) => setToolPolicy(c.id, toolName, policy)}
            onRemove={c.custom ? () => removeConnector(c.id) : undefined}
          />
        ))}
        <AddConnectorForm />
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
