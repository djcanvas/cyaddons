import { renderBlockHitbox } from "../../BloomCore/RenderUtils";
import Dungeon from "../../BloomCore/dungeons/Dungeon";
import { C08PacketPlayerBlockPlacement, MCBlockPos } from "../../BloomCore/utils/Utils";
import config from "../config";

// Function to get the sound string based on a numeric value
function getStringForValue(value) {
    const sounds = [
        "random.orb",     // index 0
        "mob.blaze.hit",  // index 1
        "note.harp",      // index 2
        "note.pling"      // index 3
    ];
    
    // Make sure value is within bounds of the array
    if (value >= 0 && value < sounds.length) {
        return sounds[value];
    }
    
    // Default to the first sound if value is invalid
    return sounds[0];
}

function percentageToAudioSetting(percentage, type) {
    // Ensure percentage is between 0-100
   
   
    switch (type) {
        case 'volume':
            // Convert percentage (0-100) to volume (0-1)
            return percentage;
            
        case 'pitch':
            // Convert percentage (0-100) to pitch (0-2)
            return (percentage * 2);
            
        default:
            return percentage 
    }
}

const highlights = new Map(); // [blockStr: {block: ctBlock, locked: false}]
const validBlocks = [
    "minecraft:chest",
    "minecraft:lever",
    "minecraft:skull",
    "minecraft:trapped_chest",
];
const validSkullIDs = [
    "e0f3e929-869e-3dca-9504-54c666ee6f23", // Wither Essence
    "fed95410-aba1-39df-9b95-1d4f361eb66e"  // Redstone Key
];

const highlightBlock = (block) => {
    const blockStr = block.toString();
    highlights.set(blockStr, {
        block: block,
        locked: false
    });
    
    // Play a sound when highlighting a valid block if enabled
    if (config.playSoundOnSecretClick) {
        try {
            // Get the sound string based on the config value
            

            const sound = getStringForValue(config.secretClickSound);
            const volume = percentageToAudioSetting(config.secretClickVolume, 'volume');
            const pitch = percentageToAudioSetting(config.secretClickPitch, 'pitch');
            

            World.playSound(sound, volume , pitch);
        } catch (e) {
            ChatLib.chat("§cError playing sound: " + e);
        }
    }
    
    Client.scheduleTask(20, () => highlights.delete(blockStr));
};

const isValidSkull = (x, y, z) => {
    const tileEntity = World.getWorld().func_175625_s(new MCBlockPos(x, y, z));
    if (!tileEntity || !tileEntity.func_152108_a()) return false;
    const skullID = tileEntity.func_152108_a().getId().toString();
    
    return validSkullIDs.includes(skullID);
};

// Just in case
register("worldUnload", () => highlights.clear());

register("packetSent", (packet) => {
    if (!config.showSecretClicks || !Dungeon.inDungeon) return;
    const pos = packet.func_179724_a();
    const bp = new BlockPos(pos);
    
    const x = bp.x;
    const y = bp.y;
    const z = bp.z;
    
    const block = World.getBlockAt(x, y, z);
    const blockName = block.type.getRegistryName();
    
    if (!validBlocks.includes(blockName) || highlights.has(block.toString())) return;
    if (blockName == "minecraft:skull" && !isValidSkull(x, y, z)) return;
    highlightBlock(block);
}).setFilteredClass(C08PacketPlayerBlockPlacement);

const renderBlockHighlight = (block, r, g, b) => {
    renderBlockHitbox(block, r, g, b, 1, true, 2, false);
    renderBlockHitbox(block, r, g, b, 0.2, true, 2, true);
};

register("renderWorld", () => {
    const r = config.showSecretClicksColor.getRed() / 255;
    const g = config.showSecretClicksColor.getGreen() / 255;
    const b = config.showSecretClicksColor.getBlue() / 255;
    
    for (let value of highlights.values()) {
        let { block, locked } = value;
        if (locked) renderBlockHighlight(block, 1, 0, 0);
        else renderBlockHighlight(block, r, g, b);
    }
});

register("chat", () => {
    if (!highlights.size) return;
    // Set the chest to be locked
    for (let obj of highlights.values()) {
        if (obj.block.type.getRegistryName() !== "minecraft:chest") continue;
        obj.locked = true;
        
        // Play a specific sound for locked chests if enabled
        if (config.playSoundOnLockedChest) {
            World.playSound("random.break", config.secretClickVolume || 1.0, 0.5);
        }
        
        return;
    }
}).setCriteria(/^That chest is locked!$/);

