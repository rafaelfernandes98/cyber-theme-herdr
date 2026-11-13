// Gera themes/cyber-theme-<cor>.json a partir de themes/cyber-theme.json (o vermelho original),
// trocando só os tons derivados do accent. Fundo, ANSI, cursor e cores de status ficam iguais.
// Uso: node tools/palettes.mjs
import { readFile, writeFile } from "node:fs/promises";

export const PRESETS = [
  { name: "laranja", accent: "#ff8a1f" },
  { name: "ambar", accent: "#ffc23d" },
  { name: "verde", accent: "#5be08a" },
  { name: "ciano", accent: "#35d0e6" },
  { name: "azul", accent: "#4c8dff" },
  { name: "violeta", accent: "#a879ff" },
  { name: "magenta", accent: "#ff4fa8" },
];

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (c) => "#" + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
// mix(a, b, t): t de a, (1 - t) de b.
const mix = (a, b, t) => hex(rgb(a).map((v, i) => v * t + rgb(b)[i] * (1 - t)));

// Proporções medidas no vermelho original (#f44638 sobre canvas #0a0b0f).
export function derive(accent, base, fg) {
  const muted = mix(mix(accent, fg, 0.75), base, 0.92);
  const dim = mix(muted, base, 0.77);
  return {
    chrome: mix(accent, base, 0.04),
    surface: mix(accent, base, 0.04),
    raised: mix(accent, base, 0.07),
    popover: mix(accent, base, 0.07),
    hover: mix(accent, base, 0.14),
    selected: mix(accent, base, 0.27),
    border: mix(accent, base, 0.48),
    muted,
    dim,
    idle: dim,
    unknown: mix(dim, base, 0.3),
    accent,
  };
}

const root = new URL("../themes/", import.meta.url);
const theme = JSON.parse(await readFile(new URL("cyber-theme.json", root), "utf8"));
const base = theme.colors.canvas, fg = theme.colors.foreground;
for (const p of PRESETS) {
  const d = derive(p.accent, base, fg);
  const out = { ...theme, selection: d.selected, colors: { ...theme.colors, ...d } };
  await writeFile(new URL(`cyber-theme-${p.name}.json`, root), JSON.stringify(out, null, 2) + "\n");
  console.log(`cyber-theme-${p.name}.json  accent ${p.accent}`);
}
