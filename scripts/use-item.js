import { Settings, MODULE } from "./config.js";

export const autoSelfEffectHook = async (item, config, options) => {
  if (!Settings.autoSelfEffect) return;
  if (!(item.effects.size)) return;

  const effects = item.effects.filter(({ flags: { dae }}, i) => {
    return (dae?.selfTargetAlways && !dae?.dontApply)
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

