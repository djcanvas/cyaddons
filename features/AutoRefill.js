import config from "../config"
import { prefix } from "../util/util"

register("step", () => {
    if (!config.autoRefillPearls) return
    const pearlStack = Player.getInventory()?.getItems()?.find(a => a?.getName() == "§fEnder Pearl")

        if (pearlStack) {
            let stackSize = pearlStack.getStackSize()
            if (stackSize < config.autoRefillPearlsThreshold) {
                const toGive = 16 - stackSize
                ChatLib.chat(`${prefix} Getting Ender Pearls!`)
                ChatLib.command(`gfs ender_pearl ${toGive}`, false)
            }
        }
}).setDelay(4)

register("step", () => {
    if (!config.autoRefillBooms) return
    const BoomStack = Player.getInventory().getItems().find(a => a?.getName() == "§9Superboom TNT")
    
        if (BoomStack) {
            let stackSize = BoomStack.getStackSize()
            if (stackSize < config.autoRefillBoomsThreshold) {
                const toGive = 64 - stackSize
                ChatLib.chat(`${prefix} Getting Superboom TNT!`)
                ChatLib.command(`gfs superboom_tnt ${toGive}`, false)
            }
        }
}).setDelay(4)

register("step", () => {
    if (!config.autoRefillJerries) return
    const jerryStack = Player.getInventory()?.getItems()?.find(a => a?.getName() == "§fInflatable Jerry")

        if (jerryStack) {
            let stackSize = jerryStack.getStackSize()
            if (stackSize < config.autoRefillJerriesThreshold) {
                const toGive = 64 - stackSize
                setTimeout(() => {
                    ChatLib.chat(`${prefix} Getting Jerries!`)
                    ChatLib.command(`gfs inflatable_jerry ${toGive}`, false)
                }, 2000)
            }
        }
}).setDelay(4)