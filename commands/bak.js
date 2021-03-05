const Discord = require('discord.js')
const redis = require('redis')
const embeds = require('../embeds')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .bak
    */
    async (args, msg, client) => {
        if(msg.author.id == process.env.MYID || msg.author.id == process.env.SERID) {
            const rClient = redis.createClient(process.env.RURL)
            rClient.get('botautokick', (err, res) => {
                if(err) throw err

                if(res) {
                    var set = (res == 'true')
                    rClient.set('botautokick', String(!set), (err, res) => {
                        if(err) throw err
                        msg.channel.send(embeds.botautokick(msg.member, !set))
                        rClient.quit()
                    })
                } else {
                    rClient.set('botautokick', true, (err, res) => {
                        if(err) throw err
                        msg.channel.send(embeds.botautokick(msg.member, true))
                        rClient.quit()
                    })
                }
            })
        }
    }