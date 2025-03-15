import { renderBlockHitbox } from "../../BloomCore/RenderUtils";
import Dungeon from "../../BloomCore/dungeons/Dungeon";
import { getDistanceToCoord, getDistanceToEntity } from "../../BloomCore/utils/utils"
import { C08PacketPlayerBlockPlacement, MCBlockPos, registerWhen } from "../../BloomCore/utils/Utils";
import config from "../config";
import RenderLib from "../../RenderLib"

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
    // Simple direct conversion without complex logic
    switch (type) {
        case 'volume':
            // Return a reasonable volume value (0-1)
            return percentage
            
        case 'pitch':
            // Return a reasonable pitch value (0.5-2.0)
            return (percentage*2)
            
        default:
            return percentage;
    }
}

// Maps to store highlights for different types of objects
const blockHighlights = new Map(); // [blockStr: {block: ctBlock, locked: false}]
const entityHighlights = new Map(); // [posStr: {x, y, z, type, time, w, h}]

// Timestamp tracking for chest interactions to implement suppression window
let lastChestInteractionTime = 0;

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

// Helper function to validate coordinates
function isValidCoordinate(coord) {
    return typeof coord === 'number' && !isNaN(coord) && isFinite(coord);
}

const highlightBlock = (block) => {
    if (!block || !config.showSecretClicks || !Dungeon.inDungeon) return;
    
    const blockStr = block.toString();
    blockHighlights.set(blockStr, {
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
            
            World.playSound(sound, volume, pitch);
        } catch (e) {
            ChatLib.chat("§cError playing sound: " + e);
        }
    }
    
    Client.scheduleTask(20, () => blockHighlights.delete(blockStr));
};

// Function to highlight entity positions (bats, items, etc)
const highlightEntity = (x, y, z, type, width = 1, height = 1) => {
    if (!config.showSecretClicks || !Dungeon.inDungeon) return;
    
    // Validate coordinates
    if (!isValidCoordinate(x) || !isValidCoordinate(y) || !isValidCoordinate(z)) {
        return;
    }
    
    const posStr = `${type}:${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)}`;
    
    entityHighlights.set(posStr, {
        x: x,
        y: y,
        z: z,
        type: type,
        time: Date.now(),
        w: width,
        h: height
    });
    
    // Play a sound when highlighting an entity
    if (config.playSoundOnSecretClick) {
        try {
            const sound = getStringForValue(config.secretClickSound);
            const volume = percentageToAudioSetting(config.secretClickVolume, 'volume');
            const pitch = percentageToAudioSetting(config.secretClickPitch, 'pitch');
            
            World.playSound(sound, volume, pitch);
        } catch (e) {
            ChatLib.chat("§cError playing sound: " + e);
        }
    }
    
    // Automatically remove the highlight after 2 seconds
    Client.scheduleTask(40, () => entityHighlights.delete(posStr));
};

const isValidSkull = (x, y, z) => {
    try {
        const tileEntity = World.getWorld().func_175625_s(new MCBlockPos(x, y, z));
        if (!tileEntity || !tileEntity.func_152108_a()) return false;
        const skullID = tileEntity.func_152108_a().getId().toString();
        
        return validSkullIDs.includes(skullID);
    } catch (e) {
        return false;
    }
};

// Clear all highlights when leaving a world
register("worldUnload", () => {
    blockHighlights.clear();
    entityHighlights.clear();
});

// Clear highlights when leaving a dungeon
registerWhen(register("tick", () => {
    if (!Dungeon.inDungeon) {
        blockHighlights.clear();
        entityHighlights.clear();
    }
}), () => config.showSecretClicks);

register("packetSent", (packet) => {
    if (!config.showSecretClicks || !Dungeon.inDungeon) return;
    
    try {
        const pos = packet.func_179724_a();
        if (!pos) return;
        
        const bp = new BlockPos(pos);
        
        const x = bp.x;
        const y = bp.y;
        const z = bp.z;
        
        const block = World.getBlockAt(x, y, z);
        if (!block) return;
        
        const blockName = block.type.getRegistryName();
        
        if (!validBlocks.includes(blockName) || blockHighlights.has(block.toString())) return;
        if (blockName == "minecraft:skull" && !isValidSkull(x, y, z)) return;
        
        // Record chest interaction time for suppression window implementation
        if (blockName === "minecraft:chest" || blockName === "minecraft:trapped_chest") {
            lastChestInteractionTime = Date.now();
        }
        
        highlightBlock(block);
    } catch (e) {
        // Silently handle any errors
    }
}).setFilteredClass(C08PacketPlayerBlockPlacement);

