const Discord = require('discord.js')
const redis = require('redis')
const utl = require('../utility')
const util = require('util')
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

        const rClient = redis.createClient(process.env.RURL)
        const get = util.promisify(rClient.get).bind(rClient)
        const set = util.promisify(rClient.set).bind(rClient)
        get(msg.author.id)
            .then(res => {
                if(res) {
                    var userData = JSON.parse(res)
                    if(!userData.money) {
                        utl.embed(msg, `У Вас нет денег чтобы играть!`)
                        rClient.quit()
                        return
                    }
                    if(userData.money < bet) {
                        utl.embed(msg, 'Ставка больше Вашего баланса!')
                        rClient.quit()
                        return
                    }

                    var rand = Math.floor(Math.random() * 100) + 1
                    if(rand >= 70) {
                        utl.embed(msg, `Вы выиграли! Ваша ставка удвоена и добавлена в баланс: **${userData.money}** + **${bet * 2}** = ${userData.money + bet * 2} <:__:813854413579354143>`)
                        userData.money += bet * 2
                    }
                    else {
                        userData.money -= bet
                        utl.embed(msg, `Вы проиграли! Из вашего баланса вычтена ставка: **${userData.money}** - **${bet}** = **${userData.money - bet}** <:__:813854413579354143>`)
                    }

                    set(msg.author.id, JSON.stringify(userData))
                        .then(res => {
                            rClient.quit()
                        })
                } else {
                    utl.embed(msg, `У Вас нет денег чтобы играть!`)
                    rClient.quit()
                }
            })
    }