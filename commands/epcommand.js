import { prefix } from "../util/util"

export const enderPearlCommand = register("command", () => {
    const pearlStack = Player.getInventory().getItems().find(a => a?.getName() == "§fEnder Pearl")

    if (!pearlStack) {
        ChatLib.chat(`${prefix} &aGetting Ender Pearls!`)
        ChatLib.command(`gfs ender_pearl 16`, false)
        return
    }

    const toGive = 16 - pearlStack.getStackSize()
    if (toGive == 0) {
        ChatLib.chat(`${prefix} &cEnder Pearl Stack Full!`)
        return
    }
    ChatLib.chat(`${prefix} &aGetting Ender Pearls!`)
    ChatLib.command(`gfs ender_pearl ${toGive}`, false)
}).setName("ep")