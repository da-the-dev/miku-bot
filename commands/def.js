const Discord = require('discord.js')
const redis = require('redis')
const embeds = require('../embeds')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .def
    */
    async (args, msg, client) => {
        if(msg.author.id == process.env.MYID || msg.author.id == process.env.SERID) {
            const rClient = redis.createClient(process.env.RURL)
            rClient.get('defenses', (err, res) => {
                if(err) throw err

                if(res) {
                    var set = (res == 'true')
                    rClient.set('defenses', String(!set), (err, res) => {
                        if(err) throw err
                        msg.channel.send(embeds.defenses(msg.member, !set))
                        rClient.quit()
                    })
                } else {
                    rClient.set('defenses', true, (err, res) => {
                        if(err) throw err
                        msg.channel.send(embeds.defenses(msg.member, true))
                        rClient.quit()
                    })
                }
            })
        }
    }