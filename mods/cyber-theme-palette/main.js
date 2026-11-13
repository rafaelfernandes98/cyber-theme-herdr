// Accent picker: troca o vermelho do Cyber Theme por uma cor pré-definida.
// Cada cor é um tema gerado por tools/palettes.mjs (themes/cyber-theme-<cor>.json); escolher
// roda `app.theme`, então a escolha fica salva no layout como qualquer escolha de tema.
// Aberto pelo botão de cor da barra de abas. ↑/↓ movem, Enter aplica, Esc fecha.

import { View, div, PathBuilder } from "gpui-kit";
import { v_flex, h_flex } from "gpui-base";
import { run, props, closeOverlay, theme, shared } from "herdr";

const W = globalThis.window;
const anim = () => shared("cyber-theme.animations") !== false;
const CUT = 10;
const cutPath = (c) => PathBuilder.fill().add_polygon([[c, 0], ["100%", 0], ["100%", "100%"], [0, "100%"], [0, c]], true).build();
const MONO = "Share Tech Mono";

// Manter em sincronia com tools/palettes.mjs. "cyber-theme" é o vermelho original.
const COLORS = [
  { label: "Vermelho", theme: "cyber-theme", accent: "#f44638" },
  { label: "Laranja", theme: "cyber-theme-laranja", accent: "#ff8a1f" },
  { label: "Âmbar", theme: "cyber-theme-ambar", accent: "#ffc23d" },
  { label: "Verde", theme: "cyber-theme-verde", accent: "#5be08a" },
  { label: "Ciano", theme: "cyber-theme-ciano", accent: "#35d0e6" },
  { label: "Azul", theme: "cyber-theme-azul", accent: "#4c8dff" },
  { label: "Violeta", theme: "cyber-theme-violeta", accent: "#a879ff" },
  { label: "Magenta", theme: "cyber-theme-magenta", accent: "#ff4fa8" },
];
const current = () => COLORS.findIndex((c) => c.accent.toLowerCase() === (theme().accent ?? "").toLowerCase());

export default class Palette extends View {
  init(_props, cx) {
    this.at = Math.max(0, current());
    this.handle = cx.focus_handle();
    this.handle.focus();
    this.shown = !anim();
    if (!this.shown) cx.timer.after(16, () => { this.shown = true; cx.notify(); });
  }

  choose(i) {
    const c = COLORS[i];
    if (!c) return;
    closeOverlay(props()?.overlay);
    run("app.theme", { name: c.theme });
  }

  render() {
    const t = theme();
    const active = current();
    const bracket = () => div().absolute().size(8).border_color(t.accent);
    return v_flex()
      .id("palette")
      .track_focus(this.handle)
      .relative()
      .w_full()
      .min_h(0)
      .p(6)
      .text_size(13)
      .opacity(this.shown ? 1 : 0)
      .when(anim(), (el) => el.transition("opacity", { duration: 120 }))
      .child(W.paint_path(cutPath(CUT), t.accent).absolute().top(0).left(0).size_full())
      .child(W.paint_path(cutPath(CUT - 1), t.popover).absolute().top(1).left(1).right(1).bottom(1))
      .child(bracket().bottom(3).right(3).border_b(1).border_r(1))
      .on_key_down((e, cx) => {
        if (e.key === "down") this.at = (this.at + 1) % COLORS.length;
        else if (e.key === "up") this.at = (this.at + COLORS.length - 1) % COLORS.length;
        else if (e.key === "enter") return this.choose(this.at);
        else if (e.key === "escape") return closeOverlay(props()?.overlay);
        else return;
        cx.notify();
      })
      .child(h_flex().h(18).px(8).gap(6).items_center().flex_none()
        .child(div().font_family(MONO).text_size(9).text_color(t.dim).child("//01"))
        .child(div().font_family("Chakra Petch").font_semibold().text_size(9).text_color(t.dim).child("ACCENT COLOR")))
      .children(COLORS.map((c, i) => {
        const on = i === this.at;
        return h_flex()
          .id(`pc-${i}`)
          .h(28)
          .px(6)
          .gap(8)
          .rounded(0)
          .border_1()
          .border_color(on ? t.working : "#00000000")
          .items_center()
          .font_semibold()
          .text_color(t.foreground)
          .when(on, (el) => el.bg(t.working + "26"))
          .on_hover((h, cx) => { if (h && this.at !== i) { this.at = i; cx.notify(); } })
          .on_click(() => this.choose(i))
          .child(div().w(8).flex_none().text_size(10).text_color(t.working).child(on ? "▸" : ""))
          .child(div().size(12).flex_none().rounded(0).bg(c.accent).border_1().border_color(i === active ? t.foreground : c.accent))
          .child(div().flex_1().truncate().child(c.label))
          .child(div().flex_none().font_family(MONO).text_size(10).text_color(i === active ? t.accent : t.dim).child(i === active ? "ATIVO" : c.accent.toUpperCase()));
      }));
  }
}
