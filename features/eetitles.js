import config from "../config";
import { data } from "../util/data";
import RenderLibV2 from "../../RenderLibV2";
import { getNameByClass, getOwnClass } from "../util/player";


// Initialize state variables
let inp3 = false;
let done1st = false;
let doneee2 = false;
let doneee3 = false;
let donecore = false;
let donetunnel = false;
let donesafespot = false;

// Necron boss fight detection
const necronStartMessage = [
    "[BOSS] Necron: Finally, I heard so much about you. The Eye likes you very much.",
    "[BOSS] Necron: You went further than any human before, congratulations."
];

// Register chat triggers
register("chat", () => inp3 = true)
    .setCriteria("[BOSS] Goldor: Who dares trespass into my domain?");

register("chat", (message) => {
    if (!necronStartMessage.includes(message)) return;
    inp3 = false;
}).setCriteria("${message}");

// Play sequential sound effects
function dingloop() {
    const delays = Array(120).fill(2);
    
    function playWithDelay(index) {
        if (index >= delays.length) return;
        setTimeout(() => {
            World.playSound("note.pling", 0.7, 1.6);
            playWithDelay(index + 1);
        }, delays[index]);
    }
    
    playWithDelay(0);
}

// Overlay for displaying location messages
let testtitle1 = [`&bPlayer is at low ee 3`];
const overlay1 = {
    render: null, 
    title: null, 
    truetitleDONTUSE: `eetitlesGui`
};

const overlayregister1 = register("renderOverlay", () => {
    let scale = data.eetitles.scale;
    Renderer.scale(data.eetitles.scale);
    Renderer.drawStringWithShadow((overlay1.truetitleDONTUSE), data.eetitles.x, data.eetitles.y);
}).unregister();

let gui1on;

// Register/unregister overlay functions
function registerall() {
    overlay1.render = true;
    overlayregister1.register();
}

function unregisterall() {
    overlay1.render = false;
    overlayregister1.unregister();
}

// GUI configuration and rendering handlers
register("step", () => {
    if (config.eetitlesGui.isOpen()) registerall();
    
    if (overlay1.render) {
        overlayregister1.register();
        
        if (config.eetitlesGui.isOpen()) {
            overlay1.truetitleDONTUSE = testtitle1;
            gui1on = true;
        } else if (!config.eetitlesGui.isOpen() && gui1on) {
            unregisterall();
            overlay1.truetitleDONTUSE = " ";
            gui1on = false;
        } else {
            overlay1.truetitleDONTUSE = overlay1.title;
        }
    }
}).setFps(1);

// GUI position and scale handlers
register("dragged", (dx, dy, x, y, bn) => {
    if (config.eetitlesGui.isOpen() && bn != 2) {
        data.eetitles.x = (x / data.eetitles.scale);
        data.eetitles.y = (y / data.eetitles.scale);
        data.save();
    }
});

register("scrolled", (x, y, dir) => {
    if (config.eetitlesGui.isOpen()) {
        if (dir == 1) {
            data.eetitles.scale += 0.05;
        } else {
            data.eetitles.scale -= 0.05;
        }
        
        data.eetitles.x = (x / data.eetitles.scale);
        data.eetitles.y = (y / data.eetitles.scale);
        data.save();
    }
});

register("guiMouseClick", (x, y, bn) => {
    if (config.eetitlesGui.isOpen() && bn != 2) {
        data.eetitles.x = (x / data.eetitles.scale);
        data.eetitles.y = (y / data.eetitles.scale);
        data.save();
    } 
    
    if (config.eetitlesGui.isOpen() && bn == 2) {
        // Reset position and scale
        data.eetitles.x = Renderer.screen.getWidth() / 2;
        data.eetitles.y = Renderer.screen.getHeight() / 2 + 10;
        data.eetitles.scale = 1;
        data.save();
    }
});

// Reset world state function
function worldloadd() {
    done1st = false;
    doneee2 = false;
    doneee3 = false;
    donecore = false;
    donetunnel = false;
    donesafespot = false;
    inp3 = false;
   
}

// Handle world unloading
register("worldUnload", () => {
    overlayregister1.unregister();
    overlay1.render = false;
    worldloadd();
});

// Handle world loading
register("worldLoad", () => {
    done1st = false;
    doneee2 = false;
    doneee3 = false;
    donecore = false;
    donetunnel = false;
    donesafespot = false;
    inp3 = false;
    
});

