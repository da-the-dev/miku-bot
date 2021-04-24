const Discord = require('discord.js')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .unequip <rolePos|role>
    */
    (args, msg, client) => {
        var mRole = msg.mentions.roles.first()
        var pos = args[1]
        if(mRole) pos = null
        if(!pos && !mRole) {
            utl.embed(msg, 'Не указан индекс роли, ни кастомная роль!')
            return
        }

        // Shop role
        if(pos && !mRole)
            utl.db.createClient(process.env.MURL).then(db => {
                db.get(msg.guild.id, msg.author.id).then(userData => {
                    if(userData) {
                        db.get(msg.guild.id, 'serverSettings').then(serverData => {
                            if(serverData) {
                                var selectedRole = serverData.roles[args[1] - 1]
                                if(!selectedRole) {
                                    utl.embed(msg, 'Этой роли не существует!')
                                    db.close()
                                    return
                                }
                                if(!userData.inv.find(r => r == selectedRole.id)) {
                                    utl.embed(msg, 'Эта роль у Вас не куплена!')
                                    db.close()
                                    return
                                }
                                msg.member.roles.remove(selectedRole.id)
                                utl.embed(msg, `Роль <@&${selectedRole.id}> успешно снята`)
                                db.close()
                            } else
                                db.close()
                        })
                    } else {
                        utl.embed(msg, 'У Вас нет ролей!')
                        db.close()
                    }
                })
            })

        // Custom role
        if(!pos && mRole)
            utl.db.createClient(process.env.MURL).then(db => {
                db.get(msg.guild.id, msg.author.id).then(userData => {
                    if(userData) {
                        if(!userData.customInv) {
                            utl.embed(msg, 'У Вас нет кастомных ролей!')
                            db.close()
                            return
                        }

                        var selectedRole = userData.customInv.find(r => r == mRole.id)
                        if(selectedRole)
                            msg.member.roles.remove(userData.customInv.find(r => r == mRole.id))
                                .then(() => {
                                    utl.embed(msg, `Роль <@&${mRole.id}> успешно снята`)
                                    db.close()
                                })
                        else {
                            utl.embed(msg, 'Этой роли нет у Вас в инвентаре!')
                            db.close()
                            return
                        }

                    } else {
                        utl.embed(msg, 'У Вас нет ролей!')
                        db.close()
                    }
                })
            })


    }