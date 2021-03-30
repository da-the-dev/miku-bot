const Discord = require('discord.js')
const redis = require('redis')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .def
    */
    (args, msg, client) => {
        if(msg.author.id == process.env.MYID || msg.author.id == process.env.SERID) {
            const rClient = redis.createClient(process.env.RURL)
            rClient.get('defenses', (err, res) => {
                if(err) console.log(err)

                if(res) {
                    var set = (res == 'true')
                    rClient.set('defenses', String(!set), (err, res) => {
                        if(err) console.log(err)
                        msg.channel.send(utl.embed.def(msg, !set))
                        rClient.quit()
                    })
                } else {
                    rClient.set('defenses', true, (err, res) => {
                        if(err) console.log(err)
                        msg.channel.send(utl.embed.def(msg, true))
                        rClient.quit()
                    })
                }
            })
        }
    }