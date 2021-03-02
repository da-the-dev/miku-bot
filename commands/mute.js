const Discord = require('discord.js')
const roles = require('../roles.json')
const embeds = require('../embeds')
const redis = require('redis')
const moment = require('moment')

/**
 * @description Check if there's only one 's', 'm', 'h' is 'life'
 * @param {string} str
 * @param {string} letter
 */
const checkForLetters = (str) => {
    if(str == 'life')
        return str
    if(str.endsWith('s') || str.endsWith('m') || str.endsWith('h') || str.endsWith('d')) {
        var arr = str.split("")
        arr = arr.filter(a => a != '0' && a != '1' && a != '2' && a != '3' && a != '4' && a != '5' && a != '6' && a != '7' && a != '8' && a != '9')
        if(arr.length > 1)
            return false
        return str
    }
    return false
}

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

            if(args.length == 0) { // If no settings were provided
                msg.channel.send(embeds.error(msg.member, 'Вы не указали время, на которые замутить человека!'))
                return
            }

            if(!args.every(a => checkForLetters(a))) { // Check if settings are valid
                msg.channel.send(embeds.error(msg.member, 'Неверный формат времени!'))
                return
            }

            var time = 0

            var isLife = args.find(a => a == 'life')

            if(!isLife)
                for(i = 0; i < args.length; i++) {
                    var a = args[i]
                    var sType = a[a.length - 1]
                    var sValue = Number(a.slice(0, a.length - 1))

                    switch(sType) {
                        case 's':
                            time += sValue
                            break
                        case 'm':
                            time += sValue * 60
                            break
                        case 'h':
                            time += sValue * 60 * 60
                            break
                        case 'd':
                            time += sValue * 60 * 60 * 24
                            break
                    }
                }
            else
                time = -1

            if(time == 0) {
                msg.channel.send(embeds.error(msg.member, 'Неверный формат времени!'))
                return
            }

            mMember.roles.add(roles.muted)
            const rClient = redis.createClient(process.env.RURL)
            if(time == -1) {
                try {
                    rClient.set('muted-' + mMember.user.id + '-' + msg.guild, true)
                } finally {
                    rClient.quit()
                }
                msg.channel.send(embeds.permamute(client, mMember, 'был замьючен навсегда'))
                // msg.reply(time)
            } else {

                var mmD = Math.floor(time / 60 / 60 / 24)
                var mmH = Math.floor(time / 60 / 60) - (mmD * 24)
                var mmM = Math.floor(time / 60) - (mmD * 60 * 24 + mmH * 60)
                var mmS = Math.floor(time - (mmD * 60 * 60 * 24 + mmH * 60 * 60 + mmM * 60))
                var muteMsg = ''

                if(mmD) muteMsg += mmD.toString() + " д "
                if(mmH) muteMsg += mmH.toString() + " ч "
                if(mmM) muteMsg += mmM.toString() + " мин "
                if(mmS) muteMsg += mmS.toString() + " сек "

                // console.log(mmD, mmH, mmM, mmS)

                // Set shadow key
                rClient.set('muted-' + mMember.user.id + '-' + msg.guild.id, true)
                rClient.expire('muted-' + mMember.user.id + '-' + msg.guild.id, time)

                // Update user data accordingly 
                rClient.get(mMember.user.id, (err, res) => {
                    if(err)
                        console.error(err)

                    // If no user data
                    var guildID = msg.guild.id
                    if(res == null) {
                        rClient.set(mMember.user.id, JSON.stringify(
                            {
                                [msg.guild.id]: {
                                    'mute': msg.channel.id
                                }
                            }
                        ), err => {
                            if(err)
                                console.error(err)
                            rClient.quit()
                        })
                    }
                    // If user data exists already
                    else {
                        var userData = JSON.parse(res)
                        console.log(userData)
                        userData[msg.guild.id].mute = msg.channel.id
                        console.log(userData)
                        console.log(JSON.stringify(userData))
                        rClient.set(mMember.user.id, JSON.stringify(userData), err => {
                            if(err)
                                console.error(err)
                            rClient.quit()
                        })
                    }
                })

                msg.channel.send(embeds.mute(client, mMember, 'был замьючен на', muteMsg.trim()))
                // msg.reply(time)
            }

        } else {
            msg.channel.send(embeds.error(msg.member, 'У Вас нет прав для этой команды!'))
        }
    }