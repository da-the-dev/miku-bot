const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')

/**
 * Delete a role from the guild and from its db entry
 * @param {Discord.Guild} guild - Guild object
 * @param {string} id - User/member ID
 * @param {string} roleID - Role ID
 */
const deleteRole = (guild, id, roleID) => {
    utl.db.createClient(process.env.MURL).then(db => {
        db.get(guild.id, 'serverSettings').then(serverData => {

            // Find and delete role from guild
            var role = serverData.customRoles.find(r => r.id == roleID && r.owner == id)
            var guildRole = guild.roles.cache.get(role.id)
            utl.embed(msg, `Роль ${guildRole.name} была удалена`)
            guildRole.delete()

            // Delete the role for server settings
            serverData.customRoles.splice(serverData.customRoles.findIndex(r => r.id == roleID && r.owner == id), 1)

            db.set(guild.id, 'serverSettings', serverData).then(() => db.close())
        })
    })
}

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .deleteRole <role>
    */
    (args, msg, client) => {
        var mRole = msg.mentions.roles.first()

        if(!mRole) {
            utl.embed(msg, 'Не указана роль!')
            return
        }

        var isCurator = false
        var curator = msg.guild.roles.cache.get(constants.roles.curator)
        if(msg.member.roles.cache.find(r => r.position >= curator.position))
            isCurator = true

        if(isCurator)
            deleteRole(msg.guild, msg.author.id, mRole.id)
        else
            utl.customRoles.checkIfOwner(msg.guild.id, msg.author.id, mRole.id).then(res => res ? deleteRole(msg.guild, msg.author.id, mRole.id) : null)
    }