import { registerSettings, MODULE, L, Settings } from "./config.js";
import { MacroHelpers } from "./macro-helpers.js";
import { preCreateToken } from "./token-hooks.js";
import { autoSelfEffectHook } from "./use-item.js";
import { ActionTriggers } from "./trigger-actions.js";

Hooks.on("setupTileActions", ActionTriggers.registerActions);

Hooks.once("init", () => {
  registerSettings();

  MODULE.log("Initializing!");
  globalThis.CONFIG.DND5E.consumableTypes.conjuredEffect = L(".consumableTypes.conjuredEffect");
  globalThis.CONFIG.DND5E.featureTypes.environmentalAction = { label: L(".featureTypes.environmentalActions") };

  if (Settings.vibeCheck) {
    globalThis.CONFIG.DND5E.skills.vib = { label: L(".skills.vibe"), ability: "cha", fullkey: "vibe" };
  }

  // phb should be removed once I fix lim's game
  globalThis.phb = globalThis.SlamsHelpers = MacroHelpers

  Hooks.on("dnd5e.useItem", autoSelfEffectHook);
  // Hooks.on("dnd5e.useItem", measuredTemplateAuraHook);
  Hooks.on("preCreateToken", preCreateToken);
});

Hooks.on("ready", () => {
  MODULE.log("Ready!")
});
