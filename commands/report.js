const Discord = require('discord.js')
const redis = require('redis')
const utl = require('../utility')
const constants = require('../constants.json')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .report <member> <reason> -possible attachments
    */
    async (args, msg, client) => {
        var mMember = msg.mentions.members.first()
        if(!mMember) {
            utl.embed(msg, 'Не указан участник!')
            return
        }
        args.shift()
        args.shift()
        if(args.length <= 0) {
            utl.embed(msg, 'Не указана причина!')
            return
        }

        // Reply to report with response message
        msg.channel.send(
            new Discord.MessageEmbed()
                .setDescription(```Жалоба на пользователя ${mMember.user.tag} отправлена на рассмотрение!```)
                .setAuthor(msg.author.tag, msg.author.avatarURL())
                .setColor('#2F3136')
                .setFooter(`Hoteru • Жалобы • ${utl.embed.calculateTime(msg)}`, client.user.avatarURL())
        )


        var description = `Жалоба на пользователя: **${mMember.user.tag}**\nТекст жалобы: *${args.join()}*\n`
        if(msg.member.voice.channel)
            description += `[*Голосовой канал пожаловавшегося*](${await (await msg.member.voice.channel.createInvite()).url})\n`
        if(mMember.voice.channel)
            description += `[*Голосовой канал виновника*](${await (await mMember.voice.channel.createInvite()).url})\n`

        if(msg.attachments.array().length > 0)
            description += `**В репорт приложены файлы!**`

        var embed = new Discord.MessageEmbed()
            .setAuthor(`${msg.author.tag} отправил жалобу!`, msg.author.avatarURL())
            .setDescription(description)
            .setColor('#2F3136')
            .setFooter(`${client.user.tag} • ${utl.embed.calculateTime(msg)}`, client.user.avatarURL())

        msg.channel.send('', { embed: embed, files: Array.from(msg.attachments.values()) })
            .then(m => {
                m.react('☑️')
            })
    }
