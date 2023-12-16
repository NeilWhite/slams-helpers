import { MODULE, L } from "./config.js"

export class ActionTriggers {

  static getScenes(value) {
    if (value instanceof Scene) return [value];
    if (value instanceof Token || value instanceof TileDocument) return [value.parent];
    if (value instanceof Array) {
      if (!value.length) return null;
      if (value[0] instanceof Scene) return value;
      if (value[0] instanceof Token || value[0] instanceof TileDocument) return value.map(v => v.parent);
    }
  }

  static registerActions(app) {
    app.registerTileGroup(MODULE.name, L(".actions.groupName"));
    app.registerTileAction(MODULE.name, "cleanscene", {
      name: L(".actions.cleanscene"),
      group: MODULE.name,
      ctrls: [{
        id: "sceneid",
        name: L("MonksActiveTiles.ctrl.scene"),
        type: "select",
        subtype: "entity",
        required: true,
        options: { show: ["scene", "tile", "previous"] },
        restrict: (entity) => { return (entity instanceof Scene); },
        defaultType: "scenes"
      }],
      fn: async (args = {}) => {
        const { action } = args;
        const values = await game.MonksActiveTiles.getEntities(args, "scenes", action.data.sceneid);
        const scenes = ActionTriggers.getScenes(values);

        for (const scene of scenes) {
          const combats = game.combats.filter(c => c.scene.id === scene.id);
          for (const combat of combats) {
            MODULE.log("Deleting in-progress combat...", combat);
            await combat.delete();
          }
          const tokens = scene.tokens.map(v => v.id);
          MODULE.log(`Deleting ${tokens.length} Tokens from ${scene.name}...`, tokens);
          await scene.deleteEmbeddedDocuments("Token", tokens);
        }
      },
      content: async (trigger, action) => {
        const ctrl = trigger.ctrls.find(c => c.id == "sceneid");
        const entityName = await game.MonksActiveTiles.entityName(action.data?.sceneid || ctrl?.defvalue || "unknown", "scenes");
        return `<span class="action-style">${L(trigger.name)}</span>
                from
                <span class="entity-style">${entityName}</span>`;
      }
    });
  }
}
