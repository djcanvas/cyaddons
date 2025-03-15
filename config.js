import {
    @ButtonProperty,
    @CheckboxProperty,
    Color,
    @ColorProperty,
    @PercentSliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @Vigilant,
    @SliderProperty,
    @NumberProperty,
} from '../Vigilance/index';

@Vigilant("cyaddons", "§5cya addons",  {
    getCategoryComparator: () => (a, b) => {
        const categories = ["general", "secrets", "chat", "notifications",'f7/m7', 'location message', 'gui positions'];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {
    
    MaskGuiGui = new Gui()
    eetitlesGui = new Gui()
    CrystalInfoGui = new Gui()
    terminalGui = new Gui()
    WitherStuckGui = new Gui()
    KeyPickupGui = new Gui()
    BloodDoneGui = new Gui()
    BatTitleGui = new Gui()
    WishGui = new Gui()
    CloakGui = new Gui()
    AutoPetGui = new Gui()
    SectionDoneGui = new Gui()
    p3StartTimerGui = new Gui()
    goldorTickTimerGui = new Gui()
    MelodyWarningGui = new Gui()
    
    //general category

    @SwitchProperty({
        name: "pearls",
        description: "Automatically refills your stack of ender pearls when you have less than a specific threshold",
        category: "general",
        subcategory: "auto refill"
    })
    autoRefillPearls = false;

    @SliderProperty({
        name: "pearls threshold",
        description: "Refills pearls when stack size goes under this number",
        category: "general",
        subcategory: "auto refill",
        min: 1,
        max: 16
    })
    autoRefillPearlsThreshold = 8;

    @SwitchProperty({
        name: "jerries",
        description: "Automatically refills your stack of inflatable jerries when you have less than a specific threshold",
        category: "general",
        subcategory: "auto refill"
    })
    autoRefillJerries = false;

    @SliderProperty({
        name: "jerries threshold",
        description: "Refills jerries when stack size goes under this number",
        category: "general",
        subcategory: "auto refill",
        min: 1,
        max: 64
    })
    autoRefillJerriesThreshold = 32;

    @SwitchProperty({
        name: "sp booms",
        description: "Automatically refills your stack of superboom tnt when you have less than a specific threshold",
        category: "general",
        subcategory: "auto refill"
    })
    autoRefillBooms = false;

    @SliderProperty({
        name: "sp booms threshold",
        description: "Refills sp booms when stack size goes under this number",
        category: "general",
        subcategory: "auto refill",
        min: 1,
        max: 64
    })
    autoRefillBoomsThreshold = 32;
    
    @SwitchProperty({
        name: "auto potion bag",
        description: "Opens the potion bag when entering a dungeon",
        category: "general",
    })
    autoOpenPotionBag = false;

    @SwitchProperty({
        name: "compact hoppity",
        description: "Turns the three lines when you find an egg into one to make it easier if you got a new or a dupe",
        category: "general",
    })
    compactHoppity = false;

    @SwitchProperty({
        name: "mask gui",
        description: "Shows if your mask/phoenix has been used or not",
        category: "general",
        subcategory: "mask gui"
    })
    MaskGui = false;

    @SelectorProperty({
        name: "mask name color",
        description: "Changes the color of mask names",
        category: "general",
        subcategory: "mask gui",
        options: [
            "§0black§r",
            "§1dark blue§r",
            "§2dark green§r",
            "§3dark aqua§r",
            "§4dark red§r",
            "§5dark purple§r",
            "§6gold§r",
            "§7gray§r",
            "§8dark gray§r",
            "§9blue§r",
            "§agreen§r",
            "§baqua§r",
            "§cred§r",
            "§dlight purple§r",
            "§eyellow§r",
            "§fwhite§r"
        ]
    })
    MaskNameColor = 6; // Default to Gold (index 6)

    @SelectorProperty({
        name: "cooldown timer color",
        description: "Changes the color of cooldown timers",
        category: "general",
        subcategory: "mask gui",
        options: [
            "§0black§r",
            "§1dark blue§r",
            "§2dark green§r",
            "§3dark aqua§r",
            "§4dark red§r",
            "§5dark purple§r",
            "§6gold§r",
            "§7gray§r",
            "§8dark gray§r",
            "§9blue§r",
            "§agreen§r",
            "§baqua§r",
            "§cred§r",
            "§dlight purple§r",
            "§eyellow§r",
            "§fwhite§r"
        ]
    })
    CooldownColor = 12; // Default to Red (index 12)

    @SelectorProperty({
        name: "ready indicator color",
        description: "Changes the color of ready indicators",
        category: "general",
        subcategory: "mask gui",
        options: [
            "§0black§r",
            "§1dark blue§r",
            "§2dark green§r",
            "§3dark aqua§r",
            "§4dark red§r",
            "§5dark purple§r",
            "§6gold§r",
            "§7gray§r",
            "§8dark gray§r",
            "§9blue§r",
            "§agreen§r",
            "§baqua§r",
            "§cred§r",
            "§dlight purple§r",
            "§eyellow§r",
            "§fwhite§r"
        ]
    })
    ReadyColor = 10; // Default to Green (index 10)
   
    @SwitchProperty({
        name: "bc helper",
        description: "Shows when to kill mobs and show location",
        category: "general",
        subcategory: "blood"
    })
    BCHelper = false;

    @SwitchProperty({
        name: "hide players",
        description: "Hides players after leap",
        category: "general",
    })
    hidePlayersAfterLeap = false;

    //secrets category

    @SwitchProperty({
        name: "show clicked secrets",
        description: `Tells you when you click on a secret by rendering a box around where the secret is.`,
        category: "secrets",
    })
    showSecretClicks = false;

    @ColorProperty({
        name: "clicked secrets color",
        description: "Change the highlight color of the secret when you click it.",
        category: "secrets",
    })
    showSecretClicksColor = Color.GREEN;

    @CheckboxProperty({
        name: "clicked secrets sound",
        description: "plays sound when secret is clicked",
        category: "secrets",
    })
    playSoundOnSecretClick = false

    @SelectorProperty({
        name: "select secret clicked sound",
        description: "Change the sound of secret clicks",
        category: "secrets",
        options: [
        "random.orb",     // index 0
        "mob.blaze.hit",   // index 1
        "note.harp", // index 2
        "note.pling"      // index 3
        ]
    })
    secretClickSound = 0;

    @PercentSliderProperty({
        name: "pitch of secret click sound",
        description: "changes pitch",
        category: "secrets",
    })
    secretClickPitch = 100;

    @PercentSliderProperty({
        name: "volume of secret click sound",
        description: "changes pitch",
        category: "secrets",
    })
    secretClickVolume = 100;


    //chat category

    @SwitchProperty({
        name: "chat cleaner",
        description: "Removes useless messages",
        category: "chat"
    })
    ChatCleaner = false

    @SwitchProperty({
        name: "auto chat p",
        description: " auto party chat",
        category: "chat"
    })
    PartyChatSwitcher = false

    //notifications category
    @SwitchProperty({
        name: "key",
        description: "Shows title when someone picked up a key when you are mage or arch",
        category: "notifications"
    })
    KeyPickup = false

    @CheckboxProperty({
        name: "key sound",
        description: "Plays sound when someone picked up a key",
        category: "notifications"
    })
    Keysound = false

    @SwitchProperty({
        name: "blood",
        description: "Shows title when blood is done",
        category: "notifications"
    })
    BloodDone = false

    @SwitchProperty({
        name: "bat",
        description: "Shows title when Bat was killed",
        category: "notifications"
    })
    BatTitle = false

    @SwitchProperty({
        name: "wish",
        description: "Shows when to wish",
        category: "notifications"
    })
    Wish = false

    @SwitchProperty({
        name: "cloak",
        description: "Shows cloak activation/deactivation",
        category: "notifications"
    })
    Cloak = false

    @SwitchProperty({
        name: "pet",
        description: "Shows which pet u have equipped after rod swap",
        category: "notifications"
    })
    AutoPet = false

    @SwitchProperty({
        name: "section done",
        description: "Shows when section in p3 is completed",
        category: "notifications"
    })
    SectionDone = false

    
    
    // F7/M7 Category
    @SwitchProperty({
        name: "i4helper",
        description: "Shows points to aim at i4",
        category: "f7/m7",
        subcategory: "p3"
    })
    i4helper = false

    @SwitchProperty({
        name: "lever aura",
        description: "Automatically does levers in p3 for you",
        category: "f7/m7",
        subcategory: "p3"
    })
    LeverAura = false

    @SwitchProperty({
        name: "melody warning",
        description: "Shows who has melody and how far along they are",
        category: "f7/m7",
        subcategory: "p3"
    })
    MelodyWarning = false

    @SwitchProperty({
        name: "goldor tick timer",
        description: "Shows death ticks in p3",
        category: "f7/m7",
        subcategory: "p3"
    })
    goldorTickTimer = false

    @SwitchProperty({
        name: "p3 start timer",
        description: "Shows when p3 starts",
        category: "f7/m7",
        subcategory: "p3"
    })
    p3StartTimer = false

    @SwitchProperty({
        name: "wither stuck title",
        description: "Shows when wither is stuck",
        category: "f7/m7"
    })
    WitherStuck = false

    @SwitchProperty({
        name: "terminal gui",
        description: "Shows how many terms/levers/dev have been completed",
        category: "f7/m7",
        subcategory: "p3"
    })
    terminal = false

    @SwitchProperty({
        name: "timestamps",
        description: "Shows when each term/dev/lever has been completed",
        category: "f7/m7",
        subcategory: "p3"
    })
    terminalTimestamps = false

    @SwitchProperty({
        name: "esp",
        description: "Draws esp box for terms and levers",
        category: "f7/m7",
        subcategory: "p3"
    })
    TerminalESP = false

    @ColorProperty({
        name: "esp color",
        description: "Change the color of the esp",
        category: "f7/m7",
        subcategory: "p3"
    })
    ESPColor = Color.GREEN;



    @SwitchProperty({
        name: "predev timer",
        description: "Shows how long ur predev took. Starts with boss and ends with leap",
        category: "f7/m7"
    })
    PredevTimer = false;

    @SwitchProperty({
        name: "crystal info",
        description: "Shows notification to place your crystal and when the next crystal spawns",
        category: "f7/m7"
    })
    CrystalInfo = false;

    // Location Message Category

    @SwitchProperty({
		name: "fast leap",
		description: "Fast leap to ppl at ees or to the specific role",
		category: "location message"
	})
	FastLeap = false;

    @SwitchProperty({
		name: "early enter alert",
		description: "Alerts you when someone is at an early enter location using player position\nWill only work if you are within 4 chunks of the ee location",
		category: "location message"
	})
	eetitles = false;

    @SwitchProperty({
		name: "paste early enters into party chat",
		category: "location message"
	})
	sendchatmessage = false;

    @SwitchProperty({
        name: "location notifications",
        description: "Shows a title and plays a sound when a party member sends a location message",
        category: "location message"
    })
    locationNotif = false;

    @TextProperty({
        name: "location notification sound",
        description: "Sound used for Location Notification Sound",
        category: "location message",
        placeholder: "note.harp"
    })
    locationSound = "note.harp";

    @TextProperty({
        name: "location notification sound times to play",
        description: "Choose how many times the location notification sound plays",
        category: "location message",
        placeholder: "1"
    })
    locationNotifRepeatAmount = "1";

    @SwitchProperty({
        name: "toggle selected location message",
        description: "Enable/disable all selected nearby location messages at once",
        category: "location message"
    })
    toggleSelectedNearbyMessages = false;

    @CheckboxProperty({
        name: "ss",
        category: "location message"
    })
    ssCoord = false;

    @CheckboxProperty({
        name: "pre 2",
        category: "location message"
    })
    pre2Coord = false;

    @CheckboxProperty({
        name: "pre 3",
        category: "location message"
    })
    pre3Coord = false;

    @CheckboxProperty({
        name: "pre 4",
        category: "location message"
    })
    pre4Coord = false;
    
    @CheckboxProperty({
        name: "core",
        category: "location message"
    })
    slingshotCoord = false;

    @CheckboxProperty({
        name: "tunnel",
        category: "location message"
    })
    tunnelCoord = false;

    @CheckboxProperty({
        name: "mid",
        category: "location message"
    })
    midCoord = false;

    @CheckboxProperty({
        name: "safespot 2",
        category: "location message"
    })
    safespotCoord = false;

       
    // GUI Positions Category
    @ButtonProperty({
        name: "move mask gui",
        description: "Moves mask gui",
        category: "gui positions",
        placeholder: "Move"
    })
    MoveMaskGuiGui() {
        this.MaskGuiGui.open()
    };

    @ButtonProperty({
        name: "move early enter alert gui",
        description: "Moves early enter alert gui",
        category: "gui positions",
        placeholder: "Move"
    })
    MoveeetitlesGui() {
        this.eetitlesGui.open()
    };

    @ButtonProperty({
        name: "move crystal info",
        description: "Moves text when new crystal spawns",
        category: "gui positions",
        placeholder: "Move"
    })
    MoveCrystalInfoGui() {
        this.CrystalInfoGui.open()
    };

    @ButtonProperty({
    name: "move terminal gui",
    description: "Scroll to change scale, middle click to reset",
    category: "gui positions",
    placeholder: "Move"
    })
    MoveTerminalGui() {
        this.terminalGui.open()
    };

    @ButtonProperty({
    name: "move wither stuck gui",
    description: "Scroll to change scale, middle click to reset",
    category: "gui positions",
    placeholder: "Move"
    })
    MoveWitherStuckGui() {
        this.WitherStuckGui.open()
    };

    @ButtonProperty({
    name: "move key pickup title",
    description: "Scroll to change scale, middle click to reset",
    category: "gui positions",
    placeholder: "Move"
    })
    MoveKeyPickupGui() {
        this.KeyPickupGui.open()
    };

    @ButtonProperty({
    name: "move blood done title",
    description: "Scroll to change scale, middle click to reset",
    category: "gui positions",
    placeholder: "Move"
    })
    MoveBloodDoneGui() {
        this.BloodDoneGui.open()
    };

    @ButtonProperty({
    name: "move bat title",
    description: "Scroll to change scale, middle click to reset",
    category: "gui positions",
    placeholder: "Move"
    })
    MoveBatTitleGui() {
        this.BatTitleGui.open()
    };

    @ButtonProperty({
    name: "move wish title",
    description: "Scroll to change scale, middle click to reset",
    category: "gui positions",
    placeholder: "Move"
    })
    MoveWishGui() {
        this.WishGui.open()
    };

    @ButtonProperty({
    name: "move cloak title",
    description: "Scroll to change scale, middle click to reset",
    category: "gui positions",
    placeholder: "Move"
    })
    MoveCloakGui() {
        this.CloakGui.open()
    };

    @ButtonProperty({
        name: "move pet title",
        description: "Scroll to change scale, middle click to reset",
        category: "gui positions",
        placeholder: "Move"
    })
    MoveAutoPetGui() {
        this.AutoPetGui.open()
    };

    @ButtonProperty({
        name: "move section done title",
        description: "Scroll to change scale, middle click to reset",
        category: "gui positions",
        placeholder: "Move"
    })
    MoveSectionDoneGui() {
        this.SectionDoneGui.open()
    };

    @ButtonProperty({
        name: "move p3 start timer",
        description: "Scroll to change scale, middle click to reset",
        category: "gui positions",
        placeholder: "Move"
    })
    Movep3StartTimerGui() {
        this.p3StartTimerGui.open()
    };

    @ButtonProperty({
        name: "move goldor tick timer",
        description: "Scroll to change scale, middle click to reset",
        category: "gui positions",
        placeholder: "Move"
    })
    MovegoldorTickTimerGui() {
        this.goldorTickTimerGui.open()
    };

    @ButtonProperty({
        name: "move melody warning",
        description: "Scroll to change scale, middle click to reset",
        category: "gui positions",
        placeholder: "Move"
    })
    MoveMelodyWarningGui() {
        this.MelodyWarningGui.open()
    };

   
      
    constructor() {
        this.initialize(this);

        const lines = [
            "",
            "&5welcome to cya addons!",
            "",
            "&fCommands:",
            "&5- &f/cya &5- opens the settings gui",
            "&5- &f/ep &5refills ender pearls & &f/sp &5refills superboom ",
            "",
            "&4NOTE: A LOT of the features do not work without Mort and Boss messages. Make sure to not have them disabled.",
            ""
        ]
        const commands = lines.join("\n")

        this.setCategoryDescription("general", commands)
        
        // Add dependencies after initialization
        this.addDependency("move mask gui", "mask gui");
        this.addDependency("move crystal info", "crystal info");
        this.addDependency("mask name color", "mask gui");
        this.addDependency("cooldown timer color", "mask gui");
        this.addDependency("ready indicator color", "mask gui");
        this.addDependency("move early enter alert gui", "early enter alert");
        this.addDependency("location notification sound", "location notifications");
        this.addDependency("location notification sound times to play", "location notifications");
        this.addDependency("ss", "toggle selected location message");
        this.addDependency("pre 2", "toggle selected location message");
        this.addDependency("pre 3", "toggle selected location message");
        this.addDependency("pre 4", "toggle selected location message");
        this.addDependency("core", "toggle selected location message");
        this.addDependency("tunnel", "toggle selected location message");
        this.addDependency("mid", "toggle selected location message");
        this.addDependency("safespot 2", "toggle selected location message");
        this.addDependency("move terminal gui", "terminal gui");
        this.addDependency("move wither stuck gui", "wither stuck title");
        this.addDependency("move key pickup title", "key");
        this.addDependency("move blood done title", "blood");
        this.addDependency("move bat title", "bat");
        this.addDependency("key sound", "key");
        this.addDependency("move wish title", "wish");
        this.addDependency("move cloak title", "cloak");
        this.addDependency("move pet title", "pet");
        this.addDependency("move section done title", "section done");
        this.addDependency("clicked secrets color", "show clicked secrets");
        this.addDependency("clicked secrets sound", "show clicked secrets");
        this.addDependency("select secret clicked sound", "show clicked secrets");
        this.addDependency("pitch of secret click sound", "show clicked secrets");
        this.addDependency("volume of secret click sound", "show clicked secrets");
        this.addDependency("select secret clicked sound", "clicked secrets sound");
        this.addDependency("pitch of secret click sound", "clicked secrets sound");
        this.addDependency("volume of secret click sound", "clicked secrets sound");
        this.addDependency("pearls threshold", "pearls");
        this.addDependency("jerries threshold", "jerries");
        this.addDependency("sp booms threshold", "sp booms");
        this.addDependency("esp color", "esp")
        this.addDependency("move p3 start timer", "p3 start timer")
        this.addDependency("move goldor tick timer", "goldor tick timer")
        this.addDependency("move melody warning", "melody warning")
    }
}

export default new Settings();