import config from "../config";
import { registerWhen } from "../../BloomCore/utils/Utils";
import { data } from "../util/data";

// Variables
let Notify = false;
let ShowNotify = false;
let Stucktext = "&6Stuck!";



// Event Handlers
registerWhen(register("chat", () => {
    Notify = true;
}).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!"), () => config.WitherStuck);

registerWhen(register("chat", () => {
    ShowNotify = true;
    setTimeout(() => {
        ShowNotify = false; // Hide the notification after the delay
    }, 1500);
}).setCriteria("[BOSS] Storm: Ouch, that hurt!"), () => Notify);

registerWhen(register("chat", () => {
    ShowNotify = true;
    setTimeout(() => {
        ShowNotify = false; // Hide the notification after the delay
    }, 1500);
}).setCriteria("[BOSS] Maxor: YOU TRICKED ME!"), () => Notify);

registerWhen(register("chat", () => {
    ShowNotify = true;
    setTimeout(() => {
        ShowNotify = false; // Hide the notification after the delay
    }, 1500);
}).setCriteria("[BOSS] Maxor: THAT BEAM! IT HURTS! IT HURTS!!"), () => Notify);

registerWhen(register("chat", () => {
    ShowNotify = true;
    setTimeout(() => {
        ShowNotify = false; // Hide the notification after the delay
    }, 1500);
}).setCriteria("[BOSS] Storm: Oof"), () => Notify);

// Render Component
registerWhen(register("renderOverlay", () => {
    
        let scale = data.WitherStuck?.scale || 1;
        let originX = data.WitherStuck?.x || Renderer.screen.getWidth() / 2;
        let originY = data.WitherStuck?.y || Renderer.screen.getHeight() / 2;

        Renderer.scale(scale, scale);
        Renderer.translate(originX / scale, originY / scale);
        Renderer.drawStringWithShadow(Stucktext, 0, 0);
    
}), () => ShowNotify || config.WitherStuckGui.isOpen());

// Reset on world unload
register("worldUnload", () => {
    Notify = false;
    ShowNotify = false;
});

// GUI Position and Scale Handlers

register("dragged", (dx, dy, x, y, bn) => {
    if (!config.WitherStuckGui.isOpen() || bn == 2) return
    data.WitherStuck.x = x
    data.WitherStuck.y = y
    data.save()
})

register("scrolled", (x, y, dir) => {
    if (!config.WitherStuckGui.isOpen()) return
    if (dir == 1) data.WitherStuck.scale += 0.05
    else data.WitherStuck.scale -= 0.05
    data.save()
})

// Handle mouse click in the GUI
register("guiMouseClick", (x, y, bn) => {
    if (!config.WitherStuckGui.isOpen() || bn != 2) return
    data.WitherStuck.x = Renderer.screen.getWidth() / 2
    data.WitherStuck.y = Renderer.screen.getHeight() / 2 + 10
    data.WitherStuck.scale = 1
    data.save()
})

