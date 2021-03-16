const Discord = require('discord.js')
const utl = require('../utility')
const gameNames = ["Dota 2", "CS:GO", "PUBG", "Osu!", "League of Legends", "Valorant", "Among Us", "Minecraft", "Brawlhalla", "Apex", "Rainbow Six Siege", "Genshin Impact"]
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
            var act = msg.author.presence.activities.find(a => gameNames.includes(a.name))
            if(act)
                msg.member.roles.add(constants.gameRoles[act.name])
            else
                msg.member.roles.remove(constants.gameRolesArray)
        }
    }