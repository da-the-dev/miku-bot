const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')
const { sweet } = require('../constants.json').emojies
const sMsg = 'Любовная команата'

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .lrpay <amount>
    */
    (args, msg, client) => {
        if(!args[1]) {
            utl.embed(msg, sMsg, 'Не указана сумма!')
            return
        }

        var amount = Number(args[1])
        if(!amount || isNaN(amount) || !Number.isInteger(amount)) {
            utl.embed(msg, sMsg, 'Указана неверная сумма!')
            return
        }

        utl.db.createClient(process.env.MURL).then(async db => {
            var userData = await db.get(msg.guild.id, msg.author.id)
            if(userData) {
                if(!userData.loveroom) {
                    utl.embed('У Вас нет любовной комнаты!')
                    db.close()
                    return
                }

                if(amount > userData.money) {
                    utl.embed(msg, 'У Вас недостаточно средств для пополнения!')
                    db.close()
                    return
                }

                userData.loveroom.bal += amount
                userData.money -= amount
                await db.set(msg.guild.id, msg.author.id, userData)
                await db.update(msg.guild.id, userData.loveroom.partner, { $inc: { 'loveroom.bal': amount } })
                utl.embed(msg, sMsg, `Вы успешно пополнили баланс комнаты на **${amount}** ${sweet}`)
                db.close()
            } else {
                utl.embed(msg, sMsg, 'У Вас нет любовной комнаты!')
                db.close()
            }
        })
    }