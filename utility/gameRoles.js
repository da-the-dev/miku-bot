const Discord = require('discord.js')
const constants = require('../constants.json')
/**
 * Assing an activity role to member
 * @param {Discord.Presence} oldPresence
 * @param {Discord.Presence} newPresence
 */
module.exports = (oldPresence, newPresence) => {
    if(!newPresence.user.bot) {
        var pres = newPresence.activities.find(a => a.type == 'PLAYING')
        pres ? constants.gameRoles[pres.name] ? !newPresence.member.roles.cache.has(constants.gameRoles[pres.name]) ? newPresence.member.roles.add(constants.gameRoles[pres.name]).catch(err => { }) : null : null : null
    }
}