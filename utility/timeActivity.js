const Discord = require('discord.js')
const fetchAll = require('discord-fetch-all')
/**
 * Give daytime activity role if user got 500+ messages in general 
 * @param {Discord.Message} msg
 */
module.exports.daytimeTextActivity = async (msg) => {
    // var messageAmount = 0
    // var tries = 0
    // while(messageAmount < 500 && tries < 5) {
    //     const m = await msg.channel.messages.fetch({ limit: 500 })
    //     console.log(m.array().length)
    //     messageAmount += m.array().length
    //     if(messageAmount < 100) break
    // }
    const m = await msg.channel.messages.fetch({ limit: 500 })
    // const e = await fetchAll.messages(channel)
    // console.log(e.length)

    console.log(m.array().length)
}