const Discord = require('discord.js')
const redis = require('redis')
const util = require('util')
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
        var replyEmbed = new Discord.MessageEmbed()
            .setDescription(`\`\`\`Жалоба на пользователя ${mMember.user.tag} отправлена на рассмотрение!\`\`\``)
            .setAuthor(msg.author.tag, msg.author.avatarURL())
            .setColor('#2F3136')
            .setFooter(`Hoteru • Жалобы • ${utl.embed.calculateTime(msg)}`, client.user.avatarURL())
        msg.channel.send(replyEmbed)

        var reportEmbed = new Discord.MessageEmbed()
            .setDescription("Жалоба в режиме ожидания, прожмите реакцию, чтобы перейти к рассмотрению.")
            .setColor('#2F3136')
            .setAuthor(`${msg.author.tag} • Отправил жалобу `, msg.author.avatarURL())
            .setFooter(`Report-System • ${utl.embed.calculateTime(msg)}`, client.user.avatarURL())

        msg.guild.channels.cache.get(constants.channels.reports).send('', { embed: reportEmbed, files: Array.from(msg.attachments.values()) })
            .then(m => {
                m.react('☑️')
            })

        const rClient = redis.createClient(process.env.RURL)
        const set = util.promisify(rClient.set).bind(rClient)

        var data = { guilty: mMember.user.tag, description: args.join() }
        if(msg.member.voice.channel)
            data.reportVoiceChannel = (await msg.member.voice.channel.createInvite()).url
        if(mMember.voice.channel)
            data.guiltyVoiceChannel = (await mMember.voice.channel.createInvite()).url

        set(`report-${msg.author.tag}`, JSON.stringify(data)).then(() => { console.log('OK'); rClient.quit() })
    }
