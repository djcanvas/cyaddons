import config from "../config";
import { registerWhen } from "../../BloomCore/utils/Utils";
import { data } from "../util/data";

// Variables
let Creeperact = false; 
let Creeperdeact = false;
let Creeperactext = "&aActivated!";
let Creeperdeacttext = "&cDeactivated!";



// Event Handlers
registerWhen(register("chat", () => {
    Creeperact = true;
    setTimeout(() => {
        Creeperact = false; 
    }, 1000);
}).setCriteria("Creeper Veil Activated!"), () => config.Cloak);

registerWhen(register("chat", () => {
    Creeperdeact = true;
    setTimeout(() => {
        Creeperdeact = false; 
    }, 500);
}).setCriteria("Creeper Veil De-activated!"), () => config.Cloak);

registerWhen(register("chat", () => {
    Creeperdeact = true;
    setTimeout(() => {
        Creeperdeact = false; 
    }, 500);
}).setCriteria("Creeper Veil De-activated! (Expired)"), () => config.Cloak);

// Render Component
registerWhen(register("renderOverlay", () => {
    let scale = data.Cloak?.scale || 1;
    let originX = data.Cloak?.x || Renderer.screen.getWidth() / 2;
    let originY = data.Cloak?.y || Renderer.screen.getHeight() / 2;

    Renderer.scale(scale, scale);
    if (Creeperact) {
        Renderer.translate((originX / scale) - 15, originY / scale);
        Renderer.drawStringWithShadow(Creeperactext, 0, 0);
    } else if (Creeperdeact) {
        Renderer.translate((originX / scale) - 20, originY / scale);
        Renderer.drawStringWithShadow(Creeperdeacttext, 0, 0);
    } else if (config.CloakGui.isOpen()) {
        Renderer.translate((originX / scale) - 20, originY / scale);
        Renderer.drawStringWithShadow(Creeperactext, 0, 0);
    }
    
}), () => (Creeperact || Creeperdeact || config.CloakGui.isOpen()));

// Reset on world unload
register("worldUnload", () => {
    Creeperact = false; 
    Creeperdeact = false;
});

// GUI Position and Scale Handlers
register("dragged", (dx, dy, x, y, bn) => {
    if (!config.CloakGui.isOpen() || bn == 2) return;
    data.Cloak = data.Cloak || {};
    data.Cloak.x = x;
    data.Cloak.y = y;
    data.save();
});

register("scrolled", (x, y, dir) => {
    if (!config.CloakGui.isOpen()) return;
    data.Cloak = data.Cloak || {};
    if (dir == 1) data.Cloak.scale = (data.Cloak.scale || 1) + 0.05;
    else data.Cloak.scale = (data.Cloak.scale || 1) - 0.05;
    data.save();
});

register("guiMouseClick", (x, y, bn) => {
    if (!config.CloakGui.isOpen() || bn != 2) return;
    data.Cloak = data.Cloak || {};
    data.Cloak.x = Renderer.screen.getWidth() / 2;
    data.Cloak.y = Renderer.screen.getHeight() / 2 + 10;
    data.Cloak.scale = 1;
    data.save();
});