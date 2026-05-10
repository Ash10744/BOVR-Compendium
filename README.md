# BOVR Compendiums

A FoundryVTT module providing all BOVR shared compendium packs, automatically
organised into a nested folder tree in the Compendium sidebar.

---

## Folder Structure

```
BOVR Compendiums                        (deep red)
├── BOVR - DND5E - Importer             (navy)
│   ├── [BOVR-DDBI-DND5e] Monsters
│   ├── [BOVR-DDBI-DND5e] Spells
│   ├── [BOVR-DDBI-DND5e] Classes
│   ├── [BOVR-DDBI-DND5e] Subclasses
│   ├── [BOVR-DDBI-DND5e] Class Features
│   ├── [BOVR-DDBI-DND5e] Races
│   ├── [BOVR-DDBI-DND5e] Racial Traits
│   ├── [BOVR-DDBI-DND5e] Feats
│   ├── [BOVR-DDBI-DND5e] Backgrounds
│   ├── [BOVR-DDBI-DND5e] Items
│   ├── [BOVR-DDBI-DND5e] Vehicles
│   ├── [BOVR-DDBI-DND5e] Tables
│   ├── [BOVR-DDBI-DND5e] Adventures
│   └── [BOVR-DDBI-DND5e] Override
│
├── BOVR - DND5e - Homebrew             (indigo)
│   ├── [BOVR-HB-DND5e] Custom Class Features
│   ├── [BOVR-HB-DND5e] Custom Classes
│   └── [BOVR-HB-DND5e] Custom Subclasses
│
├── BOVR - DND5e - Aetherial Expanse    (teal)
│   ├── [BOVR-AE-DND5e] Scenes
│   ├── [BOVR-AE-DND5e] NPCs
│   ├── [BOVR-AE-DND5e] Monsters
│   └── [BOVR-AE-DND5e] Custom Items
│
└── BOVR - Pathfinder - Kingmaker       (brown)
    ├── [BOVR-KM-Pathfinder] Scenes
    ├── [BOVR-KM-Pathfinder] NPCs
    ├── [BOVR-KM-Pathfinder] Monsters
    └── [BOVR-KM-Pathfinder] Custom Items
```

---

## Installation

1. Extract the zip into `Data/modules/bovr-compendium/`
2. Restart Foundry VTT
3. Enable **BOVR Compendiums** in your world's Module Management

The folder tree is built automatically on load (GM only).

---

## Adding a new pack

1. Add the pack entry to the `packs` array in `module.json`
2. Add its `name` to the correct `packs` array under `packFolders` in `module.json`
3. Add the same name to the matching `packs` array in the `FOLDER_TREE` inside `scripts/bovr-compendium.js`
4. Restart or reload the module

## Adding a new sub-folder

Add a new entry to `FOLDER_TREE` in `scripts/bovr-compendium.js` with
`parent: "BOVR Compendiums"` (or whichever parent folder you want).
The script will create it automatically on next load.

---

## Compatibility

| Foundry | Status |
|---------|--------|
| v11     | ✅ Supported |
| v12     | ✅ Verified  |

---

## Pack editing

Module packs are locked by default. To add/edit content:
- Right-click the pack in the Compendium sidebar → **Toggle Edit Lock**
- Make your changes
- Lock it again when done

Changes write to `Data/modules/bovr-compendium/packs/` and are shared
across all worlds on the same Foundry server automatically.
