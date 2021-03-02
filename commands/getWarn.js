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
        const rClient = redis.createClient(process.env.RURL)
        try {
            rClient.get(msg.member.id, (err, reply) => {
                console.log('getting warn...')
                if(err) {
                    console.log(err)
                    return
                }
                if(reply) {
                    var warns = JSON.parse(reply).warns.split('||')
                    console.log(warns)
                    msg.reply(warns)
                } else {
                    msg.reply('no warns')
                }
            })
        } finally {
            rClient.quit()
        }
    }