# Cyber Theme

A dark cyberpunk HUD for Herdr: a red-accented sidebar whose spaces are drawn as points on a
procedurally generated city map, square chips with 45° cut corners everywhere, yellow and cyan
status marks that blink, breathe and scan, a typed `Cyber Theme` wordmark with an RGB-split glitch,
a status readout with a built-in radio, and a color button that swaps the red for one of eight accents.

![Cyber Theme](preview.png)

## What you see

Left to right, then top to bottom. Window background: gradient `#0a0b0f` → `#05060a` at 170°,
1px `border` dividers, no title bar.

- **Sidebar** (340px, `chrome` `#140c15`, rail mode under 160px):
  - **Brand** (46px): `Cyber Theme` in Rajdhani Bold 19px `accent`, `v0.4` in Share Tech Mono 10px `dim`, a
    14-bar barcode, the data line `SYS//0x7F3A  NODE//<machines>` (Share Tech Mono 9px `dim` at 0.7), then
    square 26px search and sidebar-fold buttons. A 4px yellow hazard band with dark slashes runs along its bottom edge.
  - **Spaces map** (weight 1): sea `#0a1220`, one landmass per machine (`#151822`) with a noisy coast, a river with
    bridges, roads and highways (`working` at 0.6), and suburb blocks. Each space is a 7px diamond inside a ring
    split into one arc per agent, colored by state; the active space adds an `accent` ring and corner brackets.
    Each point has a yellow tag (`NN NAME`, then `▲blocked ●working ○idle · branch · ◆milestones◇issues`) on a
    leader line. Under each machine header, a two-column legend `01 — name`. Header `SPACES` with a `+`.
  - **Agents** (weight 1): sections numbered `//01`, `//02` with a 1px `border` rule and a 24px `accent` lead;
    rows with a 3px left bar in the state color, times in Share Tech Mono `dim`.
  - **Footer** (69px): `SETTINGS` and `ADD MACHINE` (Chakra Petch 600 12px caps, 18px square icon boxes) and the
    `ANIM ON` / `ANIM OFF` chip.
- **Tab bar** (42px, `chrome`): tabs are 28px chips (Chakra Petch 600 12px) with a 6px top-left cut; active =
  `selected` fill, `accent` cut outline, 2px yellow bottom line. Then square 26px buttons: `+`, Files, Changes and
  the **accent color** button (a 12px square in the current `accent`).
- **Main** (padding 8, gap 8): the active tab's panes, square, 1px `border`, `working` (cyan) border when focused,
  terminal background `#0a1220`, JetBrains Mono 14, padding 14×12. Each pane has a 30px header: 3px state strip,
  7px `accent` notch, name (Rajdhani Bold 13), folder, branch, `0x01F // P1` label, state chip, and hover buttons.
- **Side panel** (368px, 280–900): a stack of Files (file tree + previews) and Herdr's Changes.
- **Status bar** (28px): `NET//OK` tag (`accent`, 9px cut), then `▮`-separated Share Tech Mono 11px segments:
  machine, branch, `N AGENTS`, one 6×6 square + count per state, palette hint, clock `HH:MM`. At the right, a 196px
  `RADIO OFF` / station chip.

Colors (theme `cyber-theme`): accent `#f44638`, border `#7a2a28`, muted `#e0645a`, dim/idle `#b04a40`,
hover `#2a1418`, selected/selection `#4a1d1f`, raised/popover `#1c1220`, foreground `#e8e1d9`,
working/cursor `#5ef6ff`, done/solid `#fcee0a`, blocked `#ff003c`.

## How it behaves

- **Agent states** (agents list, pane headers, tabs, map, status bar):
  - working: cyan; `EXEC` chip with a `▰▱▱` data bar (`.frames`, 110ms); on the map the diamond breathes.
  - blocked: hot red; `INPUT REQ` chip with slashed stripes and a hard blink (opacity −6→7, 900ms linear).
  - done: yellow; `COMPLETE` chip that breathes 0.6→1 over 1400ms.
  - idle: a 6×6 hollow square; `STANDBY` in pane headers.
- **Accent color**: the tab-bar color button opens a popup (200×270) with eight colors: Vermelho, Laranja, Âmbar,
  Verde, Ciano, Azul, Violeta, Magenta. ↑/↓ or hover move, Enter or click applies it with `app.theme`, Esc closes.
  The current one says `ATIVO`. Accent, borders, muted/dim text, hover, selection and chrome tint change;
  the terminal background, ANSI colors and the status colors stay.
- **Map**: click a point or legend row to select its space, right-click for the space menu. Hovering a point for
  300ms opens a card with every agent in that space (blocked first, sub-agents indented); click a row to
  `agent.focus`. Scrolling keeps its position.
