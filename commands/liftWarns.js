const Discord = require('discord.js')
const redis = require('redis')
const roles = require('../roles.json')
const embeds = require('../embeds.js')
const emojies = ['1️⃣', '2️⃣', '3️⃣']
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .liftWarns <member>
    */

    async (args, msg, client) => {
        var mMember = msg.mentions.members.first()
        if(!mMember) {
            msg.channel.send(embeds.error(msg.member, 'Не указан пользователь!'))
            return
        }

        const rClient = redis.createClient(process.env.RURL)
        rClient.get(mMember.user.id, (err, res) => {
            if(err) throw err
            if(res) {
                var userData = JSON.parse(res)
                console.log(userData.warns, userData.warns.length)
                if(!userData.warns) {
                    msg.channel.send(embeds.error(msg.member, 'У пользователя нет варнов!'))
                    return
                }
                var embed = new Discord.MessageEmbed()
                    .setColor('#2F3136')
                    .setDescription(`Варны пользователя ${mMember.user.username}`)
                for(i = 0; i < userData.warns.length; i++) {
                    console.log(userData.warns[i])
                    embed.addField(`#${i + 1}`, userData.warns[i], true)
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
                                    if(userData.warns.length == 0) {
                                        delete userData.warns
                                        mMember.roles.remove(roles.offender)
                                    }
                                    rClient.set(mMember.user.id, JSON.stringify(userData), err => { if(err) throw err })
                                    rClient.quit()
                                    m.edit(new Discord.MessageEmbed()
                                        .setColor('#2F3136')
                                        .setDescription(`Варны для пользователя <@${mMember.user.id}> обновлены!`))
                                    m.reactions.removeAll()
                                }
                            })
                    })
            }
        })
    }
