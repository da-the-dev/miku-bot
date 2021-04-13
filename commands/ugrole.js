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
    (args, msg, client) => {
        utl.db.createClient(process.env.MURL).then(db => {
            db.get(msg.guild.id, msg.author.id).then(userData => {
                if(userData) {
                    var userData = JSON.parse(res)
                    if(userData.gameRoles == undefined || userData.gameRoles == true)
                        userData.gameRoles = false
                    else if(userData.gameRoles == false)
                        userData.gameRoles = true

                    db.set(msg.guild.id, msg.author.id, userData).then(() => db.close())
                    utl.embed(msg, `Игровые роли ${userData.gameRoles ? '**включены**' : '**выключены**'}`)
                    !userData.gameRoles ? msg.member.roles.remove(constants.gameRolesArray) : null
                } else {
                    db.set(msg.guild.id, msg.author.id, { gameRoles: false }).then(() => db.close())
                    msg.member.roles.remove(constants.gameRolesArray)
                    utl.embed(msg, `Игровые роли **выключены**`)
                }
            })
        })
    }