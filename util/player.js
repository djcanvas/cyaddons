/**
 * Strips rank and tags off player name.
 * 
 * @param {String} player - Player name with rank and tags.
 * @returns {String} Base player ign.
 */
export function getPlayerName(player) {
    let name = player;
    let nameIndex = name.indexOf(']');

    while (nameIndex !== -1) {
        name = name.substring(nameIndex + 2);
        nameIndex = name.indexOf(']');
    }

    return name.split(' ')[0];
}

/**
 * Strips the user of the rank.
 *
 * @param {String} player - Player's name with rank ex [MVP++] Da_Minty
 * @returns {String} - Stripped rank ex Da_Minty
 */
export function stripRank(player) {
    let stripped = String(player) // 😏
    stripped = stripped.replace("[MVP++] "," ")
    stripped = stripped.replace("[MVP+] "," ")
    stripped = stripped.replace("[MVP] "," ")
    stripped = stripped.replace("[VIP+] "," ")
    stripped = stripped.replace("[VIP] "," ")
    stripped = stripped.replace(" ","")
    return stripped
}

/**
 * Extracts and returns the guild name from a player's name string.
 *
 * @param {String} player - Player's name, possibly with guild tags and ranks.
 * @returns {String} - Extracted guild name from the player's name.
 */
export function getGuildName(player) {
    let name = player;
    let rankIndex = name.indexOf('] ');
    if (rankIndex !== -1)
        name = name.substring(name.indexOf('] ') + 2);
    name = name.substring(0, name.indexOf('[') - 1);

    return name;
}

/**
 * Returns True if entity is player otherwise False.
 * 
 * @param {Entity} entity - OtherPlayerMP Minecraft Entity.
 * @returns {Boolean} - Whether or not player is human.
 */
export function isPlayer(entity) {
    return World.getPlayerByName(entity.getName())?.getPing() === 1;
}

/**
 * What class you are playing on
 * 
 * @returns {String} - Returns the players class
 */
export function getClass() {
    let tabInfo = TabList.getNames()
    for (let i = 0; i < tabInfo.length; i++) {
        let tabLine = tabInfo[i].removeFormatting()
        if (tabLine.includes(Player.getName())) {
            return tabLine.substring((tabLine.indexOf("(")) + 1)
        }
    }
}

export function getOwnClass() {
    let tabInfo = TabList.getNames();
    for (let i = 0; i < tabInfo.length; i++) {
        let tabLine = tabInfo[i].removeFormatting();
        if (tabLine.includes(Player.getName())) {
            // Check if there's a "(" character in the string
            if (tabLine.indexOf("(") === -1) {
                // No class information found
                return null;
            }
            
            // Get everything between "(" and first space or numeral
            let classStr = tabLine.substring(tabLine.indexOf("(") + 1);
            // Match only the letters at the start of the string
            let match = classStr.match(/^[A-Za-z]+/);
            
            // Add null check before accessing [0]
            return match ? match[0] : null;
        }
    }
    // Return null if we didn't find the player in the tab list
    return null;
}

/**
 * What class the playing is playing on
 * 
 * @param {String} player - Player clean username
 * @returns {String} - Returns the players class usage ex getClassOther("Da_Minty")[0] == 'B'
 */
export function getClassOther(player) {
    let tabInfo = TabList.getNames()
    for (let i = 0; i < tabInfo.length; i++) {
        let tabLine = tabInfo[i].removeFormatting()
        if (tabLine.includes(getPlayerName(player))) {
            return tabLine.substring((tabLine.indexOf("(")) + 1)
        }
    }
}

/**
 * Converts Roman numeral to number
 * @param {String} roman - Roman numeral string
 * @returns {Number} - Arabic number
 */
function romanToNumber(roman) {
    const romanValues = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C': 100,
        'D': 500,
        'M': 1000
    };

    let result = 0;
    for (let i = 0; i < roman.length; i++) {
        const current = romanValues[roman[i]];
        const next = romanValues[roman[i + 1]];
        if (next > current) {
            result += next - current;
            i++;
        } else {
            result += current;
        }
    }
    return result;
}


/**
 * Gets the name of a player playing a specified class.
 * 
 * @param {String} className - The class to check for (e.g., "Berserk").
 * @returns {String} - Player name or null if not found
 */
export function getNameByClass(className) {
    let tabInfo = TabList.getNames();
    
    for (let line of tabInfo) {
        let tabLine = line.removeFormatting();
        
        // Look for pattern: "[number] name (Class Level)"
        let match = tabLine.match(/\[\d+\]\s+(\w+).*?\((\w+)\s+[IVXLCDM]+\)/);
        
        if (match && match[2].toLowerCase() === className.toLowerCase()) {
            return match[1];  // Just return the player name
        }
    }
    return null;
}


register("command", (className) => {
    getOwnClass()
    ChatLib.chat(getOwnClass())
}).setName("getownclass");
// Command registration with class parameter
register("command", (className) => {
    if (!className) {
        ChatLib.chat("&cPlease specify a class! Usage: /getNameByClass <className>");
        return;
    }

    let playerName = getNameByClass(className);
    if (playerName) {
        ChatLib.chat(`&aFound player: ${playerName}`);
    } else {
        ChatLib.chat(`&cNo players found playing ${className}`);
    }
}).setName("getNameByClass");