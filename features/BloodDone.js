import config from "../config";
import { registerWhen } from "../../BloomCore/utils/Utils";
import { prefix } from "../util/util";
import { data } from "../util/data";

// Variables
let bloodDone = false;
let Bloodtext = "&cBlood Done!";



// Event Handler
registerWhen(register("chat", () => {
    bloodDone = true;
    ChatLib.chat(`${prefix} &cBlood Done!`);
    setTimeout(() => {
        bloodDone = false; 
    }, 1000);
}).setCriteria("[BOSS] The Watcher: You have proven yourself. You may pass."), () => config.BloodDone);

// Render Component
registerWhen(register("renderOverlay", () => {
    let scale = data.BloodDone?.scale || 1;
    let originX = data.BloodDone?.x || Renderer.screen.getWidth() / 2;
    let originY = data.BloodDone?.y || Renderer.screen.getHeight() / 2;

    Renderer.scale(scale, scale);
    Renderer.translate(originX / scale, originY / scale);
    Renderer.drawStringWithShadow(Bloodtext, 0, 0);
}), () => bloodDone || config.BloodDoneGui.isOpen());

// Reset on world unload
register("worldUnload", () => {
    bloodDone = false;
});

// GUI Position and Scale Handlers
register("dragged", (dx, dy, x, y, bn) => {
    if (!config.BloodDoneGui.isOpen() || bn == 2) return;
    data.BloodDone = data.BloodDone || {};
    data.BloodDone.x = x;
    data.BloodDone.y = y;
    data.save();
});

register("scrolled", (x, y, dir) => {
    if (!config.BloodDoneGui.isOpen()) return;
    data.BloodDone = data.BloodDone || {};
    if (dir == 1) data.BloodDone.scale = (data.BloodDone.scale || 1) + 0.05;
    else data.BloodDone.scale = (data.BloodDone.scale || 1) - 0.05;
    data.save();
});

register("guiMouseClick", (x, y, bn) => {
    if (!config.BloodDoneGui.isOpen() || bn != 2) return;
    data.BloodDone = data.BloodDone || {};
    data.BloodDone.x = Renderer.screen.getWidth() / 2;
    data.BloodDone.y = Renderer.screen.getHeight() / 2 + 10;
    data.BloodDone.scale = 1;
    data.save();
});