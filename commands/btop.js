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

        //         data = data.filter(d => d.money)
        //         data.sort((a, b) => {
        //             if(a.money > b.money) return -1
        //             if(a.money < b.money) return 1
        //             return 0
        //         })

        //         var embed = new Discord.MessageEmbed()
        //             .setTitle('<a:__:825834909146415135> Топ 10 пользователей по балансу')
        //             .setColor('#2F3136')
        //             .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)}`, msg.author.avatarURL())

        //         var description = ''

        //         for(i = 0; i < topAmount; i++) {
        //             var member = await msg.guild.members.fetch(data[i].id)
        //             if(member)
        //                 switch(i) {
        //                     case 0:
        //                         description += `\`🥇\` ${member.displayName} — **${data[i].money}** <${constants.emojies.sweet}>\n`
        //                         break
        //                     case 1:
        //                         description += `\`🥈\` ${member.displayName} — **${data[i].money}** <${constants.emojies.sweet}>\n`
        //                         break
        //                     case 2:
        //                         description += `\`🥉\` ${member.displayName} — **${data[i].money}** <${constants.emojies.sweet}>\n`
        //                         break
        //                     default:
        //                         description += `\`💰\` ${member.displayName} — **${data[i].money}** <${constants.emojies.sweet}>\n`
        //                         break
        //                 }
        //         }

        //         embed.setDescription(description)
        //         msg.reply(embed)
        //     })
        // })
    }
