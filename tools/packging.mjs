import { info } from "fancy-log";
import * as fvtt from "@foundryvtt/foundryvtt-cli";

import { getStagePath } from "./util.mjs";
import { clean } from "./clean.mjs";

/**
 * @param {import("./util.mjs").FoundryPack} pack - module to extract json from
 */
export async function extractPack(pack, { verbose: log }) {
  info(`Extracting ${pack.label} [${pack.name}]...`);
  await fvtt.extractPack(pack.path, getStagePath(pack), { log, clean: true, transformEntry: clean(pack.type) });
}

/**
 * @param {import("./util.mjs").FoundryPack} pack - module to extract json from
 */
export async function compilePack(pack, { verbose: log }) {
  info(`Compile ${pack.label} [${pack.name}]...`);
  await fvtt.compilePack(getStagePath(pack), pack.path, { log, transformEntry: clean(pack.type), recursive: true });
}