- **Agents list**: hovering a row for 400ms opens a `SCAN // 0x01F` card with class, status, uptime, turns, path,
  branch, `//TELEMETRY` (model, context, 5H and 7D usage bars read from the agent's own status line) and a 5-segment
  threat bar.
- **Tabs**: a new or renamed tab title decodes from noise glyphs over 300ms. Drag to reorder, double-click to
  rename, right-click for the menu, scroll wheel to switch.
- **Panes**: a new pane gets a one-time cyan scan sweep across its header.
- **Brand**: the wordmark types itself once per app start, then two offset copies (cyan and red) flicker
  behind it for ~100ms every 3s.
- **Toasts**: cut-corner cards that slide in and flicker once, tagged `TASK COMPLETE`, `INPUT REQUIRED`,
  `ERROR` or `NOTICE`.
- **Menus and picker**: cut-corner popups that fade in over 120–150ms; the selected row is a cyan band with `▸`.
- **Keys** (`keys.json`, `layout:cyber-theme`): `cmd-p` opens the tab picker; `ctrl-shift-→` / `ctrl-shift-←`
  next/previous radio station; `ctrl-shift-m` mute.
- **ANIM OFF** stops every blink, breathe, sweep, decode, typing and fade at once.

## Built from

- `layouts/cyber-theme.json`: root `row` → `sidebar` column [`brand` block, `sidebar-lists` column
  [`spaces`, `agents`], `sidebar-footer` block] and `work` column [`tabs` block, `work-body` row [`main`
  (`tab: active` with the pane frame and `cyber-theme-pane` header), `panel` column → `panel-body` stack
  [`files`, `changes`]], `status` row [`status-readout`, `radio`]]. Root also sets `theme`, `font`, `ui_font`,
  `terminal_padding` and `"toast": "cyber-theme-toast"`.
- Mods: `cyber-theme-chrome` (brand; `props.footer` for the footer), `-spaces` (map), `-agents`, `-tabs`,
  `-pane`, `-files`, `-status`, `-radio`, `-toast`, `-menu` (right-click menus), `-new-menu` (the `+` menu),
  `-picker`, `-palette` (accent popup). Shipped mods used: `changes`, plus icons from `files`, `pane`,
  `workspace-chrome`.
- Themes: `themes/cyber-theme.json` (the red) and `themes/cyber-theme-<color>.json`, generated by
  `tools/palettes.mjs` with fixed accent/background ratios measured on the red.
- Fonts in `mods/cyber-theme-chrome/fonts/`: Chakra Petch, Rajdhani, Share Tech Mono (OFL).
- `herdr` API: `spaces`, `panes`, `agents`, `terminals`, `focused`, `machines`, `theme`, `shared`/`setShared`
  (prefix `cyber-theme.`), `openOverlay`/`closeOverlay`, `run`, `exec`, `hc`, `readTextFile`, `watchFolder`,
  `knownAgents`. Commands: `app.theme`, `agent.focus`, `layout.select`/`show`/`hide`, `space.new`, `tab.*`,
  `pane.*`, `window.*`, `app.palette`, `app.settings`.
- Programs it runs: `git` (read-only: remote, branch, status), `gh api graphql` (read-only open issue and
  milestone counts for the map, at most every 10 min per repo), `hc read` (agent telemetry on hover),
  `python3` + `mpv` (radio).
- Art: all geometry is generated from the spaces' names and data; no images.

## Watch out

- `.frames` runs on one clock shared by every view, with an unknown phase: a padded one-shot frame list usually
  shows nothing. One-shot motion (typing, title decode, sweeps) uses `.transition` on a target changed after first
  layout instead.
- Building the map terrain inside `render` gets the view interrupted (the mod engine is much slower than node).
  Builds run as queued jobs, one per timer tick.
- `flex_shrink()` needs a number; `herdr-app check` passes without it but the live render throws.
- `.line_height(22)` is read as a multiplier and hides the text.
- `init`'s first argument does not carry layout props: read `props()`.
- The radio needs `python3` and `mpv` and plays only what the person lists in `~/.config/herdr-app/radio.json`
  (see `mods/cyber-theme-radio/radio.example.json`); nothing ships or plays at startup.
- The map and pane telemetry read GitHub (`gh`) and the agent's screen (`hc read`), read-only. Without `gh` login,
  the map simply shows no issue/milestone markers.
- Herdr's file watcher does not follow symlinks: install with copies (`npm run install-theme`), or edits won't
  hot reload.
- The accent presets appear in Herdr's global theme picker too. Ciano is close to the working cyan and Âmbar to
  the done yellow.
- Limits: map rings show up to 12 agent arcs; the space hover card lists 12 agents then `+n MORE`; the file tree
  stops at 500 entries per folder and 5000 in total.

## Done when

- `node tools/dev.mjs --once` installs; `herdr-app check` passes for every `mods/cyber-theme-*`;
  `herdr-app do layout.switch '{"name":"cyber-theme"}'` shows it and `herdr-app status` lists no errors.
- The brand reads `Cyber Theme` and types itself after a mod reload.
- Every space appears as a point with a tag on the map; clicking one selects that space.
- A working agent shows the cyan `EXEC` bar in its pane header, tab and agents row; a blocked one blinks red.
- The color button opens the popup; choosing Azul turns borders and accents blue, and Vermelho brings back
  `#f44638`.
- Files and Changes toggle the side panel; `cmd-p` opens the picker.
- `ANIM OFF` stops every animation; `ANIM ON` brings them back.
- `node mods/cyber-theme-spaces/districts.check.mjs`, `node mods/cyber-theme-agents/telemetry.check.mjs` pass.
