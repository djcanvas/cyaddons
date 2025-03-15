import RenderLib from "../../RenderLib/index"
import config from "../config"

let inTerms = false



register("Chat", () => {
    if (!config.TerminalESP) return
    inTerms = true
    render.register()
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")

register("Chat", () => {
    inTerms = false
    render.unregister()
}).setCriteria("[BOSS] Goldor: You have done it, you destroyed the factory…")

const render = register("renderWorld", () => {
    if (!inTerms) return

    const r = config.ESPColor.getRed() / 255;
    const g = config.ESPColor.getGreen() / 255;
    const b = config.ESPColor.getBlue() / 255;
    World.getAllEntitiesOfType(net.minecraft.entity.item.EntityArmorStand).forEach(ent => {
    if (!ent.getName().includes("Inactive") && !ent.getName().includes("Not Activated")) return

    if (ent.getName().includes("Inactive")) {
        Tessellator.disableDepth();
        RenderLib.drawEspBox(ent.getRenderX(), ent.getRenderY() + 1, ent.getRenderZ(), 1, 1, r, g, b, 1, true)
        Tessellator.enableDepth();
    } else if (ent.getName().includes("Not Activated")) {
        Tessellator.disableDepth();
        RenderLib.drawEspBox(ent.getRenderX(), ent.getRenderY() - 1, ent.getRenderZ(), 0.5, 0.5, r, g, b, 1, true)
        Tessellator.enableDepth();
    }
})
}).unregister()

