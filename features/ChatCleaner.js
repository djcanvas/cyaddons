import config from "../config";
import RenderLib from '../../RenderLib';
import { isInDungeon } from "../util/util"
import { registerWhen } from "../../BloomCore/utils/Utils"
import { getOwnClass } from "../util/player"




// Main event to hide bonemeal on armor stands
const onRenderEntity = registerWhen(
    register("renderEntity", (entity, pos, partialTicks, event) => {
        try {
            // Check if it's an armor stand by examining the entity's string representation
            const entityStr = entity.toString();
            if (!entityStr.includes("dyePowder.white")) return;

            // Check distance
            const playerPos = { x: Player.getX(), y: Player.getY(), z: Player.getZ() };

            if (entity.distanceTo(playerPos.x, playerPos.y, playerPos.z) > 6) return;

            cancel(event);
        } catch (e) {
            ChatLib.chat(`&cError while hiding bonemeal: ${e}`);
        }
    }),
    () => (isInDungeon() && (getOwnClass() == "Archer"))
);









// List of chat messages to filter
const uselessMsgs = [
    /\$SKYTILS-DUNGEON-SCORE-MIMIC\$/,
    /.*Mimic Killed!/,
    /.*Skytils-SC.*/,
    /       /,
    /Warping you to your SkyBlock island.../,
    /You earned .+ Event EXP from playing SkyBlock!/,
    /Warping.../,
    /Watchdog has banned .+ players in the last 7 days./,
    /RARE REWARD!.+/,
    /Error initializing players\: undefined/,
    /You are playing on profile\: .+/,
    /Profile ID\:.+/,
    /.+Mimic Killed!/,
    /You're already in this channel!/,
    /Goldor's TNT Trap hit you for 1,788.9 true damage./,
    /This Terminal doesn't seem to be responsive at the moment./,
    /Whow! Slow down there!/,
    /⚠ Storm is enraged! ⚠/,
    /Giga Lightning.+/,
    /Necron's Nuclear Frenzy hit you for .+ damage./,
    /Woah slow down, you're doing that too fast!/,
    /Command Failed: This command is on cooldown! Try again in about a second!/,
    /Someone has already activated this lever!/,
    /Goldor's Greatsword hit you for .+ damage./,
    /A mystical force in this room prevents you from using that ability!/,
    /The Frozen Adventurer used Ice Spray on you!/,
    /It isn't your turn!/,
    /That chest is locked!/,
    /Don't move diagonally! Bad!/,
    /Oops! You stepped on the wrong block!/,
    /Used Ragnarok!/,
    /Your Auto Recombobulator recombobulated/,
    /You cannot use abilities in this room!/,
    /A shiver runs down your spine.../,
    /The BLOOD DOOR has been opened!/,
    /.*Granted you.+/,
    /You found a Secret Redstone Key!/,
    /Blacklisted modifications are a bannable offense!/,
    /\[WATCHDOG ANNOUNCEMENT\]/,
    /Staff have banned an additional .+/,
    /Your Ultimate is currently on cooldown for .+ more seconds./,
    /ESSENCE! .+ found .+ Essence!/,
    /This lever has already been used./,
    /You hear the sound of something opening.../,
    /This chest has already been searched!/,
    /A Blessing of .+ was picked up!/,
    /.*Also granted you.+/,
    /The Lost Adventurer used Dragon's Breath on you!/,
    /A Blessing of .+/,
    /You sold .+ x.* for .+/,
    /You don't have enough space in your inventory to pick up this item!.*/,
    /Inventory full\? Don't forget to check out your Storage inside the SkyBlock Menu!/,
    /Your Berserk ULTIMATE Ragnarok is now available!/,
    /Granted you.+/,
    /This item's ability is temporarily disabled!/,
    /Throwing Axe is now available!/,
    /.*is now available!/,
    /Used Throwing Axe!/,
    /You are not allowed to use Potion Effects.+/,
    /\[STATUE\].+/,
    /\[NPC\] (Hugo)/,
    /PUZZLE SOLVED!.+/,
    /DUNGEON BUFF! .+/,
    /A Crypt Wither Skull exploded, hitting you for .+ damage./,
    /.+ opened a WITHER door!/,
    /\[[Tank|Healer|Mage|Archer|Berserk]+\] .+/,
    /\[SKULL\] .+/,
    /You summoned your.+/,
    /\[BOMB\] Creeper:.+/,
    /\[Sacks\] .+ item.+/,
    /The .+ Trap hit you for .+ damage!/,
    /Healer Milestone.+/,
    /Archer Milestone.+/,
    /Mage Milestone.+/,
    /Tank Milestone.+/,
    /Berserk Milestone.+/,
    /RARE DROP!.+/,
    /There are blocks in the way!/,
    /Error initializing players: undefined Hidden/,
    /Your .+ stats are doubled because you are the only player using this class!/,
    /Moved .+ Ender Pearl from your Sacks to your inventory./,
    /Skytils.+Something isn't right! .*/,
    /You have .+ unclaimed .+/,
    /Click here to view them!/,
    /.+ joined the lobby! .*/,
    /Welcome to Hypixel SkyBlock!/,
    /Latest update: SkyBlock .+/,
    /BONUS! Temporarily earn 5% more skill experience!/,
    /.+ is now ready!/,
    /Sending to server .+/,
    /Queuing... .+/,
    /.+ Milestone .+:.+ /,
    /Your CLASS stats are doubled because you are the only player using this class!/,
    /RIGHT CLICK on .+ to open it. .+/,
    /Your .+ hit .+ for [\d,.]+ damage./,
    /You do not have enough mana to do this!/,
    /.+Kill Combo+/,
    /.*Kill Combo.*/,
    /Thunderstorm is ready to use! Press DROP to activate it!/,
    /.+ healed you for .+ health!/,
    /You earned .+ GEXP .*/,
    /.+ unlocked .+ Essence!/,
    /.+ unlocked .+ Essence x\d+!/,
    /This menu is disabled here!/,
    /This item is on cooldown.+/,
    /This ability is on cooldown.+/,
    /You do not have the key for this door!/,
    /The Stormy .+ struck you for .+ damage!/,
    /Please wait a few seconds between refreshing!/,
    /You cannot move the silverfish in that direction!/,
    /You cannot hit the silverfish while it's moving!/,
    /Your Kill Combo has expired! You reached a .+ Kill Combo!/,
    /Your active Potion Effects have been paused and stored. They will be restored when you leave Dungeons! You are not allowed to use existing Potion Effects while in Dungeons./,
    /The Flamethrower hit you for .+ damage!/,
    /.+ found a Wither Essence! Everyone gains an extra essence!/,
    /Ragnarok is ready to use! Press DROP to activate it!/,
    /This creature is immune to this kind of magic!/,
    /\[.+?\] .+ has obtained (?!Blood Key!|Wither Key!).+!/,
    /FISHING FESTIVAL The festival is now underway! Break out your fishing rods and watch out for sharks!/
];

