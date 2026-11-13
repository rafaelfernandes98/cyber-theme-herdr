# cyber-theme

Visual próprio para o Herdr: tema + layout + mods. Base: cópia do **Cyber-Neon**
(tema `Cyber-Neon`, layout `Cyber-Neon`, mods `cyberneon-*`), renomeada para `cyber-theme`.

| Pasta | Conteúdo |
|---|---|
| `themes/cyber-theme.json` | paleta (terminal + `colors` da UI). Tem o nome do layout, então é o tema dele. |
| `layouts/cyber-theme.json` | estrutura da janela, fontes, `"theme": "cyber-theme"`, `"toast": "cyber-theme-toast"` |
| `themes/cyber-theme-<cor>.json` | cores pré-definidas que substituem o vermelho, geradas por `node tools/palettes.mjs` (não editar à mão) |
| `mods/cyber-theme-*` | agents, chrome, files, menu, new-menu, palette, pane, picker, radio, spaces, status, tabs, toast |
| `tools/palettes.mjs` | gera os temas de cor a partir de `themes/cyber-theme.json` |

Chaves de estado compartilhado usam o prefixo `cyber-theme.` (ex. `cyber-theme.animations`), separado do Cyber-Neon.

## Desenvolvimento

```sh
npm run dev            # instala no Herdr e fica observando: cada arquivo salvo é copiado e o Herdr recarrega
npm run install-theme  # só instala (sem observar)
npm run palettes       # regenera themes/cyber-theme-<cor>.json
```

O `dev` copia (não usa symlinks, que o watcher do Herdr não segue) só o que é do tema:
`themes/cyber-theme*.json`, `layouts/cyber-theme.json` e `mods/cyber-theme-*`. O sentido é único,
projeto → `~/.config/herdr-app`: edite sempre aqui. Mods apagados do projeto saem do Herdr na próxima instalação.

Para ver: `herdr-app do layout.switch '{"name":"cyber-theme"}'`.

Atalhos do layout ficam em `~/.config/herdr-app/keys.json`, seção `"layout:cyber-theme"`
(`cmd-p` picker, `ctrl-shift-←/→/m` rádio).

Referência: `~/.config/herdr-app/AGENTS.md` (seção "The look") e `herdr.d.ts`.

## Licença

MIT, veja [LICENSE](LICENSE). Exceções, que mantêm as licenças próprias:

- Fontes em `mods/cyber-theme-chrome/fonts/` (Chakra Petch, Rajdhani, Share Tech Mono): SIL Open Font License 1.1, textos ao lado de cada fonte.
- `mods/cyber-theme-files/` é adaptado do mod `files` do Herdr (Apache-2.0).
