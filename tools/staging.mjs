import { glob } from "glob";
import path from "path/posix";
import { info } from "fancy-log";
import { cp } from "fs/promises";

import { getJson, getStagePath, getSourcePath, writeJson, ensurePath } from "./util.mjs";

export const cleanName = (input) =>
  input.replace("'", "").replace(/[^a-z0-9]+/gi, " ").trim().replace(/\s+|-{2,}/g, "-").toLowerCase();

export async function unstagePack(pack) {
  info(`Unstaging: ${pack.label} [${pack.name}]`);

  const names = await glob(path.join(getStagePath(pack), "**/*.json"));
  const files = (await Promise.all(names.map(getJson))).reduce((acc, i) => {
    acc[i._id] = i;
    return acc;
  }, {});

  const makePath = (id) => {
    const entry = files[id];
    if (entry.folder) return path.join(makePath(entry.folder), cleanName(entry.name));
    return cleanName(entry.name);
  };

  const makeFileName = (entry) => {
    const name = makePath(entry._id);
    const isFolder = !!(entry._key?.startsWith("!folders!"));
    return isFolder ? path.join(name, "_folder.json") : `${name}.json`;
  };

  for (const entry of Object.values(files)) {
    const fileName = path.join(getSourcePath(pack), makeFileName(entry));
    await writeJson(fileName, entry);
  }
}

export async function stagePack(pack) {
  info(`Staging ${pack.label} [${pack.name}]]`);
  const src = getSourcePath(pack);
  const dst = getStagePath(pack);
  await ensurePath(src);
  await ensurePath(dst);
  await cp(src, dst, { recursive: true });
}
