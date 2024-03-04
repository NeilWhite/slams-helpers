import { registerSettings, MODULE, L, Settings } from "./config.js";
import { MacroHelpers } from "./macro-helpers.js";
import { preCreateToken } from "./token-hooks.js";
import { autoSelfEffectHook } from "./use-item.js";
import { ActionTriggers } from "./trigger-actions.js";
import { dnd5e_preRollDamage } from "./feats.js";

Hooks.on("setupTileActions", ActionTriggers.registerActions);


Hooks.once("init", () => {
  registerSettings();

  if (Settings.vibeCheck) {
    globalThis.CONFIG.DND5E.skills.vib = {
      label: L(".skills.vibe"),
      ability: "cha",
      fullkey: "vibe",
      reference: "Compendium.slams-helpers.journals.JournalEntry.YxW6DzkluQh4vWeQ.JournalEntryPage.LDa2BJ9CusjpjLgN",
      icon: "icons/skills/social/thumbsup-approval-like.webp"
    };
  }

  MODULE.log("Initializing!");
  globalThis.CONFIG.DND5E.consumableTypes.conjuredEffect = L(".consumableTypes.conjuredEffect");
  globalThis.CONFIG.DND5E.featureTypes.environmentalAction = { label: L(".featureTypes.environmentalActions") };
  globalThis.CONFIG.DND5E.characterFlags.piercer = { name: L(".feats.piercer.name"), hint: L(".feats.piercer.hint"), section: "Feats", type: Boolean };



  // phb should be removed once I fix lim's game
  globalThis.phb = globalThis.SlamsHelpers = MacroHelpers

  Hooks.on("dnd5e.useItem", autoSelfEffectHook);
  // Hooks.on("dnd5e.useItem", measuredTemplateAuraHook);
  Hooks.on("preCreateToken", preCreateToken);
  Hooks.on("dnd5e.preRollDamage", dnd5e_preRollDamage);
});



Hooks.on("ready", () => {
  MODULE.log("Ready!")
});
