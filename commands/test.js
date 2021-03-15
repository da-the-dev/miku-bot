const Discord = require('discord.js')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .test <args>
    */
    async (args, msg, client) => {
        if(msg.author.id == process.env.MYID) {
            embeds.member(msg, `<@${msg.mentions.members.first().id}>`)
        }
    }