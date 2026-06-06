import type {
  Model,
  Conversation,
  Project,
  ScheduledTask,
  FileNode,
  CodeSession,
  Connector,
  Artifact,
} from "@/types";

const ago = (mins: number) => new Date(Date.now() - mins * 60000);

export const models: Model[] = [
  {
    id: "gemma4:27b",
    name: "gemma4",
    provider: "Ollama",
    kind: "local",
    params: "27B",
    context: "128K",
    quant: "Q4_K_M",
    capabilities: ["vision", "thinking", "tools"],
    installState: "loaded",
    sizeBytes: 17_000_000_000,
    estVramGb: 18,
    fitsHardware: true,
    description: "Google's open multimodal model. Vision + reasoning, strong general assistant.",
  },
  {
    id: "deepseek-v3.2",
    name: "deepseek-v3.2",
    provider: "Ollama",
    kind: "local",
    params: "671B MoE",
    context: "164K",
    quant: "Q4_K_M",
    capabilities: ["thinking", "tools"],
    installState: "installed",
    sizeBytes: 404_000_000_000,
    estVramGb: 220,
    fitsHardware: false,
    description: "Mixture-of-experts reasoning model. Heavy; recommended for high-VRAM rigs.",
  },
  {
    id: "minimax-m2.5",
    name: "minimax-m2.5",
    provider: "Ollama",
    kind: "local",
    params: "200B MoE",
    context: "200K",
    quant: "Q4_K_M",
    capabilities: ["thinking", "tools"],
    installState: "available",
    sizeBytes: 120_000_000_000,
    estVramGb: 96,
    fitsHardware: false,
    description: "Agentic / coding specialist MoE. Excellent tool use.",
  },
  {
    id: "nemotron-3-nano",
    name: "nemotron-3-nano",
    provider: "Ollama",
    kind: "local",
    params: "8B",
    context: "1M",
    quant: "Q4_K_M",
    capabilities: ["tools"],
    installState: "installed",
    sizeBytes: 5_200_000_000,
    estVramGb: 6,
    fitsHardware: true,
    description: "Tiny, ultra-long-context model. Great for retrieval and routing.",
  },
  {
    id: "glm-5.1",
    name: "glm-5.1",
    provider: "ZAI",
    kind: "local",
    params: "32B",
    context: "128K",
    quant: "Q4_K_M",
    capabilities: ["thinking", "tools"],
    installState: "available",
    sizeBytes: 20_000_000_000,
    estVramGb: 22,
    fitsHardware: true,
    description: "ZAI reasoning model with strong step-by-step planning.",
  },
  {
    id: "qwen3-coder-next",
    name: "qwen3-coder-next",
    provider: "Ollama",
    kind: "local",
    params: "30B",
    context: "256K",
    quant: "Q4_K_M",
    capabilities: ["tools", "thinking"],
    installState: "update",
    sizeBytes: 19_000_000_000,
    estVramGb: 21,
    fitsHardware: true,
    description: "Coding-tuned Qwen. Diff-aware, repo-scale edits.",
  },
  {
    id: "kimi-k2.5",
    name: "kimi-k2.5",
    provider: "Ollama",
    kind: "local",
    params: "1T MoE",
    context: "256K",
    capabilities: ["thinking", "tools"],
    installState: "available",
    sizeBytes: 600_000_000_000,
    estVramGb: 400,
    fitsHardware: false,
    description: "Frontier-scale agentic MoE. Cloud-class capability.",
  },
  {
    id: "claude-opus-4.8",
    name: "claude-opus-4.8",
    provider: "Anthropic",
    kind: "cloud",
    params: "—",
    context: "1M",
    capabilities: ["vision", "thinking", "tools"],
    installState: "available",
    sizeBytes: 0,
    description: "Anthropic frontier model. Best-in-class reasoning and coding.",
  },
  {
    id: "gpt-5.4",
    name: "gpt-5.4",
    provider: "OpenAI",
    kind: "cloud",
    params: "—",
    context: "400K",
    capabilities: ["vision", "thinking", "tools"],
    installState: "available",
    sizeBytes: 0,
    description: "OpenAI frontier multimodal model.",
  },
  {
    id: "gpt-oss:120b-cloud",
    name: "gpt-oss:120b",
    provider: "Ollama Cloud",
    kind: "cloud",
    params: "120B",
    context: "128K",
    capabilities: ["thinking", "tools"],
    installState: "available",
    sizeBytes: 0,
    description: "Hosted Ollama Cloud inference for the :cloud tag.",
  },
];

