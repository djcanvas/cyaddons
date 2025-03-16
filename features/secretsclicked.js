import { renderBlockHitbox } from "../../BloomCore/RenderUtils";
import Dungeon from "../../BloomCore/dungeons/Dungeon";
import { getDistanceToCoord, getDistanceToEntity } from "../../BloomCore/utils/utils";
import { C08PacketPlayerBlockPlacement, MCBlockPos, registerWhen } from "../../BloomCore/utils/Utils";
import config from "../config";
import RenderLib from "../../RenderLib";

// ====== Constants ======
const SOUND_OPTIONS = [
    "random.orb",    // index 0
    "mob.blaze.hit", // index 1
    "note.harp",     // index 2
    "note.pling"     // index 3
];

const VALID_BLOCKS = [
    "minecraft:chest",
    "minecraft:lever",
    "minecraft:skull",
    "minecraft:trapped_chest",
];

const VALID_SKULL_IDS = [
    "e0f3e929-869e-3dca-9504-54c666ee6f23", // Wither Essence
    "fed95410-aba1-39df-9b95-1d4f361eb66e"  // Redstone Key
];

const VALID_ITEM_DROPS = [
    "item.item.monsterPlacer", 
    "item.item.bone", 
    "item.item.skull.char", 
    "item.tile.weightedPlate_heavy", 
    "item.item.enderPearl", 
    "item.item.potion", 
    "item.item.skull.char", 
    "item.item.shears", 
    "item.item.paper", 
    "item.tile.tripWireSource"
];

const HIGHLIGHT_DURATION_TICKS = 40; // 2 seconds
const CHEST_SUPPRESSION_WINDOW = 1000; // 1 second in ms

// ====== State Storage ======
const blockHighlights = new Map(); // [blockStr: {block: ctBlock, locked: false}]
const entityHighlights = new Map(); // [posStr: {x, y, z, type, time, w, h}]
let lastChestInteractionTime = 0;

// ====== Utility Functions ======
/**
 * Gets the sound string based on a numeric value
 * @param {number} value - Index of sound to play
 * @returns {string} - Sound identifier
 */
function getSoundString(value) {
    if (value >= 0 && value < SOUND_OPTIONS.length) {
        return SOUND_OPTIONS[value];
    }
    return SOUND_OPTIONS[0]; // Default to first sound
}

/**
 * Converts percentage to audio setting
 * @param {number} percentage - Value to convert
 * @param {string} type - 'volume' or 'pitch'
 * @returns {number} - Converted value
 */
function percentageToAudioSetting(percentage, type) {
    switch (type) {
        case 'volume':
            return percentage;
        case 'pitch':
            return percentage * 2;
        default:
            return percentage;
    }
}

/**
 * Validates if a coordinate is usable
 * @param {any} coord - Coordinate to check
 * @returns {boolean} - True if valid
 */
function isValidCoordinate(coord) {
    return typeof coord === 'number' && !isNaN(coord) && isFinite(coord);
}

/**
 * Checks if coordinates are valid
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} z - Z coordinate
 * @returns {boolean} - True if all coordinates are valid
 */
function areValidCoordinates(x, y, z) {
    return isValidCoordinate(x) && isValidCoordinate(y) && isValidCoordinate(z);
}

/**
 * Plays configured secret click sound
 */
function playSecretClickSound() {
    if (!config.playSoundOnSecretClick) return;
    
    try {
        const sound = getSoundString(config.secretClickSound);
        const volume = percentageToAudioSetting(config.secretClickVolume, 'volume');
        const pitch = percentageToAudioSetting(config.secretClickPitch, 'pitch');
        
        World.playSound(sound, volume, pitch);
    } catch (e) {
        ChatLib.chat("§cError playing sound: " + e);
    }
}

/**
 * Checks if a skull at the given position is of a valid type
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} z - Z coordinate
 * @returns {boolean} - True if valid skull
 */
function isValidSkull(x, y, z) {
    try {
        const tileEntity = World.getWorld().func_175625_s(new MCBlockPos(x, y, z));
        if (!tileEntity || !tileEntity.func_152108_a()) return false;
        
        const skullID = tileEntity.func_152108_a().getId().toString();
        return VALID_SKULL_IDS.includes(skullID);
    } catch (e) {
        return false;
    }
}

/**
 * Renders a block highlight
 * @param {object} block - Block to highlight
 * @param {number} r - Red component (0-1)
 * @param {number} g - Green component (0-1)
 * @param {number} b - Blue component (0-1)
 */
function renderBlockHighlight(block, r, g, b) {
    renderBlockHitbox(block, r, g, b, 1, true, 2, false);
    renderBlockHitbox(block, r, g, b, 0.2, true, 2, true);
}

// ====== Core Functionality ======
/**
 * Highlights a block
 * @param {object} block - Block to highlight
 */
function highlightBlock(block) {
    if (!block || !config.showSecretClicks || !Dungeon.inDungeon) return;
    
    const blockStr = block.toString();
    blockHighlights.set(blockStr, {
        block: block,
        locked: false
    });
    
    playSecretClickSound();
    
    // Schedule removal of highlight
    Client.scheduleTask(HIGHLIGHT_DURATION_TICKS, () => blockHighlights.delete(blockStr));
}

/**
 * Highlights an entity position
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} z - Z coordinate
 * @param {string} type - Entity type
 * @param {number} width - Width of highlight
 * @param {number} height - Height of highlight
 */
