const Discord = require('discord.js')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .rst <rolePos>
    */
    (args, msg, client) => {
        if(!args[1]) {
            utl.embed(msg, 'Не указан индекс роли!')
            return
        }
        if(!args[1][0] == 'c' || !Number.isInteger(Number(args[1].slice(1)))) {
        }
        var pos = args[1].slice(1)

        if(!pos) {
            utl.embed(msg, 'Не указана роль!')
            return
        }

        utl.db.createClient(process.env.MURL).then(async db => {
            var userData = await db.get(msg.guild.id, msg.author.id)
            if(!userData || !userData.customInv || !userData.customInv[pos - 1]) {
                utl.embed(msg, 'У Вас нет кастомных ролей')
                db.close()
                return
            }

            var serverData = await db.getServer(msg.guild.id)
            var role = serverData.customRoles.find(r => r.id == userData.customInv[pos - 1])
            if(!serverData.customRoles.find(r => r.id == userData.customInv[pos - 1])) {
                utl.embed(msg, 'Эта роль Вам не принадлежит!')
                db.close()
                return
            }

            var expireDate = new Date(role.expireTimestamp)

            utl.embed(msg, `Роль: <@&${role.id}>\nЕсть у **${role.members}** пользователей\nДата удаления: **${expireDate.toLocaleDateString()}**`)
            db.close()
        })
    }