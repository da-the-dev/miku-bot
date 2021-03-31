const Discord = require('discord.js')
const redis = require('redis')
const utl = require('../utility')
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

        const rClient = redis.createClient(process.env.RURL)
        rClient.get(msg.author.id, (err, res) => {
            if(err) console.log(err)
            if(res) {
                var userData = JSON.parse(res)
                if(amount > userData.money)  // If too much money is requested 
                    utl.embed(msg, 'У тебя недостаточно средств для перевода!')
                else {
                    rClient.get(mMember.user.id, (err, rres) => {
                        if(err) console.log(err)
                        if(rres) { // If receiver HAS data
                            var receiverData = JSON.parse(rres)
                            userData.money -= amount
                            receiverData.money += amount

                            rClient.set(mMember.user.id, JSON.stringify(receiverData), err => { if(err) console.log(err) })
                            rClient.set(msg.author.id, JSON.stringify(userData), err => { if(err) console.log(err) })
                            rClient.quit()

                            utl.embed(msg, `Вы передали **${amount}**<:__:813854413579354143> пользователю <@${mMember.user.id}>`)
                        } else { // If receiver DOES NOT have user data
                            rClient.set(mMember.user.id, JSON.stringify({ 'money': amount }), err => { if(err) console.log(err) })
                            rClient.set(msg.author.id, JSON.stringify({ 'money': userData.money - amount }), err => { if(err) console.log(err) })
                            rClient.quit()

                            utl.embed(msg, `Вы передали **${amount}**<:__:813854413579354143> пользователю <@${mMember.user.id}>`)
                        }
                    })
                }
            } else
                msg.channel.send(embeds.error(msg.member, 'У тебя нет средств для перевода!'))
        })
    }