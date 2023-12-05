import ModuleJson from "../module.json" assert { type: "json" };

const stripFlags = [
  "ddbimporter",
  "midiProperties",
  "midi-qol",
  "obsidian",
  "scene-packer",
  "exportSource"
];

const cleanFlags = (flags) => {
  for (const flagName of stripFlags) {
    if (flags[flagName]) delete flags[flagName];
  }
};

const stripSpecial = (input) => input.replace(/\u2060/gu, "").replace(/[‘’]/gu, "'").replace(/[“”]/gu, '"');

const cleanStats = (stats) => {
  stats.lastModifiedBy = "SlamsHelpers0123";
};

const cleanSystem = (system) => {
  if (system.description?.value) system.description.value = stripSpecial(system.description.value);
  if (system.materials?.value) system.materials.value = stripSpecial(system.materials.value);
  system.source = {
    custom: ModuleJson.title,
    license: "MIT"
  }
}

// eslint-disable-next-line no-unused-vars
export const clean = (packType) => (entry) => {
  if (entry.flags) cleanFlags(entry.flags);
  if (entry._stats) cleanStats(entry._stats);
  if (entry.system) cleanSystem(entry.system);
};
