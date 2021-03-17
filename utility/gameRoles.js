const Discord = require('discord.js')
const gameNames = ["Dota 2", "Counter-Strike: Global Offensive", "PUBG", "Osu!", "League of Legends", "Valorant", "Among Us", "Minecraft", "Brawlhalla", "Apex", "Rainbow Six Siege", "Genshin Impact", "Code"]
const constants = require('../constants.json')
/**
 * Assing an activity role to member
 * @param {Discord.Presence} oldPresence
 * @param {Discord.Presence} newPresence
 */
module.exports = (oldPresence, newPresence) => {
    var act = newPresence.activities.find(a => gameNames.includes(a.name))
    if(act)
        newPresence.member.roles.add(constants.gameRoles[act.name])
    else
        newPresence.member.roles.remove(constants.gameRolesArray)
}