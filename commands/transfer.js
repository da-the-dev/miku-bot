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

        if(msg.author.id == mMember.user.id) {
            msg.channel.send(embeds.error(msg.member, 'Нельзя переводить деньги самому себе!'))
            return
        }

        const rClient = redis.createClient(process.env.RURL)
        rClient.get(msg.author.id, (err, res) => {
            if(err) throw err
            if(res) {
                var userData = JSON.parse(res)
                console.log(userData)
                if(amount > userData.money) { // If too much money is requested 
                    msg.channel.send(embeds.error(msg.member, 'У тебя недостаточно средств для перевода!'))
                    rClient.quit()
                } else {
                    rClient.get(mMember.user.id, (err, rres) => {
                        if(err) throw err
                        if(rres) { // If receiver HAS data
                            var receiverData = JSON.parse(rres)
                            userData.money -= amount
                            receiverData.money += amount

                            rClient.set(mMember.user.id, JSON.stringify(receiverData), err => { if(err) throw err })
                            rClient.set(msg.author.id, JSON.stringify(userData), err => { if(err) throw err })
                            rClient.quit()

                            msg.channel.send(embeds.success(msg.member, `Успешно переведено \`${amount}\` конфет пользователю ${mMember.user.username}!`))
                        } else { // If receiver DOES NOT have user data
                            rClient.set(mMember.user.id, JSON.stringify({ 'money': amount }), err => { if(err) throw err })
                            rClient.set(msg.author.id, JSON.stringify({ 'money': userData.money - amount }), err => { if(err) throw err })
                            rClient.quit()

                            msg.channel.send(embeds.success(msg.member, `Успешно переведено \`${amount}\` конфет пользователю ${mMember.user.username}!`))
                        }
                    })
                }
            } else {
                msg.channel.send(embeds.error(msg.member, 'У тебя нет средств для перевода!'))
                rClient.quit()
            }
            rClient.quit()
        })
    }