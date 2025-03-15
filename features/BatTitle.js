import config from "../config";
import { registerWhen } from "../../BloomCore/utils/Utils";
import { isInDungeon } from "../util/util";
import { data } from "../util/data";

// Variables
let Bat = false;
let Battext = "&cBAT!";



// Event Handler - sound detection
registerWhen(register("soundPlay", (pos, name, vol, pitch, category, event) => {
    if ((name == "mob.bat.hurt" && vol == 0.10000000149011612) || name == "mob.bat.death") {
        Bat = true;
        setTimeout(() => {
            Bat = false; // Hide the notification after the delay
        }, 1500);
    }
}), () => config.BatTitle && isInDungeon());

// Render Component
registerWhen(register("renderOverlay", () => {
    let scale = data.BatTitle?.scale || 1;
    let originX = data.BatTitle?.x || Renderer.screen.getWidth() / 2;
    let originY = data.BatTitle?.y || Renderer.screen.getHeight() / 2;

    Renderer.scale(scale, scale);
    Renderer.translate(originX / scale, originY / scale);
    Renderer.drawStringWithShadow(Battext, 0, 0);
}), () => Bat || config.BatTitleGui.isOpen());

// Reset on world unload
register("worldUnload", () => {
    Bat = false;
});

// GUI Position and Scale Handlers
register("dragged", (dx, dy, x, y, bn) => {
    if (!config.BatTitleGui.isOpen() || bn == 2) return;
    data.BatTitle = data.BatTitle || {};
    data.BatTitle.x = x;
    data.BatTitle.y = y;
    data.save();
});

register("scrolled", (x, y, dir) => {
    if (!config.BatTitleGui.isOpen()) return;
    data.BatTitle = data.BatTitle || {};
    if (dir == 1) data.BatTitle.scale = (data.BatTitle.scale || 1) + 0.05;
    else data.BatTitle.scale = (data.BatTitle.scale || 1) - 0.05;
    data.save();
});

register("guiMouseClick", (x, y, bn) => {
    if (!config.BatTitleGui.isOpen() || bn != 2) return;
    data.BatTitle = data.BatTitle || {};
    data.BatTitle.x = Renderer.screen.getWidth() / 2;
    data.BatTitle.y = Renderer.screen.getHeight() / 2 + 10;
    data.BatTitle.scale = 1;
    data.save();
});