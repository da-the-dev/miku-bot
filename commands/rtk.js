const Discord = require('discord.js')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .rgv <member> <rolePos>
    */
    (args, msg, client) => {
        var mMember = msg.mentions.members.first()
        if(args[2][0] == 'c' || !Number.isInteger(args[2].slice(1))) {
            utl.embed(msg, 'Указан неверный индекс роли!')
        }
        var pos = args[2].slice(1)
        if(!mMember) {
            utl.embed(msg, 'Не указан пользователь!')
            return
        }
        if(!pos) {
            utl.embed(msg, 'Не указана роль!')
            return
        }

        utl.db.createClient(process.env.MURL).then(async db => {
            var userData = await db.get(msg.guild.id, msg.author.id)
            if(!userData || !userData.customInv || !userData.customInv[pos]) {
                utl.embed(msg, 'У Вас нет кастомных ролей')
                db.close()
                return
            }

            var serverData = await db.getServer(msg.guild.id)
            var role = serverData.customRoles.find(r => r.id == userData.customInv[pos])
            if(!role) {
                utl.embed(msg, 'Эта роль Вам не принадлежит!')
                db.close()
                return
            }

            serverData.customRoles[serverData.customRoles.findIndex(r => r.id == role.id && r.owner == msg.author.id)].members -= 1
            utl.embed(msg, `Роль <@&${role.id}> была забрана у <@${mMember.id}>`)

            db.update(msg.guild.id, mMember.id, { $pull: { customInv: role.id } }).then(() => {
                db.set(msg.guild.id, 'serverSettings', serverData).then(() => db.close())
            })
        })
    }