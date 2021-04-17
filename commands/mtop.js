const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')

const topAmount = 10

module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
     * @description Usage: .top
     */
    async (args, msg, client) => {
        // utl.db.createClient(process.env.MURL).then(db => {
        //     db.getGuild('718537792195657798').then(async data => {
        //         db.close()

        //         data = data.filter(d => d.dayMsgs || d.nightMsgs)
        //         var idsNMessages = data.map(d => { return { id: d.id, msgs: d.dayMsgs || 0 + d.nightMsgs || 0 } })
        //         idsNMessages.sort((a, b) => {
        //             if(a.msgs > b.msgs) return -1
        //             if(a.msgs < b.msgs) return 1
        //             return 0
        //         })
        //         idsNMessages.filter
        //         idsNMessages = idsNMessages.slice(0, topAmount)

        //         console.log(idsNMessages)

        //         var embed = new Discord.MessageEmbed()
        //             .setTitle('<a:__:825834909146415135> Топ 10 пользователей по голосовому онлайну')
        //             .setColor('#2F3136')
        //             .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)}`, msg.author.avatarURL())

        //         var description = ''

        //         for(i = 0; i < topAmount; i++) {
        //             var member = await msg.guild.members.fetch(idsNMessages[i].id)
        //             switch(i) {
        //                 case 0:
        //                     console.log('🥇')
        //                     description += `\`🥇\` ${member.displayName} — **${idsNMessages[i].msgs}** <${constants.emojies.speaker}>\n`
        //                     break
        //                 case 1:
        //                     console.log('🥈')
        //                     description += `\`🥈\` ${member.displayName} — **${idsNMessages[i].msgs}** <${constants.emojies.speaker}>\n`
        //                     break
        //                 case 2:
        //                     console.log('🥉')
        //                     description += `\`🥉\` ${member.displayName} — **${idsNMessages[i].msgs}** <${constants.emojies.speaker}>\n`
        //                     break
        //                 default:
        //                     console.log('🕓')
        //                     description += `\`🕓\` ${member.displayName} — **${idsNMessages[i].msgs}** <${constants.emojies.speaker}>\n`
        //                     break
        //             }
        //         }

        //         embed.setDescription(description)
        //         msg.reply(embed)
        //     })
        // })
    }