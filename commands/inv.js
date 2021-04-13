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
        utl.db.createClient(process.env.RURL).then(db => {
            db.get(msg.guild.id, msg.author.id).then(userData => {
                if(userData) {
                    if(!userData.inv) {
                        utl.embed(msg, 'К сожалению, Ваш инвентарь пуст')
                        db.close()
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


                    utl.embed(msg, roles)
                    db.close()
                } else {
                    utl.embed(msg, 'К сожалению, Ваш инвентарь пуст')
                    db.close()
                }
            })
        })
    }