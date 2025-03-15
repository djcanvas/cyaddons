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
        const categories = ["general", "chat", "notifications",'f7/m7', 'location message', 'gui positions'];
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
    
    //general category
    @SwitchProperty({
        name: "show clicked secrets",
        description: `Tells you when you click on a secret by rendering a box around where the secret is.`,
        category: "general",
        subcategory: "secret clicked",
    })
    showSecretClicks = false;

    @ColorProperty({
        name: "clicked secrets color",
        description: "Change the highlight color of the secret when you click it.",
        category: "general",
        subcategory: "secret clicked",
    })
    showSecretClicksColor = Color.GREEN;

    @CheckboxProperty({
        name: "clicked secrets sound",
        description: "plays sound when secret is clicked",
        category: "general",        
        subcategory: "secret clicked",
    })
    playSoundOnSecretClick = false

    @SelectorProperty({
        name: "select secret clicked sound",
        description: "Change the sound of secret clicks",
        category: "general",
        subcategory: "secret clicked",
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
        category: "general",
        subcategory: "secret clicked",
    })
    secretClickPitch = 100;

    @PercentSliderProperty({
        name: "volume of secret click sound",
        description: "changes pitch",
        category: "general",
        subcategory: "secret clicked",
    })
    secretClickVolume = 100;


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
        category: "f7/m7"
    })
    i4helper = false

    @SwitchProperty({
        name: "wither stuck title",
        description: "Shows when wither is stuck",
        category: "f7/m7"
    })
    WitherStuck = false

     @SwitchProperty({
        name: "terminal gui",
        description: "Shows how many terms/levers/dev have been completed",
        category: "f7/m7"
    })
    terminal = false

    @SwitchProperty({
        name: "predev timer",
        description: "Shows how long ur predev took, starts with boss and ends with leap",
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
    }
}

export default new Settings();