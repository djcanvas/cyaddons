
import { getPlayerName } from "./player"
const Threading = Java.type("gg.essential.api.utils.Multithreading");

/**
 * Adds a delay before executing a function or runs the function asynchronously.
 *
 * @param {Function} func - The function to be executed after the delay.
 * @param {Number} time - The delay time in milliseconds (optional). If not provided, the function will run asynchronously.
 */
function delay(func, time) {
    if (time) {
        // Schedule the function to be executed after the specified delay.
        // The time value is converted to milliseconds using java.util.concurrent.TimeUnit.MILLISECONDS.
        Threading.schedule(() => { func() }, time, java.util.concurrent.TimeUnit.MILLISECONDS);
    } else {
        // Run the function asynchronously without any delay.
        Threading.runAsync(() => { func() });
    }
}


class Party {
    #in = false;
    #leader = false;
    #chatp = false;
    #members = new Set();

    constructor() {
        // --- TRACK EMPTY PARTY ---
        register("chat", () => {
            this.#in = false;
            this.#leader = false;
            this.#members.clear();
        }).setCriteria("${player} has disbanded the party!");

        register("chat", () => {
            this.#in = false;
            this.#leader = false;
            this.#members.clear();
        }).setCriteria("The party was disbanded because all invites expired and the party was empty.");

        register("chat", () => {
            this.#in = false;
            this.#leader = false;
            this.#members.clear();
        }).setCriteria("You left the party.");

        register("chat", () => {
            this.#in = false;
            this.#leader = false;
            this.#chatp = false;
            this.#members.clear();
        }).setCriteria("You are not in a party right now.");


        // --- TRACK PARTY LEADER ---
        register("chat", (player1) => {
            this.#leader = Player.getName() === getPlayerName(player1);
            this.#in = true;
        }).setCriteria("The party was transferred to ${player1} by ${player2}");

        register("chat", (player1) => {
            this.#leader = Player.getName() === getPlayerName(player1);
            this.#in = true;
        }).setCriteria("The party was transferred to ${player1} because ${player2} left");

        register("chat", (_, player2) => {
            this.#leader = Player.getName() === getPlayerName(player2);
            this.#in = true;
        }).setCriteria("${player1} has promoted ${player2} to Party Leader");

        register("chat", (player1) => {
            this.#leader = Player.getName() === getPlayerName(player1);
            this.#in = true;
        }).setCriteria("${player1} invited ${player2} to the party! They have 60 seconds to accept.");


        // --- TRACK PARTY INTERACTIONS ---
        register("chat", (player) => {
            this.#leader = false;
            this.#in = true;
            this.#chatp = true;
        }).setCriteria("You have joined ${player}'s party!");

        register("chat", () => {
            this.#leader = false;
            this.#in = false;
            this.#members.clear();
        }).setCriteria("You have been kicked from the party by ${player}");


        // --- CONTROL FOR GAME/CT RS ---
        register("gameLoad", this.parseParty);

        register("chat", this.parseParty).setCriteria("Welcome to Hypixel SkyBlock!");

        register("chat", (leader, event) => {
            this.#in = true;
            const player = getPlayerName(leader);
            this.#leader = Player.getName() === player;

            if (player === Player.getName()) return;
            this.#members.add(player);
        }).setCriteria("Party Leader: ${leader} ●");

        register("chat", (members) => {
            this.#in = true;
            members.split(" ● ").forEach(member => {
                const name = getPlayerName(member);
                if (name === Player.getName()) return;
                this.#members.add(name);
            });
        }).setCriteria("Party Moderators: ${members} ● ");

        register("chat", (members) => {
            this.#in = true;
            members.split(" ● ").forEach(member => {
                const name = getPlayerName(member);
                if (name === Player.getName()) return;
                this.#members.add(name);
            });
        }).setCriteria("Party Members: ${members} ● ");

        register("chat", (player) => {
            this.#in = true;
            const name = getPlayerName(player);
            if (name === Player.getName()) return;
            this.#members.delete(name);
        }).setCriteria("${player} has been removed from the party.");


        register("chat", () => {
            this.chatp = false;
        }).setCriteria("You are now in the GUILD channel");
        register("chat", () => {
            this.chatp = false;
        }).setCriteria("You are now in the SKYBLOCK CO-OP channel");
        register("chat", (user) => {
            this.chatp = false;
        }).setCriteria("Opened a chat conversation with ${user} for the next 5 minutes. Use /chat a to leave");
        register("chat", () => {
            this.chatp = false;
        }).setCriteria("You are now in the OFFICER channel");
        register("chat", () => {
            this.chatp = false;
        }).setCriteria("You are now in the ALL channel");
        register("chat", () => {
            this.chatp = false;
        }).setCriteria("You are not in a party and were moved to the ALL channel.");
        register(`gameLoad`, () => {
            this.chatp = false;
        })
        register("chat", () => {
            this.chatp = true;
        }).setCriteria("You are now in the PARTY channel");
    }

    /**
     * Returns Party.#in
     * 
     * @returns {Boolean} - True if in party, otherwise false.
     */
    getIn() {
        return this.#in;
    }

    /**
     * Returns Party.#in && Party.#leader
     * 
     * @returns {Boolean} - True if leader of party, otherwise false.
     */
    getLeader() {
        return this.#in && this.#leader;
    }

    /**
     * Returns Party.#chatp
     * 
     * @returns {Boolean} - True if in chat is p, otherwise false.
     */
    chatp() {
        return this.#chatp;
    }

    /**
     * Returns Party.#members
     * 
     * @returns {Set} - Set object of all party members.
     */
    getMembers() {
        return this.#members;
    }

    /**
     * Private.
     */
    parseParty() {
        const cancelChat = register("chat", (event) => {
            cancel(event);
        });

        ChatLib.command("p list");
        delay(() => {
            cancelChat.unregister();
        }, 500);
    }
}
export default new Party();
