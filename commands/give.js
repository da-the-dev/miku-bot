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

            const rClient = redis.createClient(process.env.RURL)
            rClient.get(msg.author.id, (err, res) => {
                if(err) throw err
                if(res) {
                    var userData = JSON.parse(res)
                    console.log(userData)
                    if(!userData.money)
                        userData.money == amount
                    else
                        userData.money += amount
                    console.log(userData)

                    rClient.set(msg.author.id, JSON.stringify(userData), err => {
                        if(err) throw err
                        msg.channel.send(embeds.success(msg.member, `Успешно обновлен баланс пользователя ${msg.author.username} (\`${userData.money}\`)!`))
                        rClient.quit()
                    })
                } else {
                    rClient.set(msg.author.id, JSON.stringify({ 'money': amount }), err => {
                        if(err) throw err
                        msg.channel.send(embeds.success(msg.member, `Успешно установлена сумма \`${amount}\` пользователю ${msg.author.username}!`))
                        rClient.quit()
                    })
                }
            })
        }
    }