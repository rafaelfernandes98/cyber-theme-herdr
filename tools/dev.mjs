// Instala o Cyber Theme no Herdr como cópias reais e mantém sincronizado enquanto roda.
// O watcher do Herdr não segue symlinks, então copiar é o que faz o hot reload funcionar.
//
//   node tools/dev.mjs          instala e fica observando (Ctrl+C para sair)
//   node tools/dev.mjs --once   só instala
//
// Gerencia apenas: themes/cyber-theme*.json, layouts/cyber-theme.json, mods/cyber-theme-*.
// Sentido único (projeto → Herdr): o que for editado direto em ~/.config/herdr-app é sobrescrito.
import { watch } from "node:fs";
import { cp, lstat, mkdir, readdir, rename, rm, copyFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const SRC = fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");
const DEST = process.env.HERDR_HOME ?? join(homedir(), ".config", "herdr-app");
const once = process.argv.includes("--once");
const log = (...a) => console.log(new Date().toTimeString().slice(0, 8), ...a);

// Caminho relativo ao projeto que pertence ao tema (o resto do repositório não vai para o Herdr).
const managed = (rel) => {
  const [top, name] = rel.split(sep);
  if (!name) return false;
  if (top === "themes") return /^cyber-theme(-[a-z0-9-]+)?\.json$/.test(name);
  if (top === "layouts") return name === "cyber-theme.json";
  if (top === "mods") return name.startsWith("cyber-theme-") && !rel.split(sep).includes("node_modules");
  return false;
};

const exists = (p) => lstat(p).then((s) => s, () => null);

// Arquivo novo vai para um nome oculto e é renomeado: o Herdr ignora ocultos, então recarrega uma vez só.
async function put(rel) {
  const from = join(SRC, rel), to = join(DEST, rel);
  await mkdir(dirname(to), { recursive: true });
  const tmp = join(dirname(to), `.${rel.split(sep).pop()}.dev-tmp`);
  await copyFile(from, tmp);
  await rename(tmp, to);
}

async function install() {
  const items = [];
  for (const top of ["themes", "layouts", "mods"]) {
    for (const name of await readdir(join(SRC, top)).catch(() => [])) {
      if (managed(join(top, name))) items.push(join(top, name));
    }
  }
  for (const rel of items) {
    const to = join(DEST, rel), st = await exists(to);
    if (st?.isSymbolicLink()) await rm(to); // symlink antigo: troca por cópia real
    else if (st?.isDirectory()) await rm(to, { recursive: true }); // cópia antiga: refaz do zero (leva junto arquivos apagados)
    await cp(join(SRC, rel), to, { recursive: true, filter: (p) => !p.split(sep).includes("node_modules") });
  }
  // Mods/temas que saíram do projeto também saem do Herdr.
  for (const top of ["themes", "mods"]) {
    for (const name of await readdir(join(DEST, top)).catch(() => [])) {
      const rel = join(top, name);
      if (managed(rel) && !items.includes(rel)) { await rm(join(DEST, rel), { recursive: true, force: true }); log("removido", rel); }
    }
  }
  log(`instalado: ${items.length} itens em ${DEST}`);
}

async function sync(rel) {
  if (!managed(rel) || rel.split(sep).pop().startsWith(".")) return;
  const st = await exists(join(SRC, rel));
  if (!st) { await rm(join(DEST, rel), { recursive: true, force: true }); log("apagado ", rel); return; }
  if (st.isDirectory()) { await cp(join(SRC, rel), join(DEST, rel), { recursive: true }); log("copiado ", rel + "/"); return; }
  await put(rel);
  log("copiado ", rel);
}

await install();
if (once) process.exit(0);

// Editores salvam em rajadas (tmp + rename): espera 80ms de silêncio por arquivo.
const timers = new Map();
watch(SRC, { recursive: true }, (_event, file) => {
  if (!file) return;
  const rel = relative(SRC, join(SRC, file.toString()));
  if (!managed(rel)) return;
  clearTimeout(timers.get(rel));
  timers.set(rel, setTimeout(() => {
    timers.delete(rel);
    sync(rel).catch((e) => log("erro    ", rel, e.message));
  }, 80));
});
log("observando", SRC, "(Ctrl+C para sair)");
