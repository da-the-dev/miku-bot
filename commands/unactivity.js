const Discord = require('discord.js')
const redis = require('redis')
const constants = require('../constants.json')
const utl = require('../utility')
const { promisify } = require('util')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .uactivity
    */
    (args, msg, client) => {
        // const rClient = redis.createClient(process.env.RURL)
        // const get = promisify(rClient.get).bind(rClient)
        // const set = promisify(rClient.set).bind(rClient)

        // get(msg.author.id)
        //     .then(res => {
        //         if(res) {
        //             msg.member.roles.cache.has(constants.roles.daylyActive) ? msg.member.roles.remove(constants.roles.daylyActive) : null
        //             msg.member.roles.cache.has(constants.roles.nightActive) ? msg.member.roles.remove(constants.roles.nightActive) : null

        //             var userData = JSON.parse(res)
        //             if(userData.activity || userData.activity === undefined)
        //                 userData.activity = false
        //             else if(!userData.activity)
        //                 userData.activity = true
        //             set(msg.author.id, JSON.stringify(userData)).then(() => { rClient.quit() })
        //             utl.embed(msg, `Роли за активность ${userData.activity ? '**включены**' : '**выключены**'}`)
        //         } else {
        //             utl.embed(msg, 'У Вас нет ролей активностей!')
        //             rClient.quit()
        //         }
        //     })
    }