registerWhen(register("soundPlay", (pos, name, vol, pitch, category, event) => {
    if (!Dungeon.inDungeon) return;
    
    if ((name == "mob.bat.hurt" && vol == 0.10000000149011612) || name == "mob.bat.death") {
        // Access Vector3f properties directly using their appropriate field names
        // instead of array destructuring which doesn't work with Java objects
        const x = pos.x;
        const y = pos.y;
        const z = pos.z;
        
        // Validate coordinates before highlighting
        if (isValidCoordinate(x) && isValidCoordinate(y) && isValidCoordinate(z)) {
            highlightEntity(x, y, z, "bat", 1, 1);
        }
    }
}), () => config.showSecretClicks);


const drops = ["item.item.monsterPlacer", "item.item.bone", "item.item.skull.char", "item.tile.weightedPlate_heavy", "item.item.enderPearl", "item.item.potion", "item.item.skull.char", "item.item.shears", "item.item.paper", "item.tile.tripWireSource"]

register(Java.type("me.odinmain.events.impl.EntityLeaveWorldEvent"), (event) => { // Item pickup listener
    // Add missing dungeon context validation
    if (!config.showSecretClicks || !Dungeon.inDungeon) return;
    
    try {
        const entity = event.getEntity();
        if (!(entity instanceof net.minecraft.entity.item.EntityItem)) return;
        
        const wrappedEntity = new Entity(entity);
        const name = wrappedEntity.getName();
        if (!drops.includes(name)) return;
        
        if (getDistanceToEntity(wrappedEntity) > 6) return;
        
        // Implement temporal suppression window: suppress item highlights for 2 seconds after chest interaction
        const currentTime = Date.now();
        if (currentTime - lastChestInteractionTime < 2000) {
            // Within suppression window, skip highlighting
            return;
        }
        
        // Extract position from entity name if possible
        const entityStr = entity.toString();
        
        // Parse coordinates from the string
        const xMatch = entityStr.match(/x=(-?[0-9.]+)/);
        const yMatch = entityStr.match(/y=(-?[0-9.]+)/);
        const zMatch = entityStr.match(/z=(-?[0-9.]+)/);
        
        if (xMatch && yMatch && zMatch) {
            const x = parseFloat(xMatch[1]);
            const y = parseFloat(yMatch[1]);
            const z = parseFloat(zMatch[1]);
            
            // Validate coordinates before highlighting
            if (isValidCoordinate(x) && isValidCoordinate(y) && isValidCoordinate(z)) {
                highlightEntity(x, y, z, "item", 0.5, 0.5);
            }
        }
    } catch (e) {
        // Silently handle any errors to prevent disruption
    }
});

const renderBlockHighlight = (block, r, g, b) => {
    renderBlockHitbox(block, r, g, b, 1, true, 2, false);
    renderBlockHitbox(block, r, g, b, 0.2, true, 2, true);
};

register("renderWorld", () => {
    if (!config.showSecretClicks || !Dungeon.inDungeon) return;
    
    // Render block highlights
    const r = config.showSecretClicksColor.getRed() / 255;
    const g = config.showSecretClicksColor.getGreen() / 255;
    const b = config.showSecretClicksColor.getBlue() / 255;
    
    blockHighlights.forEach((value, blockStr) => {
        let { block, locked } = value;
        if (locked) renderBlockHighlight(block, 1, 0, 0);
        else renderBlockHighlight(block, r, g, b);
    });
    
    // Render entity highlights using RenderLib
    const currentTime = Date.now();
    entityHighlights.forEach((highlight, posStr) => {
        // Skip if highlight is too old
        if (currentTime - highlight.time > 3000) {
            entityHighlights.delete(posStr);
            return;
        }
        
        // Draw ESP box using RenderLib
        RenderLib.drawEspBox(
            highlight.x, 
            highlight.y, 
            highlight.z, 
            highlight.w, 
            highlight.h, 
            r, 
            g, 
            b, 
            1, 
            true
        );
    });
});

register("chat", () => {
    if (!blockHighlights.size) return;
    // Set the chest to be locked
    for (let obj of blockHighlights.values()) {
        if (obj.block.type.getRegistryName() !== "minecraft:chest") continue;
        obj.locked = true;
        
        // Play a specific sound for locked chests if enabled
        if (config.playSoundOnLockedChest) {
            World.playSound("random.break", config.secretClickVolume || 1.0, 0.5);
        }
        
        return;
    }
}).setCriteria(/^That chest is locked!$/);