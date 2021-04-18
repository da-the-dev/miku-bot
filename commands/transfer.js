const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .transfer <member> <ammount>
    */
    (args, msg, client) => {
        var mMember = msg.mentions.members.first()
        if(!mMember) {
            utl.embed(msg, 'Не указан участник!')
            return
        }
        if(!args[2]) {
            utl.embed(msg, 'Не указана сумма!')
            return
        }
        var amount = Number(args[2])
        if(!amount || !Number.isInteger(amount)) {
            utl.embed(msg, 'Указана неверная сумма!')
            return
        }

        if(msg.author.id == mMember.user.id) {
            utl.embed(msg, 'Нельзя переводить деньги самому себе!')
            return
        }

        utl.db.createClient(process.env.MURL).then(db => {
            db.get(msg.guild.id, msg.author.id).then(userData => {
                if(userData) {
                    if(amount > userData.money) { // If too much money is requested 
                        utl.embed(msg, 'У тебя недостаточно средств для перевода!')
                        db.close()
                    } else {
                        db.update(msg.guild.id, msg.author.id, { $inc: { money: -amount } }).then(() => {
                            db.update(msg.guild.id, mMember.id, { $inc: { money: amount } }).then(() => {
                                utl.embed(msg, `Вы передали **${amount}**<${constants.emojies.sweet}> пользователю <@${mMember.user.id}>`)
                                db.close()
                            })
                        })
                    }
                } else {
                    utl.embed(msg, 'У тебя нет средств для перевода!')
                    db.close()
                }
            })
        })
    }