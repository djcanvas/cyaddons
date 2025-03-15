import config from "../config"
import { data } from "../util/data"
import { registerWhen } from "../../BloomCore/utils/Utils"

let timeText = new Text('').setScale(1).setShadow(true).setAlign('CENTER').setColor(Renderer.YELLOW)
let startTime

register("chat", () => {
    startTime = Date.now()
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance.")

registerWhen(register("renderOverlay", () => {
    const remaining = (5.2 - (Date.now() - startTime ?? 0) / 1000).toFixed(2)
    if (remaining < 0) return

    timeText.setString(remaining)
    timeText.setScale(data.p3StartTimer.scale)
    timeText.draw(data.p3StartTimer.x, data.p3StartTimer.y)
}), () => config.p3StartTimer && startTime)

register("renderOverlay", () => {
    if (config.p3StartTimerGui.isOpen()) {
        timeText.setString("5.20")
        timeText.setScale(data.p3StartTimer.scale)
        timeText.draw(data.p3StartTimer.x, data.p3StartTimer.y)
    }
})

register("dragged", (dx, dy, x, y, bn) => {
    if (!config.p3StartTimerGui.isOpen() || bn == 2) return
    data.p3StartTimer.x = x
    data.p3StartTimer.y = y
    data.save()
})

register("scrolled", (x, y, dir) => {
    if (!config.p3StartTimerGui.isOpen()) return
    if (dir == 1) data.p3StartTimer.scale += 0.05
    else data.p3StartTimer.scale -= 0.05
    data.save()
})

register("guiMouseClick", (x, y, bn) => {
    if (!config.p3StartTimerGui.isOpen() || bn != 2) return
    data.p3StartTimer.x = Renderer.screen.getWidth() / 2
    data.p3StartTimer.y = Renderer.screen.getHeight() / 2 + 10
    data.p3StartTimer.scale = 1
    data.save()
})