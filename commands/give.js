const Discord = require('discord.js')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .give <member> <ammount>
    */
    (args, msg, client) => {
        // Check if admin
        if(msg.member.roles.cache.find(r => r.permissions.has('ADMINISTRATOR'))) {
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

            utl.db.createClient(process.env.MURL).then(db => {
                console.log(amount)
                db.update(msg.guild.id, mMember.user.id, { $inc: { money: amount } }).then(() => {
                    utl.embed(msg, `Обновлен баланс пользователя на <@${mMember.user.id}> **${amount}**<:__:813854413579354143>`)
                    db.close()
                })
            })
        } else
            utl.embed(msg, 'У Вас нет прав для этой команды!')
    }