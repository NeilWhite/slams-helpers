export const MODULE = {
  get name() { return "slams-helpers" },
  get prefix() { return "SLAMS-HELPERS" },
  log: (...args) => console.log(`${MODULE.name} | `, ...args)
};

export const CONFIG = globalThis.CONFIG;
export const libWrapper = globalThis.libWrapper;

export const L = (locString) => game.i18n.localize(locString[0] === "." ? `${MODULE.prefix}${locString}` : locString);

const SETTINGS_NAMES = {
  AUTO_SELF_EFFECT: "autoSelfEffect",
  APPLY_MEASUREMENT_AURAS: "applyMeasurementAura",
  SET_TOKEN_VISION: "autoVision",
  VIBE_CHECK: "vibeCheck",
  CUSTOM_FLAG_HANDLING: "customFlag",
  SMALLER_CHAT: "smallerChat",
};

export const Settings = {
  get autoSelfEffect() { return game.settings.get(MODULE.name, SETTINGS_NAMES.AUTO_SELF_EFFECT); },
  get applyMeasurementAura() { return game.settings.get(MODULE.name, SETTINGS_NAMES.APPLY_MEASUREMENT_AURAS); },
  get autoVision() { return game.settings.get(MODULE.name, SETTINGS_NAMES.SET_TOKEN_VISION); },
  get vibeCheck() { return game.settings.get(MODULE.name, SETTINGS_NAMES.VIBE_CHECK); },
  get customFlag() { return game.settings.get(MODULE.name, SETTINGS_NAMES.CUSTOM_FLAG_HANDLING); },
  get smallerChat() { return game.settings.get(MODULE.name, SETTINGS_NAMES.SMALLER_CHAT); }
}

export const registerSettings = () => {
  game.settings.register(MODULE.name, SETTINGS_NAMES.AUTO_SELF_EFFECT, {
    name: L(".setting.autoEffects.name"),
    hint: L(".setting.autoEffects.hint"),
    scope: "world",
    type: Boolean,
    config: true,
    default: true,
    requiresReload: false
  });

  game.settings.register(MODULE.name, SETTINGS_NAMES.SET_TOKEN_VISION, {
    name: L(".setting.autoVision.name"),
    hint: L(".setting.autoVision.hint"),
    scope: "world",
    type: Boolean,
    config: true,
    default: true,
    requiresReload: false
  });

  // game.settings.register(MODULE.name, SETTINGS_NAMES.APPLY_MEASUREMENT_AURAS, {
  //   name: "Auto Aruas",
  //   hint: "Configure measurements to apply auras (requires ActiveAuras)",
  //   scope: "world",
  //   type: Boolean,
  //   config: true,
  //   default: true,
  //   requiresReload: false
  // });

  game.settings.register(MODULE.name, SETTINGS_NAMES.VIBE_CHECK, {
    name: L(".setting.vibe.name"),
    hint: L(".setting.vibe.hint"),
    scope: "world",
    type: Boolean,
    config: true,
    default: false,
    requiresReload: true
  });

  game.settings.register(MODULE.name, SETTINGS_NAMES.CUSTOM_FLAG_HANDLING, {
    name: L(".setting.flagHandling.name"),
    hint: L(".setting.flagHandling.hint"),
    scope: "world",
    type: Boolean,
    config: true,
    default: true,
    requiresReload: true
  })

  game.settings.register(MODULE.name, SETTINGS_NAMES.SMALLER_CHAT, {
    name: L(".setting.smallerChat.name"),
    hint: L(".setting.smallerChat.hint"),
    scope: "client",
    type: Boolean,
    config: true,
    default: true
  })
}
