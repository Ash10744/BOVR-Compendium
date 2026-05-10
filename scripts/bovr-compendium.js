/**
 * BOVR Compendium Module
 *
 * Target structure:
 * BOVR Compendiums
 * ├── BOVR - DND5e
 * │   ├── BOVR - DND5E - Importer
 * │   ├── BOVR - DND5e - Homebrew
 * │   ├── BOVR - DND5e - Aetherial Expanse
 * │   └── BOVR - DND5e - Grim Hollow
 * └── BOVR - Pathfinder
 *     └── BOVR - Pathfinder - Kingmaker
 */

const MODULE_ID = "bovr-compendium";

const FOLDER_TREE = [
  {
    name: "BOVR Compendiums",
    color: "#8B0000",
    parent: null,
    packs: []
  },
  {
    name: "BOVR - DND5e",
    color: "#7b2d00",
    parent: "BOVR Compendiums",
    packs: []
  },
  {
    name: "BOVR - DND5E - Importer",
    color: "#1a3a6b",
    parent: "BOVR - DND5e",
    packs: [
      "ddbi-monsters", "ddbi-spells", "ddbi-classes", "ddbi-subclasses",
      "ddbi-class-features", "ddbi-races", "ddbi-racial-traits", "ddbi-feats",
      "ddbi-backgrounds", "ddbi-items", "ddbi-vehicles", "ddbi-tables",
      "ddbi-adventures", "ddbi-override"
    ]
  },
  {
    name: "BOVR - DND5e - Homebrew",
    color: "#4b0082",
    parent: "BOVR - DND5e",
    packs: ["hb-custom-class-features", "hb-custom-classes", "hb-custom-subclasses"]
  },
  {
    name: "BOVR - DND5e - Aetherial Expanse",
    color: "#006080",
    parent: "BOVR - DND5e",
    packs: ["ae-scenes", "ae-npcs", "ae-monsters", "ae-custom-items"]
  },
  {
    name: "BOVR - DND5e - Grim Hollow",
    color: "#2d0a0a",
    parent: "BOVR - DND5e",
    packs: ["gh-monsters", "gh-scenes", "gh-npcs", "gh-custom-items"]
  },
  {
    name: "BOVR - Pathfinder",
    color: "#5a3000",
    parent: "BOVR Compendiums",
    packs: []
  },
  {
    name: "BOVR - Pathfinder - Kingmaker",
    color: "#5a3000",
    parent: "BOVR - Pathfinder",
    packs: ["km-scenes", "km-npcs", "km-monsters", "km-custom-items"]
  }
];

Hooks.once("ready", async () => {
  if (!game.user.isGM) return;
  console.log(`${MODULE_ID} | Building BOVR compendium folder tree...`);
  await buildFolderTree();
});

Hooks.on("renderCompendiumDirectory", async () => {
  if (!game.user.isGM) return;
  await buildFolderTree();
});

async function buildFolderTree() {
  const folderMap = {};

  // Pass 1: create any missing folders (all at root for now)
  for (const def of FOLDER_TREE) {
    let folder = game.folders.find(f =>
      f.type === "Compendium" && f.name === def.name
    );
    if (!folder) {
      console.log(`${MODULE_ID} | Creating folder: "${def.name}"`);
      folder = await CompendiumFolder.create({
        name: def.name,
        type: "Compendium",
        color: def.color,
        sorting: "a",
        folder: null
      });
    }
    folderMap[def.name] = folder;
  }

  // Pass 2: set correct parent on every folder that needs one
  for (const def of FOLDER_TREE) {
    if (!def.parent) continue;
    const folder = folderMap[def.name];
    const parentFolder = folderMap[def.parent];
    if (!parentFolder) continue;
    if ((folder.folder?.id ?? null) !== parentFolder.id) {
      console.log(`${MODULE_ID} | Nesting "${def.name}" under "${def.parent}"`);
      await folder.update({ folder: parentFolder.id });
    }
  }

  // Pass 3: assign packs to their folders
  for (const def of FOLDER_TREE) {
    if (!def.packs.length) continue;
    const folder = folderMap[def.name];
    for (const packName of def.packs) {
      const pack = game.packs.get(`${MODULE_ID}.${packName}`);
      if (!pack) {
        console.warn(`${MODULE_ID} | Pack not found: ${packName}`);
        continue;
      }
      if (pack.folder?.id === folder.id) continue;
      console.log(`${MODULE_ID} | Moving pack "${pack.metadata.label}" -> "${def.name}"`);
      await pack.configure({ folder: folder.id });
    }
  }

  console.log(`${MODULE_ID} | Done.`);
}
