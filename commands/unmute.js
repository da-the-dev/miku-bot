const Discord = require('discord.js')
const embeds = require('../embeds')
const redis = require('redis')
const constants = require('../constants.json')

module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
     * @description Usage: .unmute <member>
     */
    async (args, msg, client) => {
        var moderatorRole = msg.guild.roles.cache.get(constants.roles.moder)
        if(msg.member.roles.cache.find(r => r.position >= moderatorRole.position)) {
            var mMember = msg.mentions.members.first()
            if(!mMember) {
                msg.channel.send(embeds.error(msg.member, 'Вы не указали пользователя для мута!'))
                return
            }

            // Get and prematurely delete the shadow key
            const rClient = redis.createClient(process.env.RURL)
            rClient.get('muted-' + mMember.user.id, (err, res) => {
                if(err) throw err
                if(res) {
                    // Delete the shadow key
                    rClient.DEL('muted-' + mMember.user.id, err => {
                        if(err) {
                            console.error(err)
                            return
                        }
                    })

                    // Shadow key means that userData exists
                    rClient.get(mMember.user.id, (err, res) => {
                        if(err)
                            console.error(err)

                        mMember.roles.remove(constants.roles.muted)

                        var userData = JSON.parse(res)
                        if(userData.mute) delete userData.mute
                        rClient.set(mMember.user.id, JSON.stringify(userData), err => { if(err) throw err })
                        rClient.quit()

                        msg.channel.send(embeds.unmute(mMember, msg.member))
                    })
                } else {
                    msg.channel.send(embeds.error(msg.member, 'Пользователь не был замьючен в первую очередь!'))
                }
            })
        } else {
            msg.channel.send(embeds.error(msg.member, 'У Вас нет прав для этой команды!'))
        }
    }
module.exports.allowedInGeneral = true