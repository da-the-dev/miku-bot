const Discord = require('discord.js')
const redis = require('redis')
const utl = require('../utility')
const util = require('util')
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

            const rClient = redis.createClient(process.env.RURL)
            const get = util.promisify(rClient.get).bind(rClient)
            const set = util.promisify(rClient.set).bind(rClient)
            get(mMember.user.id)
                .then(res => {
                    console.log(res)
                    if(res) {
                        var userData = JSON.parse(res)

                        if(!userData.money)
                            userData.money = amount
                        else
                            userData.money += amount

                        set(mMember.user.id, JSON.stringify(userData))
                            .then(res => {
                                utl.embed(msg, `Обновлен баланс пользователя <@${mMember.user.id}> **${userData.money}**<:__:813854413579354143>`)
                                rClient.quit()
                            })
                    } else {
                        set(mMember.user.id, JSON.stringify({ 'money': amount }))
                            .then(res => {
                                utl.embed(msg, `Обновлен баланс пользователя <@${mMember.user.id}> **${amount}**<:__:813854413579354143>`)
                                rClient.quit()
                            })
                    }
                })
        } else
            utl.embed(msg, 'У Вас нет прав для этой команды!')
    }