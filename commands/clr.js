const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')
const redis = require('redis')

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .clr <member>
    */
    async (args, msg, client) => {
        var mMember = msg.mentions.members.first()
        if(!mMember) {
            utl.embed(msg, 'Не указан участник!')
            return
        }
        if(mMember.id == msg.member.id) {
            utl.embed(msg, 'Неверный участник!')
            return
        }

        utl.db.createClient(process.env.MURL).then(db => {
            db.get(msg.guild.id, msg.author.id).then(async userData => {
                if(userData) {
                    if(!userData.money || userData.money < 10000) {
                        utl.embed(msg, 'У Вас недостачно конфет для покупки любовной комнаты!')
                        db.close()
                        return
                    }
                    if(userData.loveroom) {
                        utl.embed(msg, 'У Вас уже есть любовная комната!')
                        db.close()
                        return
                    }

                    var d = await db.get(msg.guild.id, mMember.id)
                    if(d) {
                        if(d.loveroom) {
                            utl.embed(msg, 'У партнера уже есть любовная комната!')
                            await db.close()
                            return
                        }
                    }

                    var firstEmbed = new Discord.MessageEmbed()
                        .setDescription(`<@${mMember.id}>, <@${msg.member.id}> с тобой хочет создать с тобой любовную комнату, что ответишь?\nСтоимость комнаты **10.000** <${constants.emojies.sweet}>`)
                        .setColor('#2F3136')

                    msg.channel.send(firstEmbed)
                        .then(async m => {
                            utl.reactionSelector.yesNo(m, mMember.id,
                                () => {
                                    m.edit(utl.embed.build(msg, `<@${msg.member.id}> cоздал любовную комнату с <@${mMember.id}>`))
                                    m.guild.channels.create(`${msg.author.username} ❤ ${mMember.user.username}`, {
                                        type: 'voice',
                                        permissionOverwrites:
                                            [
                                                {
                                                    id: msg.guild.id,
                                                    deny: ["CONNECT"]
                                                },
                                                {
                                                    id: constants.roles.verify,
                                                    deny: ["VIEW_CHANNEL", "CONNECT"]
                                                },
                                                {
                                                    id: constants.roles.muted,
                                                    deny: ["VIEW_CHANNEL", "CONNECT"]
                                                },
                                                {
                                                    id: constants.roles.toxic,
                                                    deny: ["VIEW_CHANNEL", "CONNECT"]
                                                },
                                                {
                                                    id: constants.roles.localban,
                                                    deny: ["VIEW_CHANNEL", "CONNECT"]
                                                },
                                                {
                                                    id: msg.author.id,
                                                    allow: ["VIEW_CHANNEL", 'CONNECT']
                                                },
                                                {
                                                    id: mMember.id,
                                                    allow: ["VIEW_CHANNEL", 'CONNECT']
                                                }
                                            ],
                                        parent: constants.categories.loverooms,
                                        userLimit: 2
                                    })
                                        .then(c => {
                                            mMember.roles.add(constants.roles.loveroom)
                                            msg.member.roles.add(constants.roles.loveroom)

                                            userData.money -= 10000
                                            userData.loveroom = { 'id': c.id, 'partner': mMember.id, 'creationDate': Date.now(), 'bal': 6000 }

                                            db.set(msg.guild.id, msg.author.id, userData).then(() => {
                                                db.update(msg.guild.id, mMember.id, { $set: { 'loveroom': { 'id': c.id, 'partner': msg.author.id, 'creationDate': Date.now(), 'bal': 6000 } } }).then(() => {
                                                    db.close()
                                                    const embed = utl.embed.build(msg, 't')
                                                        .setDescription("`💞`" + `<@${msg.member.id}> и <@${mMember.id}> теперь пара!`)
                                                        .setImage('https://i.pinimg.com/originals/56/3a/04/563a04f99fea51b9b49c8d2f9e633066.gif')
                                                    msg.channel.send(embed)
                                                })
                                            })
                                        })
                                    m.reactions.removeAll()
                                    return
                                },
                                () => {
                                    m.edit(utl.embed.build(msg, `<@${mMember.id}> тебе отказал(-а)`))
                                    m.reactions.removeAll()
                                    db.close()
                                },
                                () => {
                                    m.edit(utl.embed.build(msg, `<@${mMember.id}> тебя проигнорировал(-а)`))
                                    m.reactions.removeAll()
                                    db.close()
                                }
                            )
                        })
                } else {
                    utl.embed(msg, 'У Вас недостачно конфет для покупки любовной комнаты!')
                    db.close()
                }
            })
        })
    }
module.exports.allowedInGeneral = true