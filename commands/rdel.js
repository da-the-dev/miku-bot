const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')

/**
 * Delete a role from the guild and from its db entry
 * @param {Discord.Guild} guild - Guild object
 * @param {string} id - User/member ID
 * @param {string} pos - Role position
 */
const deleteRole = (guild, id, pos) => {

}

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .deleteRole <rolePos>
    */
    (args, msg, client) => {
        if(!args[1][0] == 'c' || !Number.isInteger(Number(args[1].slice(1)))) {
            utl.embed(msg, 'Указан неверный индекс роли!')
            return
        }
        var pos = args[1].slice(1)
        if(!pos) {
            utl.embed(msg, 'Не указана роль!')
            return
        }

        utl.db.createClient(process.env.MURL).then(async db => {
            var userData = await db.get(msg.guild.id, msg.author.id)
            if(!userData || !userData.customInv) {
                utl.embed(msg, 'У Вас нет кастомных ролей')
                db.close()
                return
            }

            var serverData = await db.getServer(msg.guild.id)
            var role = serverData.customRoles.find(r => r.id == userData.customInv[pos - 1])
            if(!role) {
                utl.embed(msg, 'Этой роли не существует!')
                db.close()
                return
            }
            var owner = serverData.customRoles.find(r => r.id == userData.customInv[pos - 1]).owner
            if(owner != msg.author.id && !msg.member.roles.cache.find(r => r.permissions.has('ADMINISTRATOR'))) {
                utl.embed(msg, 'Эта роль Вам не принадлежит!')
                db.close()
                return
            }

            // Find and delete role from guild
            var role = serverData.customRoles.find(r => r.id == role.id && r.owner == msg.author.id)
            var guildRole = msg.guild.roles.cache.get(role.id)
            utl.embed(msg, `Роль ${guildRole.name} была удалена`)
            guildRole.delete()

            // Delete the role for server settings
            serverData.customRoles.splice(serverData.customRoles.findIndex(r => r.id == role.id && r.owner == msg.author.id), 1)
            db.setServer(msg.guild.id, serverData).then(() => db.close())
        })
    }