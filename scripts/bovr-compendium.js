/**
 * BOVR Compendium Module
 *
 * Folder structure (built at runtime so it works across Foundry v11 & v12):
 *
 * BOVR Compendiums                        (#8B0000  deep red)
 * ├── BOVR - DND5E - Importer             (#1a3a6b  navy)
 * ├── BOVR - DND5e - Homebrew             (#4b0082  indigo)
 * ├── BOVR - DND5e - Aetherial Expanse    (#006080  teal)
 * └── BOVR - Pathfinder - Kingmaker       (#5a3000  brown)
 */

const MODULE_ID = "bovr-compendium";

// ─── Folder definitions ───────────────────────────────────────────────────────
// Each entry: { name, color, parent (name string | null), packs: [pack names] }
const FOLDER_TREE = [
  {
    name: "BOVR Compendiums",
    color: "#8B0000",
    parent: null,
    packs: []
  },
  {
    name: "BOVR - DND5E - Importer",
    color: "#1a3a6b",
    parent: "BOVR Compendiums",
    packs: [
      "ddbi-monsters",
      "ddbi-spells",
      "ddbi-classes",
      "ddbi-subclasses",
      "ddbi-class-features",
      "ddbi-races",
      "ddbi-racial-traits",
      "ddbi-feats",
      "ddbi-backgrounds",
      "ddbi-items",
      "ddbi-vehicles",
      "ddbi-tables",
      "ddbi-adventures",
      "ddbi-override"
    ]
  },
  {
    name: "BOVR - DND5e - Homebrew",
    color: "#4b0082",
    parent: "BOVR Compendiums",
    packs: [
      "hb-custom-class-features",
      "hb-custom-classes",
      "hb-custom-subclasses"
    ]
  },
  {
    name: "BOVR - DND5e - Aetherial Expanse",
    color: "#006080",
    parent: "BOVR Compendiums",
    packs: [
      "ae-scenes",
      "ae-npcs",
      "ae-monsters",
      "ae-custom-items"
    ]
  },
  {
    name: "BOVR - Pathfinder - Kingmaker",
    color: "#5a3000",
    parent: "BOVR Compendiums",
    packs: [
      "km-scenes",
      "km-npcs",
      "km-monsters",
      "km-custom-items"
    ]
  }
];

// ─── Boot ─────────────────────────────────────────────────────────────────────
Hooks.once("ready", async () => {
  if (!game.user.isGM) return;
  console.log(`${MODULE_ID} | Building BOVR compendium folder tree…`);
  await buildFolderTree();
});

Hooks.on("renderCompendiumDirectory", async () => {
  if (!game.user.isGM) return;
  await buildFolderTree();
});

// ─── Core logic ───────────────────────────────────────────────────────────────

/**
 * Walk FOLDER_TREE in order (parents always come before children),
 * create any missing CompendiumFolders, then assign packs.
 */
async function buildFolderTree() {
  // Map: folder name → CompendiumFolder document
  const folderMap = {};

  for (const def of FOLDER_TREE) {
    const parentFolder = def.parent ? folderMap[def.parent] ?? null : null;

    // Find an existing folder that matches name + parent
    let folder = game.folders.find(
      (f) =>
        f.type === "Compendium" &&
        f.name === def.name &&
        (f.folder?.id ?? null) === (parentFolder?.id ?? null)
    );

    if (!folder) {
      console.log(`${MODULE_ID} | Creating folder: "${def.name}"`);
      folder = await CompendiumFolder.create({
        name: def.name,
        type: "Compendium",
        color: def.color,
        sorting: "a",
        folder: parentFolder?.id ?? null
      });
    }

    folderMap[def.name] = folder;

    // Assign packs that belong to this folder
    for (const packName of def.packs) {
      const pack = game.packs.get(`${MODULE_ID}.${packName}`);
      if (!pack) {
        console.warn(`${MODULE_ID} | Pack not found: ${MODULE_ID}.${packName}`);
        continue;
      }
      if (pack.folder?.id === folder.id) continue; // already correct
      console.log(`${MODULE_ID} | Moving "${pack.metadata.label}" → "${def.name}"`);
      await pack.configure({ folder: folder.id });
    }
  }

  console.log(`${MODULE_ID} | Folder tree complete.`);
}
