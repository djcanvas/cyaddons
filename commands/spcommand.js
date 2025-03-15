import { prefix } from "../util/util"

export const SuperboomCommand = register("command", () => {
    const superboomStack = Player.getInventory().getItems().find(a => a?.getName() == "§9Superboom TNT")

    if (!superboomStack) {
        ChatLib.chat(`${prefix} &aGetting Superbooms!`)
        ChatLib.command(`gfs superboom_tnt 64`, false)
        return
    }

    const toGive = 64 - superboomStack.getStackSize()
    if (toGive == 0) {
        ChatLib.chat(`${prefix} &cSuperboom Stack Full!`)
        return
    }
    ChatLib.chat(`${prefix} Getting Superboom!`)
    ChatLib.command(`gfs superboom_tnt ${toGive}`, false)
}).setName("sp", true)

