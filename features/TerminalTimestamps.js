import config from "../config"
import { registerWhen } from "../../BloomCore/utils/Utils"

let lastCompleted = [0, 7]
let gateBlown = false
let phaseStarted = null
let sectionStarted = null

const newSection = () => {
    sectionStarted = Date.now()
    gateBlown = false
    lastCompleted = [0, 7]
}

registerWhen(register("chat", () => {
    phaseStarted = Date.now()
    sectionStarted = Date.now()
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?"), () => config.terminalTimestamps)

registerWhen(register("chat", (name, action, object, completed, total, event) => {
    completed = parseInt(completed)
    total = parseInt(total)
    let message = ChatLib.getChatMessage(event, true)
    let timeSection = ((Date.now() - sectionStarted) / 1000).toFixed(1)
    let timePhase = ((Date.now() - phaseStarted) / 1000).toFixed(1)
    
    let formattedName = message.substring(0, name.length + 6)
    cancel(event)
    if (completed == total) {
        if (object == "a terminal") {
        ChatLib.chat(`Term: &a[&r${completed}/${total}] &8(&r${timeSection} &8|&r ${timePhase}&8)&r`)
        }
        if (object == "a device") {
        ChatLib.chat(`Device: &a[${completed}/${total}] &8(&r${timeSection} &8|&r ${timePhase}&8)&r`)
        }
        if (object == "a lever") {
        ChatLib.chat(`Lever: &a[${completed}/${total}] &8(&r${timeSection} &8|&r ${timePhase}&8)&r`)
        }

    }else {
        if (object == "a terminal") {
        ChatLib.chat(`Term: [${completed}/${total}] &8(&r${timeSection} &8|&r ${timePhase}&8)&r`)
        }
        if (object == "a device") {
        ChatLib.chat(`Device: [${completed}/${total}] &8(&r${timeSection} &8|&r ${timePhase}&8)&r`)
        }
        if (object == "a lever") {
        ChatLib.chat(`Lever: [${completed}/${total}] &8(&r${timeSection} &8|&r ${timePhase}&8)&r`)
        }
    }
    if (completed < lastCompleted[0] || (completed == total && gateBlown)) return newSection()
    lastCompleted = [completed, total]
}).setCriteria(/(\w+) (activated|completed) (a terminal|a device|a lever)! \((\d)\/(\d)\)/), () => config.terminalTimestamps && phaseStarted)

registerWhen(register("chat", (event) => {
    let timeSection = ((Date.now() - sectionStarted) / 1000).toFixed(1)
    let timePhase = ((Date.now() - phaseStarted) / 1000).toFixed(1)
    cancel(event)
    ChatLib.chat(`&a Gate destroyed! &8(&r${timeSection} &8|&r ${timePhase}&8)&r`)
    if (lastCompleted[0] == lastCompleted[1]) newSection()
    else gateBlown = true
}).setCriteria("The gate has been destroyed!"), () => config.terminalTimestamps && phaseStarted)

registerWhen(register("chat", (event) => {
    phaseStarted = null
    sectionStarted = null
}).setCriteria("The Core entrance is opening!"), () => config.terminalTimestamps)

register("worldLoad", () => {
    lastCompleted = [0, 7]
    gateBlown = false
    phaseStarted = null
    sectionStarted = null
})