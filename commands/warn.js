const Discord = require('discord.js')
const redis = require('redis')
const roles = require('../roles.json')
const embeds = require('../embeds.js')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .v <arg> 
    */

    async (args, msg, client) => {
        var moderatorRole = msg.guild.roles.cache.get(roles.moder)
        if(msg.member.roles.cache.find(r => r.position >= moderatorRole.position && r.id != roles.star)) {
            var mMember = msg.mentions.members.first()
            if(!mMember) {
                msg.channel.send(embeds.error(msg.member, 'Вы не указали пользователя для варна!'))
                return
            }

            args.shift()
            args.shift()

            var reason = args.join(" ").trim()
            if(!reason) {
                msg.channel.send(embeds.error(msg.member, 'Вы не указали причину варна!'))
                return
            }

            // Added the warn to the history
            const rClient = redis.createClient(process.env.RURL)

            var avalible = false
            rClient.get(mMember.user.id, (err, res) => {
                if(err)
                    console.error(err)

                // If no user data
                if(res == null)

                    rClient.set(mMember.user.id, JSON.stringify(
                        {
                            [msg.guild.id]: {
                                'warns': [reason]
                            }
                        }
                    ), err => {
                        if(err)
                            console.error(err)
                        msg.member.roles.add(roles.offender)
                        rClient.quit()
                    })
                else {
                    var userData = JSON.parse(res)

                    if(userData[msg.guild.id].warns.length == 3) { // Refuse to add more than 3 warns
                        msg.reply('already three warns')
                        return
                    }

                    userData[msg.guild.id].warns.push(reason)

                    if(userData[msg.guild.id].warns.length == 3) { // Alert when maxed out on number of warns
                        msg.reply('there are 3 warns')
                    }

                    rClient.set(msg.member.user.id, JSON.stringify(userData), err => {
                        if(err)
                            console.error(err)
                        rClient.quit()
                    })
                }
            })

            // msg.channel.send(embeds.warn(mMember, msg.member, reason))
        } else {
            msg.channel.send(embeds.error(msg.member, 'У Вас нет прав для этой команды!'))
        }
    }