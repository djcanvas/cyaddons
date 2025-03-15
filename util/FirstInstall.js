import { data } from "./data"

const checkFirstInstall = () => {
    if (!data.firstInstall) return
    data.firstInstall = false
    data.save()
    
    const msgs = [
        "&aThank you for installing &5&lcyaddons!",
        "",
        "&aTo get started, run the &5/cyaddons or /cya &acommand."
    ]
    ChatLib.chat(`&f&m${ChatLib.getChatBreak(" ")}`)
    msgs.forEach(a => ChatLib.chat(ChatLib.getCenteredText(a)))
    ChatLib.chat(`&f&m${ChatLib.getChatBreak(" ")}`)
}

const firstInstallTrigger = register("tick", () => {
    checkFirstInstall()
    firstInstallTrigger.unregister()
})