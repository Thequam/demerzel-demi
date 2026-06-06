import { create } from "zustand";
import type {
  View,
  Effort,
  Conversation,
  ChatMessage,
  Model,
  ScheduledTask,
  TaskRun,
  Connector,
  Policy,
  CanvasDoc,
} from "@/types";
import {
  models as seedModels,
  conversations as seedConversations,
  tasks as seedTasks,
  connectors as seedConnectors,
  canvasDocs as seedCanvasDocs,
} from "@/data/mock";

type Theme = "light" | "dark";
type ThemePref = "light" | "dark" | "system";

let idCounter = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;

interface AppState {
  /* ---- theme ---- */
  theme: Theme;
  themePref: ThemePref;
  toggleTheme: () => void;
  setThemePref: (p: ThemePref) => void;

  /* ---- navigation ---- */
  view: View;
  setView: (v: View) => void;

  /* ---- chat ---- */
  conversations: Conversation[];
  activeConversationId: string;
  setActiveConversation: (id: string) => void;
  createConversation: () => void;
  sendMessage: (text: string) => void;
  streamingConvoId: string | null;

  /* ---- model selection ---- */
  activeModelId: string;
  effort: Effort;
  setModel: (id: string) => void;
  setEffort: (e: Effort) => void;
  modelSwitcherOpen: boolean;
  toggleModelSwitcher: (open?: boolean) => void;

  /* ---- model manager ---- */
  models: Model[];
  pulling: Record<string, number>;
  pullModel: (id: string) => void;
  setModelLoaded: (id: string, loaded: boolean) => void;
  deleteModel: (id: string) => void;

  /* ---- cowork tasks ---- */
  tasks: ScheduledTask[];
  toggleTaskActive: (id: string) => void;
  toggleTaskKeepAwake: (id: string) => void;
  runTaskNow: (id: string) => void;

  /* ---- connectors ---- */
  connectors: Connector[];
  toggleConnector: (id: string) => void;
  setToolPolicy: (connectorId: string, toolName: string, policy: Policy) => void;

  /* ---- settings ---- */
  localOnly: boolean;
  setLocalOnly: (v: boolean) => void;
  telemetry: boolean;
  setTelemetry: (v: boolean) => void;
  ollamaBaseUrl: string;
  setOllamaBaseUrl: (v: string) => void;
  providerKeys: Record<string, string>;
  setProviderKey: (provider: string, key: string) => void;

  /* ---- canvas ---- */
  canvasDocs: CanvasDoc[];
  canvasPanelOpen: boolean;
  toggleCanvasPanel: (open?: boolean) => void;
  activeCanvasId: string | null;
  setActiveCanvas: (id: string | null) => void;
}

const getInitialTheme = (): Theme => {
  if (typeof document !== "undefined") {
    return (document.documentElement.getAttribute("data-theme") as Theme) || "dark";
  }
  return "dark";
};

const systemTheme = (): Theme =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";

const applyTheme = (t: Theme) => {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", t);
  }
};

