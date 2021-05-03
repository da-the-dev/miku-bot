const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .buy <pos>
    */
    (args, msg, client) => {
        if(!args[1]) {
            utl.embed(msg, 'Не указан номер роли для покупки!')
            return
        }

        utl.db.createClient(process.env.MURL).then(db => {
            db.get(msg.guild.id, 'serverSettings').then(serverData => {
                if(serverData) {
                    var selectedRole = serverData.roles[args[1] - 1]
                    db.get(msg.guild.id, msg.author.id).then(userData => {
                        if(userData) {
                            console.log(userData.money, selectedRole.price, userData.money < selectedRole.price)
                            if(!userData.money) {
                                utl.embed(msg, 'Не достаточно средств для покупки роли! 1 ')
                                db.close()
                                return
                            }
                            if(userData.money < selectedRole.price) {
                                utl.embed(msg, 'Не достаточно средств для покупки роли! 2')
                                db.close()
                                return
                            }
                            msg.channel.send(utl.embed.build(msg, `Вы уверены, что хотите купить роль <@&${selectedRole.id}>?`))
                                .then(m => {
                                    utl.reactionSelector.yesNo(m, msg.author.id,
                                        () => {
                                            msg.member.roles.add(msg.guild.roles.cache.get(selectedRole.id))
                                            userData.money -= selectedRole.price
                                            if(!userData.inv)
                                                userData.inv = []
                                            userData.inv.push(selectedRole.id)
                                            db.set(msg.guild.id, msg.author.id, userData).then(() => db.close())

                                            m.edit(utl.embed.build(msg, `Вы успешно приобрели роль <@&${selectedRole.id}>.\nПолный список команд магазина вы можете посмотреть в <#${constants.channels.commands}>`))
                                            m.reactions.removeAll()
                                            return
                                        },
                                        () => {
                                            m.edit(new Discord.MessageEmbed()
                                                .setDescription(`Покупка отменена`)
                                                .setColor('#2F3136')
                                            )
                                            m.reactions.removeAll()
                                        },
                                        () => {
                                            m.edit(new Discord.MessageEmbed()
                                                .setDescription(`Покупка отменена про причине истечения времени`)
                                                .setColor('#2F3136')
                                            )
                                            m.reactions.removeAll()
                                        }
                                    )
                                })
                        } else {
                            utl.embed(msg, 'Не достаточно средств для покупки роли!')
                            db.close()
                            return
                        }
                    })
                } else {
                    utl.embed(msg, 'Нет ролей для покупки!')
                    db.close()
                }
            })
        })
    }