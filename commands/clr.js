const Discord = require('discord.js')
const utl = require('../utility')
const util = require('util')
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

        const rClient = redis.createClient(process.env.RURL)
        const get = util.promisify(rClient.get).bind(rClient)
        rClient.get(msg.author.id, async (err, res) => {
            if(err) console.log(err)
            if(res) {
                var userData = JSON.parse(res)
                if(!userData.money || userData.money < 10000) {
                    utl.embed(msg, 'У Вас недостачно конфет для покупки любовной комнаты!')
                    rClient.quit()
                    return
                }
                if(userData.loveroom) {
                    utl.embed(msg, 'У Вас уже есть любовная комната!')
                    rClient.quit()
                    return
                }

                var res = await get(mMember.id)
                if(res) {
                    var d = JSON.parse(res)
                    if(d.loveroom) {
                        utl.embed(msg, 'У партнера уже есть любовная комната!')
                        rClient.quit()
                        return
                    }
                }

                var firstEmbed = new Discord.MessageEmbed()
                    .setDescription(`<@${mMember.id}>, <@${msg.member.id}> с тобой хочет создать с тобой любовную комнату, что ответишь?\nСтоимость комнаты **10.000** <${constants.emojies.sweet}>`)
                    .setColor('#2F3136')

                msg.channel.send(firstEmbed)
                    .then(async m => {
                        utl.yesNoReactionMessage(m, mMember.id,
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
                                                deny: ["CONNECT"]
                                            },
                                            {
                                                id: constants.roles.muted,
                                                deny: ["CONNECT"]
                                            },
                                            {
                                                id: constants.roles.toxic,
                                                deny: ["CONNECT"]
                                            },
                                            {
                                                id: constants.roles.localban,
                                                deny: ["VIEW_CHANNEL", "CONNECT"]
                                            },
                                            {
                                                id: msg.author.id,
                                                allow: ['CONNECT']
                                            },
                                            {
                                                id: mMember.id,
                                                allow: ['CONNECT']
                                            }
                                        ],
                                    parent: constants.categories.loverooms,
                                    userLimit: 2
                                })
                                    .then(async c => {
                                        mMember.roles.add(constants.roles.loveroom)
                                        msg.member.roles.add(constants.roles.loveroom)

                                        userData.money -= 10000
                                        userData.loveroom = { 'id': c.id, 'partner': mMember.id, 'creationDate': Date.now() }
                                        console.log(userData.loveroom)
                                        rClient.set(msg.author.id, JSON.stringify(userData), err => {
                                            if(err) console.log(err)

                                            rClient.get(mMember.id, (err, res) => {
                                                if(err) console.log(err)
                                                if(res) {
                                                    var userData = JSON.parse(res)
                                                    userData.loveroom = { 'id': c.id, 'partner': msg.author.id, 'creationDate': Date.now() }
                                                    rClient.set(mMember.id, JSON.stringify(userData), err => { if(err) console.log(err) })
                                                } else
                                                    rClient.set(mMember.id, JSON.stringify({ 'loveroom': { 'id': c.id, 'partner': msg.author.id, 'creationDate': Date.now() } }), err => { if(err) console.log(err) })

                                                rClient.quit()

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
                            },
                            () => {
                                m.edit(utl.embed.build(msg, `<@${mMember.id}> тебя проигнорировал(-а)`))
                                m.reactions.removeAll()
                            }
                        )
                    })
            } else {
                utl.embed(msg, 'У Вас недостачно конфет для покупки любовной комнаты!')
                rClient.quit()
            }
        })
    }
module.exports.allowedInGeneral = true