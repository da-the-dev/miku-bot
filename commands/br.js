const Discord = require('discord.js')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .br <bet>
    */
    (args, msg, client) => {
        var bet = args[1]
        if(!bet) {
            utl.embed(msg, 'Не указана ставка!')
            return
        }
        if(bet < 50) {
            utl.embed(msg, 'Ставка должна быть больше 50 <:__:813854413579354143>!')
            return
        }

        utl.db.createClient(process.env.MURL).then(db => {
            db.get(msg.guild.id, msg.author.id)
                .then(userData => {
                    if(userData) {
                        if(!userData.money) {
                            utl.embed(msg, `У Вас нет денег чтобы играть!`)
                            db.close()
                            return
                        }
                        if(userData.money < bet) {
                            utl.embed(msg, 'Ставка больше Вашего баланса!')
                            db.close()
                            return
                        }

                        var rand = Math.floor(Math.random() * 99) + 1
                        if(rand >= 85) {
                            userData.money += bet * 2
                            utl.embed(msg, `Вы выиграли! Ваш баланс: **${userData.money}** <:__:813854413579354143>`)
                        }
                        else {
                            userData.money -= bet
                            userData.money < 0 ? userData = 0 : null
                            utl.embed(msg, `Вы проиграли! Ваш баланс: **${userData.money}** <:__:813854413579354143>`)
                        }

                        db.set(msg.guild.id, msg.author.id, userData)
                            .then(res => {
                                db.close()
                            })

                    } else {
                        utl.embed(msg, `У Вас нет денег чтобы играть!`)
                        db.close()
                    }
                })
        })
    }