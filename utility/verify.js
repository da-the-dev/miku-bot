const Discord = require('discord.js')
const constants = require('../constants.json')

/**
 * 
 * @param {Discord.MessageReaction} reaction 
 * @param {Discord.User} user 
 */
module.exports.verify = (reaction, user) => {
    if(reaction.message.id == 819295686415482921)
        console.log('verified user', user.tag)
    reaction.message.guild.members.cache.find(m => m.user.id == user.id).roles.remove(reaction.message.guild.roles.cache.get(constants.roles.verify))
}

/**
 * @param {Discord.GuildMember} member
 */
module.exports.mark = (member) => {
    console.log('dever')
    member.roles.add(member.guild.roles.cache.get(constants.roles.verify))
}