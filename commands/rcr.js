const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')

/** Role cost */
const cost = 10000
/**
 * Retrieves HEX color name 
 * @param {string} hex - HEX string
 * @returns {Promise<string>} HEX name
 */
const fetchHEXName = (hex) => {
    return new Promise((resolve, reject) => {
        const fetch = require('node-fetch');
        fetch(`https://www.thecolorapi.com/id?hex=${hex.slice(1)}`)
            .then(res => {
                res.text()
                    .then(res => {
                        resolve(JSON.parse(res).name.value)
                    })
                    .catch(err => reject(err))
            })
            .catch(err => reject(err))
    })
}

/**
 * Create a custom role
 * @param {Discord.Message} msg - OG message
 * @param {string} name - Role's name
 * @param {string} hex - Role's hex color
 * @param {Function} success - Success function tp run at the end
 */
const createRole = (msg, name, hex, success, db) => {
    msg.guild.roles.create({
        data: {
            name: name,
            color: hex,
            position: 16
        },
        reason: `${msg.author.tag} создал(-а) эту роль командой .createRole`
    }).then(r => {
        utl.db.createClient(process.env.MURL).then(async db => {
            // Set expireDate to 00:00:00:0000
            var expireDate = new Date(Date.now())
            expireDate.setHours(0)
            expireDate.setMinutes(0)
            expireDate.setSeconds(0)
            expireDate.setMilliseconds(0)

            // Update serverSettings to include a new custom role
            await db.update(msg.guild.id, 'serverSettings', {
                $push: {
                    customRoles: {
                        id: r.id,
                        owner: msg.author.id,
                        expireTimestamp: expireDate.getTime(),
                        members: 1
                    }
                }
            })
            // Add the role to custom invetory
            await db.update(msg.guild.id, msg.author.id, { $push: { customInv: r.id } })
            await success(db)
            utl.embed(msg, `Вы успешно создали роль <@&${r.id}>!`)
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
    async (args, msg, client) => {
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


        utl.db.createClient(process.env.MURL).then(db => {
            db.get(msg.guild.id, 'serverSettings').then(serverData => {
                var counter = 0
                serverData.customRoles.forEach(r => {
                    r.owner == msg.author.id ? counter++ : null
                })

                if(counter >= 2) {
                    utl.embed(msg, 'У Вас уже есть 2 кастомные роли!')
                    db.close()
                    return
                }

                db.get(msg.guild.id, msg.author.id).then(async userData => {
                    if(userData) {
                        var hasBoosts = !(!userData.boosts || (userData.boosts && userData.boosts < 2))
                        var hasMoney = !(!userData.money || (userData.money && userData.money < cost))

                        if(!hasBoosts && !hasMoney) {
                            utl.embed(msg, 'У Вас не хватает ни бустов, ни конфет!')
                            db.close()
                            return
                        }

                        console.log('value data:', hasBoosts, hasMoney)

                        // Paying with boosts, no money
                        if(hasBoosts && !hasMoney) {
                            utl.embed(msg, `У Вас есть только **${userData.boosts}** бустов\nПодтверждаете создание роли c цветом *${await fetchHEXName(hex)}* и названем *${name}*?\n\nСтоимость **2** буста`).then(m => {
                                utl.reactionSelector.yesNo(m, msg.author.id,
                                    () => {
                                        createRole(msg, name, hex, (db) => {
                                            db.update(msg.guild.id, msg.author.id, { $inc: { boosts: -2 } })
                                        }, db)
                                        db.close()
                                    },
                                    () => {
                                        m.delete()
                                        db.close()
                                    },
                                    () => {
                                        m.delete()
                                        db.close()
                                    }
                                )
                            })
                        }

                        // Paying with money, no boosts
                        if(!hasBoosts && hasMoney) {
                            utl.embed(msg, `У Вас есть только **${userData.money}**<${constants.emojies.sweet}>\nПодтверждаете создание роли c цветом *${await fetchHEXName(hex)}* и названем *${name}*?\n\nСтоимость **7000**<${constants.emojies.sweet}>`).then(m => {
                                utl.reactionSelector.yesNo(m, msg.author.id,
                                    () => {
                                        createRole(msg, name, hex, (db) => {
                                            db.update(msg.guild.id, msg.author.id, { $inc: { money: -cost } })
                                        }, db)
                                        m.delete()
                                        db.close()
                                    },
                                    () => {
                                        m.delete()
                                        db.close()
                                    },
                                    () => {
                                        m.delete()
                                        db.close()
                                    }
                                )
                            })
                        }

                        // Paying with either money or boosts
                        if(hasBoosts && hasMoney) {
                            utl.embed(msg, `У Вас есть **${userData.money}**<${constants.emojies.sweet}> и **${userData.boosts}** бустов\nПодтверждаете создание роли c цветом *${await fetchHEXName(hex)}* и названем *${name}*?\n\nСтоимость **2** буста** или 7000**<${constants.emojies.sweet}>`).then(m => {
                                utl.reactionSelector.multiselector(m, msg.author.id,
                                    () => {
                                        m.delete()
                                        db.close()
                                    },
                                    () => {
                                        m.delete()
                                        db.close()
                                    },
                                    // Pay with boosts
                                    () => {
                                        createRole(msg, name, hex, (db) => {
                                            db.update(msg.guild.id, msg.author.id, { $inc: { boosts: -2 } })
                                        }, db)
                                        m.delete()
                                        db.close()
                                    },
                                    // Pay with money
                                    () => {
                                        createRole(msg, name, hex, (db) => {
                                            db.update(msg.guild.id, msg.author.id, { $inc: { money: -cost } })
                                        }, db)
                                        m.delete()
                                        db.close()
                                    }
                                )
                            })
                        }
                    }
                    else {
                        utl.embed(msg, 'У Вас нет ни бустов, ни конфет!')
                        db.close()
                    }
                })
            })
        })
    }