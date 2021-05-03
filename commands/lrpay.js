const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .lrpay <amount>
    */
    (args, msg, client) => {
        if(!args[1]) {
            utl.embed(msg, 'Не указана сумма!')
            return
        }

        var amount = Number(args[1])
        if(!amount || isNaN(amount) || !Number.isInteger(amount)) {
            utl.embed(msg, 'Указана неверная сумма!')
            return
        }

        utl.db.createClient(process.env.MURL).then(db => {
            db.get(msg.guild.id, msg.author.id).then(userData => {
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
                    db.set(msg.guild.id, msg.author.id, userData).then(() => {
                        db.update(msg.guild.id, userData.loveroom.partner, { $inc: { 'loveroom.bal': amount } }).then(() => {
                            utl.embed(msg, `Успешно добавлено **${amount}**<${constants.emojies.sweet}> на счет команаты`)
                            db.close()
                        })
                    })
                } else {
                    utl.embed('У Вас нет любовной комнаты!')
                    db.close()
                }
            })
        })
    }