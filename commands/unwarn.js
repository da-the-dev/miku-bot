const Discord = require('discord.js')
const redis = require('redis')
const utl = require('../utility')
const emojies = ['1️⃣', '2️⃣', '3️⃣']
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .unwarn <member>
    */
    (args, msg, client) => {
        if(msg.member.roles.cache.find(r => r.permissions.has('ADMINISTRATOR'))) {
            var mMember = msg.mentions.members.first()
            if(!mMember) {
                utl.embed(msg, 'Не указан пользователь!')
                return
            }

            const rClient = redis.createClient(process.env.RURL)
            rClient.get(mMember.user.id, (err, res) => {
                if(err) console.log(err)
                if(res) {
                    var userData = JSON.parse(res)
                    if(!userData.warns) {
                        utl.embed(msg, `У пользователя <@${mMember.user.id}> нет предупреждений`)
                        return
                    }
                    var embed = utl.embed.build(msg, `Предупреждения <@${mMember.user.id}>`)

                    for(i = 0; i < userData.warns.length; i++) {
                        var w = userData.warns[i]
                        var date = new Date(w.time)
                        embed.addField('Дата', `\`⌗\`${i + 1} — ${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear().toString().slice(2)} в ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`, true)
                        embed.addField(`Исполнитель`, `<@${w.who}>`, true)
                        embed.addField(`Причина`, `${w.reason}`, true)
                    }

                    msg.channel.send(embed)
                        .then(async m => {
                            for(i = 0; i < userData.warns.length; i++)
                                await m.react(emojies[i])
                            const filter = (reaction, user) => user.id == msg.author.id
                            m.awaitReactions(filter, { time: 60000, max: 1 })
                                .then(reactions => {
                                    if(reactions.array().length > 0) {
                                        switch(reactions.first().emoji.name) {
                                            case emojies[0]:
                                                userData.warns.shift()
                                                break
                                            case emojies[1]:
                                                userData.warns.splice(1, 1)
                                                break
                                            case emojies[2]:
                                                userData.warns.pop()
                                                break
                                        }
                                        if(userData.warns.length == 0)
                                            delete userData.warns

                                        rClient.set(mMember.user.id, JSON.stringify(userData), err => { if(err) console.log(err) })
                                        rClient.quit()
                                        m.edit(utl.embed.build(msg, `Предупреждения для пользователя <@${mMember.user.id}> обновлены!`))
                                        m.reactions.removeAll()
                                    }
                                })
                        })
                } else {
                    utl.embed(msg, `У пользователя <@${mMember.user.id}> нет предупреждений`)
                    return
                }
            })
        } else {
            utl.embed(msg, 'У Вас нет прав для этой команды!')
        }
    }
module.exports.allowedInGeneral = true