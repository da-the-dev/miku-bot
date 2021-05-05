const Discord = require('discord.js')
const utl = require('../utility')
const { sweet } = require('../constants.json').emojies
const sMsg = 'Дуэли'

const startDuel = (msg, member = null) => {
}

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .br <bet>
    */
    (args, msg, client) => {
        var bet = args[1]
        if(!bet || bet < 50 || bet > 50000) {
            utl.embed.ping(msg, sMsg, `укажите **количество** ${sweet}, которое **не** меньше **50**${sweet} и **не** больше **50000**${sweet}`)
            return
        }

        var mMember = msg.mentions.members.first()
        if(mMember) {
            utl.embed.ping(msg, sM)
        }

        var embed

        utl.db.createClient(process.env.MURL).then(async db => {
            var userData = await db.get(msg.guild.id, msg.author.id)

            if(userData) {
                if(!userData.money) {
                    utl.embed.ping(msg, sMsg, `у Вас нет денег чтобы играть!`)
                    db.close()
                    return
                }
                if(userData.money < bet) {
                    utl.embed.ping(msg, sMsg, 'ставка больше Вашего баланса!')
                    db.close()
                    return
                }

                var rand = Math.floor(Math.random() * 99) + 1
                if(rand >= 80) {
                    userData.money += bet * 2
                    utl.embed.ping(msg, sMsg, `Вы выиграли! Ваш баланс: **${userData.money}** ${sweet}`)
                }
                else {
                    userData.money -= bet
                    userData.money < 0 ? userData = 0 : null
                    utl.embed.ping(msg, sMsg, `Вы проиграли! Ваш баланс: **${userData.money}** ${sweet}`)
                }

                await db.set(msg.guild.id, msg.author.id, userData)
                    .then(res => {
                        db.close()
                    })

            } else {
                utl.embed.ping(msg, sMsg, `у Вас нет денег чтобы играть!`)
                db.close()
            }
        })
    }