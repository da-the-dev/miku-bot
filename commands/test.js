const Discord = require('discord.js')
const time = require('../utility/timeActivity')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .test <args>
    */
    async (args, msg, client) => {
        if(msg.author.id == process.env.MYID) {
            time.daytimeTextActivity(msg)
        }
    }