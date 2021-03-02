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
            rClient.get(msg.member.id, (err, reply) => {
                if(err)
                    console.error(err)

                // If first warn
                if(reply == null)
                    rClient.set(msg.member.id, JSON.stringify({
                        'warns': reason.toString()
                    }), err => {
                        if(err)
                            console.error(err)
                        msg.member.roles.add(roles.offender)
                        rClient.quit()
                    })
                else
                    rClient.get(msg.member.id, (err, reply) => {
                        if(err)
                            console.error(err)

                        /**@type {Array<object>} */
                        var warns = JSON.parse(reply).warns.split('||')

                        if(warns.length == 3) { // Refuse to add more than 3 warns
                            msg.reply('three warns already')
                            warns.push(reason)
                            rClient.quit()
                            return
                        }

                        warns.push(reason)

                        rClient.set(msg.member.id, JSON.stringify({
                            'warns': warns.join('||')
                        }))

                        if(warns.length == 3) { // As soon as there are 3 warns
                            msg.reply('three warns now')
                            rClient.quit()
                            return
                        }
                        rClient.quit()
                    })
            })

            // msg.channel.send(embeds.warn(mMember, msg.member, reason))
        } else {
            msg.channel.send(embeds.error(msg.member, 'У Вас нет прав для этой команды!'))
        }
    }