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
                        if(!userData.inv) {
                            utl.embed(msg, 'К сожалению, Ваш инвентарь пуст')
                            db.close()
                            return
                        }
                        var roles = ''

                        console.log(serverData)
                        console.log(userData.inv)

                        for(i = 0; i < serverData.roles.length; i++) {
                            console.log(serverData.roles[i].id)
                            if(userData.inv.includes(serverData.roles[i].id))
                                if(msg.member.roles.cache.has(serverData.roles[i].id))
                                    roles += `\`⌗\` **${i + 1}**︰<@&${serverData.roles[i].id}> — Надета\n`
                                else
                                    roles += `\`⌗\` **${i + 1}**︰<@&${serverData.roles[i].id}> — Не надета\n`
                        }

                        utl.embed(msg, roles)
                        db.close()
                    } else {
                        utl.embed(msg, 'К сожалению, Ваш инвентарь пуст')
                        db.close()
                    }
                })
            })
        })
    }