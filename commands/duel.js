const Discord = require('discord.js')
const utl = require('../utility')
const { sweet } = require('../constants.json').emojies
const sMsg = 'Дуэли'

/**
 * Start a duel
 * @param {Discord.Message} msg - Original message
 * @param {Discord.Message} m - Response message
 * @param {Discord.GuildMember} caller - Original duelist
 * @param {Discord.GuildMember} duelist - Duelist who responded
 * @param {number} bet
 */
const startDuel = (m, msg, caller, duelist, bet) => {
    const roll = Math.random()
    if(roll < 0.5) {
        m.edit(utl.embed(msg, sMsg, `В **дуэли** одержал победу <@${caller.id}> и получил **${bet}**${sweet}\n\n**Вызов принял:** <@${duelist.id}>`))
        utl.db.createClient(process.env.MURL).then(async db => {
            var users = await Promise.all([db.get(msg.guild.id, caller.id), db.get(msg.guild.id, duelist.id)])
            users[0].money += Number(bet)
            users[1].money -= Number(bet)
            await Promise.all([db.set(msg.guild.id, caller.id, users[0]), db.set(msg.guild.id, duelist.id, users[1])])
            db.close()
        })
    }
    if(roll == 0.5) {
        m.edit(utl.embed(msg, sMsg, `**Дуэль** окончилась ничьей\n\n**Вызов принял:** <@${duelist.id}>`))
    }
    if(roll > 0.5) {
        m.edit(utl.embed(msg, sMsg, `В **дуэли** одержал победу <@${duelist.id}> и получил **${bet}**${sweet}\n\n**Вызов принял:** <@${duelist.id}>`))
        utl.db.createClient(process.env.MURL).then(async db => {
            var users = await Promise.all([db.get(msg.guild.id, caller.id), db.get(msg.guild.id, duelist.id)])
            users[0].money -= bet
            users[1].money += bet
            console.log(users)
            await Promise.all([db.set(msg.guild.id, caller.id, users[0]), db.set(msg.guild.id, duelist.id, users[1])])
            db.close()
        })
    }
}

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .br <bet>
    */
    async (args, msg, client) => {
        var bet = args[1]

        if(!Number.isInteger(Number(bet)) || bet < 50 || bet > 50000) {
            utl.embed.ping(msg, sMsg, `укажите **количество** ${sweet}, которое **не** меньше **50**${sweet} и **не** больше **50000**${sweet}`)
            return
        }

        var mMember = msg.mentions.members.first()
        if(mMember) {
            const m = await utl.embed(msg, sMsg, `<@${mMember.id}>, <@${msg.author.id}> **вызывает** Вас на **дуэль** за **${bet}**${sweet}\nДля **согласия** нажмите на ✅, а для **отмены** ❌`)
            utl.reactionSelector.yesNo(m, mMember.id,
                () => {
                    startDuel(m, msg, msg.member, mMember, bet)
                },
                () => {
                    m.edit(utl.embed(msg, sMsg, `<@${mMember.id}> **струсил**\n\n**Вызов принял:** <@${mMember.id}>`))
                },
                () => {
                    m.edit(utl.embed.ping(msg, sMsg, `<@${mMember.id}> **струсил** и **не ответил** на Ваш вызов\n\n**Вызов принял:** <@${mMember.id}>`))
                }
            )
        } else {
            const m = await utl.embed(msg, sMsg, `<@${msg.author.id}> хочет с кем-то **сразится** за **${bet}**${sweet}\n`)
            await m.react('✅')
            const filter = (reaction, user) => {
                return ['✅'].includes(reaction.emoji.name) && user.id == id
            }
            m.awaitReactions(filter, { max: 1, time: 60000, errors: 'time' })
                .then(reactions => {
                    const reaction = reactions.first()
                    const member = msg.guild.member(reaction.users.cache.last())

                    startDuel(m, msg, msg.member, member, bet)
                })
        }

    }