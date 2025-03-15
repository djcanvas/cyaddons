import { getScoreboard, removeUnicode } from "../../BloomCore/utils/Utils"
import { registerWhen } from "../../BloomCore/utils/Utils"
import { data } from "./data"

export const prefix = "&b[&r&ocya&r&b]&r"
export const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
export const MouseEvent = Java.type("net.minecraftforge.client.event.MouseEvent")
export const S2FPacketSetSlot = Java.type("net.minecraft.network.play.server.S2FPacketSetSlot")
export const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow")

export function getHeldItemID() {
    const item = Player.getHeldItem();
    const itemId = item?.getNBT()?.get("tag")?.get("ExtraAttributes")?.getString("id");
    return itemId;
}
export const sendWindowClick = (windowId, slot, clickType, actionNumber=0) => Client.sendPacket(new C0EPacketClickWindow(windowId ?? Player.getContainer().getWindowId(), slot, clickType ?? 0, 0, null, actionNumber))

export function space() {
    ChatLib.chat("")
}

export function divider() {
    ChatLib.chat(ChatLib.getChatBreak("-"))
}

export function getDistance(x1, z1, x2, z2) {
    return Math.sqrt((x1 - x2) ** 2 + (z1 - z2) ** 2)
}

export function formatNumber(number) {
    let format = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    let ind = format.indexOf(".")
    if (ind > -1) return format.substring(0, ind)
    else return format
}

export function isInDungeon() {
    try {
        return TabList?.getNames()?.some(a => a.removeFormatting() == 'Dungeon: Catacombs')
    } catch (e) { }
}


export function getClass() {
    let index = TabList?.getNames()?.findIndex(line => line?.includes(Player.getName()))
    if (index == -1) return
    let match = TabList?.getNames()[index]?.removeFormatting().match(/.+ \((.+) .+\)/)
    if (!match) return "EMPTY"
    return match[1];
}

export const rooms = JSON.parse(FileLib.read("cyaddons", "util/roomdata.json"))

export const getRoomID = () => {
    let sb = getScoreboard(false)
    if (!sb) return null
    let line = removeUnicode(sb[sb.length-1])
    let match = line.match(/\d+\/\d+\/\d+ \w+ ([-\d]+,[-\d]+)/)
    if (!match) return null
    return match[1]
}

export const getRoom = (roomID=null) => {
    if (roomID == null) roomID = getRoomID()
    return rooms?.find(a => a.id.includes(roomID)) ?? null
}

export const inSkyblock = () => {
    if (Scoreboard.getTitle().removeFormatting().includes("SKYBLOCK")) return true
    return false
}

export function isPlayerInBox(x1, y1, z1, x2, y2, z2) {
    const x = Player.getX();
    const y = Player.getY();
    const z = Player.getZ();

    return (x >= Math.min(x1, x2) && x <= Math.max(x1, x2) &&
            y >= Math.min(y1, y2) && y <= Math.max(y1, y2) &&
            z >= Math.min(z1, z2) && z <= Math.max(z1, z2));
}

export function rightClick() {
    const rightClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147121_ag", null)
    rightClickMethod.setAccessible(true);
    rightClickMethod.invoke(Client.getMinecraft(), null);
}

