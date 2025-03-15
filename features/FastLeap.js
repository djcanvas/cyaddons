import config from "../config";
import leapHelper from "../util/leapUtils"
import {getNameByClass, getOwnClass} from "../util/player"
import {isPlayerInBox, rightClick, MouseEvent, getHeldItemID } from "../util/util";
const S02PacketChat = Java.type("net.minecraft.network.play.server.S02PacketChat");
let inBoss = false;
let inMaxor = false;
let inStorm = false;
let inGoldor = false;
let inNecron = false;
let lastOpener
let sharedData = global.sharedData || {};

register("chat", () => {
    inMaxor = true
}).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!")

register("chat", () => {
    inStorm = true
}).setCriteria("[BOSS] Storm: Pathetic Maxor, just like expected.")

register("chat", () => {
    inGoldor = true
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")
 

register('chat', () => {
    setTimeout(() => {
        inNecron = true;
    }, 7000); // 5000 milliseconds = 5 seconds
}).setCriteria("The Core entrance is opening!")


register("packetReceived", packet => {
	const message = ChatLib.removeFormatting(packet.func_148915_c().func_150260_c());
	if (["[BOSS] Maxor:", "[BOSS] Storm:", "[BOSS] Goldor:", "[BOSS] Necron:"].some(bossname => message.startsWith(bossname))) inBoss = true;
}).setFilteredClass(S02PacketChat);


register("chat", (player, event) => {
    lastOpener = player
}).setCriteria(/^(\w+) opened a WITHER door!$/)

register('worldLoad', () => {
inBoss = false;
inMaxor = false;
inStorm = false;
inGoldor = false;
inNecron = false;
lastOpener = null
})


function getLeap() {
    let leapString = "";

    if (!inBoss) {
        leapString = lastOpener;
    } else if (inBoss) {
        if (inMaxor) {
            let leapClass = getNameByClass("Berserk");
            leapString = leapClass !== null ? leapClass : "Berserk";
        }
        if (inStorm) {
            if (getOwnClass() === "Healer") {
                let leapClass = getNameByClass("Berserk");
                leapString = leapClass !== null ? leapClass : "Berserk";
            } else {
                let leapClass = getNameByClass("Healer");
                leapString = leapClass !== null ? leapClass : "Healer";
            }
        }
        if (inGoldor) {
            if (isPlayerInBox(113, 160, 48, 89, 100, 122)) {
                if (sharedData.atee2) {
                    leapString = sharedData.atee2;
                } else {
                    if (getOwnClass() === "Archer") {
                        let leapClass = getNameByClass("Berserk");
                        leapString = leapClass !== null ? leapClass : "Berserk";
                    } else {
                        let leapClass = getNameByClass("Archer");
                        leapString = leapClass !== null ? leapClass : "Archer";
                    }
                }
            } else if (isPlayerInBox(91, 160, 145, 19, 100, 121)) {
                if (sharedData.atee3) {
                    leapString = sharedData.atee3;
                } else {
                    if (getOwnClass() === "Healer") {
                        let leapClass = getNameByClass("Archer");
                        leapString = leapClass !== null ? leapClass : "Archer";
                    } else {
                        let leapClass = getNameByClass("Healer");
                        leapString = leapClass !== null ? leapClass : "Healer";
                    }
                }
            } else if (isPlayerInBox(-6, 160, 123, 19, 100, 50)) {
                if (sharedData.atcore) {
                    leapString = sharedData.atcore;
                } else {
                    let leapClass = getNameByClass("Mage");
                    leapString = leapClass !== null ? leapClass : "Mage";
                }
            } else if (isPlayerInBox(17, 160, 27, 90, 100, 50)) {
                if (sharedData.inTunnel) {
                    leapString = sharedData.inTunnel;
                } else {
                    let leapClass = getNameByClass("Mage");
                    leapString = leapClass !== null ? leapClass : "Mage";
                }
            }
        }
        if (inNecron) {
            let leapClass = getNameByClass("Healer");
            leapString = leapClass !== null ? leapClass : "Healer";
        }
    }

    return leapString;
}



register(MouseEvent, (event) => {
    if (!config.FastLeap) return;
    
    const button = event.button
    const state = event.buttonstate

    if (!state) return
    if (button !== 0) return;

    if (getHeldItemID() !== "INFINITE_SPIRIT_LEAP") return;
    cancel(event)

    rightClick()

    let leapTo = getLeap()
    if (!leapTo || !leapTo.length) return;

    leapHelper.queueLeap(leapTo)
    
})
