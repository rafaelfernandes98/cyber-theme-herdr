# Updating Cyber Theme

A brief for an agent asked to update an installed Cyber Theme to the latest version of this repository
(<https://github.com/rafaelfernandes98/cyber-theme-herdr>). It replaces the files of the theme already
installed; it does not add a second copy.

This overrides one rule of Herdr's guide to layouts other people made (`AGENTS.md`, "Never overwrite: if a
name is taken, rename the new one"): that rule protects a *different* layout or mod that happens to share a
name. An update replaces the same theme's own files, so they are overwritten, never renamed.

## What the theme owns

Paths relative to the Herdr home (`$HERDR_HOME`, else `~/.config/herdr-app`):

- `themes/cyber-theme.json` and `themes/cyber-theme-<color>.json` (the accent colors)
- `layouts/cyber-theme.json`
- `mods/cyber-theme-*/` (one folder per mod)

Nothing else is the theme's. Never touch:

- `data/` (what the mods store: radio settings, map caches and so on)
- `keys.json` (the person's shortcuts; see step 6)
- `radio.json` (the person's radio stations)
- Herdr's settings, which hold the accent color the person chose (`app.theme`). Don't switch the theme or the layout.

From the repository, copy only the three paths above. Leave out `README.md`, `RECIPE.md`, `UPDATE.md`,
`LICENSE`, `package.json`, `tools/`, `keys.json` and anything matched by `.gitignore` (`*.d.ts`: Herdr writes
`gpui-kit.d.ts` into each mod folder and recreates it on load).

## Steps

1. **Find the install.** Look in the Herdr home for `layouts/cyber-theme.json` and `mods/cyber-theme-*`.
   If they are missing, look for a layout whose blocks use mods such as `cyber-theme-spaces` or
   `cyber-theme-chrome` under another name: an agent that installed it may have renamed it to dodge a name
   clash (e.g. `cyber-theme-2`). If you find a renamed install, keep the person's names: apply the same
   renames to the new files (file and folder names, the `mod` names in the layout, `"theme"` in the layout,
   and every `mods/<name>/` path inside the mods). If there is no install at all, stop and say so: this is
   for updating, and installing is in the README.

2. **Get the latest version.** If the person has a clone of this repository (ask, or look for a folder whose
   `git remote get-url origin` is this repository), run `git status` there first. Uncommitted changes in it are
   the person's own edits: stop and ask before pulling. Otherwise `git pull`. With no clone, clone it into a
   new temporary folder.

3. **Tell the person what changes before writing anything.**
   - Commits since their version, if you can tell (a clone's `git log` before and after the pull).
   - A diff of the installed files against the new ones (`diff -r`, ignoring `*.d.ts`). Point out
     differences that look like the person's own edits in the install, not upstream changes: they will be
     lost. Updating an install edited by hand needs the person's yes.
   - Like Herdr's guide asks: whether any mod newly reaches the network, runs programs (`exec`, `hc`) or
     reads files outside its own folder. Today the theme runs `git` and `gh api graphql` (read-only),
     `hc read`, `python3` and `mpv` (radio); mention only what is new.

4. **Back up** the installed theme files (the paths from "What the theme owns") to a new folder *outside*
   the Herdr home, e.g. `~/cyber-theme-backup-<YYYYMMDD-HHMM>/`. Inside the Herdr home, the backup would be
   loaded as more mods.

5. **Replace.**
   - With a clone and no renames: `npm run install-theme` in it does exactly this step (it deletes and
     recopies each theme path and removes theme mods and colors that no longer exist upstream). It honors
     `HERDR_HOME`.
   - Otherwise, by hand: for each `mods/cyber-theme-*` folder in the repository, delete the installed folder
     and copy the new one (copies, not symlinks: Herdr's watcher doesn't follow symlinks). Copy
     `layouts/cyber-theme.json` and `themes/cyber-theme*.json` over the installed ones. Delete installed
     `mods/cyber-theme-*` folders and `themes/cyber-theme-*.json` files the repository no longer has.

6. **Keys.** Compare the repository's `keys.json` (section `"layout:cyber-theme"`) with the person's
   `keys.json`. Add new keys in that section; ask before changing a key the person already has. An edited
   `keys.json` is entirely the person's, so don't rewrite it, only merge.

7. **Check.** Herdr hot reloads the files; no restart. Then:
   - `herdr-app check <Herdr home>/mods/<name>` for every theme mod: all pass.
   - `herdr-app status`: no errors from the theme's files or mods.

   If something fails, say what, and offer to restore the backup from step 4.

8. **Report**: the version installed (the commit, `git rev-parse --short HEAD`), what changed for the person,
   what you merged into `keys.json`, and where the backup is. The backup can be deleted once they're happy.
