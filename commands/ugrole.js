const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .ugrole
    */

    //!!!GAMEROLES TRUE - DONT GIVE ROLE; GAMEROLES FALSE - GIVE ROLES!!!
    (args, msg, client) => {
        utl.db.createClient(process.env.MURL).then(db => {
            db.update(msg.guild.id, msg.author.id, [{ $set: { gameRoles: { $not: "$gameRoles" } } }])
                .then(() => {
                    db.get(msg.guild.id, msg.author.id).then(userData => {
                        utl.embed(msg, `Игровые роли ${!userData.gameRoles ? '**включены**' : '**выключены**'}`)
                        userData.gameRoles ? msg.member.roles.remove(constants.gameRolesArray) : null
                        db.close()
                    })
                })
        })
    }