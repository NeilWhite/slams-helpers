export const MODULE = {
  get name() { return "slams-helpers" },
  get prefix() { return "SLAMS-HELPERS" },
  log: (...args) => console.log(`${MODULE.name} | `, ...args)
};

export const CONFIG = globalThis.CONFIG;
export const libWrapper = globalThis.libWrapper;

export const L = (locString) => game.i18n.localize(locString[0] === "." ? `${MODULE.prefix}${locString}` : locString);

const SETTINGS_NAMES = {
  AUTO_SELF_EFFECT: ["autoSelfEffect", true],
  // APPLY_MEASUREMENT_AURAS: ["applyMeasurementAura", true],
  SET_TOKEN_VISION: ["autoVision", false],
  VIBE_CHECK: ["vibeCheck", false, true],
  CUSTOM_FLAG_HANDLING: ["customFlag", true],
  SMALLER_CHAT: ["smallerChat", true],
  OVERLAY_DEAD: ["overlayDead", true],
  GUN_SMITHING: ["gunSmithing", false, true]
};

export const Settings = {
  get autoSelfEffect() { return game.settings.get(MODULE.name, SETTINGS_NAMES.AUTO_SELF_EFFECT[0]); },
  // get applyMeasurementAura() { return game.settings.get(MODULE.name, SETTINGS_NAMES.APPLY_MEASUREMENT_AURAS[0]); },
  get autoVision() { return game.settings.get(MODULE.name, SETTINGS_NAMES.SET_TOKEN_VISION[0]); },
  get vibeCheck() { return game.settings.get(MODULE.name, SETTINGS_NAMES.VIBE_CHECK[0]); },
  get customFlag() { return game.settings.get(MODULE.name, SETTINGS_NAMES.CUSTOM_FLAG_HANDLING[0]); },
  get smallerChat() { return game.settings.get(MODULE.name, SETTINGS_NAMES.SMALLER_CHAT[0]); },
  get alwaysOverlayDead() { return game.settings.get(MODULE.name, SETTINGS_NAMES.OVERLAY_DEAD[0]); },
  get gunSmithing() { return game.settings.get(MODULE.name, SETTINGS_NAMES.GUN_SMITHING[0]); }
}


export const registerSettings = () => {
  for (const [k, [name, def, reload]] of Object.entries(SETTINGS_NAMES)) {
    game.settings.register(MODULE.name, name, {
      name: L(`.setting.${name}.name`),
      hint: L(`.setting.${name}.hint`),
      scope: "world",
      type: Boolean,
      config: true,
      default: def,
      requiresReload: !!reload
    });
  }
}
