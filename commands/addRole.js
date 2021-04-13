const Discord = require('discord.js')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .addRole <role> <positon> <price>
    */
    (args, msg, client) => {
        if(msg.member.roles.cache.find(r => r.permissions.has('ADMINISTRATOR'))) {
            var mRole = msg.mentions.roles.first()
            if(!mRole) {
                utl.embed(msg, 'Не указана роль!')
                return
            }

            var pos = Number(args[2])
            if(!pos || !Number.isInteger(pos)) {
                utl.embed(msg, 'Не указана позиция роли!')
                return
            }
            if(pos == 0 || pos > 18) {
                utl.embed(msg, 'Позиция роли ограничена диапозоном 1-18!')
                return
            }

            var price = Number(args[3])
            if(!price || !Number.isInteger(price)) {
                utl.embed(msg, 'Не указана цена роли!')
                return
            }

            utl.db.createClient(process.env.MURL).then(db => {
                db.get(msg.guild.id, 'serverSettings').then(serverData => {
                    if(serverData) {
                        if(!serverData.roles)
                            serverData.roles = [{ id: mRole.id, price: price, pos: pos }]
                        else {
                            serverData.roles.f
                            serverData.roles.splice(pos - 1, 0, { id: mRole.id, price: price, pos: pos })
                        }

                        db.set(msg.guild.id, 'serverSettings', serverData).then(() => db.close())
                    }
                    else
                        db.set(msg.guild.id, 'serverSettings', { roles: [{ id: mRole.id, price: price, pos: pos }] }).then(() => db.close())
                })
            })
        }
    }