export const sampleArtifact: Artifact = {
  id: "art-1",
  title: "Quarterly Revenue Dashboard",
  type: "html",
  version: 3,
  updatedAt: ago(8),
  live: true,
  content: `<!doctype html><html><head><meta charset="utf-8"><style>
    body{font-family:Inter,system-ui;margin:0;background:#0B0E11;color:#F2F4F6;padding:24px}
    h1{font-size:18px;margin:0 0 16px;background:linear-gradient(135deg,#4154D6,#43D8F7);-webkit-background-clip:text;color:transparent}
    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
    .card{background:#1E232A;border:1px solid #2B323B;border-radius:12px;padding:16px}
    .v{font-size:24px;font-weight:700}.l{color:#6B7685;font-size:12px}
    .bar{height:8px;background:#2B323B;border-radius:99px;margin-top:8px;overflow:hidden}
    .fill{height:100%;background:linear-gradient(90deg,#4154D6,#43D8F7)}
  </style></head><body>
    <h1>Quarterly Revenue — Q2 2026</h1>
    <div class="grid">
      <div class="card"><div class="l">MRR</div><div class="v">$142.8K</div><div class="bar"><div class="fill" style="width:72%"></div></div></div>
      <div class="card"><div class="l">New Logos</div><div class="v">318</div><div class="bar"><div class="fill" style="width:54%"></div></div></div>
      <div class="card"><div class="l">Net Retention</div><div class="v">118%</div><div class="bar"><div class="fill" style="width:88%"></div></div></div>
    </div>
  </body></html>`,
};

export const conversations: Conversation[] = [
  {
    id: "c1",
    title: "Revenue dashboard from CSV",
    mode: "chat",
    updatedAt: ago(8),
    pinned: true,
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Build me an interactive quarterly revenue dashboard from this CSV. Dark theme, three KPI cards.",
        createdAt: ago(12),
      },
      {
        id: "m2",
        role: "assistant",
        modelId: "gemma4:27b",
        effort: "High",
        createdAt: ago(11),
        thinking:
          "The user wants a self-contained HTML dashboard. I'll parse the columns (mrr, logos, retention), pick the brand gradient for accents, and emit three KPI cards with progress bars. Keeping it single-file so it renders in the artifact panel.",
        content:
          "Here's an interactive revenue dashboard. I pulled MRR, new logos, and net retention into KPI cards with progress bars, styled with the Demi brand gradient. Open the artifact panel to preview it live — you can download it as a single HTML file or open it in your browser.",
        artifactId: "art-1",
      },
      {
        id: "m3",
        role: "user",
        content: "Nice. Switch to a reasoning model and add a short narrative summary above the cards.",
        createdAt: ago(9),
      },
      {
        id: "m4",
        role: "assistant",
        modelId: "deepseek-v3.2",
        effort: "High",
        createdAt: ago(8),
        thinking:
          "Switched provider mid-conversation. Context preserved. I'll add a one-paragraph executive summary derived from the three metrics, framed around the 118% net retention as the headline.",
        content:
          "Done — added an executive summary that leads with the 118% net retention as the headline signal, then contextualizes MRR growth and logo velocity. This run was produced by `deepseek-v3.2`; the conversation history carried forward from `gemma4`.",
      },
    ],
  },
  {
    id: "c2",
    title: "Explain MoE routing",
    mode: "chat",
    updatedAt: ago(140),
    messages: [
      { id: "m5", role: "user", content: "Explain mixture-of-experts routing simply.", createdAt: ago(141) },
    ],
  },
  {
    id: "c3",
    title: "Refactor auth middleware",
    mode: "code",
    updatedAt: ago(320),
    messages: [],
  },
];

