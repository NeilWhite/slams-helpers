import { registerSettings, MODULE } from "./config.js";
import { MacroHelpers } from "./macro-helpers.js";
import { preCreateToken } from "./token-hooks.js";
import { measuredTemplateAuraHook, autoSelfEffectHook } from "./use-item.js";

Hooks.on("init", () => {
  MODULE.log("Initializing!");
  globalThis.CONFIG.DND5E.consumableTypes.conjuredEffect = "Conjured Effect";
  globalThis.CONFIG.DND5E.featureTypes.environmentalAction = { label: "Environmental Action" }

  // phb should be removed once I fix lim's game
  globalThis.phb = globalThis.SlamsHelpers = MacroHelpers

  Hooks.on("dnd5e.useItem", autoSelfEffectHook);
  Hooks.on("dnd5e.useItem", measuredTemplateAuraHook);
  Hooks.on("preCreateToken", preCreateToken);

  // Fix for Aura's getting stuck on
  Hooks.on("deleteActiveEffect", async (effect) => {
    if (effect.flags?.ActiveAuras?.isAura) {
      await globalThis.canvas.drawings.draw();
    }
  });

  registerSettings();
});

Hooks.on("ready", () => {
  MODULE.log("Ready!")
});
