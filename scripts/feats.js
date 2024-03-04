
const isPiercing = (item, config) => {
  if (config.rollConfigs && config.rollConfigs.some(v => v.type === "piercing")) return true;
  if (item.system.damage.parts.some(v => v[1] === "piercing")) return true;
  return false;
}

export const dnd5e_preRollDamage = (item, config) => {
  if (item.actor.getFlag("dnd5e", "piercer")) {
     if (isPiercing(item, config)) {
      config.criticalBonusDice = (config.criticalBonusDice ?? 0) + 1;
    }
  }
}
