const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')
const moneytop = require('../commands/mtop.js')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
     * @description Usage: .test <args>
     */
    async (args, msg, client) => {
        if(msg.author.id == process.env.MYID) {

            const user = message.mentions.members.first() || client.users.cache.get(args[0]) || message.author

            const a = await Local.findOne({ member: user.id });
            const { marry, data, voice } = await Local.findOne({ member: user.id, guild: message.guild.id });
            const time = textTime(ms(Date.now() - data))
            const time1 = textTime(ms(voice))

            const embed = new MessageEmbed()
                .setAuthor(`Профиль • ${user.tag}`, user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setColor("#2f3136")
                .addField(```⠀⠀⠀⠀ ⠀Уровень⠀⠀⠀⠀⠀⠀ ```, ```q\n${a.level}```, true)
                .addField(```⠀⠀⠀⠀⠀ ⠀⠀⠀Опыт⠀⠀⠀⠀⠀⠀⠀ ```, ```q\n${a.xp} ```, true)
                .addField(```⠀⠀⠀⠀⠀ На сервере⠀⠀⠀⠀⠀ ```, ```q\nс ${moment(message.member.joinedAt).format("DD-MM-YYYY")} ```, true)
                .addField(```⠀⠀⠀⠀⠀Чат актив ⠀⠀⠀⠀ ```, ```q\n${a.messages} ```, true)
                .addField(```⠀⠀⠀⠀⠀⠀Войс актив ⠀⠀⠀⠀⠀```, ```q\n${time1 == "null" ? "0м." : time1} ```, true)
                .addField(```⠀⠀⠀⠀⠀ ⠀Баланс⠀⠀⠀⠀⠀⠀⠀ ```, ```q\n${a.money}```, true)
                .addField(```⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀Брак⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ```, ```diff\n${marry == 'null' ? '- Нет' : client.users.cache.get(marry).tag} ```, true)
                .addField(```⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Время в браке ⠀⠀⠀⠀⠀⠀ ⠀⠀```, ```q\n${marry == "null" ? "0ч. 00м. 00с." : time} ```, true)
            message.channel.send(embed)
        }
    }

module.exports.allowedInGeneral = true