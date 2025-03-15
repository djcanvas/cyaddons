import config from "../config"
import { data } from "../util/data"
import { getDistance } from "../util/util"
import { registerWhen } from "../../BloomCore/utils/Utils"

let pickedUp = false
let showPlaceCrystal = false
let placeCrystalText = new Text('place crystal').setScale(2).setShadow(true).setAlign('CENTER').setColor(Renderer.YELLOW)

let timeText = new Text('').setScale(1).setShadow(true).setAlign('CENTER').setColor(Renderer.LIGHT_PURPLE)
let ticks = 0

registerWhen(register("chat", (name) => {
    if (name != Player.getName()) return
    pickedUp = true
    showPlaceCrystal = true
}).setCriteria(/(\w+) picked up an Energy Crystal!/), () => config.CrystalInfo)

const EnderCrystal = Java.type("net.minecraft.entity.item.EntityEnderCrystal")

registerWhen(register("tick", () => {
    let entities = World.getAllEntitiesOfType(EnderCrystal)
    entities.forEach(e => {
        if (getDistance(e.getX(), e.getZ(), Player.getX(), Player.getZ()) < 5 && e.getY() == 224.375) {
            pickedUp = false
            showPlaceCrystal = false
        }
    })
}), () => config.CrystalInfo && pickedUp)

register("renderOverlay", () => {
    if (!config.CrystalInfo) return
    if (showPlaceCrystal) {
        placeCrystalText.draw(Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() * 0.4)
    }
})
register('chat', () => {
    pickedUp = false
    showPlaceCrystal = false   
}).setCriteria("[BOSS] Storm: I'd be happy to show you what that's like!")
register("worldLoad", () => {
    pickedUp = false
    showPlaceCrystal = false
})



register("chat", () => {
    ticks = 34
    tickCounter.register()
}).setCriteria("[BOSS] Maxor: THAT BEAM! IT HURTS! IT HURTS!!")

register("chat", () => {
    ticks = 34
    tickCounter.register()
}).setCriteria("[BOSS] Maxor: YOU TRICKED ME!")

const tickCounter = register("packetReceived", () => {
    ticks--
}).setFilteredClass(Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction")).unregister()

registerWhen(register("renderOverlay", () => {
    let timeLeft = (ticks / 20).toFixed(2)

    timeText.setString(timeLeft)
    timeText.setScale(data.CrystalInfo.scale)
    timeText.draw(data.CrystalInfo.x, data.CrystalInfo.y)
}), () => config.CrystalInfo && ticks > 0)

register("renderOverlay", () => {
    if (config.CrystalInfoGui.isOpen()) {
        timeText.setString("2.00")
        timeText.setScale(data.CrystalInfo.scale)
        timeText.draw(data.CrystalInfo.x, data.CrystalInfo.y)
    }
})

register("dragged", (dx, dy, x, y, bn) => {
    if (!config.CrystalInfoGui.isOpen() || bn == 2) return
    data.CrystalInfo.x = x
    data.CrystalInfo.y = y
    data.save()
})

register("scrolled", (x, y, dir) => {
    if (!config.CrystalInfoGui.isOpen()) return
    if (dir == 1) data.CrystalInfo.scale += 0.05
    else data.CrystalInfo.scale -= 0.05
    data.save()
})

register("guiMouseClick", (x, y, bn) => {
    if (!config.CrystalInfoGui.isOpen() || bn != 2) return
    data.CrystalInfo.x = Renderer.screen.getWidth() / 2
    data.CrystalInfo.y = Renderer.screen.getHeight() / 2 + 10
    data.CrystalInfo.scale = 1
    data.save()
})
