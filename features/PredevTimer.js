import config from "../config"
import { data } from "../util/data" 
import { prefix } from "../util/util"
import { registerWhen } from "../../BloomCore/utils/Utils"
import { getOwnClass } from "../util/player"

let enterBoss
let at3Dev = false
let counting = false

const getDistance = (x2, y2) => {
    let x1 = parseInt(Player.getX())
    let y1 = parseInt(Player.getZ());

    return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
}

registerWhen(register("chat", () => {
    enterBoss = Date.now()
    counting = true
}).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!"), () => getOwnClass() === "Healer" && config.predevTimer)

registerWhen(register("tick", () => {
    if (!at3Dev && getDistance(1, 77) <= 3) {
        at3Dev = true
        return
    }
}), () => getOwnClass() === "Healer" && counting && config.predevTimer)

registerWhen(register("chat", () => {
    if (!at3Dev) {
        ChatLib.chat(`${prefix} Predev not completed.`)
    } else {
        const time = ((Date.now() - enterBoss) / 1000).toFixed(2)
        let msg = `${prefix} Predev completed in &e${time}&rs.`
        if (time < data.predevTimer.pb) {
            data.predevTimer.pb = time
            data.save()
            msg += " &d&l(PB)"
        }
        new Message(new TextComponent(msg).setHover("show_text", `Personal Best: ${data.predevTimer.pb}s`)).chat()
        at3Dev = false
    }
    counting = false
}).setCriteria(/You have teleported to .+/), () => getOwnClass() === "Healer" && counting && config.predevTimer)

register("worldLoad", () => {
    at3Dev = false
    counting = false
})