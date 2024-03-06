import { registerSettings, MODULE, L, Settings } from "./config.js";
import { MacroHelpers } from "./macro-helpers.js";
import { preCreateToken } from "./token-hooks.js";
import { autoSelfEffectHook } from "./use-item.js";
import { ActionTriggers } from "./trigger-actions.js";
import { customFlagsHandling, dnd5e_preRollDamage} from "./flags.js";

Hooks.on("setupTileActions", ActionTriggers.registerActions);

Hooks.once("init", () => {
  registerSettings();

  if (Settings.vibeCheck) {
    globalThis.CONFIG.DND5E.skills.vib = {
      label: L(".skills.vibe"),
      ability: "cha",
      fullkey: "vibe",
      reference: `Compendium.${MODULE.name}.journals.JournalEntry.YxW6DzkluQh4vWeQ.JournalEntryPage.LDa2BJ9CusjpjLgN`,
      icon: "icons/skills/social/thumbsup-approval-like.webp"
    };
  }

  if (Settings.customFlag) {
    Hooks.on("applyActiveEffect", customFlagsHandling);
  }

  MODULE.log("Initializing!");
  globalThis.CONFIG.DND5E.consumableTypes.conjuredEffect = L(".consumableTypes.conjuredEffect");
  globalThis.CONFIG.DND5E.featureTypes.environmentalAction = { label: L(".featureTypes.environmentalActions") };

  const makeFeat = (name, section, type) => ({
    name: L(`.feats.${name}.name`),
    hint: L(`.feats.${name}.hint`),
    section: L(section),
    type
  });

  Object.assign(globalThis.CONFIG.DND5E.characterFlags, {
    piercer: makeFeat("piercer", "DND5E.Feats", Boolean),
    // slasher: makeFeat("slasher", "DND5E.Feats", Boolean),
    // orcishFury: makeFeat("orcishFury", "DND5E.Feats", Boolean)
  });

  // phb should be removed once I fix lim's game
  globalThis.phb = globalThis.SlamsHelpers = MacroHelpers

  Hooks.on("dnd5e.useItem", autoSelfEffectHook);
  Hooks.on("preCreateToken", preCreateToken);
  Hooks.on("dnd5e.preRollDamage", dnd5e_preRollDamage);
});



Hooks.on("ready", () => {
  MODULE.log("Ready!")
});
