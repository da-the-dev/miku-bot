const Discord = require('discord.js')
const util = require('util')
const utl = require('../utility')
/**
 *  @param {Array<string>} args Command argument
 *  @param {Discord.Message} msg Discord message object
 * @param {Discord.Client} client Discord client object
 * @description Usage: .loveProfile
 */
module.exports = (args, msg, client) => {
    const rClient = require('redis').createClient(process.env.RURL)
    const get = util.promisify(rClient.get).bind(rClient)

    get(msg.author.id)
        .then(res => {
            if(res) {
                var userData = JSON.parse(res)
                if(!userData.loveroom) {
                    utl.embed(msg, 'У Вас нет пары!')
                    rClient.quit()
                    return
                }

                var date = new Date(userData.loveroom.creationDate)
                var embed = utl.embed.build(msg, 't')
                    .setDescription(`\`\`\`カップル Профиль пары\`\`\`\n\`💞\` **Партнёр:**\n<@${userData.loveroom.partner}>\n\`📅\` **Дата регистрации пары:**\n${date.toLocaleDateString('ru-RU')}`)
                    .setImage("https://media.discordapp.net/attachments/736038639791767594/743986900179615763/unknown.png")
                msg.channel.send(embed)
                rClient.quit()
            } else {
                utl.embed(msg, 'У Вас нет пары!')
                rClient.quit()
            }
        })
}