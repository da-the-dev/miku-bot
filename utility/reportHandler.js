const Discord = require('discord.js')
const redis = require('redis')
const util = require('util')
const utl = require('../utility')
const constants = require('../constants.json')
/**
 * Handles report assignment with reactions
 * @param {Discord.MessageReaction} reaction - Reaction
 * @param {Discord.User} user - Reaction's user
 * @param {Discord.Client} client - Bot client
 */

const calculateTime = (timestamp) => {
    var time = 'Сегодня, в '
    var date = new Date(timestamp)
    var offset = date.getTimezoneOffset() + 180
    var hours = (date.getHours() + offset / 60).toString().padStart(2, '0')
    var minutes = date.getMinutes().toString().padStart(2, '0')
    time += `${hours}:${minutes}`
    return time
}

module.exports.reportAssignmentHandler = async (reaction, user, client) => {
    if(reaction.message.channel.id == constants.channels.dev) {
        if(reaction.emoji.name == "☑️" && user.id != client.user.id) {
            const rClient = redis.createClient(process.env.RURL)
            const get = util.promisify(rClient.get).bind(rClient)

            var name = reaction.message.embeds[0].author.name
            name = name.slice(0, name.indexOf('•') - 1)
            console.log(`report-${name}`)
            var reportInfo = JSON.parse(await get(`report-${name}`))
            console.log(reportInfo)
            rClient.del(`report-${reaction.message.embeds[0].author.name}`)
            rClient.quit()

            var description = `\n:white_small_square: За жалобу взялся(-ась) <@${user.id}>\n`
            reportInfo.reportVoiceChannel ? description += `:white_small_square: [Канал пожаловавшегося](${reportInfo.reportVoiceChannel})\n` : null
            reportInfo.guiltyVoiceChannel ? description += `:white_small_square: [Канал виновника](${reportInfo.guiltyVoiceChannel})` : null
            console.log(description)

            const takenReport = reaction.message.embeds[0]
            takenReport.setDescription(description)
            takenReport.setFooter(`Report-System • ${calculateTime(Date.now())}`, client.user.avatarURL())
            takenReport.addField("`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Жалоба на⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`", `\`\`\`${reportInfo.guilty}\`\`\``, true)
            takenReport.addField("`⠀⠀⠀⠀⠀⠀⠀⠀⠀Содержимое жалобы⠀⠀⠀⠀⠀⠀⠀⠀⠀`", `\`\`\`${reportInfo.description}\`\`\``, true)

            reaction.message.edit(takenReport)
                .then(m => {
                    m.reactions.removeAll()
                        .then(async m => {
                            await m.react('✅')
                            await m.react('❌')
                        })
                })
        }
    }
}