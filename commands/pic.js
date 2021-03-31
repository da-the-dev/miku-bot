const Discord = require('discord.js')
const redis = require('redis')
const constants = require('../constants.json')
const utl = require('../utility')

/**
 * Buys the pic role for some time
 * @param {Discord.Message} msg - OG message
 * @param {Discord.GuildMember} member - Member who bought it
 * @param {number} duration - Duration in seconds
 * @param {number} price - Price
 */
const buyRole = async (msg, member, duration, price) => {
    const rClient = redis.createClient(process.env.RURL)
    const get = require('util').promisify(rClient.get).bind(rClient)
    const set = require('util').promisify(rClient.set).bind(rClient)
    const expire = require('util').promisify(rClient.expire).bind(rClient)
    const del = require('util').promisify(rClient.del).bind(rClient)
    const ttl = require('util').promisify(rClient.ttl).bind(rClient)

    var res = await get(member.id)
    if(res) {
        var userData = JSON.parse(res)
        if(res) {
            var userData = JSON.parse(res)
            if(!userData.money || userData.money < price) {
                rClient.quit()
                utl.embed(msg, "У Вас недостаточно конфет!")
                return false
            }
            else {
                userData.money -= price
                await set(member.id, JSON.stringify(userData))
            }
        } else {
            rClient.quit()
            utl.embed(msg, "У Вас недостаточно конфет!")
            return false
        }
    }


    get('pics-' + member.id)
        .then(async res => {
            console.log('res type:', typeof res, res)
            if(res != null) {
                console.log('extend')

                var remaining = await ttl('pics-' + member.id)
                console.log(remaining)
                set('pics-' + member.id, '').then(() => {
                    expire('pics-' + member.id, remaining + duration).then(() => {
                        rClient.quit()
                    }).catch(err => { console.log(err) }).then(() => { console.log('set key:', 'pics-' + member.id) })
                }).catch(err => { console.log(err) })
                msg.edit(new Discord.MessageEmbed()
                    .setDescription(`Вы продлили роль <@&${constants.roles.pics}> на **${duration / 24 / 60 / 60}** дней`)
                    .setColor('#2F3136')
                    .setFooter(`${member.user.tag} • ${utl.embed.calculateTime(Date.now())}`, member.user.avatarURL())
                ).then(m => m.reactions.removeAll())
            } else {
                console.log('buys')
                set('pics-' + member.id, '').then(() => {
                    expire('pics-' + member.id, duration).then(() => {
                        rClient.quit()
                    }).catch(err => { console.log(err) })
                }).catch(err => { console.log(err) }).then(() => { console.log('set key:', 'pics-' + member.id) })
                member.roles.add(constants.roles.pics)
                msg.edit(new Discord.MessageEmbed()
                    .setDescription(`Вы успешно купили роль <@&${constants.roles.pics}> на **${duration / 24 / 60 / 60}** дней`)
                    .setColor('#2F3136')
                    .setFooter(`${member.user.tag} • ${utl.embed.calculateTime(Date.now())}`, member.user.avatarURL())
                ).then(m => m.reactions.removeAll())
            }
        })
}

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .pic
    */
    (args, msg, client) => {
        const emb = utl.embed.build(msg, `<@${msg.author.id}>, на сколько Вы хотите **купить** <@&${constants.roles.pics}>?\n\n<${constants.emojies.one}> — **7** дней, цена: 1000 <${constants.emojies.sweet}>\n<${constants.emojies.two}> — **14** дней, цена: 1800 <${constants.emojies.sweet}>\n<${constants.emojies.three}> — **30** дней, цена: 4000 <${constants.emojies.sweet}>\n<${constants.emojies.escape}> — Отмена\n`)
        msg.channel.send(emb)
            .then(async m => {
                await m.react(constants.emojies.one)
                await m.react(constants.emojies.two)
                await m.react(constants.emojies.three)
                await m.react(constants.emojies.escape)

                /**
                 * @param {Discord.MessageReaction} reaction 
                 * @param {Discord.User} user 
                 */
                const filter = (reaction, user) => {
                    return [constants.emojies.one, constants.emojies.two, constants.emojies.three, constants.emojies.escape].includes(reaction.emoji.identifier) && user.id == msg.author.id
                }
                m.awaitReactions(filter, { max: 1 })
                    .then(reactions => {
                        var reaction = reactions.first()
                        switch(reaction.emoji.identifier) {
                            case constants.emojies.one:
                                buyRole(m, msg.member, 7 * 24 * 60 * 60, 1000)
                                break
                            case constants.emojies.two:
                                buyRole(m, msg.member, 14 * 24 * 60 * 60, 1800)
                                break
                            case constants.emojies.three:
                                buyRole(m, msg.member, 30 * 24 * 60 * 60, 4000)
                                break
                            case constants.emojies.escape:
                                m.delete()
                                break
                        }
                    })
            })
    }