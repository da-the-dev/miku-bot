const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')

/**
 * Generates and validates IDs for new reports
 * @param {string} guildID - Guild ID
 * @returns {Promise<string>} Will return as soon as a valid ID is generated
 */
const createReportID = (guildID) => {
    return new Promise((resolve, reject) => {
        utl.db.createClient(process.env.MURL).then(async db => {
            var valid = false
            while(!valid) {
                var id = Math.floor(Math.random() * (9999 - 1000) + 1000)
                var data = await db.get(guildID, `report-${id.toString()}`)
                if(!data) {
                    valid = true
                    db.close()
                    resolve(id)
                }
            }
        })
    })
}

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
        if(mMember.id == msg.author.id) {
            utl.embed(msg, 'Не лучшая идея')
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

        var reportID = await createReportID(msg.guild.id)
        var reportEmbed = new Discord.MessageEmbed()
            .setDescription("Жалоба в режиме ожидания, прожмите реакцию, чтобы перейти к рассмотрению.")
            .setColor('#2F3136')
            .setAuthor(`${msg.author.tag} • Отправил жалобу `, msg.author.avatarURL())
            .setFooter(`Report-System • ${utl.embed.calculateTime(msg)} • ID: ${reportID}`, client.user.avatarURL())



        utl.db.createClient(process.env.MURL).then(async db => {
            var data = { caller: msg.author.id, guilty: mMember.user.tag, description: args.join(' ') }

            if(msg.member.voice.channel)
                data.reportVoiceChannel = (await msg.member.voice.channel.createInvite()).url
            if(mMember.voice.channel)
                data.guiltyVoiceChannel = (await mMember.voice.channel.createInvite()).url

            console.log(`report-${reportID}`, data)

            db.set(msg.guild.id, `report-${reportID}`, data).then(() => {
                db.close()

                msg.guild.channels.cache.get(constants.channels.reports).send('', { embed: reportEmbed, files: Array.from(msg.attachments.values()) })
                    .then(m => {
                        m.react('☑️')
                    })
            })
        })
    }
