import config from "../config"
import { registerWhen } from "../../BloomCore/utils/Utils"

let rabbitFound
let isDupe
let dupeTxt
let perks

registerWhen(register("chat", (event) => {
    cancel(event)
}).setCriteria(/^HOPPITY'S HUNT You found a Chocolate \w+ Egg .+!/), () => config.compactHoppity)

registerWhen(register("chat", (event) => {
    let message = ChatLib.getChatMessage(event, true)
    rabbitFound = message.substring(21)
    cancel(event)
}).setCriteria(/.{4}HOPPITY'S HUNT You found .+ \(.{4}\w+\)!/), () => config.compactHoppity)

registerWhen(register("chat", (dupe, perks, event) => {
    let message = ChatLib.getChatMessage(event, true)
    isDupe = dupe == "DUPLICATE" ? true : false
    if (isDupe) {
        dupeTxt = message.substring(0, 23)
        perks = message.substring(24)
    }
    else {
        dupeTxt = message.substring(0, 17)
        perks = message.substring(18)
    }
    cancel(event)
    let compactMsg = `${dupeTxt} ${rabbitFound} ${perks}`
    ChatLib.chat(compactMsg)
}).setCriteria(/^(DUPLICATE|NEW) RABBIT! (.+)/), () => config.compactHoppity)
