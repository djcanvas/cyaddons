import config from "../config"
import { data } from "../util/data"
import { registerWhen } from "../../BloomCore/utils/Utils"
import { getClass } from "../util/util"
import { prefix, isInDungeon } from "../util/util"
if (!global.sharedData) {
    global.sharedData = {};
}
global.sharedData.SectionDone = false



function ding() {
    World.playSound("note.pling", 1, 2);
    setTimeout(() => {
        World.playSound("note.pling", 1, 2);
    }, 100);
}


let gateBlown = false
let deviceActivated = false
let sectionCount = 1
let isGuiactive = false
let termsCompleted = 0
let leversCompleted = 0
let deviceCompletedInSection = false
let lastCompleted = [0, 7]
let sectionStarted = null
let devicename = ""
let preenterGui = false
let i4done = false


const newSection = () => {
        
        global.sharedData.SectionDone = true
        ding()
        setTimeout(() => {
            global.sharedData.SectionDone = false
            
        }, 500);
        
        let timeSection = ((Date.now() - sectionStarted) / 1000).toFixed(2)
        let Devicetime = ((Date.now() - sectionStarted) / 1000).toFixed(2)
        sectionStarted = Date.now()
        gateBlown = false
        deviceActivated = false
        sectionCount++
        termsCompleted = 0
        leversCompleted = 0
        lastCompleted = [0, 7]
        deviceCompletedInSection = false
       if (sectionCount > 1){
            preenterGui = false
       }
       if (sectionCount == 4 && i4done){
            deviceActivated = true
       }
    
}

