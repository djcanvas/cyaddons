import config from "../config";
import { data } from "../util/data";

// Java type imports
const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow");

// Variables
let title = " ";
let text1;
let stopautopetdisplay = false;

// Setup Text render
register("step", () => {
    text1 = new Text(
        title, 
        data.AutoPet.x,
        data.AutoPet.y
    ).setAlign("CENTER").setShadow(true).setScale(2);
}).setFps(10);

// Render registration
const overlayregister1 = register("renderOverlay", () => {
    text1.draw();
}).unregister();

// Wardrobe prevention
register("packetReceived", () => {
    Client.scheduleTask(0, () => {
        if (Player.getContainer().getName().includes("Wardrobe")) {
            stopautopetdisplay = true;
            setTimeout(() => {
                stopautopetdisplay = false;
            }, 2000);
        } 
    });
}).setFilteredClass(S2DPacketOpenWindow);

// Pet display handler
register("chat", (level, petName, event) => {
    if (!config.AutoPet || stopautopetdisplay) return;
    cancel(event);
    
    if (petName == "Phoenix" || petName == "Phoenix ✦") {
        overlayregister1.register();
        title = "&5phoenix";
        setTimeout(() => {
            if (title != "&5phoenix") return;
            overlayregister1.unregister();
            title = " ";
        }, 1500);
    }
    if (petName == "Black Cat" || petName == "Black Cat ✦") {
        overlayregister1.register();
        title = "&dBlack Cat";
        setTimeout(() => {
            if (title != "&dBlack Cat") return;
            overlayregister1.unregister();
            title = " ";
        }, 1500);
    }
    if (petName == "Golden Dragon" || petName == "Golden Dragon ✦") {
        overlayregister1.register();
        title = "&6gdrag";
        setTimeout(() => {
            if (title != "&6gdrag") return;
            overlayregister1.unregister();
            title = " ";
        }, 1500);
    }
}).setCriteria(/Autopet equipped your \[Lvl (\d+)\] (.+)! VIEW RULE/);

// Reset on world unload
register("worldUnload", () => {
    title = " ";
    stopautopetdisplay = false;
    overlayregister1.unregister();
});

// GUI Position and Scale Handlers
register("dragged", (dx, dy, x, y, bn) => {
    if (!config.AutoPetGui.isOpen() || bn == 2) return;
    data.AutoPet.x = x;
    data.AutoPet.y = y;
    data.save();
});

register("scrolled", (x, y, dir) => {
    if (!config.AutoPetGui.isOpen()) return;
    if (dir == 1) data.AutoPet.scale += 0.05;
    else data.AutoPet.scale -= 0.05;
    data.save();
});

register("guiMouseClick", (x, y, bn) => {
    if (!config.AutoPetGui.isOpen() || bn != 2) return;
    data.AutoPet.x = Renderer.screen.getWidth() / 2;
    data.AutoPet.y = Renderer.screen.getHeight() / 2 + 40; // Adjusted for auto pet display position
    data.AutoPet.scale = 3;
    data.save();
});