import config from "../config";
import { registerWhen } from "../../BloomCore/utils/Utils";
import { data } from "../util/data";

// Track cooldowns in ticks (20 ticks = 1 second)
let bonzoCooldownTicks = 0;
let spiritCooldownTicks = 0;
let phoenixCooldownTicks = 0;

let inBoss = false;

const S32PacketConfirmTransaction = Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction")

// Create Text objects for drawing on-screen for each ability.
let bonzoTextObj = new Text("").setScale(1).setShadow(true).setAlign("CENTER");
let spiritTextObj = new Text("").setScale(1).setShadow(true).setAlign("CENTER");
let phoenixTextObj = new Text("").setScale(1).setShadow(true).setAlign("CENTER");


// Create packet handlers for each cooldown
let bonzoTickCounter = register('packetReceived', () => {
    bonzoCooldownTicks--;
    if (bonzoCooldownTicks <= 0) {
        bonzoCooldownTicks = 0;
        bonzoTickCounter.unregister();
    }
}).setFilteredClass(S32PacketConfirmTransaction).unregister();

let spiritTickCounter = register('packetReceived', () => {
    spiritCooldownTicks--;
    if (spiritCooldownTicks <= 0) {
        spiritCooldownTicks = 0;
        spiritTickCounter.unregister();
    }
}).setFilteredClass(S32PacketConfirmTransaction).unregister();

let phoenixTickCounter = register('packetReceived', () => {
    phoenixCooldownTicks--;
    if (phoenixCooldownTicks <= 0) {
        phoenixCooldownTicks = 0;
        phoenixTickCounter.unregister();
    }
}).setFilteredClass(S32PacketConfirmTransaction).unregister();

// ── Ability Trigger Chat Events ──

registerWhen(register("chat", () => {
    inBoss = true;
    }).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!"), () => config.MaskGui);

// (1) Bonzo's Mask trigger (dynamic cooldown):
registerWhen(
  register("chat", () => {
    // Only update when the ability is triggered.
    let helmet = Player.getInventory().getStackInSlot(39);
    if (helmet) {
      let lore = helmet.getLore();
      for (let line of lore) {
        // Remove formatting so our regex works reliably.
        let stripped = ChatLib.removeFormatting(line);
        if (stripped.includes("Cooldown:")) {
          // Expecting a line like: "Cooldown: 205s"
          let cooldownMatch = stripped.match(/Cooldown:\s*(\d+)s/);
          if (cooldownMatch) {
            let cdSeconds = parseInt(cooldownMatch[1]);
            // Convert seconds to ticks (20 ticks = 1 second)
            bonzoCooldownTicks = cdSeconds * 20;
            // Unregister existing counter if running
            bonzoTickCounter.unregister();
            // Register new counter
            bonzoTickCounter.register();
          }
          break; // Found the cooldown line; stop checking further.
        }
      }
    }
  }).setCriteria("Your ⚚ Bonzo's Mask saved your life!"),
  () => config.MaskGui && inBoss
);

// (2) Spirit ability trigger (fixed 30-second cooldown):
registerWhen(
  register("chat", () => {
    spiritCooldownTicks = 30 * 20; // 30 seconds in ticks
    // Unregister existing counter if running
    spiritTickCounter.unregister();
    // Register new counter
    spiritTickCounter.register();
  }).setCriteria("Second Wind Activated! Your Spirit Mask saved your life!"),
  () => config.MaskGui && inBoss
);

// (3) Phoenix ability trigger (fixed 60-second cooldown):
registerWhen(
  register("chat", () => {
    phoenixCooldownTicks = 60 * 20; // 60 seconds in ticks
    // Unregister existing counter if running
    phoenixTickCounter.unregister();
    // Register new counter
    phoenixTickCounter.register();
  }).setCriteria("Your Phoenix Pet saved you from certain death!"),
  () => config.MaskGui && inBoss
);

// ── Packet-Based Tick Handler ──
// This uses transaction packets for more accurate timing



// ── Render Overlay ──
// This draws a multi-line string for all three abilities.

registerWhen(
  register("renderOverlay", () => {
    // Get color codes based on the selected indices
    const colorCodes = ["§0", "§1", "§2", "§3", "§4", "§5", "§6", "§7", "§8", "§9", "§a", "§b", "§c", "§d", "§e", "§f"];
    const nameColor = colorCodes[config.MaskNameColor];
    const cooldownColor = colorCodes[config.CooldownColor];
    const readyColor = colorCodes[config.ReadyColor];

    // Calculate seconds from ticks, rounding up for better user experience
    let bonzoSecondsLeft = (bonzoCooldownTicks / 20).toFixed(1);
    let spiritSecondsLeft = (spiritCooldownTicks / 20).toFixed(1);
    let phoenixSecondsLeft = (phoenixCooldownTicks / 20).toFixed(1);

    // If the remaining time is positive, show the countdown; otherwise, show "Ready!"
    let bonzoDisplay = (bonzoCooldownTicks > 0)
      ? `§o${nameColor}Bonzo: §r${cooldownColor}${bonzoSecondsLeft}s`
      : `§o${nameColor}Bonzo: §r${readyColor}§o✔`;
    let spiritDisplay = (spiritCooldownTicks > 0)
      ? `§o${nameColor}Spirit: §r${cooldownColor}${spiritSecondsLeft}s`
      : `§o${nameColor}Spirit: §r${readyColor}§o✔`;
    let phoenixDisplay = (phoenixCooldownTicks > 0)
      ? `§o${nameColor}Phoenix: §r${cooldownColor}${phoenixSecondsLeft}s`
      : `§o${nameColor}Phoenix: §r${readyColor}§o✔`;

    // Combine the three lines into one multi-line string.
    let combinedText = `${bonzoDisplay}\n${spiritDisplay}\n${phoenixDisplay}`;

    // Use your config settings for scaling and position.
    let scale = data.MaskGui.scale;
    let originX = data.MaskGui.x;
    let originY = data.MaskGui.y;

    Renderer.scale(scale, scale);
    Renderer.translate(originX / scale, originY / scale);
    Renderer.drawStringWithShadow(combinedText, 0, 0);
  }),
  () => (config.MaskGui && inBoss) || config.MaskGuiGui.isOpen()
);


// Reset everything when changing worlds
register("worldUnload", () => {
    bonzoCooldownTicks = 0;
    spiritCooldownTicks = 0;
    phoenixCooldownTicks = 0;
    inBoss = false;
    
    // Unregister all packet handlers
    bonzoTickCounter.unregister();
    spiritTickCounter.unregister();
    phoenixTickCounter.unregister();
});

// GUI Movement and Scaling Functions
register("dragged", (dx, dy, x, y, bn) => {
    if (!config.MaskGuiGui.isOpen() || bn == 2) return
    data.MaskGui.x = x
    data.MaskGui.y = y
    data.save()
})

register("scrolled", (x, y, dir) => {
    if (!config.MaskGuiGui.isOpen()) return
    if (dir == 1) data.MaskGui.scale += 0.05
    else data.MaskGui.scale -= 0.05
    data.save()
})

// Handle mouse click in the GUI
register("guiMouseClick", (x, y, bn) => {
    if (!config.MaskGuiGui.isOpen() || bn != 2) return
    data.MaskGui.x = Renderer.screen.getWidth() / 2
    data.MaskGui.y = Renderer.screen.getHeight() / 2 + 10
    data.MaskGui.scale = 1
    data.save()
})