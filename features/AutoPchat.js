import config from "../config";
import { registerWhen } from "../../BloomCore/utils/Utils";
import party from "../util/party";

// Event Handlers
registerWhen(register("chat", () => {
    ChatLib.command('chat p');
}).setCriteria(/You have joined (.+)('|'s)? party!/), 
() => config.PartyChatSwitcher, 
!party.chatp);

registerWhen(register("chat", () => {
    ChatLib.command('chat p');
}).setCriteria(/Party Finder > .+ joined the dungeon group! \((Berserk|Healer|Tank|Mage|Archer) Level \d+\)/), 
() => config.PartyChatSwitcher, 
!party.chatp);

registerWhen(register("chat", (player) => {
    // Only switch if this player is you
    if (player !== Player.getName()) return;
    ChatLib.command('chat p');
}).setCriteria(/(\w{1,16}) invited .+ to the party! They have 60 seconds to accept./), 
() => config.PartyChatSwitcher, 
!party.chatp);