const Discord = require('discord.js')
const roles = require('../roles.json')
const embeds = require('../embeds')
const redis = require('redis')
const redisTools = require('../redis')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
    */
    //$mute <@user> [<time> <mod>]
    //$mute <@user> 5s 5m 5h
    async (args, msg, client) => {
        var moderatorRole = msg.guild.roles.cache.get(roles.moder)
        if(msg.member.roles.cache.find(r => r.position >= moderatorRole.position && r.id != roles.star)) {
            var mMember = msg.mentions.members.first()
            if(!mMember) {
                msg.channel.send(embeds.error(msg.member, 'Вы не указали пользователя для мута!'))
            }

            args.shift()
            args.shift()

            if(args) {
                var time = Number(args[2])
                if(!time || !Number.isInteger(time)) {
                    msg.channel.send(embeds.error(msg.member, 'Вы указали неверное время!'))
                    return
                }

                msg.member.roles.add(roles.muted)
                msg.channel.send(embeds.mute(client, msg.member, 'был замьючен на ', time))

                const rClient = redis.createClient(process.env.RURL)
                try {
                    rClient.set('mute-' + msg.member.user.id + '-' + msg.guild + '-' + msg.channel.id, true)
                    rClient.expire('mute-' + msg.member.user.id + '-' + msg.guild + '-' + msg.channel.id, time)
                } finally {
                    rClient.quit()
                }
            } else
                msg.channel.send(embeds.error(msg.member, 'Вы не указали время, на которые замутить человека!'))
        } else {
            msg.channel.send(embeds.error(msg.member, 'У Вас нет прав для этой команды!'))
        }
    }