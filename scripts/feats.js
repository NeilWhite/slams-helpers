export const dnd5e_preRollDamage = (item, config) => {
  if (item.actor.getFlag("dnd5e", "piercer")) {
    if (config.rollConfigs.some(v => v.type === "piercing")) config.criticalBonusDice = (config.criticalBonusDice ?? 0) + 1;
    console.log("pierce-daddy", { item, config });
  }
}