export const projects: Project[] = [
  {
    id: "p1",
    name: "Demi Marketing Site",
    description: "Landing page + docs for the Demerzel launch. Astro + Tailwind.",
    folderPath: "~/code/demi-site",
    defaultModel: "qwen3-coder-next",
    updatedAt: ago(45),
    chatCount: 12,
    artifactCount: 5,
  },
  {
    id: "p2",
    name: "Research: Local Agents",
    description: "Notes, benchmarks, and artifacts comparing local model agent loops.",
    defaultModel: "deepseek-v3.2",
    updatedAt: ago(900),
    chatCount: 7,
    artifactCount: 9,
  },
  {
    id: "p3",
    name: "Invoice Parser",
    description: "CLI tool that extracts line items from PDF invoices into JSON.",
    folderPath: "~/code/invoice-parser",
    defaultModel: "gemma4:27b",
    updatedAt: ago(2880),
    chatCount: 4,
    artifactCount: 2,
  },
];

export const tasks: ScheduledTask[] = [
  {
    id: "t1",
    name: "Weekly competitor digest",
    schedule: "Every Monday · 9:00 AM",
    instructions:
      "Fetch the latest releases from the 5 tracked competitors, summarize what changed, and update the live digest artifact.",
    keepAwake: true,
    active: true,
    lastStatus: "success",
    projectId: "p2",
    runs: [
      { id: "r1", startedAt: ago(60), durationMs: 42000, status: "success", summary: "3 releases summarized, digest updated." },
      { id: "r2", startedAt: ago(10140), durationMs: 51000, status: "warn", summary: "1 source timed out; partial digest." },
      { id: "r3", startedAt: ago(20220), durationMs: 39000, status: "success", summary: "2 releases summarized." },
    ],
  },
  {
    id: "t2",
    name: "Nightly repo health check",
    schedule: "Daily · 2:00 AM",
    instructions: "Run the test suite in the Invoice Parser folder and open an issue artifact if anything fails.",
    keepAwake: false,
    active: true,
    lastStatus: "fail",
    projectId: "p3",
    runs: [
      { id: "r4", startedAt: ago(720), durationMs: 88000, status: "fail", summary: "2 tests failing in pdf extractor." },
      { id: "r5", startedAt: ago(2160), durationMs: 76000, status: "success", summary: "All 48 tests passed." },
    ],
  },
  {
    id: "t3",
    name: "Inbox triage",
    schedule: "Every 4 hours",
    instructions: "Read new MCP-connected mail, label, and draft replies for approval.",
    keepAwake: false,
    active: false,
    lastStatus: "success",
    runs: [
      { id: "r6", startedAt: ago(240), durationMs: 12000, status: "success", summary: "9 mails triaged, 3 drafts queued." },
    ],
  },
];

export const fileTree: FileNode[] = [
  {
    name: "demi-site",
    path: "demi-site",
    kind: "dir",
    children: [
      {
        name: "src",
        path: "demi-site/src",
        kind: "dir",
        children: [
          { name: "main.tsx", path: "demi-site/src/main.tsx", kind: "file", language: "tsx" },
          { name: "App.tsx", path: "demi-site/src/App.tsx", kind: "file", language: "tsx" },
          {
            name: "components",
            path: "demi-site/src/components",
            kind: "dir",
            children: [
              { name: "Hero.tsx", path: "demi-site/src/components/Hero.tsx", kind: "file", language: "tsx" },
              { name: "Pricing.tsx", path: "demi-site/src/components/Pricing.tsx", kind: "file", language: "tsx" },
            ],
          },
        ],
      },
      { name: "package.json", path: "demi-site/package.json", kind: "file", language: "json" },
      { name: "README.md", path: "demi-site/README.md", kind: "file", language: "markdown" },
    ],
  },
];

