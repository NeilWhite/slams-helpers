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
  var types = getDamageTypes(item, config);
  return types.includes(type);
}

const getDamageTypes = (item, config) => {
  // 3.x.x
  if (config.rollConfigs) return config.rollConfigs.map(v => v.type);
  // 2.4.x
  if (item.system.damage.parts) return item.system.damage.parts.map(v => v[1]).filter(v => !!v);
  return [];
}

const addDamage = (config, damage, type) => {
  if (config.rollConfigs) config.rollConfigs.push({ parts: [damage], type });
  else if (config.parts) config.parts.push(`${damage}`);
}

const isPiercing = hasDamageType("piercing");
const isBludgeoning = hasDamageType("bludgeoning");
const isSlashing = hasDamageType("slashing");

export const dnd5e_preRollDamage = (item, config) => {
  const { piercer } = item.actor.flags?.dnd5e ?? {};

  if (piercer && isPiercing(item, config)) {
    config.criticalBonusDice = (config.criticalBonusDice ?? 0) + 1;
  }
}

/**
 * seems like overrides aren't applied to flags before prepareData is called, so lets look there first
 */
const getFlagWithOverride = (document, scope, key) => {
  const override = getProperty(`overrides.flags.${scope}.${key}`)
  if (typeof(override) !== "undefined") return override;
  return document.getFlag(scope, key);
}

export const dnd5e_actor_prePrepareData = (actor) => {
  const toolExpertise = getFlagWithOverride(actor, "dnd5e", "toolExpertise");

  if (actor.system.tools) {
    for (const tool of Object.values(actor.system.tools)) {
      if (toolExpertise && tool.value === 1) tool.value = 2;
    }
  }
}
