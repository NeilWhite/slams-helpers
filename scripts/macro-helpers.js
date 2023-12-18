import { MODULE, L } from "./config.js";

const FIELD = {
  transient: "transient",
  source: "source"
};

export const DAMAGE_ICONS = {
  acid: "icons/magic/acid/projectile-glowing-bubbles.webp",
  bludgeoning: "icons/skills/melee/strike-hammer-destructive-orange.webp",
  cold: "icons/magic/water/projectile-ice-orb-white.webp",
  fire: "icons/magic/fire/flame-burning-yellow-orange.webp",
  force: "icons/magic/earth/projectile-stone-bullet-pink.webp",
  lightning: "icons/magic/lightning/bolt-strike-sparks-blue.webp",
  necrotic: "icons/magic/unholy/strike-body-life-soul-green.webp",
  piercing: "icons/skills/melee/strike-polearm-light-orange.webp",
  poison: "icons/skills/melee/strike-dagger-poison-green.webp",
  psychic: "icons/magic/control/hypnosis-mesmerism-swirl.webp",
  radiant: "icons/magic/light/beam-rays-orange-large.webp",
  slashing: "icons/skills/melee/strike-sword-steel-yellow.webp",
  thunder: "icons/magic/lightning/orb-ball-purple.webp"
};

export const DRAGON_COLORS = {
  black: { label: ".dragon.black", damage: "acid" },
  blue: { label: ".dragon.blue", damage: "lightning" },
  brass: { label: ".dragon.brass", damage: "fire" },
  bronze: { label: ".dragon.bronze", damage: "lightning" },
  copper: { label: ".dragon.copper", damage: "acid" },
  gold: { label: ".dragon.gold", damage: "fire" },
  green: { label: ".dragon.green", damage: "poison" },
  red: { label: ".dragon.red", damage: "fire" },
  silver: { label: ".dragon.silver", damage: "cold" },
  white: { label: ".dragon.white", damage: "cold" }
};

export const FAVOURED_ENEMY = {
  aberration: { languages: ["deepspeak"], img: "icons/creatures/abilities/dragon-breath-purple.webp" },
  beast: { img: "icons/creatures/abilities/bear-roar-bite-brown.webp" },
  celestial: { languages: ["celestial"], img: "icons/magic/holy/angel-winged-humanoid-blue.webp" },
  construct: { img: "icons/creatures/magical/construct-stone-earth-gray.webp" },
  dragon: { languages: ["draconic"], img: "icons/creatures/abilities/dragon-ice-breath-blue.webp" },
  elemental: { languages: ["aquan", "auran", "ignan", "terran"], img: "icons/creatures/magical/spirit-mischief-fire-blue.webp" },
  fey: { img: "icons/creatures/magical/fae-fairy-winged-glowing-green.webp" },
  fiend: { languages: ["infernal"], img: "icons/creatures/unholy/demon-hairy-winged-pink.webp" },
  giant: { languages: ["giant"], img: "icons/magic/earth/strike-fist-stone-gray.webp" },
  monstrosity: { img: "icons/creatures/abilities/mouth-teeth-crooked-blue.webp" },
  ooze: { img: "icons/creatures/slimes/slime-face-melting-green.webp" },
  plant: { img: "icons/magic/nature/tree-animated-smile.webp" },
  undead: { img: "icons/magic/death/hand-undead-skeleton-fire-pink.webp" },

  humanoid: {
    img: "icons/environment/people/infantry-army.webp",
    types: {
      gnoll: { languages: ["gnoll"] },
      gith: { languages: ["gith"] },
      goblin: { languages: ["goblin"] },
      dwarf: { languages: ["dwarvish"] },
      elf: { languages: ["elvish"] },
      gnome: { languages: ["gnomish"] },
      halfling: { languages: ["halfling"] },
      orc: { languages: ["orc"] }
    }
  }
}

const getFlag = (document, flag) => document.getFlag(MODULE.name, flag);

const apply = async (effect, actor, origin) => {
  const [newEffect] = await actor.createEmbeddedDocuments("ActiveEffect", [
    effect.clone({
      disabled: false,
      origin
    })
  ]);

  return newEffect;
}

