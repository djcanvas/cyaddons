import config from '../config'
import { registerWhen } from "../../BloomCore/utils/Utils"


let text = new Text('').setScale(2).setShadow(true).setAlign('CENTER').setColor(Renderer.YELLOW)
let startTime
let name
let action
let place
let timesPlayed = 0

registerWhen(register("chat", (n, a, p) => {
    name = n
    action = a
    place = p
    startTime = Date.now()
    timesPlayed = 0
}).setCriteria(/Party >.* (\w+): (At|Inside) (.+)(!)?/), () => config.locationNotif)

registerWhen(register("renderOverlay", () => {
    const remaining = (1500 - (Date.now() - startTime ?? 0))
    if (remaining < 0) return

    text.setString(`${name} is ${action} ${place}!`)
    text.draw(Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2 - 50)

    let timesToPlay = parseInt(config.locationNotifRepeatAmount)
    if (timesPlayed < timesToPlay) {
        World.playSound(config.locationSound, 2, 2)
        timesPlayed++
    }

}), () => config.locationNotif && startTime && name != Player.getName())

const inRange = (arr) => {
    let x = Player.getX()
    let y = Player.getY()
    let z = Player.getZ()
    if (x >= arr[1][0] && x <= arr[1][1]) {
        if (y >= arr[2][0] && y <= arr[2][1]) {
            if (z >= arr[3][0] && z <= arr[3][1]) {
                return true
            }
        }
    }
    return false
}

const inRadius = (arr) => {
    let x = Player.getX()
    let y = Player.getY()
    let z = Player.getZ()
    if (y >= arr[2][0] && y <= arr[2][1]) {
        let dist = Math.sqrt((x - arr[1]) ** 2 + (z - arr[3]) ** 2)
        if (dist < arr[4]) return true
    }
    return false
}

let messagesSent = {
    'ssMessage': [true, [107, 110], [120, 121], [93, 95]],
    'i4Spot': [true, [62, 65], [127, 128], [34, 37]],
    'pre2': [true, [54, 58], [108, 110], [130, 132]],
    'pre3': [true, [6, 7], [113, 114], [103, 106]],
    'lowerpre3': [true, [1, 3], [109, 110], [103, 106]],
    'pre4': [true, [39, 42], [108, 110], [34, 36]],
    'slingshot': [true, [51.3, 57], [113.5, 116], [50.7, 53.7]],
    'tunnel': [true, [39, 70.999], [112, 155.499], [54, 59.3]],
    'mid': [true, 54.5, [64, 65], 76.5, 7.8],
    'safespot2': [true, [46, 49], [109, 109], [121.987, 121.988]]
    }

register('chat', () => {
    messagesSent.ssMessage[0] = false
    messagesSent.i4Spot[0] = false
}).setCriteria("[BOSS] Storm: I'd be happy to show you what that's like!")

register('chat', () => {
    messagesSent.pre2[0] = false
    messagesSent.pre3[0] = false
    messagesSent.lowerpre3[0] = false
    messagesSent.pre4[0] = false
    messagesSent.slingshot[0] = false
    messagesSent.tunnel[0] = false
    messagesSent.mid[0] = false
    messagesSent.safespot2[0] = false
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")

register('chat', () => {
    messagesSent.tunnel[0] = true
    messagesSent.slingshot[0] = true
    messagesSent.pre2[0] = true
    messagesSent.pre3[0] = true
    messagesSent.lowerpre3[0] = true
    messagesSent.pre4[0] = true
    messagesSent.safespot2[0] = true
}).setCriteria("The Core entrance is opening!")

register('chat', () => {
    messagesSent.mid[0] = true
}).setCriteria("[BOSS] Necron: You went further than any human before, congratulations.")

register('tick', () => {
    if (!config.toggleSelectedNearbyMessages) return
    if (!messagesSent.ssMessage[0] && config.ssCoord && inRange(messagesSent.ssMessage)) {
        ChatLib.command('pc At SS!')
        messagesSent.ssMessage[0] = true
        return
    }
    if (!messagesSent.i4Spot[0] && inRange(messagesSent.i4Spot)) {
        ChatLib.command('pc At i4!')
        messagesSent.i4Spot[0] = true
        return
    }

    if (!messagesSent.pre2[0] && config.pre2Coord && inRange(messagesSent.pre2)) {
        ChatLib.command('pc At Pre Enter 2!')
        messagesSent.pre2[0] = true
        return
    }

    if (!messagesSent.pre3[0] && config.pre3Coord && (inRange(messagesSent.pre3) || inRange(messagesSent.lowerpre3))) {
        ChatLib.command('pc At Pre Enter 3!')
        messagesSent.pre3[0] = messagesSent.lowerpre3[0] = true
        return
    }

    if (!messagesSent.pre4[0] && config.pre4Coord && inRange(messagesSent.pre4)) {
        ChatLib.command('pc At Pre Enter 4!')
        messagesSent.pre4[0] = true
        return
    }

    if (!messagesSent.slingshot[0] && config.slingshotCoord && inRange(messagesSent.slingshot)) {
        ChatLib.command('pc At Core!')
        messagesSent.slingshot[0] = true
        return
    }

    if (!messagesSent.tunnel[0] && config.tunnelCoord && inRange(messagesSent.tunnel)) {
        ChatLib.command('pc Inside Goldor Tunnel!')
        messagesSent.tunnel[0] = true
        return
    }
    
    if (!messagesSent.mid[0] && config.midCoord && inRadius(messagesSent.mid)) {
        ChatLib.command('pc At Mid!')
        messagesSent.mid[0] = true
        return
    }

    if (!messagesSent.safespot2[0] && config.safespotCoord && inRange(messagesSent.safespot2)) {
        ChatLib.command('pc At 2 Safespot!')
        messagesSent.safespot2[0] = true
        return
    }

})

register('worldLoad', () => {
    messagesSent = {
    'ssMessage': [true, [107, 110], [120, 121], [93, 95]],
    'i4Spot': [true, [62, 65], [127, 128], [34, 37]],
    'pre2': [true, [54, 58], [108, 110], [130, 132]],
    'pre3': [true, [6, 7], [113, 114], [103, 106]],
    'lowerpre3': [true, [1, 3], [109, 110], [103, 106]],
    'pre4': [true, [39, 42], [108, 110], [34, 36]],
    'slingshot': [true, [51.3, 57], [113.5, 116], [50.7, 53.7]],
    'tunnel': [true, [39, 70.999], [112, 155.499], [54, 59.3]],
    'mid': [true, 54.5, [64, 65], 76.5, 7.8],
    'safespot2': [true, [46, 49], [109, 109], [121.987, 121.988]]
    }
})