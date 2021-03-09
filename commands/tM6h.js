const Discord = require('discord.js')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    */
    async (args, msg, client) => {
        if(msg.author.id == process.env.MYID)
            msg.reply(msg.createdTimestamp - 13 * 60 * 60 * 1000 + 1000)
    }