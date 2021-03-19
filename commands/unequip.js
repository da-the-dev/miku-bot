const Discord = require('discord.js')
const redis = require('redis')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .unequip <role>
    */
    async (args, msg, client) => {
        var pos = args[1]
        if(!pos) {
            utl.embed(msg, 'Не указан индекс роли для одевания!')
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
                            utl.embed(msg, 'Этой роли не существует!')
                            rClient.quit()
                            return
                        }
                        var role = rolesData.find(r => r.pos == pos)
                        msg.member.roles.remove(role.id)
                        utl.embed(msg, `Роль <@&${role.id}> успешно снята`)
                        rClient.quit()
                    }
                })
            } else {
                utl.embed(msg, 'У Вас нет ролей для снятия!')
                rClient.quit()
            }
        })
    }