// Apply filters
uselessMsgs.forEach(msg => {
    register("chat", event => {
        if (!config.ChatCleaner) return;
        cancel(event);
    }).setCriteria(msg);
});

// Friend and Guild message styling
register("chat", (username, status, event) => {
    if (!config.ChatCleaner) return;
    cancel(event);
    if (status == "joined") ChatLib.chat(`&2 >>&a ${username}`);
    if (status == "left") ChatLib.chat(`&4 <<&c ${username}`);
}).setCriteria(/Friend > (.+) (.+)\./);

register("chat", (username, status, event) => {
    if (!config.ChatCleaner) return;
    cancel(event);
    if (status == "joined") ChatLib.chat(`&2 >> &a${username}`);
    if (status == "left") ChatLib.chat(`&4 <<&c ${username}`);
}).setCriteria(/Guild > (.+) (.+)\./);

// Filter common warping/pickup messages
register("chat", (event) => {
    if (!config.ChatCleaner) return;
    cancel(event);
}).setCriteria(/Warping.../);

register("chat", (event) => {
    if (!config.ChatCleaner) return;
    cancel(event);
}).setCriteria(/AUTO-PICKUP!.+/);

// Boss message handler
let innecron = false;
register("chat", () => innecron = true).setCriteria(/\[BOSS\] Necron: (Finally, I heard so much about you.|You went further than any human before).*?/);
register("chat", (event) => {
    if (!config.ChatCleaner) return;
    if (!innecron) cancel(event);
}).setCriteria(/\[BOSS\] .+/);
register("worldload", () => innecron = false);