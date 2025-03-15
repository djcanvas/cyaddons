
import config from "../config"
import { data } from "../util/data"
import RenderLibV2 from "../../RenderLibV2"





const playersStackingMelody = []
const melodyColors = ["4", "c", "6", "e", "2", "a", "b", "3", "1", "9", "d", "5", "f", "7", "8", "0"]
let playerName = ""
let melodyProgress = ""
let furthestAlongMelody = 0
let currentMelodyProgress = 0
let phase
let lastCompleted = []
let gateBlown = false
let inP3 = false

// The main shit
register("chat", (message) => {
    if (!config.MelodyWarning || !inP3) return
    const melodyMatch = message.match(/^Party >[\s\[\w+\]]* (\w+): .*(\d\/\d|\d\d%)$/) // China regex

    if (melodyMatch) {
        playersStackingMelody.push(melodyMatch[1])
        if (melodyMatch[1] === Player.getName()) return
        currentMelodyProgress = melodyMatch[2]
        // Check if the progress value is in percent
        if (parseInt(currentMelodyProgress) >= 25) currentMelodyProgress = parseInt(currentMelodyProgress) / 25 + "/4"
        if (currentMelodyProgress > furthestAlongMelody || furthestAlongMelody === 0) { // If this melody is the furthest along one then render the message and play the sound.
            playerName = melodyMatch[1] // gets player name
            furthestAlongMelody = currentMelodyProgress
            melodyProgress = furthestAlongMelody
            World.playSound("note.pling", 0.7, 1.6)
        }
        return
    }

    // If the person who sent melody message completes a terminal then reset melody
    const terminalMatch = message.match(/^(\w+) activated a terminal! \(\d\/\d\)$/) // Yeah i could just use the regex below but I was lazy
    if (terminalMatch && playersStackingMelody.includes(terminalMatch[1])) resetMelody()

    const termMessageMatch = message.match(/^(?:\w+ \w{9,9} a \w{5,8}! \((\d)\/(\d)\)|The gate has been destroyed!|The Core entrance is opening!)$/)
    if (!termMessageMatch) return
    const completed = termMessageMatch[1]
    const total = termMessageMatch[2]

    if (message === "The gate has been destroyed!") {
        gateBlown = true
        if (lastCompleted[0] == lastCompleted[1]) newPhase()
        return
    } else if (message === "The Core entrance is opening!") {
        inP3 = false // The rest will clean itself up after you load a new world
        return
    }
    if (lastCompleted[0] > completed || lastCompleted[1] != total || (completed == total && gateBlown)) newPhase()
    else lastCompleted = [completed, total]
}).setCriteria("${message}")

register("renderOverlay", () => {
    if (config.MelodyWarningGui.isOpen()) {
        const displayMessage = `&bITheSerenity has Melody! 3/4`
        Renderer.scale(data.MelodyWarning.scale)
        Renderer.drawStringWithShadow(displayMessage, data.MelodyWarning.x - (Renderer.getStringWidth(displayMessage)), data.MelodyWarning.y)
        return
    }
    if (!melodyProgress || !inP3) return
    const displayMessage = `&b + ${playerName} has Melody! ${melodyProgress}`
    Renderer.scale(data.MelodyWarning.scale)
    Renderer.drawStringWithShadow(displayMessage, data.MelodyWarning.x - (Renderer.getStringWidth(displayMessage)), data.MelodyWarning.y)
})

const resetMelody = () => {
    while (playersStackingMelody.length) playersStackingMelody.pop()
    melodyProgress = ""
    furthestAlongMelody = 0
}

const newPhase = () => {
    while (playersStackingMelody.length) playersStackingMelody.pop()
    melodyProgress = ""
    furthestAlongMelody = 0
    phase++
    gateBlown = false
    lastCompleted = [0, phase === 2 ? 8 : 7]
}

register("chat", () => {
    inP3 = true
    phase = 1
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")

register("worldLoad", () => { // China
    newPhase()
    phase = 1
    inP3 = false
    lastCompleted = [0, 7]
})

register("dragged", (dx, dy, x, y, bn) => {
    if (!config.MelodyWarningGui.isOpen() || bn == 2) return
    data.MelodyWarning.x = x
    data.MelodyWarning.y = y
    data.save()
})

register("scrolled", (x, y, dir) => {
    if (!config.MelodyWarningGui.isOpen()) return
    if (dir == 1) data.MelodyWarning.scale += 0.05
    else data.MelodyWarning.scale -= 0.05
    data.save()
})

register("guiMouseClick", (x, y, bn) => {
    if (!config.MelodyWarningGui.isOpen() || bn != 2) return
    data.MelodyWarning.x = Renderer.screen.getWidth() / 2
    data.MelodyWarning.y = Renderer.screen.getHeight() / 2 + 10
    data.MelodyWarning.scale = 1
    data.save()
})