// Player location detection
register("step", () => {
    if (!inp3 || !config.eetitles) return;
    
    // Section 1 detection (Entrance area)
    if ((Player.getRenderX() >= 90) && (Player.getRenderZ() <= 124)) {
        World.getAllPlayers().forEach(entity => {
            if (entity.isInvisible() || entity.getPing() !== 1) return;
            
            // EE2 to normal EE2
            if (!doneee2) {
                if ((((entity.getX()) <= 59.3) && ((entity.getX()) >= 55) && 
                     ((entity.getY()) <= 110) && ((entity.getY()) >= 108.5) && 
                     ((entity.getZ()) <= 132.3) && ((entity.getZ()) >= 129.7))) {
                    doneee2 = true;
                    dingloop();
                    
                    overlay1.title = `&b${entity.getName()} is at ee2`;
                    if (config.sendchatmessage) ChatLib.command(`party chat ${entity.getName()} is at ee2`);
                    overlay1.render = true;
                    setTimeout(() => {
                        overlay1.render = false;
                        overlayregister1.unregister();
                    }, 2000);
                }
            }
            
            // EE to 1st term
            if (!done1st) {
                if (((entity.getX()) <= 80.3) && ((entity.getX()) >= 67.7) && 
                    ((entity.getY()) <= 113) && ((entity.getY()) >= 108.5) && 
                    ((entity.getZ()) <= 128.3) && ((entity.getZ()) >= 125.7)) {
                    done1st = true;
                }
            }
            
            // EE to 1st term (alternate)
            if (!done1st) {
                if (((entity.getX()) <= 70.3) && ((entity.getX()) >= 67.7) && 
                    ((entity.getY()) <= 113) && ((entity.getY()) >= 108.5) && 
                    ((entity.getZ()) < 125.7) && ((entity.getZ()) >= 121.987)) {
                    done1st = true;
                }
            }
            
            // EE to 2nd dev
            if (!doneee2) {
                if (((entity.getX()) <= 62.3) && ((entity.getX()) >= 59) && 
                    ((entity.getY()) <= 134) && ((entity.getY()) >= 131.5) && 
                    ((entity.getZ()) <= 140.3) && ((entity.getZ()) >= 137.7)) {
                    dingloop();
                    overlay1.title = `&b${entity.getName()} is at 2nd Dev`;
                    if (config.sendchatmessage) ChatLib.command(`party chat ${entity.getName()} is at 2nd Dev`);
                    doneee2 = true;
                    overlay1.render = true;
                    setTimeout(() => {
                        overlay1.render = false;
                        overlayregister1.unregister();
                    }, 2000);
                }
            }
            
            // 1st term safespot
            if (!donesafespot) {
                if (((entity.getX()) <= 69.7) && ((entity.getX()) >= 67.3) && 
                    ((entity.getY()) <= 109.2) && ((entity.getY()) >= 109) && 
                    ((entity.getZ()) <= 122) && ((entity.getZ()) >= 121.9)) {
                    dingloop();
                    overlay1.title = `&b${entity.getName()} is at 1st term safespot`;
                    donesafespot = true;
                    overlay1.render = true;
                    setTimeout(() => {
                        overlay1.render = false;
                        overlayregister1.unregister();
                    }, 2000);
                }
            }
            
            // 3rd term safespot
            if (!donesafespot) {
                if (((entity.getX()) <= 48.7) && ((entity.getX()) >= 46.3) && 
                    ((entity.getY()) <= 109.2) && ((entity.getY()) >= 109) && 
                    ((entity.getZ()) <= 122) && ((entity.getZ()) >= 121.9)) {
                    dingloop();
                    overlay1.title = `&b${entity.getName()} is at 3rd term safespot`;
                    donesafespot = true;
                    overlay1.render = true;
                    setTimeout(() => {
                        overlay1.render = false;
                        overlayregister1.unregister();
                    }, 2000);
                }
            }
        });
    }
    
    // Section 2 detection (EE3 area)
    if ((Player.getRenderX() >= 16) && (Player.getRenderZ() >= 121) && (!doneee3)) {
        World.getAllPlayers().forEach(entity => {
            if (entity.isInvisible() || entity.getPing() !== 1) return;
            
            // Normal EE3 (higher)
            if (((entity.getX()) <= 7.7) && ((entity.getX()) >= 5.95) && 
                ((entity.getY()) <= 114) && ((entity.getY()) >= 113) && 
                ((entity.getZ()) <= 106.1) && ((entity.getZ()) >= 103)) {
                dingloop();
                
                overlay1.title = `&b${entity.getName()} is at ee 3`;
                if (config.sendchatmessage) ChatLib.command(`party chat ${entity.getName()} is at ee 3`);
                doneee3 = true;
                overlay1.render = true;
                setTimeout(() => {
                    overlay1.render = false;
                    overlayregister1.unregister();
                }, 2000);
            }
            
            // 3rd term 3rd section
            if (((entity.getX()) <= 18.7) && ((entity.getX()) >= 17.7) && 
                ((entity.getY()) <= 122) && ((entity.getY()) >= 121) && 
                ((entity.getZ()) <= 95) && ((entity.getZ()) >= 91.3)) {
                dingloop();
                overlay1.title = `&b${entity.getName()} is at 3rd term`;
                if (config.sendchatmessage) ChatLib.command(`party chat ${entity.getName()} is at 3rd term`);
                doneee3 = true;
                overlay1.render = true;
                setTimeout(() => {
                    overlay1.render = false;
                    overlayregister1.unregister();
                }, 2000);
            }
            
            // New EE3 (lower)
            if (((entity.getX()) <= 3) && ((entity.getX()) >= 1.3) && 
                ((entity.getY()) <= 109.5) && ((entity.getY()) >= 108.5) && 
                ((entity.getZ()) <= 105.5) && ((entity.getZ()) >= 100)) {
                dingloop();
                
                overlay1.title = `&b${entity.getName()} is at ee 3`;
                if (config.sendchatmessage) ChatLib.command(`party chat ${entity.getName()} is at ee 3`);
                doneee3 = true;
                overlay1.render = true;
                setTimeout(() => {
                    overlay1.render = false;
                    overlayregister1.unregister();
                }, 2000);
            }
        });
    }
    
    // Section 3 detection (Core area)
    if ((Player.getRenderX() <= 20) && (Player.getRenderZ() >= 49) && (!donecore)) {
        World.getAllPlayers().forEach(entity => {
            if (entity.isInvisible() || entity.getPing() !== 1) return;
            
            // Outside core
            if (((entity.getX()) <= 57.7) && ((entity.getX()) >= 51.3) && 
                ((entity.getY()) <= 116) && ((entity.getY()) >= 113.5) && 
                ((entity.getZ()) <= 53.7) && ((entity.getZ()) >= 50.7)) {
                dingloop();
                
                overlay1.title = `&b${entity.getName()} is outside core`;
                if (config.sendchatmessage) ChatLib.command(`party chat ${entity.getName()} is outside core`);
                donecore = true;
                overlay1.render = true;
                setTimeout(() => {
                    overlay1.render = false;
                    overlayregister1.unregister();
                }, 2000);
            }
            
            // Outside core (alternate position)
            if ((((entity.getX()) <= 56.3) && ((entity.getX()) >= 52.7) && 
                 ((entity.getY()) <= 116) && ((entity.getY()) >= 114.5) && 
                 ((entity.getZ()) < 50.7) && ((entity.getZ()) >= 50))) {
                dingloop();
                
                overlay1.title = `&b${entity.getName()} is outside core`;
                if (config.sendchatmessage) ChatLib.command(`party chat ${entity.getName()} is outside core`);
                donecore = true;
                overlay1.render = true;
                setTimeout(() => {
                    overlay1.render = false;
                    overlayregister1.unregister();
                }, 2000);
            }
        });
    }
    
    // Section 4 detection (Tunnel area)
    if ((Player.getRenderX() <= 90) && (Player.getRenderZ() <= 54) && (!donetunnel)) {
        World.getAllPlayers().forEach(entity => {
            if (entity.isInvisible() || entity.getPing() !== 1) return;
            
            // Inside core
            if ((((entity.getX()) <= 70.999) && ((entity.getX()) >= 39) && 
                 ((entity.getY()) <= 155.499) && ((entity.getY()) >= 112) && 
                 ((entity.getZ()) <= 59.3) && ((entity.getZ()) >= 54))) {
                dingloop();
                
                overlay1.title = `&b${entity.getName()} is in tunnel`;
                if (config.sendchatmessage) ChatLib.command(`party chat ${entity.getName()} is in tunnel`);
                donetunnel = true;
                overlay1.render = true;
                setTimeout(() => {
                    overlay1.render = false;
                    overlayregister1.unregister();
                }, 2000);
            }
        });
    }
}).setFps(8);