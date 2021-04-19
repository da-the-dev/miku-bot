const constants = require('../constants.json')
const Discord = require('discord.js')
const utl = require('../utility')
/**
 * @param {Array<string>} args Command argument
 * @param {Discord.Message} msg Discord message object
 * @param {Discord.Client} client Discord client object
 * @description Usage: .loveProfile
 */
module.exports = (args, msg, client) => {
    utl.db.createClient(process.env.MURL).then(db => {
        db.get(msg.guild.id, msg.author.id).then(userData => {
            if(userData) {
                if(!userData.loveroom) {
                    utl.embed(msg, 'У Вас нет пары!')
                    db.close()
                    return
                }

                var date = new Date(userData.loveroom.creationDate)
                var embed = utl.embed.build(msg, 't')
                    .setDescription(`\`\`\`カップル Профиль пары\`\`\`\n\`💞\` **Партнёр:**\n<@${userData.loveroom.partner}>\n\`📅\` **Дата регистрации пары:**\n${date.toLocaleDateString('ru-RU')}\n**Баланс комнаты:** ${userData.loveroom.bal}<${constants.emojies.sweet}>`)
                    .setImage("https://media.discordapp.net/attachments/736038639791767594/743986900179615763/unknown.png")
                msg.channel.send(embed)
                db.close()
            } else {
                utl.embed(msg, 'У Вас нет пары!')
                db.close()
            }
        })
    })
}