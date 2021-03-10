const Discord = require('discord.js')
const redis = require('redis')
const embeds = require('../embeds')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .inv
    */
    async (args, msg, client) => {
        const rClient = redis.createClient(process.env.RURL)
        rClient.get(msg.author.id, (err, res) => {
            if(err) throw err
            if(res) {
                var userData = JSON.parse(res)
                if(!userData.inv) {
                    msg.channel.send(embeds.error(msg.member, 'К сожалению, Ваш инвентарь пуст'))
                    rClient.quit()
                    return
                }
                var roles = ''
                var embed = new Discord.MessageEmbed()
                    .setColor('#2F3136')

                /**@type {Array<object>} */
                var userRoles = userData.inv
                userRoles.sort((a, b) => {
                    if(a.pos > b.pos) return 1
                    if(a.pos < b.pos) return -1
                    return 0
                })

                for(i = 0; i < userRoles.length; i++)
                    if(msg.member.roles.cache.has(userRoles[i].id))
                        roles += `\`⌗\` **${userRoles[i].pos}**︰<@&${userRoles[i].id}> — Надета\n`
                    else
                        roles += `\`⌗\` **${userRoles[i].pos}**︰<@&${userRoles[i].id}> — Не надета\n`

                embed.setDescription(roles)
                msg.channel.send(embed)
                rClient.quit()
            } else {
                msg.channel.send(embeds.error(msg.member, 'К сожалению, Ваш инвентарь пуст'))
                rClient.quit()
            }
        })
    }