function highlightEntity(x, y, z, type, width = 1, height = 1) {
    if (!config.showSecretClicks || !Dungeon.inDungeon) return;
    if (!areValidCoordinates(x, y, z)) return;
    
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
    
    playSecretClickSound();
    
    // Schedule removal of highlight
    Client.scheduleTask(HIGHLIGHT_DURATION_TICKS, () => entityHighlights.delete(posStr));
}

// ====== Event Handlers ======
/**
 * Clear all highlights when leaving a world
 */
register("worldUnload", () => {
    blockHighlights.clear();
    entityHighlights.clear();
});

/**
 * Clear highlights when leaving a dungeon
 */
registerWhen(register("tick", () => {
    if (!Dungeon.inDungeon) {
        blockHighlights.clear();
        entityHighlights.clear();
    }
}), () => config.showSecretClicks);

/**
 * Handle block placement packets for secret detection
 */
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
        
        // Skip if not a valid block or already highlighted
        if (!VALID_BLOCKS.includes(blockName) || blockHighlights.has(block.toString())) return;
        if (blockName === "minecraft:skull" && !isValidSkull(x, y, z)) return;
        
        // Record chest interaction time for suppression window
        if (blockName === "minecraft:chest" || blockName === "minecraft:trapped_chest") {
            lastChestInteractionTime = Date.now();
        }
        
        highlightBlock(block);
    } catch (e) {
        // Silently handle errors to prevent disruption
    }
}).setFilteredClass(C08PacketPlayerBlockPlacement);

// ====== Event Types ======
const SecretPickupEvent = Java.type("me.odinmain.events.impl.SecretPickupEvent");
const SecretPickupEvent_Interact = Java.type("me.odinmain.events.impl.SecretPickupEvent$Interact");
const SecretPickupEvent_Item = Java.type("me.odinmain.events.impl.SecretPickupEvent$Item");
const SecretPickupEvent_Bat = Java.type("me.odinmain.events.impl.SecretPickupEvent$Bat");

/**
 * Handle interact events
 */
register(SecretPickupEvent_Interact, (event) => {
});

/**
 * Handle item pickup events
 */
register(SecretPickupEvent_Item, (event) => {
    try {
        const entity = event.getEntity();
        if (!(entity instanceof net.minecraft.entity.item.EntityItem)) return;
        
        const wrappedEntity = new Entity(entity);
        const name = wrappedEntity.getName();
        if (!VALID_ITEM_DROPS.includes(name)) return;
        
        if (getDistanceToEntity(wrappedEntity) > 6) return;
        
        // Check if within suppression window
        if (Date.now() - lastChestInteractionTime < CHEST_SUPPRESSION_WINDOW) return;
        
        // Extract position from entity string
        const entityStr = entity.toString();
        const xMatch = entityStr.match(/x=(-?[0-9.]+)/);
        const yMatch = entityStr.match(/y=(-?[0-9.]+)/);
        const zMatch = entityStr.match(/z=(-?[0-9.]+)/);
        
        if (xMatch && yMatch && zMatch) {
            const x = parseFloat(xMatch[1]);
            const y = parseFloat(yMatch[1]);
            const z = parseFloat(zMatch[1]);
            
            if (areValidCoordinates(x, y, z)) {
                highlightEntity(x, y, z, "item", 0.5, 0.5);
            }
        }
    } catch (e) {
        // Silent error handling
    }
}), () => config.showSecretClicks;

/**
 * Handle bat detection events
 */
register(SecretPickupEvent_Bat, (event) => {
    try {
        const packet = event.packet;
        const x = packet.func_149207_d();
        const y = packet.func_149211_e();
        const z = packet.func_149210_f();

        if (areValidCoordinates(x, y, z)) {
            highlightEntity(x, y, z, "bat", 1, 1);
        }
    } catch (e) {
        ChatLib.chat("§cError highlighting bat: " + e);
    }
}), () => config.showSecretClicks;

/**
 * Render highlighted blocks and entities
 */
register("renderWorld", () => {
    if (!config.showSecretClicks || !Dungeon.inDungeon) return;
    
    // Get configured color
    const r = config.showSecretClicksColor.getRed() / 255;
    const g = config.showSecretClicksColor.getGreen() / 255;
    const b = config.showSecretClicksColor.getBlue() / 255;
    
    // Render block highlights
    blockHighlights.forEach((value, blockStr) => {
        const { block, locked } = value;
        if (locked) {
            renderBlockHighlight(block, 1, 0, 0); // Red for locked
        } else {
            renderBlockHighlight(block, r, g, b); // Configured color
        }
    });
    
    // Render entity highlights
    const currentTime = Date.now();
    entityHighlights.forEach((highlight, posStr) => {
        // Remove if too old
        if (currentTime - highlight.time > 3000) {
            entityHighlights.delete(posStr);
            return;
        }
        
        // Draw ESP box
        RenderLib.drawEspBox(
            highlight.x, 
            highlight.y, 
            highlight.z, 
            highlight.w, 
            highlight.h, 
            r, g, b, 1, true
        );
    });
});

/**
 * Handle locked chest messages
 */
register("chat", () => {
    if (!blockHighlights.size) return;
    
    // Mark chest as locked
    for (let obj of blockHighlights.values()) {
        if (obj.block.type.getRegistryName() !== "minecraft:chest") continue;
        
        obj.locked = true;
        
        // Play locked chest sound if enabled
        if (config.playSoundOnLockedChest) {
            World.playSound("random.break", config.secretClickVolume || 1.0, 0.5);
        }
        
        return;
    }
}).setCriteria(/^That chest is locked!$/);