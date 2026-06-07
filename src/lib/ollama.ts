/**
 * Minimal browser client for a local Ollama server (default http://localhost:11434).
 *
 * The whole module degrades gracefully: every call throws on network/HTTP error,
 * and the store is responsible for catching and falling back to mock behaviour so
 * the app still works as a demo when Ollama is not running.
 *
 * NOTE for the user: to let a browser app call Ollama you must allow the dev
 * origin via CORS, e.g. set the env var before starting Ollama:
 *   OLLAMA_ORIGINS="*"   (or the specific origin, e.g. http://localhost:5173)
 * On Windows: `setx OLLAMA_ORIGINS "*"` then restart the Ollama service.
 */

export interface OllamaModelDetails {
  parameter_size?: string;
  quantization_level?: string;
  family?: string;
  families?: string[];
}

export interface OllamaTag {
  name: string;
  model?: string;
  size: number;
  digest?: string;
  modified_at?: string;
  details?: OllamaModelDetails;
}

export interface OllamaRunning {
  name: string;
  model?: string;
  size?: number;
  size_vram?: number;
  expires_at?: string;
}

export interface PullProgress {
  status: string;
  digest?: string;
  total?: number;
  completed?: number;
  percent: number;
}

export interface ChatRole {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Strip a trailing `/api` (and slashes) so we can build clean endpoint URLs. */
export function normalizeBase(raw: string): string {
  let b = (raw || "").trim();
  b = b.replace(/\/+$/, "");
  b = b.replace(/\/api$/i, "");
  return b || "http://localhost:11434";
}

const TIMEOUT_MS = 4000;

async function fetchJson<T>(url: string, init?: RequestInit, timeoutMs = TIMEOUT_MS): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: init?.signal ?? ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

/** Returns the Ollama version string, or throws if unreachable. */
export async function getVersion(base: string): Promise<string> {
  const data = await fetchJson<{ version: string }>(`${normalizeBase(base)}/api/version`);
  return data.version;
}

/** Quick reachability check used to drive the connection indicator. */
export async function ping(base: string): Promise<{ online: boolean; version?: string }> {
  try {
    const version = await getVersion(base);
    return { online: true, version };
  } catch {
    return { online: false };
  }
}

/** List installed models (`ollama list`). */
export async function listModels(base: string): Promise<OllamaTag[]> {
  const data = await fetchJson<{ models: OllamaTag[] }>(`${normalizeBase(base)}/api/tags`);
  return data.models ?? [];
}

/** List currently loaded/running models (`ollama ps`). */
export async function listRunning(base: string): Promise<OllamaRunning[]> {
  const data = await fetchJson<{ models: OllamaRunning[] }>(`${normalizeBase(base)}/api/ps`);
  return data.models ?? [];
}

/** Remove an installed model. */
export async function deleteModel(base: string, name: string): Promise<void> {
  const res = await fetch(`${normalizeBase(base)}/api/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
}

/**
 * Read a streaming NDJSON response body, invoking `onLine` for each parsed JSON object.
 * Buffers partial lines across chunks.
 */
async function readNdjson(
  res: Response,
  onLine: (obj: any) => void,
  signal?: AbortSignal
): Promise<void> {
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    if (signal?.aborted) {
      await reader.cancel();
      return;
    }
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line) continue;
      try {
        onLine(JSON.parse(line));
      } catch {
        /* ignore malformed partials */
      }
    }
  }
  const tail = buffer.trim();
  if (tail) {
    try {
      onLine(JSON.parse(tail));
    } catch {
      /* ignore */
    }
  }
}

/**
 * Pull (download) a model by tag, streaming progress.
 * `onProgress` receives a normalized 0..100 percent.
 */
export async function pullModel(
  base: string,
  name: string,
  opts: { onProgress?: (p: PullProgress) => void; signal?: AbortSignal } = {}
): Promise<void> {
  const res = await fetch(`${normalizeBase(base)}/api/pull`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: name, stream: true }),
    signal: opts.signal,
  });
  await readNdjson(
    res,
    (obj) => {
      if (obj.error) throw new Error(obj.error);
      const total = typeof obj.total === "number" ? obj.total : undefined;
      const completed = typeof obj.completed === "number" ? obj.completed : undefined;
      const percent =
        total && completed != null ? Math.min(100, (completed / total) * 100) : -1;
      opts.onProgress?.({
        status: obj.status ?? "",
        digest: obj.digest,
        total,
        completed,
        percent,
      });
    },
    opts.signal
  );
}

/**
 * Stream a chat completion. Calls `onToken` with each content delta and
 * `onThinking` with reasoning deltas (for models that emit a `thinking` field).
 * Returns the full assembled text. Honors `signal` for cancellation.
 */
export async function chat(
  base: string,
  body: {
    model: string;
    messages: ChatRole[];
    think?: boolean;
    options?: Record<string, unknown>;
  },
  opts: { onToken?: (t: string) => void; onThinking?: (t: string) => void; signal?: AbortSignal } = {}
): Promise<{ content: string; thinking: string }> {
  const res = await fetch(`${normalizeBase(base)}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, stream: true }),
    signal: opts.signal,
  });
  let content = "";
  let thinking = "";
  await readNdjson(
    res,
    (obj) => {
      if (obj.error) throw new Error(obj.error);
      const msg = obj.message;
      if (msg?.content) {
        content += msg.content;
        opts.onToken?.(msg.content);
      }
      if (msg?.thinking) {
        thinking += msg.thinking;
        opts.onThinking?.(msg.thinking);
      }
    },
    opts.signal
  );
  return { content, thinking };
}
