# cyber-theme

Visual próprio para o Herdr: tema + layout + mods. Descrição completa em [RECIPE.md](RECIPE.md). Base: cópia do **Cyber-Neon**
(tema `Cyber-Neon`, layout `Cyber-Neon`, mods `cyberneon-*`), renomeada para `cyber-theme`.

| Pasta | Conteúdo |
|---|---|
| `themes/cyber-theme.json` | paleta (terminal + `colors` da UI). Tem o nome do layout, então é o tema dele. |
| `layouts/cyber-theme.json` | estrutura da janela, fontes, `"theme": "cyber-theme"`, `"toast": "cyber-theme-toast"` |
| `themes/cyber-theme-<cor>.json` | cores pré-definidas que substituem o vermelho, geradas por `node tools/palettes.mjs` (não editar à mão) |
| `mods/cyber-theme-*` | agents, chrome, files, menu, new-menu, palette, pane, picker, radio, spaces, status, tabs, toast |
| `tools/palettes.mjs` | gera os temas de cor a partir de `themes/cyber-theme.json` |

Chaves de estado compartilhado usam o prefixo `cyber-theme.` (ex. `cyber-theme.animations`), separado do Cyber-Neon.

## Instalação

Precisa do Herdr e do Node.js.

```sh
git clone https://github.com/rafaelfernandes98/cyber-theme-herdr.git
cd cyber-theme-herdr
npm run install-theme
herdr-app do layout.switch '{"name":"cyber-theme"}'
```

O `install-theme` copia o tema, o layout e os mods para `~/.config/herdr-app` (ou para `$HERDR_HOME`, se definido).
Para os atalhos, mescle o `keys.json` deste repositório no `~/.config/herdr-app/keys.json` (seção `"layout:cyber-theme"`).

Opcionais:

- **Rádio**: precisa de `python3` e `mpv`, e toca só as estações listadas em `~/.config/herdr-app/radio.json`
  (modelo em `mods/cyber-theme-radio/radio.example.json`).
- **Marcadores de issues/milestones no mapa**: precisam do `gh` logado. Sem ele, o mapa só não mostra os marcadores.

## Atualização

Não há atualização automática. Para pegar a versão nova:

```sh
cd cyber-theme-herdr
git pull
npm run install-theme
```

O Herdr recarrega os mods sozinho, sem reiniciar.

- **Edições locais se perdem**: tudo o que for do tema em `~/.config/herdr-app` (`themes/cyber-theme*.json`,
  `layouts/cyber-theme.json`, `mods/cyber-theme-*`) é apagado e recopiado do repositório. Para personalizar,
  edite no repositório, não na instalação.
- **Configurações ficam**: o que os mods guardam (cor de destaque escolhida, estado da rádio etc.) não é tocado.
- **Atalhos**: o `keys.json` não é reinstalado; só mescle de novo se uma versão mudar os atalhos.

### Atualizando pelo Claude (ou outro agente)

Peça ao agente:

> Atualize meu Cyber Theme seguindo o UPDATE.md de https://github.com/rafaelfernandes98/cyber-theme-herdr

O [UPDATE.md](UPDATE.md) é um guia para o agente. Ele mostra o que vai mudar antes de escrever, faz um backup,
substitui só os arquivos do tema (sem criar uma segunda cópia renomeada), mescla atalhos novos perguntando antes
de mudar os seus e confere tudo com `herdr-app check`. Serve também para quem instalou o tema pedindo a um agente.

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

Atalhos do layout: mescle o `keys.json` deste repositório no `~/.config/herdr-app/keys.json` (seção `"layout:cyber-theme"`)
(`cmd-p` picker, `ctrl-shift-←/→/m` rádio).

Referência: `~/.config/herdr-app/AGENTS.md` (seção "The look") e `herdr.d.ts`.

## Licença

MIT, veja [LICENSE](LICENSE). Exceções, que mantêm as licenças próprias:

- Fontes em `mods/cyber-theme-chrome/fonts/` (Chakra Petch, Rajdhani, Share Tech Mono): SIL Open Font License 1.1, textos ao lado de cada fonte.
- `mods/cyber-theme-files/` é adaptado do mod `files` do Herdr (Apache-2.0).
