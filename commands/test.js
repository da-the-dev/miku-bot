const anticrash = require('../anti-crash')
const Discord = require('discord.js')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .warn <member> <reason>
    */
    async (args, msg, client) => {
        msg.guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' })
            .then(audit => {
                // Get all ban entries
                var banEntries = Array.from(audit.entries.values())
                banEntries.forEach(b => {
                    console.log(b.createdTimestamp)
                })
            })
    }