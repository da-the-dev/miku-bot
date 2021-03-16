const Discord = require('discord.js')
const utl = require('../utility')
const emojies = ['⬅️', '➡️']
const calculateTime = (msg) => {
    var time = 'Сегодня, в '
    var offset = msg.createdAt.getTimezoneOffset() + 180
    var hours = (msg.createdAt.getHours() + offset / 60).toString().padStart(2, '0')
    var minutes = msg.createdAt.getMinutes().toString().padStart(2, '0')
    time += `${hours}:${minutes}`
    return time
}
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .shop
    */
    async (args, msg, client) => {
        var embed = new Discord.MessageEmbed()
            .setColor('#2F3136')
            .setFooter(`${msg.author.username} • ${calculateTime(msg)} • стр 1/2`, msg.author.avatarURL())

        const rClient = require('redis').createClient(process.env.RURL)
        rClient.get('roles', (err, res) => {
            if(err) throw err
            if(res) {
                /**@type {Array<object>} */
                var rolesData = JSON.parse(res)
                rolesData.sort((a, b) => {
                    if(a.pos > b.pos) return 1
                    if(a.pos < b.pos) return -1
                    return 0
                })

                var length = rolesData.slice(0, 9).length
                for(i = 0; i < length; i++)
                    embed.addField(`⌗ ${rolesData[i].pos} — ${rolesData[i].price}<:__:813854413579354143>`, ` <@&${rolesData[i].id}>`, true)

                rClient.quit()
                msg.channel.send(embed)
                    .then(async m => {
                        await m.react(emojies[1])
                    })
            }
        })

    }