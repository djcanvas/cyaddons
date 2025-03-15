import config from "../config"
import { prefix, isInDungeon } from "../util/util"
import { registerWhen } from "../../BloomCore/utils/Utils"

let bagOpened = false

register("worldLoad", () => {
    bagOpened = false
})

registerWhen(register("tick", () => {
    if (isInDungeon() && !bagOpened) {
        ChatLib.chat(`${prefix} Opening potion bag.`)
        ChatLib.command("potionbag")
        bagOpened = true
    }
}), () => config.autoOpenPotionBag)