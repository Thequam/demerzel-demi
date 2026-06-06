export type Mode = "chat" | "cowork" | "code";
export type View =
  | "chat"
  | "cowork"
  | "code"
  | "projects"
  | "canvas"
  | "models"
  | "customize";

export type Capability = "vision" | "tools" | "thinking";
export type InstallState = "available" | "installed" | "loaded" | "update";
export type ProviderKind = "local" | "cloud";

export interface Model {
  id: string;
  name: string;
  provider: string;
  kind: ProviderKind;
  params: string;
  context: string;
  quant?: string;
  capabilities: Capability[];
  installState: InstallState;
  sizeBytes: number;
  estVramGb?: number;
  fitsHardware?: boolean;
  description?: string;
}

export type Effort = "Low" | "Medium" | "High";

export interface CanvasDoc {
  id: string;
  title: string;
  type: "html" | "markdown" | "code" | "svg" | "mermaid";
  version: number;
  content: string;
  updatedAt: Date;
  live?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  modelId?: string;
  effort?: Effort;
  createdAt: Date;
  canvasId?: string;
  streaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  mode: Mode;
  projectId?: string;
  messages: ChatMessage[];
  updatedAt: Date;
  pinned?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  folderPath?: string;
  defaultModel: string;
  updatedAt: Date;
  chatCount: number;
  canvasCount: number;
}

export type RunStatus = "success" | "warn" | "fail" | "running";

export interface TaskRun {
  id: string;
  startedAt: Date;
  durationMs: number;
  status: RunStatus;
  summary: string;
}

export interface ScheduledTask {
  id: string;
  name: string;
  schedule: string;
  instructions: string;
  projectId?: string;
  keepAwake: boolean;
  active: boolean;
  lastStatus: RunStatus;
  runs: TaskRun[];
}

export interface FileNode {
  name: string;
  path: string;
  kind: "file" | "dir";
  language?: string;
  children?: FileNode[];
}

export interface CodeSession {
  id: string;
  title: string;
  folderPath: string;
  model: string;
  updatedAt: Date;
}

export type Policy = "allow" | "ask" | "deny";

export interface ConnectorTool {
  name: string;
  description: string;
  readOnly: boolean;
  policy: Policy;
}

export interface Connector {
  id: string;
  name: string;
  transport: "stdio" | "http";
  enabled: boolean;
  tools: ConnectorTool[];
}
