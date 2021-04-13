const Discord = require('discord.js')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .unequip <rolePos>
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
                            if(!serverData.roles.find(r => r.pos == pos)) {
                                utl.embed(msg, 'Этой роли не существует!')
                                db.close()
                                return
                            }
                            if(!userData.inv.find(r => r.pos == pos)) {
                                utl.embed(msg, 'Эта роль у Вас не куплена!')
                                db.close()
                                return
                            }
                            var roleID = serverData.roles.find(r => r.pos == pos).id
                            msg.member.roles.remove(roleID)
                            utl.embed(msg, `Роль <@&${roleID}> успешно снята`)
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