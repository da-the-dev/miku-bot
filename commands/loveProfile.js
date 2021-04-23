const constants = require('../constants.json')
const Discord = require('discord.js')
const utl = require('../utility')

const timeCalculator = (time) => {
    var mmD = Math.floor(time / 24 / 60)
    var mmH = Math.floor(time / 60) - (mmD * 24)
    var mmM = Math.floor(time) - (mmD * 60 * 24 + mmH * 60)
    var muteMsg = ''

    if(mmD) muteMsg += `**${mmD.toString()}**d `
    if(mmH) muteMsg += `**${mmH.toString()}**h `
    if(mmM) muteMsg += `**${mmM.toString()}**m`

    return muteMsg
}

const timeTillPayday = () => {
    var today = new Date(new Date(Date.now()).toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
    var payday = new Date(new Date(Date.now()).toLocaleString("en-US", { timeZone: "Europe/Moscow" }))

    payday.setUTCHours(0)
    payday.setUTCMinutes(0)
    payday.setUTCSeconds(0)
    payday.setUTCMilliseconds(0)

    if(today.getDate() >= 24 && today.getDate() <= 31)
        payday.setUTCDate(1)
    if(today.getDate() >= 1 && today.getDate() <= 11)
        payday.setUTCDate(12)
    if(today.getDate() >= 12 && today.getDate() <= 23)
        payday.setUTCDate(24)

    return `${timeCalculator(Math.round((payday.getTime() - today.getTime()) / 1000 / 60))}`
}

/**
 * @param {Array<string>} args Command argument
 * @param {Discord.Message} msg Discord message object
 * @param {Discord.Client} client Discord client object
 * @description Usage: .loveProfile
 */
module.exports = (args, msg, client) => {
    utl.db.createClient(process.env.MURL).then(db => {
        db.get(msg.guild.id, msg.author.id).then(userData => {
            if(userData) {
                if(!userData.loveroom) {
                    utl.embed(msg, 'У Вас нет пары!')
                    db.close()
                    return
                }


                var today = new Date(new Date(Date.now()).toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
                var payday = new Date(Date.now())
                if(today.getDay() >= 24 && today.getDate() <= 31)
                    payday.setDate(1)
                if(today.getDay() >= 1 && today.getDate() <= 11)
                    payday.setDate(12)
                if(today.getDay() >= 12 && today.getDate() <= 23)
                    payday.setDate(23)

                var date = new Date(userData.loveroom.creationDate)
                var embed = utl.embed.build(msg, 't')
                    .setTitle('<a:__:825834909146415135> Профиль пары')
                    .setDescription(` \`💞\` — **Партнёр:**\n> <@{userData.loveroom.partner}>\n \`📅\` — **Дата регистрации пары:**\n> ${date.toLocaleDateString('ru-RU')}\n \`💳\` — **Баланс пары:**\n> ${userData.loveroom.bal}<${constants.emojies.sweet}>\n \`🕚\` — **До оплаты осталось**\n> ${timeTillPayday()}\n `)
                    .setImage("https://media.discordapp.net/attachments/736038639791767594/743986900179615763/unknown.png")

                // "description": ` \`💞\` — **Партнёр:**\n> <@{userData.loveroom.partner}>\n \`📅\` — **Дата регистрации пары:**\n> ${date.toLocaleDateString('ru-RU')}\n \`💳\` — **Баланс пары:**\n> ${userData.loveroom.bal}<${constants.emojies.sweet}>\n \`🕚\` — **До оплаты осталось:**\n> **1**d **0**h **10**m`,

                msg.channel.send(embed)
                db.close()
            } else {
                utl.embed(msg, 'У Вас нет пары!')
                db.close()
            }
        })
    })
}