// Register for starting the GUI
register("chat", () => {
    isGuiactive = true
    sectionStarted = Date.now()
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")

// Register for stopping the GUI
register("chat", () => {
    isGuiactive = false 
}).setCriteria("The Core entrance is opening!")

// Register for gate destruction

const S45PacketTitle = Java.type("net.minecraft.network.play.server.S45PacketTitle");
const packetTitle = (() => {
    const listeners = [];
    const trigger = register("packetReceived", (packet, event) => {
        const type = packet.func_179807_a().toString();
        const message = ChatLib.removeFormatting(packet.func_179805_b()?.func_150260_c());
        for (let listener of listeners) {
            listener(type, message, packet, event);
        }
    }).setFilteredClass(S45PacketTitle).unregister();

    return {
        addListener: (listener) => {
            if (listeners.length === 0) trigger.register();
            listeners.push(listener);
        },
        removeListener: (listener) => {
            const index = listeners.indexOf(listener);
            if (index === -1) return false;
            listeners.splice(index, 1);
            if (listeners.length === 0) trigger.unregister();
            return true;
        }
    };
})();
function onTitle(type, message, _, event) {
    if (type !== "SUBTITLE") return;
    if (!/^.* completed a device! \(\d\/\d\)$/.test(message) && 
        !/^.* activated a terminal! \(\d\/\d\)$/.test(message) && 
        !/^.* activated a lever! \(\d\/\d\)$/.test(message) && 
        !/^The gate will open in 5 seconds!$/.test(message) && 
        !/^The gate has been destroyed!$/.test(message)) return;
    cancel(event);
}

register("renderTitle", (title, subtitle, event) => {
    if(!config().terminal) return
    if(subtitle.includes("activated a terminal!")) cancel(event)
    if(subtitle.includes("completed a device!")) cancel(event)
    if(subtitle.includes("activated a lever!")) cancel(event)
})


// Register for device actions
registerWhen(register("chat", (name, completed, total) => {
    
    completed = parseInt(completed)
    total = parseInt(total)
   if (sectionCount == 1) {
        World.getAllPlayers().forEach(entity => {
            if (entity.isInvisible() || entity.getPing() !== 1) return
                
            if (entity.getX() <= 112 && entity.getX() >= 105 && 
                entity.getY() <= 125 && entity.getY() >= 118 && 
                entity.getZ() <= 99 && entity.getZ() >= 91) {
                    
                if (name == entity.getName()) {
                    let deviceTime = ((Date.now() - sectionStarted) / 1000).toFixed(2)
                    ChatLib.chat("-----------------------------------------------")
                    ChatLib.chat(`                                          SS took ${deviceTime}s`)
                    ChatLib.chat("-----------------------------------------------")
                    
                    if (!deviceCompletedInSection) {
                        deviceActivated = true
                        deviceCompletedInSection = true
                    }
                }
               
            }else if (entity.getX() <= 69 && entity.getX() >= 60 && 
                entity.getY() <= 130 && entity.getY() >= 125 && 
                entity.getZ() <= 39 && entity.getZ() >= 32) {
                    if (name == entity.getName()) {
                        i4done = true
                    }
                }
        })

    }
   if (sectionCount > 1) {
    if (!deviceCompletedInSection) {
        deviceActivated = true
        deviceCompletedInSection = true
       
    }
    }
     if (completed == total && gateBlown) {
        return newSection()
    }
    lastCompleted = [completed, total]
}).setCriteria(/(\w+) completed a device! \((\d)\/(\d)\)/), () => config.terminal && isGuiactive)

registerWhen(register("chat", () => {
    let selectedClass = getClass(Player.getName())
    if (selectedClass == "Archer") {
        if (sectionCount == 1) {
            preenterGui = true
        }
        if (sectionCount > 1) {
            preenterGui = false
        }
    }
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?"), () => config.DungeonShit && isInDungeon)

registerWhen(register("renderOverlay", () => {
    
    let Timer = (((Date.now() - sectionStarted) / 1000).toFixed(2))

    // Use your config settings for scaling and position.
    let scale = data.DungeonShit.scale;
    let originX = data.DungeonShit.x;
    let originY = data.DungeonShit.y;

    Renderer.scale(scale, scale);
    Renderer.translate(originX / scale, originY / scale);
    Renderer.drawStringWithShadow(Timer, 0, 0);
    
}), () => preenterGui && isGuiactive)

// Register for terminal actions
registerWhen(register("chat", (name, completed, total) => {
    completed = parseInt(completed)
    total = parseInt(total)
    termsCompleted++
    if (completed == total && gateBlown) {
        return newSection()
    }
    lastCompleted = [completed, total]
}).setCriteria(/(\w+) activated a terminal! \((\d)\/(\d)\)/), () => config.terminal && isGuiactive)

// Register for lever actions
registerWhen(register("chat", (name, completed, total) => {
    completed = parseInt(completed)
    total = parseInt(total)
    leversCompleted++
    if (completed == total && gateBlown) {
        return newSection()
    }
    lastCompleted = [completed, total]
}).setCriteria(/(\w+) activated a lever! \((\d)\/(\d)\)/), () => config.terminal && isGuiactive)

registerWhen(register("chat", (event) => {
        
     if (lastCompleted[0] == lastCompleted[1]) return newSection()
     else gateBlown = true
      
}).setCriteria("The gate has been destroyed!"), () => config.terminal && isGuiactive)

// Handle dragging the GUI
register("dragged", (dx, dy, x, y, bn) => {
    if (!config.terminalGui.isOpen() || bn == 2) return
    data.terminal.x = x
    data.terminal.y = y
    data.save()
})

register("scrolled", (x, y, dir) => {
    if (!config.terminalGui.isOpen()) return
    if (dir == 1) data.terminal.scale += 0.05
    else data.terminal.scale -= 0.05
    data.save()
})

// Handle mouse click in the GUI
register("guiMouseClick", (x, y, bn) => {
    if (!config.terminalGui.isOpen() || bn != 2) return
    data.terminal.x = Renderer.screen.getWidth() / 2
    data.terminal.y = Renderer.screen.getHeight() / 2 + 10
    data.terminal.scale = 1
    data.save()
})





// Render the overlay
registerWhen(register("renderOverlay", () => {
        
        const checkMark = '&a&o✔&r'
        let totalTerms = sectionCount === 2 ? 5 : 4
        let totalLevers = 2
        let hasGate = sectionCount !== 4
        const termsDisplay = (termsCompleted == totalTerms) ? checkMark : `${termsCompleted}/${totalTerms}`;
        const leversDisplay = (leversCompleted == totalLevers) ? checkMark : `${leversCompleted}/${totalLevers}`;

        let termsLeversText = `Terms: ${termsDisplay} | Levers: ${leversDisplay}`;
        let gateStatusText = hasGate ? (gateBlown ? "&aGate" : "&cGate") : ""
        let deviceStatusText = deviceActivated ? "&aDev" : "&cDev"
        let combinedText = `${termsLeversText} ${gateStatusText} ${deviceStatusText}`

        
        let scale = data.terminal.scale
        

        let originX = data.terminal.x
        let originY = data.terminal.y

        Renderer.scale(scale, scale)
        Renderer.translate(originX / scale, originY / scale)

        Renderer.drawStringWithShadow(combinedText, 0, 0)

        
        
       
    
}), ()  => (config.terminal && isGuiactive) || config.terminalGui.isOpen())



// Reset variables on world load
register("worldUnload", () => {
    lastCompleted = [0, 7]
    gateBlown = false
    deviceActivated = false
    sectionCount = 1
    isGuiactive = false
    termsCompleted = 0
    leversCompleted = 0
    deviceCompletedInSection = false
    sectionStarted = null
})
