import config from "../config"
import { prefix } from "../util/util"
import { registerWhen } from "../../BloomCore/utils/Utils"

let hide = false
let inBoss = false

const EntityPlayer = Java.type("net.minecraft.entity.player.EntityPlayer")

function showPlayers() {
    hide = false
    ChatLib.chat(`${prefix} Revealing Players!`)
}

function hidePlayers() {
    hide = true
    ChatLib.chat(`${prefix} Hiding Players!`)
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

registerWhen(register("renderEntity", (entity, pos, pt, event) => {
    if (entity.getEntity() instanceof EntityPlayer) {
        let entityName = entity.getName()
        if (entityName !== Player.getName()){
            cancel(event)
        }
    }
}), () => hide)

register("worldLoad", () => {
    inBoss = false
})