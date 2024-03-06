import { MODULE, CONFIG } from "./config.js";

export const customFlagsHandling = (actor, change, current, delta, changes) => {
  const data = CONFIG.DND5E.characterFlags[change.key.replace("flags.dnd5e.", "")];
  if (!data) return;

  var rollData = actor.getRollData({ deterministic: true });
  const value = Roll.replaceFormulaData(change.value, rollData, { missing: 0 });

  if (data.type === Number) changes[change.key] = Number(value);
  if (data.type === Boolean) changes[change.key] = Boolean(value);
  if (data.type === String) changes[change.key] = value;
}

const hasDamageType = (type) => (item, config) => {
  if (config.rollConfigs && config.rollConfigs.some(v => v.type === "piercing")) return true;
  if (item.system.damage.parts.some(v => v[1] === "piercing")) return true;
  return false;
}

const isPiercing = hasDamageType("piercing");
const isBludgeoning = hasDamageType("bludgeoning");
const isSlashing = hasDamageType("slashing");

export const dnd5e_preRollDamage = (item, config) => {
  if (item.actor.getFlag("dnd5e", "piercer") && isPiercing(item, config)) {
    config.criticalBonusDice = (config.criticalBonusDice ?? 0) + 1;
  }
}

export const dnd5e_rollDamge = (item, config) => {
  MODULE.log("rollDamage", { item, config });
}

export const dnd5e_renderChatMessage = (message, html) => {
  MODULE.log("renderChatMessage", { message, html });
}

export const dnd5e_preDisplayCard = (item, chatData, options) => {
  MODULE.log("preDisplayCard", { item, chatData, options });
}

export const dnd5e_useItem = (item, config, options) => {
  MODULE.log("useItem", { item, config, options });
}
