import { registerSettings, MODULE, L, Settings, libWrapper } from "./config.js";
import { MacroHelpers } from "./macro-helpers.js";
import { preCreateToken } from "./token-hooks.js";
import { autoSelfEffectHook } from "./use-item.js";
import { ActionTriggers } from "./trigger-actions.js";
import {
  customFlagsHandling,
  dnd5e_preRollDamage,
  dnd5e_actor_prePrepareData
} from "./flags.js";

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

  const makeFeat = (name, type) => ({
    name: L(`.feats.${name}.name`),
    hint: L(`.feats.${name}.hint`),
    section: L("DND5E.Feats"),
    type
  });

  const makeClassFeature = (name, type) => ({
    name: L(`.classFeatures.${name}.name`),
    hint: L(`.classFeatures.${name}.hint`),
    section: L("DND5E.Feature.Class.Label"),
    type
  });

  Object.assign(globalThis.CONFIG.DND5E.characterFlags, {
    piercer: makeFeat("piercer", Boolean),
    // slasher: makeFeat("slasher", Boolean),
    // orcishFury: makeFeat("orcishFury",  Boolean),
    toolExpertise: makeClassFeature("toolExpertise", Boolean),
  });

  // phb should be removed once I fix lim's game
  globalThis.phb = globalThis.SlamsHelpers = MacroHelpers

  Hooks.on("dnd5e.useItem", autoSelfEffectHook);
  Hooks.on("preCreateToken", preCreateToken);
  Hooks.on("dnd5e.preRollDamage", dnd5e_preRollDamage);
  Hooks.on("dnd5e.actor.prePrepareData", dnd5e_actor_prePrepareData);


  if (libWrapper) {
    libWrapper.register(MODULE.name, "CONFIG.Actor.documentClass.prototype.prepareData", function (wrapper) {
      Hooks.call("dnd5e.actor.prePrepareData", this);
      wrapper();
      Hooks.call("dnd5e.actor.prepareData", this);
    }, "WRAPPER");
  }
});



Hooks.on("ready", () => {
  MODULE.log("Ready!")
});
