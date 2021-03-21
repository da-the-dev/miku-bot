const Discord = require('discord.js')
const gameNames = ["Dota 2", "Counter-Strike: Global Offensive", "PLAYERUNKNOWN'SBATTLEGORUNDS", "PUBG LITE", "оsu!", "League of Legends", "VALORANT", "Among Us", "Minecraft", "Brawlhalla", "Apex Legends", "Rainbow Six Siege", "Genshin Impact", "Fortnite"]
const redis = require('redis')
const constants = require('../constants.json')
/**
 * Assing an activity role to member
 * @param {Discord.Presence} oldPresence
 * @param {Discord.Presence} newPresence
 */
module.exports = (oldPresence, newPresence) => {
    var act = newPresence.activities.find(a => gameNames.includes(a.name))
    if(!newPresence.user.bot) {
        if(act) { // If newPresence includes games
            const rClient = redis.createClient(process.env.RURL)
            rClient.get(newPresence.userID, (err, res) => {
                if(err) throw err
                if(res) {
                    var userData = JSON.parse(res)
                    if(userData.gameRoles || userData.gameRoles == undefined)
                        newPresence.member.roles.add(constants.gameRoles[act.name])
                    rClient.quit()
                }
            })
        } else
            newPresence.member.roles.remove(constants.gameRolesArray)
    }
}