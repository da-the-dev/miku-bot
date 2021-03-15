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
            console.log(new Date(Date.now()).toLocaleString())
            console.log(msg.author.createdAt.toLocaleString())
            console.log(Date.now() - msg.author.createdTimestamp)
            console.log(Date.now() - msg.author.createdTimestamp < 259200000)
        }
    }