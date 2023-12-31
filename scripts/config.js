export const MODULE = {
  get name() { return "slams-helpers" },
  get prefix() { return "SLAMS-HELPERS" },
  log: (...args) => console.log(`${MODULE.name} | `, ...args)
};

export const L = (locString) => game.i18n.localize(locString[0] === "." ? `${MODULE.prefix}${locString}` : locString);

const SETTINGS_NAMES = {
  AUTO_SELF_EFFECT: "autoSelfEffect",
  APPLY_MEASUREMENT_AURAS: "applyMeasurementAura",
  SET_TOKEN_VISION: "autoVision",
  VIBE_CHECK: "vibeCheck",
};

export const Settings = {
  get autoSelfEffect() { return game.settings.get(MODULE.name, SETTINGS_NAMES.AUTO_SELF_EFFECT); },
  get applyMeasurementAura() { return game.settings.get(MODULE.name, SETTINGS_NAMES.APPLY_MEASUREMENT_AURAS); },
  get autoVision() { return game.settings.get(MODULE.name, SETTINGS_NAMES.SET_TOKEN_VISION); },
  get vibeCheck() { return game.settings.get(MODULE.name, SETTINGS_NAMES.VIBE_CHECK); }
}

export const registerSettings = () => {
  game.settings.register(MODULE.name, SETTINGS_NAMES.AUTO_SELF_EFFECT, {
    name: "Auto Effects",
    hint: "Automatically apply 'self' targeted effects on cast (requires DAE and RSR5E)",
    scope: "world",
    type: Boolean,
    config: true,
    default: true,
    requiresReload: false
  });

  game.settings.register(MODULE.name, SETTINGS_NAMES.SET_TOKEN_VISION, {
    name: "Auto Token Vision",
    hint: "When creating a token from an actor, automatically set Token vision based off of current senses",
    scope: "world",
    type: Boolean,
    config: true,
    default: true,
    requiresReload: false
  });

  game.settings.register(MODULE.name, SETTINGS_NAMES.APPLY_MEASUREMENT_AURAS, {
    name: "Auto Aruas",
    hint: "Configure measurements to apply auras (requires ActiveAuras)",
    scope: "world",
    type: Boolean,
    config: true,
    default: true,
    requiresReload: false
  });

  game.settings.register(MODULE.name, SETTINGS_NAMES.VIBE_CHECK, {
    name: L(".setting.vibe.name"),
    hint: L(".setting.vibe.hint"),
    scope: "world",
    type: Boolean,
    config: true,
    default: false,
    requiresReload: true
  });
}
