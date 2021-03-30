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

        const rClient = redis.createClient(process.env.RURL)
        rClient.get(msg.author.id, (err, res) => {
            if(err) console.log(err)
            if(res) {
                var userData = JSON.parse(res)
                if(!userData.money || userData.money < 10000) {
                    utl.embed(msg, 'У Вас недостачно конфет для покупки любовной комнаты!')
                    rClient.quit()
                    return
                }

                var firstEmbed = new Discord.MessageEmbed()
                    .setDescription(`<@${mMember.id}>, <@${msg.member.id}> с тобой хочет создать с тобой любовную комнату, что ответишь?`)
                    .setColor('#2F3136')

                msg.channel.send(firstEmbed)
                    .then(async m => {
                        await m.react('✅')
                        await m.react('❌')
                        const filter = (reaction, user) =>
                            user.id == mMember.user.id
                        m.awaitReactions(filter, { time: 60000, max: 1 })
                            .then(reactions => {
                                if(reactions.array().length == 0) {
                                    m.edit(new Discord.MessageEmbed()
                                        .setDescription(`<@${mMember.id}> тебя проигнорировал(-а)`)
                                        .setColor('#2F3136')
                                        .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)}`, msg.author.avatarURL())
                                    )
                                    m.reactions.removeAll()
                                    return
                                }
                                if(reactions.first().emoji.name == '❌') {
                                    m.edit(new Discord.MessageEmbed()
                                        .setDescription(`<@${mMember.id}> тебе отказал(-а)`)
                                        .setColor('#2F3136')
                                        .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)}`, msg.author.avatarURL())
                                    )
                                    m.reactions.removeAll()
                                    return
                                }
                                if(reactions.first().emoji.name == '✅') {
                                    m.edit(new Discord.MessageEmbed()
                                        // .setAuthor(`Реакция: Поцелуй`, "https://cdn.discordapp.com/attachments/810255515854569472/813821208670765057/photodraw.ru-35920.png")
                                        .setDescription(`<@${msg.member.id}> cоздал любовную комнату с <@${mMember.id}>`)
                                        .setColor('#2F3136')
                                        .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)} `, msg.author.avatarURL()))

                                    msg.guild.channels.create(`${msg.author.username} ❤ ${mMember.user.username}`, {
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
                                            userData.loveroom = { 'id': c.id, 'partner': mMember.id }
                                            console.log(userData.loveroom)
                                            rClient.set(msg.author.id, JSON.stringify(userData), err => {
                                                if(err) console.log(err)

                                                rClient.get(mMember.id, (err, res) => {
                                                    if(err) console.log(err)
                                                    if(res) {
                                                        var userData = JSON.parse(res)
                                                        userData.loveroom = { 'id': c.id, 'partner': msg.author.id }
                                                        rClient.set(mMember.id, JSON.stringify(userData), err => { if(err) console.log(err) })
                                                    } else
                                                        rClient.set(mMember.id, JSON.stringify({ 'loveroom': { 'id': c.id, 'partner': msg.author.id } }), err => { if(err) console.log(err) })

                                                    rClient.quit()
                                                })
                                            })
                                        })

                                    m.reactions.removeAll()
                                    return
                                }
                                m.reactions.removeAll()
                            })
                    })
            } else {
                utl.embed(msg, 'У Вас недостачно конфет для покупки любовной комнаты!')
                rClient.quit()
            }
        })
    }
module.exports.allowedInGeneral = true