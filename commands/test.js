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
            console.log('elderly job start')
            msg.guild.members.fetch({ cache: true })
                .then(() => {
                    msg.guild.members.cache.forEach(async m => {
                        console.log(m.displayName, Date.now() - m.joinedTimestamp, Date.now() - m.joinedTimestamp > 7.884e+9)
                        if(Date.now() - m.joinedTimestamp > 7.884e+9 && !m.user.bot) {
                            await m.roles.add('824914346345496598')
                        }
                    })
                })
            console.log('elderly job end')
            var member = msg.guild.members.cache.get("793038961588961300")
            console.log(7.884e+9)
            console.log(member.joinedAt.toLocaleDateString())
            console.log(Date.now() - member.joinedTimestamp)
            console.log(Date.now() - member.joinedTimestamp > 7.884e+9)
        }
    }

module.exports.allowedInGeneral = true