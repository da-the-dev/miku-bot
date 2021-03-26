const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')
const moneytop = require('../commands/mtop.js')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
     * @description Usage: .test <args>
     */
    async (args, msg, client) => {
        if(msg.author.id == process.env.MYID) {
            var c = msg.content.toLocaleLowerCase()
            console.log(c)
            if(c.includes('добрый') || c.includes('привет') || c.includes('хай') || c.includes('welcome') || c.includes('салам') || c.includes('добро')) {
                console.log('yes')
                msg.channel.send('s')
                    .then(m => {
                        m.react('<:__:824359401895886908>')
                    })
            }
        }
    }

module.exports.allowedInGeneral = true