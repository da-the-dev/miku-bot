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
        utl.db.createClient(process.env.MURL).then(db => {
            db.getGuild('718537792195657798').then(data => {
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

                var valids = []
                for(i = 0; i < data.length; i++) {
                    if(valids.length <= topAmount) {
                        var member = msg.guild.member(data[i].id)
                        if(member)
                            valids.push({ member: member, money: data[i].money })
                    }
                }

                for(i = 0; i < topAmount; i++) {
                    switch(i) {
                        case 0:
                            description += `\`🥇\` ${valids[i].member.displayName} — **${valids[i].money}** <${constants.emojies.sweet}>\n`
                            break
                        case 1:
                            description += `\`🥈\` ${valids[i].member.displayName} — **${valids[i].money}** <${constants.emojies.sweet}>\n`
                            break
                        case 2:
                            description += `\`🥉\` ${valids[i].member.displayName} — **${valids[i].money}** <${constants.emojies.sweet}>\n`
                            break
                        default:
                            description += `\`💰\` ${valids[i].member.displayName} — **${valids[i].money}** <${constants.emojies.sweet}>\n`
                            break
                    }
                }

                embed.setDescription(description)
                msg.reply(embed)
            })
        })
    }
