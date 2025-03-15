import config from "../config"
import { prefix } from "../util/util"
import { registerWhen } from "../../BloomCore/utils/Utils"

let hide = false
let inBoss = false
let hideRadius = 2 // Radius in blocks to hide players

const EntityPlayer = Java.type("net.minecraft.entity.player.EntityPlayer")

function showPlayers() {
    hide = false
    ChatLib.chat(`${prefix} Revealing Players!`)
}

function hidePlayers() {
    hide = true
    ChatLib.chat(`${prefix} Hiding Players!`)
}

// Check if a player is within the specified radius
function isPlayerNearby(entity) {
    const playerX = Player.getX()
    const playerY = Player.getY()
    const playerZ = Player.getZ()
    
    const entityX = entity.getX()
    const entityY = entity.getY()
    const entityZ = entity.getZ()
    
    // Calculate distance between player and entity
    const distanceSquared = 
        Math.pow(playerX - entityX, 2) + 
        Math.pow(playerY - entityY, 2) + 
        Math.pow(playerZ - entityZ, 2)
    
    // Compare with radius squared (more efficient than using square root)
    return distanceSquared <= Math.pow(hideRadius, 3)
}

register("chat", () => {
    inBoss = true
}).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!")

registerWhen(register("chat", () => {
    hidePlayers()
    setTimeout(() => {
        showPlayers()
    }, 2000)
}).setCriteria(/You have teleported to .+/), () => config.hidePlayersAfterLeap)

// Modified renderEntity to check player distance
registerWhen(register("renderEntity", (entity, pos, pt, event) => {
    if (entity.getEntity() instanceof EntityPlayer) {
        let entityName = entity.getName()
        
        // Don't hide yourself
        if (entityName !== Player.getName()) {
            // Hide players based on either global hide setting or proximity
            if (hide || (config.hidePlayersAfterLeap && isPlayerNearby(entity))) {
                cancel(event)
            }
        }
    }
}), () => hidePlayersAfterLeap)

register("worldLoad", () => {
    inBoss = false
})

// Add a command to toggle nearby player hiding
register("command", (radius) => {
    if (radius) {
        hideRadius = parseFloat(radius)
        ChatLib.chat(`${prefix} Set player hiding radius to ${hideRadius} blocks`)
    }
    
    config.hideNearbyPlayers = !config.hideNearbyPlayers
    ChatLib.chat(`${prefix} Nearby player hiding ${config.hideNearbyPlayers ? "enabled" : "disabled"}`)
}).setName("hidenearby")