/* ---------------- canned assistant responder ---------------- */
function buildResponse(
  prompt: string,
  modelName: string
): { thinking?: string; text: string; canvas?: CanvasDoc } {
  const p = prompt.toLowerCase();
  const wantsCanvas =
    /(dashboard|chart|graph|kpi|revenue|build|page|site|landing|component|html|app|table|report|plot|visuali)/.test(
      p
    );

  if (wantsCanvas) {
    const title = prompt.trim().replace(/[.?!]+$/, "").slice(0, 48) || "Generated Canvas";
    const canvas: CanvasDoc = {
      id: uid("canvas"),
      title: title.charAt(0).toUpperCase() + title.slice(1),
      type: "html",
      version: 1,
      live: true,
      updatedAt: new Date(),
      content: `<!doctype html><html><head><meta charset="utf-8"><style>
        :root{color-scheme:dark}
        body{font-family:Inter,system-ui;margin:0;background:#161A20;color:#F2F4F6;padding:28px}
        h1{font-size:20px;margin:0 0 6px;background:linear-gradient(135deg,#008B8B,#0FB39A,#43D8F7);-webkit-background-clip:text;color:transparent}
        p.sub{color:#8B95A1;margin:0 0 20px;font-size:13px}
        .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .card{background:#20262E;border:1px solid #333C47;border-radius:14px;padding:18px}
        .v{font-size:26px;font-weight:700}.l{color:#8B95A1;font-size:12px;margin-bottom:6px}
        .bar{height:8px;background:#2A323C;border-radius:99px;margin-top:12px;overflow:hidden}
        .fill{height:100%;background:linear-gradient(90deg,#008B8B,#43D8F7)}
      </style></head><body>
        <h1>${title}</h1>
        <p class="sub">Generated live by ${modelName} · Demerzel Canvas</p>
        <div class="grid">
          <div class="card"><div class="l">Throughput</div><div class="v">2.4k/s</div><div class="bar"><div class="fill" style="width:78%"></div></div></div>
          <div class="card"><div class="l">Latency p95</div><div class="v">112ms</div><div class="bar"><div class="fill" style="width:42%"></div></div></div>
          <div class="card"><div class="l">Success</div><div class="v">99.3%</div><div class="bar"><div class="fill" style="width:93%"></div></div></div>
        </div>
      </body></html>`,
    };
    return {
      thinking: `The request reads as a build task, so I'll emit a single self-contained HTML canvas themed with the Demerzel teal→cyan gradient and render it in the canvas panel. Producing this with ${modelName}.`,
      text: `Done — I built **${canvas.title}** as a live canvas. I used the Demerzel teal→cyan brand gradient for the accents and kept it as a single self-contained HTML file. Open the canvas panel to preview it; you can edit, download, or open it in your browser. This run was produced by \`${modelName}\`.`,
      canvas,
    };
  }

  return {
    thinking: `Considering the question and answering directly. Keeping it concise; this turn is handled by ${modelName}.`,
    text: `Here's my take, produced by \`${modelName}\`. ${prompt.trim().replace(/[.?!]+$/, "")} — in short: I'd approach it step by step, validate assumptions early, and keep the local model in the loop for fast iteration. Ask me to go deeper on any part and I can expand or turn it into a canvas.`,
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  /* ---- theme ---- */
  theme: getInitialTheme(),
  themePref: "dark",
  toggleTheme: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    applyTheme(next);
    set({ theme: next, themePref: next });
  },
  setThemePref: (pref) => {
    const resolved: Theme = pref === "system" ? systemTheme() : pref;
    applyTheme(resolved);
    set({ theme: resolved, themePref: pref });
  },

  /* ---- navigation ---- */
  view: "chat",
  setView: (v) => set({ view: v }),

  /* ---- chat ---- */
  conversations: seedConversations,
  activeConversationId: seedConversations[0].id,
  setActiveConversation: (id) => set({ activeConversationId: id, view: "chat" }),
  createConversation: () => {
    const convo: Conversation = {
      id: uid("c"),
      title: "New chat",
      mode: "chat",
      messages: [],
      updatedAt: new Date(),
    };
    set((s) => ({
      conversations: [convo, ...s.conversations],
      activeConversationId: convo.id,
      view: "chat",
    }));
  },
  streamingConvoId: null,
  sendMessage: (text) => {
    const trimmed = text.trim();
    if (!trimmed || get().streamingConvoId) return;

    const convoId = get().activeConversationId;
    const modelId = get().activeModelId;
    const effort = get().effort;
    const model = get().models.find((m) => m.id === modelId);
    const modelName = model?.name ?? modelId;

    const userMsg: ChatMessage = {
      id: uid("m"),
      role: "user",
      content: trimmed,
      createdAt: new Date(),
    };

    const { thinking, text: replyText, canvas } = buildResponse(trimmed, modelName);

    const assistantId = uid("m");
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      thinking,
      modelId,
      effort,
      createdAt: new Date(),
      streaming: true,
      canvasId: canvas?.id,
    };

    set((s) => ({
      streamingConvoId: convoId,
      canvasDocs: canvas ? [canvas, ...s.canvasDocs] : s.canvasDocs,
      conversations: s.conversations.map((c) =>
        c.id === convoId
          ? {
              ...c,
              title: c.messages.length === 0 ? trimmed.slice(0, 40) : c.title,
              updatedAt: new Date(),
              messages: [...c.messages, userMsg, assistantMsg],
            }
          : c
      ),
    }));

    // Stream the reply token by token
    const tokens = replyText.match(/\S+\s*/g) ?? [replyText];
    let i = 0;
    const tick = () => {
      i += 1;
      const partial = tokens.slice(0, i).join("");
      const done = i >= tokens.length;
      set((s) => ({
        conversations: s.conversations.map((c) =>
          c.id === convoId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantId ? { ...m, content: partial, streaming: !done } : m
                ),
              }
            : c
        ),
        streamingConvoId: done ? null : s.streamingConvoId,
      }));
      if (!done) {
        setTimeout(tick, 22);
      } else if (canvas) {
        set({ activeCanvasId: canvas.id, canvasPanelOpen: true });
      }
    };
    setTimeout(tick, 180);
  },

  /* ---- model selection ---- */
  activeModelId: seedModels[0].id,
  effort: "High",
  setModel: (id) => set({ activeModelId: id, modelSwitcherOpen: false }),
  setEffort: (e) => set({ effort: e }),
  modelSwitcherOpen: false,
  toggleModelSwitcher: (open) =>
    set((s) => ({ modelSwitcherOpen: open ?? !s.modelSwitcherOpen })),

  /* ---- model manager ---- */
  models: seedModels,
  pulling: {},
  pullModel: (id) => {
    if (get().pulling[id] != null) return;
    set((s) => ({ pulling: { ...s.pulling, [id]: 0 } }));
    const step = () => {
      const cur = get().pulling[id];
      if (cur == null) return;
      const next = Math.min(100, cur + Math.random() * 14 + 6);
      if (next >= 100) {
        set((s) => {
          const { [id]: _removed, ...rest } = s.pulling;
          return {
            pulling: rest,
            models: s.models.map((m) =>
              m.id === id ? { ...m, installState: "installed" } : m
            ),
          };
        });
      } else {
        set((s) => ({ pulling: { ...s.pulling, [id]: next } }));
        setTimeout(step, 280);
      }
    };
    setTimeout(step, 280);
  },
  setModelLoaded: (id, loaded) =>
    set((s) => ({
      models: s.models.map((m) =>
        m.id === id ? { ...m, installState: loaded ? "loaded" : "installed" } : m
      ),
    })),
  deleteModel: (id) =>
    set((s) => ({
      models: s.models.map((m) =>
        m.id === id ? { ...m, installState: "available" } : m
      ),
    })),

  /* ---- cowork tasks ---- */
  tasks: seedTasks,
  toggleTaskActive: (id) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, active: !t.active } : t)),
    })),
  toggleTaskKeepAwake: (id) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, keepAwake: !t.keepAwake } : t)),
    })),
  runTaskNow: (id) => {
    const runId = uid("r");
    const run: TaskRun = {
      id: runId,
      startedAt: new Date(),
      durationMs: 0,
      status: "running",
      summary: "Run in progress…",
    };
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, lastStatus: "running", runs: [run, ...t.runs] } : t
      ),
    }));
    setTimeout(() => {
      set((s) => ({
        tasks: s.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                lastStatus: "success",
                runs: t.runs.map((r) =>
                  r.id === runId
                    ? {
                        ...r,
                        status: "success",
                        durationMs: 1800 + Math.floor(Math.random() * 4000),
                        summary: "Completed manually-triggered run.",
                      }
                    : r
                ),
              }
            : t
        ),
      }));
    }, 1800);
  },

  /* ---- connectors ---- */
  connectors: seedConnectors,
  toggleConnector: (id) =>
    set((s) => ({
      connectors: s.connectors.map((k) =>
        k.id === id ? { ...k, enabled: !k.enabled } : k
      ),
    })),
  setToolPolicy: (connectorId, toolName, policy) =>
    set((s) => ({
      connectors: s.connectors.map((k) =>
        k.id === connectorId
          ? {
              ...k,
              tools: k.tools.map((t) =>
                t.name === toolName ? { ...t, policy } : t
              ),
            }
          : k
      ),
    })),

  /* ---- settings ---- */
  localOnly: false,
  setLocalOnly: (v) =>
    set((s) => {
      // If turning on local-only and the active model is cloud, switch to a local one.
      let activeModelId = s.activeModelId;
      if (v) {
        const active = s.models.find((m) => m.id === activeModelId);
        if (active?.kind === "cloud") {
          const local =
            s.models.find((m) => m.kind === "local" && m.installState === "loaded") ??
            s.models.find((m) => m.kind === "local");
          if (local) activeModelId = local.id;
        }
      }
      return { localOnly: v, activeModelId };
    }),
  telemetry: false,
  setTelemetry: (v) => set({ telemetry: v }),
  ollamaBaseUrl: "http://localhost:11434/api",
  setOllamaBaseUrl: (v) => set({ ollamaBaseUrl: v }),
  providerKeys: {},
  setProviderKey: (provider, key) =>
    set((s) => ({ providerKeys: { ...s.providerKeys, [provider]: key } })),

  /* ---- canvas ---- */
  canvasDocs: seedCanvasDocs,
  canvasPanelOpen: true,
  toggleCanvasPanel: (open) =>
    set((s) => ({ canvasPanelOpen: open ?? !s.canvasPanelOpen })),
  activeCanvasId: seedCanvasDocs[0]?.id ?? null,
  setActiveCanvas: (id) => set({ activeCanvasId: id, canvasPanelOpen: id != null }),
}));
