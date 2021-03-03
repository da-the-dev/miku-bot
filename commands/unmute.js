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
        var moderatorRole = msg.guild.roles.cache.get(roles.moder)
        if(msg.member.roles.cache.find(r => r.position >= moderatorRole.position && r.id != roles.star)) {
            var mMember = msg.mentions.members.first()
            if(!mMember) {
                msg.channel.send(embeds.error(msg.member, 'Вы не указали пользователя для мута!'))
            }

            // Get and prematurely delete the shadow key
            const rClient = redis.createClient(process.env.RURL)
            rClient.get('muted-' + mMember.user.id + '-' + msg.guild.id, (err, res) => {
                if(err)
                    console.error(err)

                if(res) {
                    // Delete the shadow key
                    rClient.DEL('muted-' + mMember.user.id + '-' + msg.guild.id, err => {
                        if(err) {
                            console.error(err)
                            return
                        }
                    })

                    // Shadow key means that userData might exist
                    rClient.get(mMember.user.id, (err, res) => {
                        if(err)
                            console.error(err)

                        if(res) {
                            msg.member.roles.remove(roles.muted)
                            // Update it
                            var userData = JSON.parse(res)
                            var mute = userData[msg.guild.id].mute
                            if(mute)
                                delete userData[msg.guild.id].mute
                            rClient.set(mMember.user.id, JSON.stringify(userData), err => {
                                if(err)
                                    console.error(err)
                                rClient.quit()
                            })
                        }
                        // If not it was a permamute
                        else {
                            msg.member.roles.remove(roles.muted)
                            msg.channel.send(embeds.unmute(client, mMember))
                            rClient.quit()
                        }
                    })
                } else {
                    msg.reply('not muted in the first place')
                }
            })
        } else {
            msg.channel.send(embeds.error(msg.member, 'У Вас нет прав для этой команды!'))
        }
    }