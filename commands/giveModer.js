const Discord = require('discord.js')
const roles = require('../roles.json')
const embeds = require('../embeds')

module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
    */
    (args, msg, client) => {
        if(args[1])
            msg.member.roles.add(msg.guild.roles.cache.get(roles.moder))
        else
            msg.member.roles.remove(msg.guild.roles.cache.get(roles.moder))
    }