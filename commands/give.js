const Discord = require('discord.js')
const redis = require('redis')
const embeds = require('../embeds')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .give <member> <ammount>
    */
    async (args, msg, client) => {
        // Check if admin
        if(msg.member.roles.cache.find(r => r.permissions.has('ADMINISTRATOR'))) {
            var mMember = msg.mentions.members.first()
            if(!mMember) {
                msg.channel.send(embeds.error(msg.member, 'Не указан участник!'))
                return
            }
            console.log(args[2])
            if(!args[2]) {
                msg.channel.send(embeds.error(msg.member, 'Не указана сумма!'))
                return
            }
            var amount = Number(args[2])
            if(!amount || !Number.isInteger(amount)) {
                msg.channel.send(embeds.error(msg.member, 'Указана неверная сумма!'))
                return
            }
            console.log(amount)

            const rClient = redis.createClient(process.env.RURL)
            rClient.get(mMember.user.id, (err, res) => {
                if(err) throw err
                if(res) {
                    var userData = JSON.parse(res)
                    console.log(userData)
                    if(!userData.money)
                        userData.money == amount
                    else
                        userData.money += amount
                    console.log(userData)

                    rClient.set(mMember.user.id, JSON.stringify(userData), err => {
                        if(err) throw err
                        msg.channel.send(embeds.success(msg.member, `Обновлен баланс пользователя <@${mMember.user.id}> **${userData.money}**<:__:813854413579354143>`))
                        rClient.quit()
                    })
                } else {
                    rClient.set(mMember.user.id, JSON.stringify({ 'money': amount }), err => {
                        if(err) throw err
                        //Обновлен баланс пользователя @member 42 :__~7:
                        msg.channel.send(embeds.success(msg.member, `Обновлен баланс пользователя <@${mMember.user.id}> **${amount}**<:__:813854413579354143>`))
                        rClient.quit()
                    })
                }
            })
        } else {
            msg.channel.send(embeds.error(msg.member, 'У Вас нет прав для этой команды!'))
        }
    }