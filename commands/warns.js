const Discord = require('discord.js')
const redis = require('redis')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .warns
    */
    (args, msg, client) => {
        utl.db.createClient(process.env.MURL).then(db => {
            db.get(msg.guild.id, msg.author.id).then(userData => {
                db.close()
                if(userData) {
                    var embed = utl.embed.build(msg, `Предупреждения <@${msg.author.id}>`)

                    console.log(userData.warns, userData.warns.length == 0)

                    if(!userData.warns || userData.warns.length == 0) {
                        utl.embed(msg, 'У Вас нет предупреждений')
                        return
                    }

                    for(i = 0; i < userData.warns.length; i++) {
                        var w = userData.warns[i]
                        var date = new Date(new Date(w.time).toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
                        embed.addField('Дата', `\`⌗\`${i + 1} — ${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear().toString().slice(2)} в ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`, true)
                        embed.addField(`Исполнитель`, `<@${w.who}>`, true)
                        embed.addField(`Причина`, `${w.reason}`, true)
                    }

                    msg.channel.send(embed)
                } else
                    utl.embed(msg, 'У Вас нет предупреждений')
            })
        })
    }