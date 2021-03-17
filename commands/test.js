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
            console.log(new Date(msg.createdAt.toLocaleString("en-US", { timeZone: "Europe/Moscow" })).getHours())
        }
    }