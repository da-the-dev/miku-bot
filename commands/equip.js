const Discord = require('discord.js')
const redis = require('redis')
const embeds = require('../embeds')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .equip <roleIndex>
    */
    async (args, msg, client) => {
        var pos = args[1]
        if(!pos) {
            msg.channel.send(embeds.error(msg.member, 'Не указан индекс роли для одевания!'))
            return
        }
        const rClient = redis.createClient(process.env.RURL)
        rClient.get(msg.author.id, (err, res) => {
            if(err) throw err
            if(res) {
                rClient.get('roles', (eerr, rres) => {
                    if(eerr) throw eerr
                    if(rres) {
                        /**@type {Array} */
                        var rolesData = JSON.parse(rres)
                        if(!rolesData.find(r => r.pos == pos)) {
                            msg.channel.send(embeds.error(msg.member, 'Этой роли не существует!'))
                            rClient.quit()
                            return
                        }
                        var userData = JSON.parse(res)
                        if(!userData.inv.find(r => r.pos == pos)) {
                            msg.channel.send(embeds.error(msg.member, 'Эта роль у Вас не куплена!'))
                            rClient.quit()
                            return
                        }
                        var role = rolesData.find(r => r.pos == pos)
                        msg.member.roles.add(role.id)
                        msg.channel.send(embeds.success(msg.member, `Роль <@&${role.id}> одета`))
                        rClient.quit()
                    }
                })
            } else {
                msg.channel.send(embeds.error(msg.member, 'У Вас нет ролей для одевания!'))
                rClient.quit()
            }
        })
    }