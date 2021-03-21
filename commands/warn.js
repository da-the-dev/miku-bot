const Discord = require('discord.js')
const redis = require('redis')
const utl = require('../utility')
const constants = require('../constants.json')

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .warn <member> <reason>
    */
    (args, msg, client) => {
        var moderatorRole = msg.guild.roles.cache.get(constants.roles.moder)
        if(msg.member.roles.cache.find(r => r.position >= moderatorRole.position)) {
            var mMember = msg.mentions.members.first()
            if(!mMember) {
                utl.embed(msg, 'Вы не указали пользователя для варна!')
                return
            }

            args.shift()
            args.shift()

            var reason = args.join(" ").trim()
            if(!reason) {
                utl.embed(msg, 'Вы не указали причину варна!')
                return
            }

            const rClient = redis.createClient(process.env.RURL)
            rClient.get(mMember.user.id, (err, res) => {
                if(err) throw err

                if(res == null) {
                    rClient.set(mMember.user.id, JSON.stringify({ 'warns': [{ 'reason': reason, 'who': msg.author.id, 'time': msg.createdTimestamp }] }), err => { if(err) throw err })
                    // mMember.roles.add(roles.offender)
                    utl.embed(msg, `Пользователю <@${mMember.user.id}> было выдано предупреждение **#1** \n\`\`\`Elm\nПричина: ${reason}\n\`\`\``)
                    rClient.quit()
                } else {
                    var userData = JSON.parse(res)
                    if(!userData.warns) // Never have been warned before
                        userData.warns = []

                    userData.warns.push({ 'reason': reason, 'who': msg.author.id, 'time': msg.createdTimestamp })

                    if(userData.warns.length == 4) {// Alert when maxed out on number of warns
                        userData.warns = []
                        userData.warns.push({ 'reason': reason, 'who': msg.author.id, 'time': msg.createdTimestamp })
                    }

                    rClient.set(mMember.user.id, JSON.stringify(userData), err => { if(err) throw err })
                    rClient.quit()

                    utl.embed(msg, `Пользователю <@${mMember.user.id}> было выдано предупреждение **#${userData.warns.length}** \n\`\`\`Elm\nПричина: ${reason}\n\`\`\``)
                }
            })
        } else {
            utl.embed(msg, 'У Вас нет прав для этой команды!')
        }
    }
module.exports.allowedInGeneral = true