const Discord = require('discord.js')
const redis = require('redis')
const constants = require('../constants.json')
const utl = require('../utility')
const util = require('util')

const createRole = (msg, name, hex, success) => {
    const fetch = require('node-fetch');
    fetch(`https://www.thecolorapi.com/id?hex=${hex.slice(1)}`)
        .then(res => {
            res.text()
                .then(res => {
                    utl.embed(msg, `Вы уверены что хотите создать роль \`${name}\` с цветом \`${hex}\` *(${JSON.parse(res).name.value})*?`)
                        .then(async m => {
                            utl.yesNoReactionMessage(m, () => {
                                msg.guild.roles.create({
                                    data: {
                                        name: name,
                                        color: hex,
                                        position: 28
                                    },
                                    reason: `${msg.author.tag} создал(-а) эту роль командой .createRole`
                                }).then(r => {
                                    console.log(r.id)
                                    msg.member.roles.add(r)
                                        .then(() => {
                                            m.edit(utl.embed.build(msg, `Вы успешно создали роль <@&${r.id}>!`))
                                            m.reactions.removeAll()
                                            success()
                                        })
                                })
                            }, () => {
                                m.delete()
                            }, () => {
                                m.delete()
                            })
                        })
                })
        })
}

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .createRole <hex> <name>
    */
    (args, msg, client) => {
        var hex = args[1]
        if(!hex) {
            utl.embed(msg, 'Не указан цвет роли!')
            return
        }
        if(!hex.startsWith('#')) {
            utl.embed(msg, 'Цвет роли должен быть в формате **HEX** и начинаться с `#`!')
            return
        }
        if(hex.length != 7) {
            utl.embed(msg, 'Цвет роли должен быть в формате **HEX** и состоять в общей сложности из **7** символов!\n```#FFFFFF - Белый\n#000000 - Черный```')
            return
        }
        hex = hex.toUpperCase()

        args.shift()
        args.shift()

        var name = args.join(' ')
        if(!name) {
            utl.embed(msg, 'Не указано название роли!')
            return
        }

        const rClient = require('redis').createClient(process.env.RURL)
        const get = util.promisify(rClient.get).bind(rClient)
        const set = util.promisify(rClient.set).bind(rClient)

        get(msg.author.id)
            .then(res => {
                if(res) {
                    var userData = JSON.parse(res)
                    if(!userData.money && !userData.boosts) {
                        utl.embed(msg, 'У Вас нет недостаточно ни конфет, ни бустов!')
                        rClient.quit()
                        return
                    }
                    if(userData.boosts && userData.boosts > 2)
                        utl.embed(msg, `У Вас есть **${userData.boosts}** буста(-ов), хотите потратить **2** буста для создания роли?`)
                            .then(m => {
                                utl.yesNoReactionMessage(m, () => {
                                    userData.boosts -= 2
                                    set(msg.author.id, JSON.stringify(userData)).then(() => rClient.quit())
                                    createRole(msg, name, hex, null)
                                }, () => {
                                    m.delete()
                                    if(userData.money < 10000) {
                                        utl.embed(msg, 'У Вас недостаточно конфет!')
                                        return
                                    }
                                    set(msg.author.id, JSON.stringify(userData)).then(() => rClient.quit())
                                    createRole(msg, name, hex, () => {
                                        userData.money -= 10000
                                        set(msg.author.id, JSON.stringify(userData)).then(() => rClient.quit())
                                    })
                                }, () => {
                                    m.delete()
                                    rClient.quit()
                                })
                            })
                    else {
                        if(userData.money < 10000) {
                            m.delete()
                            utl.embed(msg, 'У Вас недостаточно конфет!')
                            return
                        }
                        createRole(msg, name, hex, () => {
                            userData.money -= 10000
                            set(msg.author.id, JSON.stringify(userData)).then(() => rClient.quit())
                        })
                    }
                } else {
                    utl.embed(msg, 'У Вас нет ни достаточно конфет, ни достаточно бустов!')
                    rClient.quit()
                }
            })
    }