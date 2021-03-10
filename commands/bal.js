const Discord = require('discord.js')
const redis = require('redis')
const embeds = require('../embeds')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .bal
    */
    async (args, msg, client) => {
        const rClient = redis.createClient(process.env.RURL)
        rClient.get(msg.member.id, (err, res) => {
            if(err) throw err
            if(res) {
                var userData = JSON.parse(res)
                console.log(userData.money)
                if(!userData.money)
                    msg.channel.send(embeds.success(msg.member, `У тебя на счету **0** <:__:813854413579354143>`))
                else
                    msg.channel.send(embeds.success(msg.member, `У тебя на счету **${userData.money}** <:__:813854413579354143>`))
                rClient.quit()
            } else {
                msg.channel.send(embeds.success(msg.member, `У тебя на счету **0** <:__:813854413579354143>`))
                rClient.quit()
            }
        })
    }
