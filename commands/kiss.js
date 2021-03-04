const Discord = require('discord.js')
const Reactions = require('../reactions')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .kiss <member>
    */
    async (args, msg, client) => {
        var mMember = msg.mentions.members.first()
        if(!mMember)
            return
        if(mMember.id == msg.member.id)
            return

        var name1 = msg.member.nickname
        if(!name1)
            name1 = msg.member.user.username
        var name2 = mMember.nickname
        if(!name2)
            name2 = mMember.user.username

        var firstEmbed = new Discord.MessageEmbed()
            .setDescription(`<@${mMember.id}>, с тобой хочет поцеловаться <@${msg.member.id}>, что ответишь?`)

        msg.channel.send(firstEmbed)
            .then(async m => {
                await m.react('✅')
                await m.react('❌')
                const filter = (reaction, user) =>
                    user.id == mMember.user.id
                m.awaitReactions(filter, { time: 10000, max: 1 })
                    .then(reactions => {
                        if(reactions.array().length == 0) {
                            m.edit(new Discord.MessageEmbed()
                                .setDescription(`<@${mMember.id}> тебя проигнорировал(-а)`)
                                .setColor('#2F3136')
                            )
                            m.reactions.removeAll()
                            return
                        }
                        if(reactions.first().emoji.name == '❌') {
                            m.edit(new Discord.MessageEmbed()
                                .setDescription(`<@${mMember.id}> тебе отказал(-а)`)
                                .setColor('#2F3136')
                            )
                            m.reactions.removeAll()
                            return
                        }
                        if(reactions.first().emoji.name == '✅') {
                            m.edit(new Discord.MessageEmbed()
                                .setDescription(`<@${msg.member.id}> поцеловал(-а) <@${mMember.id}>`)
                                .setImage(Reactions.kissReactions[Math.floor(Math.random() * 7)])
                                .setColor('#2F3136')
                            )
                            m.reactions.removeAll()
                            return
                        }

                        m.reactions.removeAll()
                    })
            })
    }