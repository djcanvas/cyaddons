import config from "../config";
import { registerWhen } from "../../BloomCore/utils/Utils";
import { data } from "../util/data";

// Variables
let sharedData = global.sharedData || {};
let Donetext = "&aDone!";

// Render Component
registerWhen(register("renderOverlay", () => {
    let scale = data.SectionDone?.scale || 1;
    let originX = data.SectionDone?.x || Renderer.screen.getWidth() / 2;
    let originY = data.SectionDone?.y || Renderer.screen.getHeight() / 2;

    Renderer.scale(scale, scale);
    Renderer.translate(originX / scale, originY / scale);
    Renderer.drawStringWithShadow(Donetext, 0, 0);
}), () => sharedData.SectionDone || config.SectionDoneGui.isOpen());

// GUI Position and Scale Handlers
register("dragged", (dx, dy, x, y, bn) => {
    if (!config.SectionDoneGui.isOpen() || bn == 2) return;
    data.SectionDone = data.SectionDone || {};
    data.SectionDone.x = x;
    data.SectionDone.y = y;
    data.save();
});

register("scrolled", (x, y, dir) => {
    if (!config.SectionDoneGui.isOpen()) return;
    data.SectionDone = data.SectionDone || {};
    if (dir == 1) data.SectionDone.scale = (data.SectionDone.scale || 1) + 0.05;
    else data.SectionDone.scale = (data.SectionDone.scale || 1) - 0.05;
    data.save();
});

register("guiMouseClick", (x, y, bn) => {
    if (!config.SectionDoneGui.isOpen() || bn != 2) return;
    data.SectionDone = data.SectionDone || {};
    data.SectionDone.x = Renderer.screen.getWidth() / 2;
    data.SectionDone.y = Renderer.screen.getHeight() / 2 + 10;
    data.SectionDone.scale = 1;
    data.save();
});