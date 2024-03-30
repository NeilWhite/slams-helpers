import { Settings } from "./config.js";

export const dnd5e_renderChatMessage = (message, html) => {
  if (Settings.smallerChat) {
    html?.classList?.add("slam-smaller");
  }
}
