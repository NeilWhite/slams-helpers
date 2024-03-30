import { registerSettings, MODULE, L, Settings, libWrapper, CONFIG } from "./config.js";
import { MacroHelpers } from "./macro-helpers.js";
import { preCreateToken } from "./token-hooks.js";
import { autoSelfEffectHook } from "./use-item.js";
import { ActionTriggers } from "./trigger-actions.js";
import {
  customFlagsHandling,
  dnd5e_preRollDamage,
  dnd5e_actor_prepareTools,
  dnd5e_preRollHitDie,
  dnd5e_preRollSkill,
  dnd5e_preUseItem
} from "./flags.js";
import { dnd5e_renderChatMessage } from "./chat.js";

Hooks.on("setupTileActions", ActionTriggers.registerActions);

const configureFeats = () => {
  const makeFeat = (name, type) => ({
    name: L(`.feats.${name}.name`),
    hint: L(`.feats.${name}.hint`),
    section: L(".sections.feats"),
    type
  });

  const makeClassFeature = (name, type) => ({
    name: L(`.classFeatures.${name}.name`),
    hint: L(`.classFeatures.${name}.hint`),
    section: L(".sections.classFeatures"),
    type
  });



  Object.assign(CONFIG.DND5E.characterFlags, {
    piercer: makeFeat("piercer", Boolean),
    minHitDieRestore: makeFeat("minHitDieRestore", String),
    toolExpertise: makeClassFeature("toolExpertise", Boolean),
  });

  if (CONFIG.ActiveEffect.documentClass.FORMULA_FIELDS)
    CONFIG.ActiveEffect.documentClass.FORMULA_FIELDS.add(`flags.dnd5e.durable`);
}

Hooks.once("init", () => {
  registerSettings();

  if (Settings.vibeCheck) {
    CONFIG.DND5E.skills.vib = {
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
  CONFIG.DND5E.consumableTypes.conjuredEffect = L(".consumableTypes.conjuredEffect");
  CONFIG.DND5E.featureTypes.environmentalAction = { label: L(".featureTypes.environmentalActions") };

  configureFeats();

  // phb should be removed once I fix lim's game
  globalThis.phb = globalThis.SlamsHelpers = MacroHelpers

  Hooks.on("preCreateToken", preCreateToken);
  Hooks.on("dnd5e.useItem", autoSelfEffectHook);
  Hooks.on("dnd5e.preRollDamage", dnd5e_preRollDamage);
  Hooks.on("dnd5e.preRollHitDie", dnd5e_preRollHitDie);
  Hooks.on("dnd5e.preRollSkill", dnd5e_preRollSkill);
  Hooks.on("dnd5e.preUseItem", dnd5e_preUseItem);
  Hooks.on("dnd5e.renderChatMessage", dnd5e_renderChatMessage);

  if (libWrapper) {
    libWrapper.register(MODULE.name, "CONFIG.Actor.documentClass.prototype._prepareTools", dnd5e_actor_prepareTools, "WRAPPER");
  }
});



Hooks.on("ready", () => {
  MODULE.log("Ready!")
});
