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

// Defined in order: parents before children
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
  // folderMap tracks created/found folders by name so children can reference parents
  const folderMap = {};

  for (const def of FOLDER_TREE) {
    const parentFolder = def.parent ? folderMap[def.parent] ?? null : null;

    // Search by name AND parent id so we don't mix up same-named folders
    let folder = game.folders.find(f =>
      f.type === "Compendium" &&
      f.name === def.name &&
      (f.folder?.id ?? null) === (parentFolder?.id ?? null)
    );

    if (!folder) {
      console.log(`${MODULE_ID} | Creating: "${def.name}" (parent: ${def.parent ?? "none"})`);
      folder = await CompendiumFolder.create({
        name: def.name,
        type: "Compendium",
        color: def.color,
        sorting: "a",
        folder: parentFolder?.id ?? null
      });
    } else if ((folder.folder?.id ?? null) !== (parentFolder?.id ?? null)) {
      // Folder exists but is in the wrong place — move it
      console.log(`${MODULE_ID} | Moving folder "${def.name}" to correct parent`);
      await folder.update({ folder: parentFolder?.id ?? null });
    }

    folderMap[def.name] = folder;

    // Assign packs into this folder
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
