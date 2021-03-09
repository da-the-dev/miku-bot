const Discord = require('discord.js')
const redis = require('redis')
const roles = require('../roles.json')
const embeds = require('../embeds.js')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .warn <member> <reason>
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

            const rClient = redis.createClient(process.env.RURL)
            rClient.get(mMember.user.id, (err, res) => {
                if(err) throw err

                if(res == null) {
                    rClient.set(mMember.user.id, JSON.stringify({ 'warns': [reason] }), err => { if(err) throw err })
                    msg.member.roles.add(roles.offender)
                    rClient.quit()
                } else {
                    console.log(res)
                    var userData = JSON.parse(res)
                    if(!userData.warns) { // Never have been warned before
                        console.log('Never have been warned before')
                        userData.warns = []
                        msg.member.roles.add(roles.offender)
                    }

                    if(userData.warns.length == 3) { // Refuse to add more than 3 warns
                        msg.channel.send(embeds.error(msg.member, 'У обвиняемого уже есть 3 варна!'))
                        return
                    }

                    userData.warns.push(reason)

                    if(userData.warns.length == 3) // Alert when maxed out on number of warns
                        console.log('three warns')
                    // msg.channel.send(embeds.success(msg.member, 'У обвиняемого теперь есть 3 варна'))

                    rClient.set(msg.author.id, JSON.stringify(userData), err => { if(err) throw err })
                    rClient.quit()
                    msg.channel.send(embeds.warn(client, mMember, reason))
                }
            })
        } else {
            msg.channel.send(embeds.error(msg.member, 'У Вас нет прав для этой команды!'))
        }
    }