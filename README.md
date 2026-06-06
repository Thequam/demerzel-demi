# Demerzel (Demi)

> Ollama's local models with Claude's interface and Cursor's coding agent — on your machine, under your control.

**Demi** is a local-first, Ollama-powered agent harness with a Claude-grade interface. It puts a polished three-mode experience — **Chat**, **Cowork**, and **Code** — on top of locally run models, while letting you reach for frontier cloud models and switch between them mid-conversation.

This repository contains a **runnable UI prototype** of Demi, built from [`docs/PRD.md`](docs/PRD.md) and [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md). It implements the full information architecture and design system as a Vite + React + TypeScript + Tailwind web app with mocked data (no live Ollama/Electron backend yet).

## Screenshots / modes

The left rail switches between the three modes and the supporting surfaces:

- **Chat** — streaming conversation, collapsible *thinking* traces, an in-composer **model switcher** (local ↔ cloud, with reasoning effort), and a live **Artifact panel** (preview / source / download).
- **Cowork** — agentic + scheduled tasks with run history, *Keep awake*, *Run now*, and live artifacts.
- **Code** — file tree + Monaco-style editor + always-dark terminal + agent panel, plus a usage dashboard (stat tiles, activity heatmap, streaks, favorite model).
- **Model Manager** — browse/pull/inspect/manage local + cloud models, with pull progress, capability badges, and VRAM-fit warnings.
- **Projects** — managed containers with the *Project → Folder* flow and linked-folder badges.
- **Artifacts** — a gallery of generated HTML / markdown / code / SVG / mermaid outputs.
- **Customize** — providers & keychain keys, Ollama config, appearance, privacy (local-only mode), and **MCP connectors** with a per-tool Allow / Ask / Deny permission model.

## Tech stack

- **UI:** React 18, TypeScript, Vite 5, Tailwind CSS (full Demi color ramps + semantic CSS-variable tokens), Framer-Motion-ready transitions, Lucide icons.
- **State:** Zustand.
- **Design system:** light & dark themes via `data-theme`, the signature `royal → azure → cyan` brand gradient, JetBrains Mono for model ids / code / terminal.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

```bash
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
npm run lint     # tsc --noEmit
```

## Project structure

```
docs/                         PRD + design system (the source of truth)
src/
  components/
    shell/                    Left rail, top bar
    composer/                 Composer + model switcher popover
    chat/                     Chat view, message bubble, thinking trace, artifact panel
    cowork/                   Cowork view, task cards, run history
    code/                     File tree, editor, terminal, usage dashboard
    models/                   Model Manager + model cards
    projects/                 Projects view
    artifacts/                Artifacts gallery
    customize/                Settings + MCP connectors
    ui.tsx                    Shared primitives (Button, Card, Badge, etc.)
  data/mock.ts                Mocked models, chats, projects, tasks, files…
  store/useAppStore.ts        Zustand app state (theme, view, active model…)
  types.ts                    Shared domain types
.cursor/agents/               Reusable subagent definitions used to build this app
```

## Status

UI prototype. Phases 0–4 of the PRD roadmap are represented in the interface; the optional Convex backend (Phase 5) and live Ollama/Electron wiring are not yet implemented.

## License

MIT
