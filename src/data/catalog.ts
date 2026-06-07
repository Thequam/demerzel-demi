/**
 * Curated suggestions of models that can be pulled from the Ollama library.
 * These are only hints for the "Pull a model" box — the user can type ANY tag
 * (e.g. `gemma3:4b`, `deepseek-r1:14b`, `qwen3:8b`) and Demi will pull it.
 *
 * `sizeBytes` is an approximate default for the headline tag, used for ETA/labels
 * before the real manifest size is known.
 */
export interface CatalogModel {
  tag: string;
  label: string;
  blurb: string;
  sizeBytes: number;
  family: string;
}

export const pullCatalog: CatalogModel[] = [
  {
    tag: "gemma3:4b",
    label: "Gemma 3 · 4B",
    blurb: "Google's compact multimodal model. Fast, vision-capable, great default.",
    sizeBytes: 3_300_000_000,
    family: "gemma",
  },
  {
    tag: "gemma3:12b",
    label: "Gemma 3 · 12B",
    blurb: "Mid-size Gemma 3 with stronger reasoning and vision.",
    sizeBytes: 8_100_000_000,
    family: "gemma",
  },
  {
    tag: "deepseek-r1:8b",
    label: "DeepSeek-R1 · 8B",
    blurb: "Distilled reasoning model with visible thinking traces.",
    sizeBytes: 5_200_000_000,
    family: "deepseek",
  },
  {
    tag: "deepseek-r1:14b",
    label: "DeepSeek-R1 · 14B",
    blurb: "Larger R1 distill — deeper chain-of-thought reasoning.",
    sizeBytes: 9_000_000_000,
    family: "deepseek",
  },
  {
    tag: "qwen3:8b",
    label: "Qwen 3 · 8B",
    blurb: "Alibaba's versatile model with strong tool use and thinking mode.",
    sizeBytes: 5_200_000_000,
    family: "qwen",
  },
  {
    tag: "qwen3:14b",
    label: "Qwen 3 · 14B",
    blurb: "Bigger Qwen 3 for tougher reasoning and coding.",
    sizeBytes: 9_300_000_000,
    family: "qwen",
  },
  {
    tag: "qwen2.5-coder:7b",
    label: "Qwen2.5 Coder · 7B",
    blurb: "Coding specialist — fill-in-the-middle and repo edits.",
    sizeBytes: 4_700_000_000,
    family: "qwen",
  },
  {
    tag: "llama3.2:3b",
    label: "Llama 3.2 · 3B",
    blurb: "Meta's small, snappy general model. Good for routing.",
    sizeBytes: 2_000_000_000,
    family: "llama",
  },
  {
    tag: "phi4:14b",
    label: "Phi-4 · 14B",
    blurb: "Microsoft's reasoning-dense small model.",
    sizeBytes: 9_100_000_000,
    family: "phi",
  },
  {
    tag: "mistral:7b",
    label: "Mistral · 7B",
    blurb: "Fast, reliable open 7B workhorse.",
    sizeBytes: 4_100_000_000,
    family: "mistral",
  },
];
