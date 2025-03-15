import config from "../config"

export const Command = register("command", () => {
    return config.openGUI()
}).setName("cyaddons").setAliases("cya")