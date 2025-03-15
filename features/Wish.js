import config from "../config";
import { registerWhen } from "../../BloomCore/utils/Utils";
import { onChatPacket } from "../../BloomCore/utils/Events";
import { getOwnClass } from "../util/player";
import { prefix } from "../util/util";
import { data } from "../util/data";

// Variables
let ShowWish = false;
let Wishtext = "&6WISH!";

// Event Handlers
registerWhen(register("chat", () => {
    let selectedClass = getOwnClass()
    if (selectedClass == "Healer") {
        ShowWish = true;
        ChatLib.chat(`${prefix} &6WISH`);
        setTimeout(() => {
            ShowWish = false;
        }, 1500);
    }
}).setCriteria("⚠ Maxor is enraged! ⚠"), () => config.Wish);

registerWhen(onChatPacket(() => {
    let selectedClass = getClass(Player.getName());
    if (selectedClass == "Healer") {
        ShowWish = true;
        ChatLib.chat(`${prefix} &6WISH`);
        setTimeout(() => {
            ShowWish = false;
        }, 1500);
    }
}).setCriteria("[BOSS] Goldor: You have done it, you destroyed the factory…"), () => config.Wish);

// Render Component
registerWhen(register("renderOverlay", () => {
    let scale = data.Wish?.scale || 1;
    let originX = data.Wish?.x || Renderer.screen.getWidth() / 2;
    let originY = data.Wish?.y || Renderer.screen.getHeight() / 2;

    Renderer.scale(scale, scale);
    Renderer.translate(originX / scale, originY / scale);
    Renderer.drawStringWithShadow(Wishtext, 0, 0);
}), () => ShowWish || config.WishGui.isOpen());

// Reset on world unload
register("worldUnload", () => {
    ShowWish = false;
});

// GUI Position and Scale Handlers
register("dragged", (dx, dy, x, y, bn) => {
    if (!config.WishGui.isOpen() || bn == 2) return;
    data.Wish = data.Wish || {};
    data.Wish.x = x;
    data.Wish.y = y;
    data.save();
});

register("scrolled", (x, y, dir) => {
    if (!config.WishGui.isOpen()) return;
    data.Wish = data.Wish || {};
    if (dir == 1) data.Wish.scale = (data.Wish.scale || 1) + 0.05;
    else data.Wish.scale = (data.Wish.scale || 1) - 0.05;
    data.save();
});

register("guiMouseClick", (x, y, bn) => {
    if (!config.WishGui.isOpen() || bn != 2) return;
    data.Wish = data.Wish || {};
    data.Wish.x = Renderer.screen.getWidth() / 2;
    data.Wish.y = Renderer.screen.getHeight() / 2 + 10;
    data.Wish.scale = 1;
    data.save();
});