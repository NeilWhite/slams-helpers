import { MODULE } from "./config.js";

export class SlamsRollTableConfig extends RollTableConfig {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: `modules/${MODULE.name}/template/roll-table.hbs`
    });
  }

  static getRollResultsWrapper (wrapper, ...args) {
    const result = wrapper(...args);

    if (!getProperty(this, `flags.${MODULE.name}.includeQuantity`)) return result;

    const newResult = [];

    for (const item of result) {
      let quantity = getProperty(item, `flags.${MODULE.name}.quantity`);

      const roll = new Roll(quantity ? quantity : "1");
      roll.evaluate({ async: false });

      for (let i = 0; i < (Math.max(roll.total, 1)); i++) {
        newResult.push(item);
      }
    }

    return newResult;
  }
}
