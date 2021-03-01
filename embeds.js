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
    'mute': (client, member1, notif, time) => {
        return new Discord.MessageEmbed()
            .setDescription(`<@${member1.user.id}> ${notif} \`${time}\``)
            .setColor('#2F3136')
            .setFooter(`Уведомила ${client.user.username}`, client.user.avatarURL())
    },
    'permamute': (client, member1, notif, time) => {
        return new Discord.MessageEmbed()
            .setDescription(`<@${member1.user.id}> ${notif}`)
            .setColor('#2F3136')
            .setFooter(`Уведомила ${client.user.username}`, client.user.avatarURL())
    },
    'unmute': (client, member1, notif) => {
        return new Discord.MessageEmbed()
            .setDescription(`<@${member1.user.id}> ${notif}`)
            .setColor('#2F3136')
            .setFooter(`Уведомила ${client.user.username}`, client.user.avatarURL())
    }

}