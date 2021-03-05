const anticrash = require('../anti-crash')
const Discord = require('discord.js')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .warn <member> <reason>
    */
    async (args, msg, client) => {
        if(msg.author.id == process.env.MYID)
            anticrash.monitorBans(msg.guild)
    }