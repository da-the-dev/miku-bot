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
        if(msg.member.roles.cache.find(r => r.position >= moderatorRole.position)) {
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
                    rClient.set(mMember.user.id, JSON.stringify({ 'warns': [{ 'reason': reason, 'who': msg.author.id, 'time': msg.createdTimestamp }] }), err => { if(err) throw err })
                    // mMember.roles.add(roles.offender)
                    msg.channel.send(embeds.warn(mMember, msg.member, 1, reason))
                    rClient.quit()
                } else {
                    console.log(res)
                    var userData = JSON.parse(res)
                    if(!userData.warns) { // Never have been warned before
                        userData.warns = []
                        // mMember.roles.add(roles.offender)
                        console.log('never has been warned')
                    }

                    userData.warns.push({ 'reason': reason, 'who': msg.author.id, 'time': msg.createdTimestamp })

                    if(userData.warns.length == 4) {// Alert when maxed out on number of warns
                        userData.warns = []
                        userData.warns.push({ 'reason': reason, 'who': msg.author.id, 'time': msg.createdTimestamp })
                    }
                    // msg.channel.send(embeds.success(msg.member, 'У обвиняемого теперь есть 3 варна'))

                    rClient.set(mMember.user.id, JSON.stringify(userData), err => { if(err) throw err })
                    rClient.quit()
                    msg.channel.send(embeds.warn(mMember, msg.member, userData.warns.length, reason))
                }
            })
        } else {
            msg.channel.send(embeds.error(msg.member, 'У Вас нет прав для этой команды!'))
        }
    }