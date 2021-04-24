const Discord = require('discord.js')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .inv
    */
    (args, msg, client) => {
        utl.db.createClient(process.env.MURL).then(db => {
            db.get(msg.guild.id, msg.author.id).then(userData => {
                db.get(msg.guild.id, 'serverSettings').then(serverData => {
                    if(userData) {
                        if(!userData.inv && !userData.customInv) {
                            utl.embed(msg, 'К сожалению, Ваш инвентарь пуст')
                            db.close()
                            return
                        }
                        var embed = utl.embed.build(msg, 't')
                            .setDescription('')
                            .setTitle(`<a:__:825834909146415135> Инвентарь ${msg.member.displayName}`)

                        if(userData.inv) {
                            var roles = ''
                            for(i = 0; i < serverData.roles.length; i++) {
                                if(userData.inv.includes(serverData.roles[i].id))
                                    if(msg.member.roles.cache.has(serverData.roles[i].id))
                                        roles += `\` ${i + 1} \` <@&${serverData.roles[i].id}> — Надета\n`
                                    else
                                        roles += `\` ${i + 1} \` <@&${serverData.roles[i].id}> — Не надета\n`
                            }

                            embed.addField('Магазинный инвентарь', roles)
                        }
                        if(userData.customInv) {
                            var roles = ''
                            for(i = 0; i < userData.customInv.length; i++)
                                if(msg.member.roles.cache.has(userData.customInv[i]))
                                    roles += `\` ${i + 1} \` <@&${userData.customInv[i]}> — Надета\n`
                                else
                                    roles += `\` ${i + 1} \` <@&${userData.customInv[i]}> — Не надета\n`
                            embed.addField('Инвентарь кастомных ролей', roles)
                        }

                        msg.channel.send(embed)
                        db.close()
                    } else {
                        utl.embed(msg, 'К сожалению, Ваш инвентарь пуст')
                        db.close()
                    }
                })
            })
        })
    }