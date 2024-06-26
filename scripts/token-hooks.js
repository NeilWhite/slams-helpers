import { Settings } from "./config.js";

export const preCreateToken = async (token, data, options, userId) => {
  if (!Settings.autoVision) return;

  const senses = token.actor?.system?.attributes?.senses;
  if (!senses) return;

  const changes = {};

  if (senses.darkvision) {
    changes["sight.range"] = senses.darkvision;
  }

  const detectionModes = [];
  if (senses.tremorsense) detectionModes.push({ id: "feelTremor", enabled: true, range: senses.tremorsense });
  if (senses.truesight) detectionModes.push({ id: "seeInvisibility", enabled: true, range: senses.truesight });
  if (senses.blindsight) detectionModes.push({ id: "blindsight", enabled: true, range: senses.blindsight });
  if (detectionModes.length) changes["detectionModes"] = detectionModes;

  await token.updateSource(changes);
}

export const createActiveEffect = (effect, ...args) => {
    if (Settings.alwaysOverlayDead && effect.statuses?.has(CONFIG.specialStatusEffects.DEFEATED)) {
      effect.update({ "flags.core.overlay": true });
    }
  }