export const MacroHelpers = {
  DRAGON_COLORS,
  DAMAGE_ICONS,
/**
 * @param {Actor} actor - actor to create the Item for
 * @param {uuid} itemUuid - Uuid of the item to create
 * @param {Map<string, any>} options.changes - changes to apply to the item before creating it
 */
  createTempItem: async (actor, itemUuid, options = { }) => {
    if (!actor) return ui.notifications.error("createTempItem: Actor not found");
    const item = await fromUuid(itemUuid);
    if (!item) return ui.notifications.error("createTempItem: Item not found")

    const [newItem] = await actor.createEmbeddedDocuments("Item", [item.clone({
      [`flags.${MODULE.name}.${FIELD.transient}`]: true,
      [`flags.${MODULE.name}.${FIELD.source}`]: itemUuid,
      ...(options.changes)
    })]);

    return newItem;
  },

/**
 * @param {Actor} actor - actor to create the Item for
 * @param {uuid} itemUuid - Uuid the item is based on
 * @param {any} options
 */
  deleteTempItem: async (actor, itemUuid, options = {}) => {
    if (!actor) return ui.notifications.error("createTempItem: Actor not found");
    const item = await fromUuid(itemUuid);
    if (!item) return ui.notifications.error("createTempItem: Item not found")

    const items = actor.items.filter(i => getFlag(i, FIELD.transient) && getFlag(i, FIELD.source) === itemUuid);
    if (items.length) await actor.deleteEmbeddedDocuments("Item", items.map(i => i.id));
  },

/**
 * @param {Actor} actor
 * @param {Uuid} itemUuid
 * @param {string} effectId
 */
  applyPickedEffect: async (actor, itemUuid, effectId) => {
    const item = await fromUuid(itemUuid);
    const options = item.effects.filter(i => i.disabled);
    const choice = await MacroHelpers.askAbout(options, { title: item.name  });
    return await apply(choice, actor, effectId);
  },

/**
 * @param {Actor} actor
 * @param {Uuid} itemUuid
 * @param {string} effectId
 */
  deletePickedEffect: async (actor, itemUuid, effectId) => {
    const effects = actor.effects.filter(i => i.origin === effectId).map(i => i.id);
    if (effects.length) await actor.deleteEmbeddedDocuments("ActiveEffect", effects);
  },

  /**
   *
   */
  morphItem: async (actor, item, name, changes) => {
    if (actor.getFlag(MODULE.name, name)) return;
    const backup = { id: item.id };

    for (const key of Object.keys(changes)) {
      backup[key] = getProperty(item, key);
    }

    await actor.setFlag(MODULE.name, name, backup);
    MODULE.log(backup, actor.flags.slam);
    await item.update(changes);
  },

  unMorphItem: async (actor, name) => {
    const morphed = actor.getFlag(MODULE.name, name);
    if (!morphed) return;

    MODULE.log(morphed);
    const { id, ...backup } = morphed;
    const item = actor.items.get(id);
    if (!item) return MODULE.log("no item", backup);

    await item.update(backup);
    await actor.setFlag(MODULE.name, name, null);
  },

  /**
   * @param {String[]} items - names of damage Types
   * @param {Boolean} options.cancel - show a Cancel button
   * @param {String} options.title - Provide the title of the dialog
   * @returns {Promise<{ id, label}>} users choice
   */
  askAboutDamageTypes: async (items, options = {}) => {
    const choices = items.map(id => ({
      id,
      img: DAMAGE_ICONS[id],
      name: CONFIG.DND5E.damageTypes[id]
    }));

    options.title = options.title ?? "Pick Damage Type";

    return MacroHelpers.askAbout(choices, options)
  },

  /**
   * @param {Boolean} options.cancel - show a Cancel button
   * @param {String} options.title - Provide the title of the dialog
   * @returns {Promise<{ id, name, damage }>} users choice
   */
  askAboutDragons: async (options = {}) => {
    const choices = Object.entries(DRAGON_COLORS).map(([id, v]) => ({
      id,
      img: DAMAGE_ICONS[v.damage],
      name: L(v.label),
      damage: v.damage
    }));

    options.title = options.title ?? "Pick Dragon Type";

    return MacroHelpers.askAbout(choices, options);
  },

  /**
   * @param {Document[]} items - Documents to pick from (items, effects, etc...)
   * @param {Boolean} options.cancel - show a Cancel button
   * @param {String} options.title - Provide the title of the dialog
   * @returns {Promise<Document>} users choice
   */
  askAbout: async (items, { cancel, title } = { }) => {
    return new Promise((res, rej) => {
      let result = null;
      const values = items.reduce((acc, w) => {
        acc[w.id] = {
          icon: w.img ? `<img src="${w.img}" class="slam-button-icon" />` : undefined,
          label: w.name,
          callback: () => result = w
        };
        return acc;
      }, {});
      if (cancel) values.cancel = { label: "Cancel", callback: () => rej() };

      new Dialog({
        title: title ?? "Choose",
        buttons: { ...values },
        default: cancel ? "cancel" : null,
        close: () => res(result)
      }, {
        classes: ["stacked", "slam-ask-about"]
      }).render(true);
    });
  }
}
