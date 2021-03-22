const Discord = require('discord.js')
const redis = require('redis')
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
        const rClient = redis.createClient(process.env.RURL)
        rClient.get(msg.author.id, (err, res) => {
            if(err) throw err
            if(res) {
                var userData = JSON.parse(res)
                if(userData.gameRoles == undefined)
                    userData.gameRoles = false
                else if(userData.gameRoles == false)
                    userData.gameRoles = true
                else if(userData.gameRoles == true)
                    userData.gameRoles = false

                rClient.set(msg.author.id, JSON.stringify(userData), err => { if(err) throw err })
                rClient.quit()
                utl.embed(msg, `Игровые роли ${userData.gameRoles ? '**включены**' : '**выключены**'}`)
            } else {
                rClient.set(msg.author.id, JSON.stringify({ gameRoles: false }), err => { if(err) throw err })
                rClient.quit()
                msg.member.roles.remove(constants.gameRolesArray)
                console.log('ugrole 1')
                utl.embed(msg, `Игровые роли **выключены**`)
            }
        })
    }