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
            rClient.get(msg.member.id, (err, res) => {
                if(err)
                    console.error(err)

                if(res)
                    msg.reply(JSON.parse(res)[msg.guild.id].warns)
                else
                    msg.reply('no warns')
            })
        } finally {
            rClient.quit()
        }
    }