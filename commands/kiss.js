const Discord = require('discord.js')
const utl = require('../utility')

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .kiss <member>
    */
    (args, msg, client) => {
        var mMember = msg.mentions.members.first()
        if(!mMember)
            return
        if(mMember.id == msg.member.id)
            return

        var name1 = msg.member.nickname
        if(!name1)
            name1 = msg.author.username
        var name2 = mMember.nickname
        if(!name2)
            name2 = mMember.user.username

        var firstEmbed = new Discord.MessageEmbed()
            .setDescription(`<@${mMember.id}>, с тобой хочет поцеловаться <@${msg.member.id}>, что ответишь?`)
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
                                .setAuthor(`Реакция: Поцелуй`, "https://cdn.discordapp.com/attachments/810255515854569472/813821208670765057/photodraw.ru-35920.png")
                                .setDescription(`<@${msg.member.id}> поцеловал(-а) <@${mMember.id}>`)
                                .setImage(utl.reactions.kissReactions[Math.floor(Math.random() * 7)])
                                .setColor('#2F3136')
                                .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)} `, msg.author.avatarURL()))
                            m.reactions.removeAll()
                            return
                        }
                        m.reactions.removeAll()
                    })
            })
    }
module.exports.allowedInGeneral = true