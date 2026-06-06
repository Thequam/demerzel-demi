import { create } from "zustand";
import type { View, Effort } from "@/types";
import { models } from "@/data/mock";

type Theme = "light" | "dark";

interface AppState {
  theme: Theme;
  toggleTheme: () => void;

  view: View;
  setView: (v: View) => void;

  activeConversationId: string;
  setActiveConversation: (id: string) => void;

  activeModelId: string;
  effort: Effort;
  setModel: (id: string) => void;
  setEffort: (e: Effort) => void;

  artifactPanelOpen: boolean;
  toggleArtifactPanel: (open?: boolean) => void;

  modelSwitcherOpen: boolean;
  toggleModelSwitcher: (open?: boolean) => void;
}

const getInitialTheme = (): Theme => {
  if (typeof document !== "undefined") {
    return (document.documentElement.getAttribute("data-theme") as Theme) || "dark";
  }
  return "dark";
};

export const useAppStore = create<AppState>((set, get) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    set({ theme: next });
  },

  view: "chat",
  setView: (v) => set({ view: v }),

  activeConversationId: "c1",
  setActiveConversation: (id) => set({ activeConversationId: id, view: "chat" }),

  activeModelId: models[0].id,
  effort: "High",
  setModel: (id) => set({ activeModelId: id, modelSwitcherOpen: false }),
  setEffort: (e) => set({ effort: e }),

  artifactPanelOpen: true,
  toggleArtifactPanel: (open) =>
    set((s) => ({ artifactPanelOpen: open ?? !s.artifactPanelOpen })),

  modelSwitcherOpen: false,
  toggleModelSwitcher: (open) =>
    set((s) => ({ modelSwitcherOpen: open ?? !s.modelSwitcherOpen })),
}));
