const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')
const moneytop = require('../commands/mtop.js')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
     * @description Usage: .test <args>
     */
    async (args, msg, client) => {
        if(msg.author.id == process.env.MYID) {
            moneytop(args, msg, client)
        }
    }

module.exports.allowedInGeneral = true