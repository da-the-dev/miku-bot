const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
     * @description Usage: .test <args>
     */
    async (args, msg, client) => {
        if(msg.author.id == process.env.MYID) {
            // utl.embed(msg, "test")
            console.log(utl.welcome(msg.member, msg.guild))
        }
    }

module.exports.allowedInGeneral = true