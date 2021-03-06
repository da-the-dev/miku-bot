const Discord = require('discord.js')
const redis = require('redis')
const embeds = require('../embeds')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .give <member> <ammount>
    */
    async (args, msg, client) => {
        const rClient = redis.createClient(process.env.RURL)
        rClient.get(msg.member.id, (err, res) => {
            if(err) throw err
            if(res) {
                var userData = JSON.parse(res)
                msg.channel.send(embeds.success(msg.member, `Твой балланс: \`${userData.money}\``))
            } else
                msg.channel.send(embeds.success(msg.member, 'Твой балланс: `0`'))
            rClient.quit()
        })
    }
