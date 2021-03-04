const Discord = require('discord.js')
const redis = require('redis')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .v <arg> 
    */

    async (args, msg, client) => {
        if(msg.member.user.id == process.env.MYID) {
            const rClient = redis.createClient(process.env.RURL)
            try {
                rClient.DEL(args[1], err => {
                    if(err)
                        console.error(err)
                })
            } finally {
                rClient.quit()
            }
        }
    }