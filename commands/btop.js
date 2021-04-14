const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')

const topAmount = 5
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
     * @description Usage: .top
     */
    async (args, msg, client) => {
        utl.db.createClient(process.env.MURL).then(db => {
            db.getGuild('718537792195657798').then(async data => {
                db.close()

                data = data.filter(d => d.money)
                data.sort((a, b) => {
                    if(a.money > b.money) return -1
                    if(a.money < b.money) return 1
                    return 0
                })

                var embed = new Discord.MessageEmbed()
                    .setTitle('<a:__:825834909146415135> Топ 10 пользователей по балансу')
                    .setColor('#2F3136')
                    .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)}`, msg.author.avatarURL())

                var description = ''

                var members = data.map(d => msg.guild.member(d.id)).slice(0, 10)


                for(i = 0; i < members.length; i++) {
                    switch(i) {
                        case 0:
                            console.log('🥇')
                            description += `\`🥇\` ${members[i].displayName} — **${data[i].money}** <${constants.emojies.sweet}>\n`
                            break
                        case 1:
                            console.log('🥈')
                            description += `\`🥈\` ${members[i].displayName} — **${data[i].money}** <${constants.emojies.sweet}>\n`
                            break
                        case 2:
                            console.log('🥉')
                            description += `\`🥉\` ${members[i].displayName} — **${data[i].money}** <${constants.emojies.sweet}>\n`
                            break
                        default:
                            console.log('💰')
                            description += `\`💰\` ${members[i].displayName} — **${data[i].money}** <${constants.emojies.sweet}>\n`
                            break
                    }
                }

                embed.setDescription(description)
                msg.reply(embed)
            })
        })
    }
