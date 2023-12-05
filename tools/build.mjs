import { parseArgs } from "node:util";
import { info } from "fancy-log";
import { default as YAML } from "js-yaml";
import { rm } from "fs/promises";

import { extractPack, compilePack } from "./packging.mjs";
import { unstagePack, stagePack } from "./staging.mjs";
import { getModule, getStagePath } from "./util.mjs";

const args = parseArgs({
  options: {
    action: {
      type: "string",
      short: "a",
      default: "extract"
    },
    verbose: {
      type: "boolean",
      short: "v",
      default: false
    }
  },
  strict: false
});

const eachPack = async (module, action, ...rest) => {
  for (const pack of module.packs) {
    if (!Array.isArray(action)) action = [action];
    for (const step of action) await step(pack, ...rest);
  }
};

const cleanStaging = async (pack, { verbose }) => {
  const path = getStagePath(pack);
  if (verbose) info(`cleaning stage folder for ${pack.name} [${path}]`);
  await rm(path, { recursive: true, force: true });
};

const process = async (options) => {
  const module = await getModule();
  info("Processing module:\n", YAML.dump({ id: module.id, name: module.name }, { indent: 2 }));
  info("With Options:\n", YAML.dump(options, { indent: 2 }));

  switch (options.action) {
    case "extract": return await eachPack(module, [cleanStaging, extractPack], options);
    case "compile": return await eachPack(module, compilePack, options);
    case "unstage": return await eachPack(module, unstagePack, options);
    case "stage": return await eachPack(module, [cleanStaging, stagePack], options);
    case "json": return await eachPack(module, [cleanStaging, extractPack, unstagePack], options);
    case "db": return await eachPack(module, [cleanStaging, stagePack, compilePack], options);
  }
};

process(args.values);
