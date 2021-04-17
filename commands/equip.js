const Discord = require('discord.js')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .equip <rolePos>
    */
    (args, msg, client) => {
        var pos = args[1]
        if(!pos) {
            utl.embed(msg, 'Не указан индекс роли!')
            return
        }
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
                            msg.member.roles.add(selectedRole.id)
                            utl.embed(msg, `Роль <@&${selectedRole.id}> успешно надета`)
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
    }