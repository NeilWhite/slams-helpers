import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { default as YAML } from "js-yaml";
import path from "path/posix";
import { info } from "fancy-log";

/**
 * @typedef {(
*   "Actor"|"Adventure"|"Cards"|"ChatMessage"|"Combat"|"FogExploration"|"Folder"|"Item"|"JournalEntry"|"Macro"|
*   "Playlist"|"RollTable"|"Scene"|"Setting"|"User"
* )} DocumentType
*/

/**
 * @typedef {(
*   "actors"|"adventures"|"cards"|"messages"|"combats"|"fog"|"folders"|"items"|"journal"|"macros"|"playlists"|"tables"|
*   "scenes"|"settings"|"users"
* )} DocumentCollection
*/

/**
 * @typedef {Object} FoundryPack
 * @property {DocumentType} type - type of package
 * @property {string} name - name of package
 * @property {string} path - module-relative path of package db
 * @property {string} label - friendly name of package
 */

/**
 * @typedef {Object} FoundryModule
 * @property {string} id - internal name of the Module
 * @property {FoundryPack[]} packs
 */

/**
 *
 * @param {FoundryPack} pack - path containing pack data
 * @returns {import("fs").PathLike} - path where yaml/json should be stored
 */

const stripFirst = (p) => {
  const [, ...result] = p.split(path.sep);
  return path.join(...result);
};

const cleanJson = (key, value) => {
  return (value !== null && value !== "") ? value : undefined;
};

export const getStagePath = (pack) => path.join("./stage", stripFirst(pack.path));
export const getSourcePath = (pack) => path.join("./src", stripFirst(pack.path));

export async function ensurePath(pathName) {
  if (!existsSync(pathName)) {
    info(`Creating folder: ${pathName}`);
    await mkdir(pathName, { recursive: true });
  }
}

export async function getJson(fileName) {
  const json = await readFile(fileName, { encoding: "utf8" });
  return JSON.parse(json);
}

export async function getModule() {
  return getJson("./module.json");
}

export async function writeYaml(fileName, doc) {
  const yaml = YAML.dump(doc, { });
  await ensurePath(path.dirname(fileName));
  await writeFile(fileName, yaml);
}

export async function writeJson(fileName, doc) {
  const json = JSON.stringify(doc, cleanJson, 2);
  await ensurePath(path.dirname(fileName));
  await writeFile(fileName, json);
}
