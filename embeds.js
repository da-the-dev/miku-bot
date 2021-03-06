const Discord = require('discord.js')
module.exports = {
    /**
     * @param {Discord.GuildMember} member1 
     * @param {Discord.GuildMember} member2
     */
    'vlock': (member1, member2) => {
        return new Discord.MessageEmbed()
            .setDescription(`Вы **закрыли доступ** в свою комнату для <@${member2.id}>`)
            .setColor('#2F3136')
            .setFooter(`Выполнил(-а) ${member1.user.tag}`, member1.user.avatarURL())
    },
    'vunlock': (member1, member2) => {
        return new Discord.MessageEmbed()
            .setDescription(`Вы **открыли доступ** в свою комнату для <@${member2.id}>`)
            .setColor('#2F3136')
            .setFooter(`Выполнил(-а) ${member1.user.tag}`, member1.user.avatarURL())
    },
    'vowner': (member1, member2) => {
        return new Discord.MessageEmbed()
            .setDescription(`Вы **передали владение ** приватной комнаты <@${member2.id}>`)
            .setColor('#2F3136')
            .setFooter(`Выполнил(-а) ${member1.user.tag}`, member1.user.avatarURL())
    },
    'vlimit': (member1, limit) => {
        return new Discord.MessageEmbed()
            .setDescription(`Вы успешно **поставили лимит** пользователей в своей комнате на \`${limit}\``)
            .setColor('#2F3136')
            .setFooter(`Выполнил(-а) ${member1.user.tag}`, member1.user.avatarURL())
    },
    'vlimitzero': (member1) => {
        return new Discord.MessageEmbed()
            .setDescription(`Вы успешно **убрали лимит** пользователей в своей комнате`)
            .setColor('#2F3136')
            .setFooter(`Выполнил(-а) ${member1.user.tag}`, member1.user.avatarURL())
    },
    'vname': (member1, name) => {
        return new Discord.MessageEmbed()
            .setDescription(`Вы успешно **изменили название** своей комнаты на \`${name}\``)
            .setColor('#2F3136')
            .setFooter(`Выполнил(-а) ${member1.user.tag}`, member1.user.avatarURL())
    },
    'error': (member1, error) => {
        return new Discord.MessageEmbed()
            .setDescription(error)
            .setColor('#2F3136')
            .setFooter(`Запросил(-а) ${member1.user.tag}`, member1.user.avatarURL())
    },
    'success': (member1, success) => {
        return new Discord.MessageEmbed()
            .setDescription(success)
            .setColor('#2F3136')
            .setFooter(`Выполнил(-а) ${member1.user.tag}`, member1.user.avatarURL())
    },
    'mute': (client, member1, time) => {
        return new Discord.MessageEmbed()
            .setDescription(`<@${member1.user.id}> был(-а) замьючен(-а) на \`${time}\``)
            .setColor('#2F3136')
            .setFooter(`Уведомила ${client.user.username}`, client.user.avatarURL())
    },
    'permamute': (client, member1) => {
        return new Discord.MessageEmbed()
            .setDescription(`<@${member1.user.id}> был(-а) замьючен(-а) навсегда`)
            .setColor('#2F3136')
            .setFooter(`Уведомила ${client.user.username}`, client.user.avatarURL())
    },
    'unmute': (client, member1) => {
        return new Discord.MessageEmbed()
            .setDescription(`<@${member1.user.id}> был(-а) размьючен(-а)`)
            .setColor('#2F3136')
            .setFooter(`Уведомила ${client.user.username}`, client.user.avatarURL())
    },
    'botautokick': (member1, value) => {
        var message = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setFooter(`Выполнил(-а) ${member1.user.tag}`, member1.user.avatarURL())
        if(value)
            message.setDescription(`Автокик ботов был включен!`)
        else
            message.setDescription(`Автокик ботов был выключен!`)

        return message
    },
    'sus': (client, reason) => {
        return new Discord.MessageEmbed()
            .setColor('#2F3136')
            .setAuthor('С Вас были сняты роли за подозрительную деятельность', 'https://cdn.discordapp.com/attachments/810255515854569472/813821208670765057/photodraw.ru-35920.png')
            .setDescription(`С Вас были сняты все роли с правами администратора за подозрительную деятельность: \`${reason}\``)
            .setFooter(`Уведомила ${client.user.username} Обратитесь к другим администраторам для выяснения обстоятельств`, client.user.avatarURL())
    },
    'embedBuilder': () => {
        return new Discord.MessageEmbed()
            .setDescription("\n`安`[EmbedBuilder](https://embedbuilder.nadekobot.me/)\n\n\n\n")
            .setColor('#2F3136')
    }
}