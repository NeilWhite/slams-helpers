import { Settings, MODULE } from "./config.js";

export const autoSelfEffectHook = async (item, config, options) => {
  if (!Settings.autoSelfEffect) return;
  if (!(item.effects.size)) return;
  const { rsr5e } = item.flags;
  if (!rsr5e) return;

  const isAltRoll = !!(config.isAltRoll ?? options.isAltRoll);

  const effects = item.effects.filter(({ flags: { dae }}, i) => {
    if (!dae || !dae?.selfTargetAlways || dae?.dontApply) return false;

    return (isAltRoll ? rsr5e.quickEffects.altValue : rsr5e.quickEffects.value)[i];
  }).map(i => i.id);

  if (effects?.length) {
    MODULE.log("Applying self effects", effects);

    await DAE.doEffects(item, true, [item.actor], {
      selfEffects: "selfEffectsAlways",
      effectsToApply: effects,
      ...config,
      ...options,
      spellLevel: item.system?.level ?? 0
    });
  }
};

