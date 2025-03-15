import config from "../config";
import { registerWhen } from "../../BloomCore/utils/Utils";
import { data } from "../util/data";
import { getOwnClass } from "../util/player";

// Variables
let Keypickedup = false;
let Keypickeduptext = "&aKey picked up!";

let selectedClass = getOwnClass()
// Event Handlers
registerWhen(
    register("chat", (message, event) => {
        Keypickedup = true;
        setTimeout(() => {
            Keypickedup = false; 
        }, 500);
        cancel(event);
    }).setCriteria(/\[.*\] \w+ has obtained (Wither|Blood) Key!/),
    () => config.KeyPickup
);

registerWhen(
    register("chat", (message, event) => {
        Keypickedup = true;
        setTimeout(() => {
            Keypickedup = false; 
        }, 500);
        cancel(event);
    }).setCriteria(/A (Wither|Blood) Key was picked up!/),
    () => config.KeyPickup
);

// Render Component
registerWhen(register("renderOverlay", () => {
    let selectedClass = getOwnClass()
    if (!(selectedClass === "Mage" || selectedClass === "Archer") && !config.KeyPickupGui.isOpen()) return;
    let scale = data.KeyPickup.scale;
    let originX = data.KeyPickup.x;
    let originY = data.KeyPickup.y;
    
    // Play sound when key is picked up
    if (config.Keysound){
        World.playSound("note.pling", 2, 2);
    }
    Renderer.scale(scale, scale);
    Renderer.translate((originX / scale) - 20, originY / scale);
    Renderer.drawStringWithShadow(Keypickeduptext, 0, 0);
}), () => (Keypickedup) || config.KeyPickupGui.isOpen());

// Reset on world unload
register("worldUnload", () => {
    Keypickedup = false;
});

// GUI Position and Scale Handlers
register("dragged", (dx, dy, x, y, bn) => {
    if (!config.KeyPickupGui.isOpen() || bn == 2) return;
    data.KeyPickup.x = x;
    data.KeyPickup.y = y;
    data.save();
});

register("scrolled", (x, y, dir) => {
    if (!config.KeyPickupGui.isOpen()) return;
    if (dir == 1) data.KeyPickup.scale += 0.05;
    else data.KeyPickup.scale -= 0.05;
    data.save();
});

register("guiMouseClick", (x, y, bn) => {
    if (!config.KeyPickupGui.isOpen() || bn != 2) return;
    data.KeyPickup.x = Renderer.screen.getWidth() / 2;
    data.KeyPickup.y = Renderer.screen.getHeight() / 2 + 10;
    data.KeyPickup.scale = 3;
    data.save();
});
