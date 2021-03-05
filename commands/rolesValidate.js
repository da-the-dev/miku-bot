const Discord = require('discord.js')
const roles = require('../roles.json')
const embeds = require('../embeds')
const redis = require('redis')

module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
     * @description Usage: .unmute <member>
     */
    async (args, msg, client) => {
        if(msg.author.id == process.env.MYID) {
            const rClient = redis.createClient(process.env.RURL)
            rClient.get(msg.author.id, (err, res) => {
                if(err)
                    console.error(err)
                if(res) {
                    var userData = JSON.parse(res)

                    if(userData[msg.guild.id].mute) // Mute if was muted prior to joining
                        msg.member.roles.add(roles.muted)
                    if(userData[msg.guild.id].warns) // Mute if was muted prior to joining
                        msg.member.roles.add(roles.offender)
                }
            })
        }
    }