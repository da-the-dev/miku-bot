const Discord = require('discord.js')
const utl = require('../utility')
const emojies = ['⬅️', '➡️']

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .shop
    */
    (args, msg, client) => {
        var embed = new Discord.MessageEmbed()
            .setColor('#2F3136')
            .setFooter(`${msg.author.username} • ${utl.embed.calculateTime(msg)} • стр 1/2`, msg.author.avatarURL())

        utl.db.createClient(process.env.MURL).then(db => {
            db.get(msg.guild.id, 'serverSettings').then(serverData => {
                if(serverData) {
                    db.close()

                    var rolesData = serverData.roles
                    rolesData.sort((a, b) => {
                        if(a.pos > b.pos) return 1
                        if(a.pos < b.pos) return -1
                        return 0
                    })

                    var length = rolesData.slice(0, 9).length
                    for(i = 0; i < length; i++)
                        embed.addField(`⌗ ${i + 1} — ${serverData.roles[i].price}<:__:813854413579354143>`, ` <@&${serverData.roles[i].id}>`, true)

                    msg.channel.send(embed)
                        .then(async m => {
                            await m.react(emojies[1])
                        })
                }
            })
        })
    }