export const sampleCode = `import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="hero">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.2, 0, 0, 1] }}
      >
        Local models. Claude's interface.
      </motion.h1>
      <p>Run any Ollama model in a first-class agent harness.</p>
      <button className="cta">Download Demi</button>
    </section>
  );
}
`;

export const terminalLines: { kind: "cmd" | "out" | "ok" | "err"; text: string }[] = [
  { kind: "cmd", text: "$ npm run dev" },
  { kind: "out", text: "  VITE v5.4.11  ready in 412 ms" },
  { kind: "out", text: "  ➜  Local:   http://localhost:5173/" },
  { kind: "ok", text: "  ✓ compiled successfully" },
  { kind: "cmd", text: "$ npm test" },
  { kind: "out", text: "  Test Files  6 passed (6)" },
  { kind: "ok", text: "  ✓ 48 tests passed (1.2s)" },
];

export const codeSessions: CodeSession[] = [
  { id: "s1", title: "Add pricing tiers to Hero", folderPath: "~/code/demi-site", model: "qwen3-coder-next", updatedAt: ago(20) },
  { id: "s2", title: "Fix PDF extractor regex", folderPath: "~/code/invoice-parser", model: "gemma4:27b", updatedAt: ago(1500) },
];

export const connectors: Connector[] = [
  {
    id: "k1",
    name: "Filesystem",
    transport: "stdio",
    enabled: true,
    tools: [
      { name: "read_file", description: "Read a file from an allowed directory.", readOnly: true, policy: "allow" },
      { name: "list_directory", description: "List entries in a directory.", readOnly: true, policy: "allow" },
      { name: "write_file", description: "Create or overwrite a file.", readOnly: false, policy: "ask" },
      { name: "delete_file", description: "Permanently delete a file.", readOnly: false, policy: "deny" },
    ],
  },
  {
    id: "k2",
    name: "GitHub",
    transport: "http",
    enabled: true,
    tools: [
      { name: "search_issues", description: "Search issues and PRs.", readOnly: true, policy: "allow" },
      { name: "get_pull_request", description: "Read a pull request.", readOnly: true, policy: "allow" },
      { name: "create_issue", description: "Open a new issue.", readOnly: false, policy: "ask" },
      { name: "merge_pull_request", description: "Merge a pull request.", readOnly: false, policy: "ask" },
    ],
  },
  {
    id: "k3",
    name: "Postgres",
    transport: "stdio",
    enabled: false,
    tools: [
      { name: "query", description: "Run a read-only SQL query.", readOnly: true, policy: "ask" },
      { name: "execute", description: "Run a write/DDL statement.", readOnly: false, policy: "deny" },
    ],
  },
];

// Usage dashboard mock metrics
export const usageStats = {
  sessions: 128,
  messages: 3142,
  totalTokens: 18_640_000,
  activeDays: 47,
  currentStreak: 9,
  longestStreak: 21,
  peakHour: "10 PM",
  favoriteLocal: "qwen3-coder-next",
  favoriteCloud: "claude-opus-4.8",
  localTokens: 12_400_000,
  cloudTokens: 6_240_000,
};

// 7x18 activity heatmap intensities (0..4)
export const heatmap: number[][] = Array.from({ length: 7 }, (_, r) =>
  Array.from({ length: 18 }, (_, c) => {
    const seed = (r * 31 + c * 17) % 11;
    return seed > 7 ? 4 : seed > 5 ? 3 : seed > 3 ? 2 : seed > 1 ? 1 : 0;
  })
);
