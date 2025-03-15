import config from "../config";
import RenderLib from "../../RenderLib";
import packetBlockChange from "../events/packetBlockChange";
import packetMultiBlockChange from "../events/packetMultiBlockChange";
import packetTitle from "../events/packetTitle";
import packetChat from "../events/packetChat";
const MCBlock = Java.type("net.minecraft.block.Block");
const blocks = [[68, 130, 50], [66, 130, 50], [64, 130, 50], [68, 128, 50], [66, 128, 50], [64, 128, 50], [68, 126, 50], [66, 126, 50], [64, 126, 50]];
let on4thDevice = false;
const highlighted = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let notified = false;


const trigger1 = register("step", () => {
	on4thDevice = Player.getX() > 63 && Player.getX() < 64 && Player.getY() === 127 && Player.getZ() > 35 && Player.getZ() < 36;
	if (on4thDevice) return;
	notified = false;
	for (let i = 0; i < highlighted.length; ++i) highlighted[i] = 0;
}).setFps(1).unregister();
function onBlock(position, block) {
	if (!on4thDevice) return;
	const index = blocks.findIndex(xyz => position.every((coord, index) => coord === xyz[index]));
	if (index === -1) return;
	const id = MCBlock.func_149682_b(block);
	if (id === 159) {
		highlighted[index] = 1;
	} else if (id === 133) {
		highlighted[index] = 2;
	}
}
function onBlocks(blocks) {
	for (let block of blocks) onBlock(...block);
}
const trigger2 = register("renderWorld", () => {
	if (!on4thDevice) return;
    
    // Get list of completed/red blocks
    const done = [];
    for (let i = 0; i < highlighted.length; ++i) {
        if (highlighted[i] === 1) done.push(i);
    }
    
	for (let i = 0; i < highlighted.length; ++i) {
		let rgb = [];
		let position = blocks[i];
		if (highlighted[i] === 0) continue;
		else if (highlighted[i] === 1) rgb = [255, 0, 0];
		else if (highlighted[i] === 2) rgb = [0, 255, 0];
		RenderLib.drawInnerEspBox(position[0] + 0.5, position[1], position[2] + 0.5, 1, 1, ...rgb, 255, true);
        
        if (highlighted[i] === 2) { 
            // Determine column based on x-coordinate
            const blockX = position[0];
            const blockY = position[1];
            const blockZ = position[2];
            
            // Determine column (left, middle, right)
            const columnIndex = i % 3; // 0 = right, 1 = middle, 2 = left
            
            if (columnIndex === 2) { 
                const aimPos = [blockX + 1.5, blockY + 1, blockZ];
                RenderLib.drawSphere(aimPos[0], aimPos[1], aimPos[2], 0.3, 20, 20, 0, 0, 0, 255, 255, 0, 200, false, false);
            } else if (columnIndex === 0) { 
                const aimPos = [blockX - 0.5, blockY + 1, blockZ];
                RenderLib.drawSphere(aimPos[0], aimPos[1], aimPos[2], 0.3, 20, 20, 0, 0, 0, 255, 255, 0, 200, false, false);
            } else { // Middle column
                // Check both neighbors
                const leftNeighborIndex = i + 1;
                const rightNeighborIndex = i - 1;
                const leftDone = done.includes(leftNeighborIndex);
                const rightDone = done.includes(rightNeighborIndex);
                
                if (leftDone && !rightDone) {
                    // If left is done, aim right
                    const aimPos = [blockX + 1.5, blockY + 1, blockZ];
                    RenderLib.drawSphere(aimPos[0], aimPos[1], aimPos[2], 0.3, 20, 20, 0, 0, 0, 255, 255, 0, 200, false, false);
                } else if (rightDone && !leftDone) {
                    // If right is done, aim left
                    const aimPos = [blockX - 0.5, blockY + 1, blockZ];
                    RenderLib.drawSphere(aimPos[0], aimPos[1], aimPos[2], 0.3, 20, 20, 0, 0, 0, 255, 255, 0, 200, false, false);
                } else {
                    // If neither is done or both are done, show both options
                    const leftAimPos = [blockX - 0.5, blockY + 1, blockZ];
                    const rightAimPos = [blockX + 1.5, blockY + 1, blockZ];
                    RenderLib.drawSphere(leftAimPos[0], leftAimPos[1], leftAimPos[2], 0.3, 20, 20, 0, 0, 0, 255, 255, 0, 200, false, false);
                    RenderLib.drawSphere(rightAimPos[0], rightAimPos[1], rightAimPos[2], 0.3, 20, 20, 0, 0, 0, 255, 255, 0, 200, false, false);
                }
            }
        }
	}
}).unregister();
function onChat(message) {
	if (!on4thDevice) return;
	const match = message.match(/^(.*) completed a device! \(\d\/\d\)$/);
	if (match === null) return;
	const [_0, player] = match;
	const match2 = Player.getDisplayName().getText().match(/^.*§a(\S*).*$/) ?? [, Player.getName()]; 
	const [_1, name] = match2;
	if (player !== name) return;
	notifyDone();
}
function onTitle(type, message, _, event) {
	if (!on4thDevice) return;
	if (type !== "SUBTITLE") return;
	if (!/^.* completed a device! \(\d\/\d\)$/.test(message) && !/^.* activated a terminal! \(\d\/\d\)$/.test(message) && !/^.* activated a lever! \(\d\/\d\)$/.test(message) && !/^The gate will open in 5 seconds!$/.test(message) && !/^The gate has been destroyed!$/.test(message)) return;
	cancel(event);
}
function notifyDone() {
	if (notified) return;
	notified = true;
	Client.showTitle(" ", "§ai4 Done!", 0, 30, 0);
	ChatLib.command("pc i4 Done");
	World.playSound("note.pling", 1, 1.414);
	setTimeout(() => World.playSound("note.pling", 1, 1.587), 150);
	setTimeout(() => World.playSound("note.pling", 1, 1.782), 300);
}



function enable() {
	packetBlockChange.addListener(onBlock);
	packetMultiBlockChange.addListener(onBlocks);
	packetChat.addListener(onChat);
	packetTitle.addListener(onTitle);
	trigger1.register();
	trigger2.register();
}
function disable() {
	packetBlockChange.removeListener(onBlock);
	packetMultiBlockChange.removeListener(onBlocks);
	packetChat.removeListener(onChat);
	packetTitle.removeListener(onTitle);
	trigger1.unregister();
	trigger2.unregister();
}
register('worldLoad', () => {
    disable()
})
register("chat", () => {
    if (config.i4helper) enable()
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")
register("chat", () => {
    if (config.i4helper) disable()
}).setCriteria("The Core entrance is opening!")