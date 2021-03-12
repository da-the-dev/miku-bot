const Discord = require('discord.js')
const embeds = require('../embeds')
const redis = require('redis')
const constants = require('../constants.json')

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
     * @description Usage: .mute <member> <time> "<reason>"
     * @example .mute @daym bro 5h "reason"
     */
    async (args, msg, client) => {
        var moderatorRole = msg.guild.roles.cache.get(roles.moder)
        if(msg.member.roles.cache.find(r => r.position >= moderatorRole.position)) {
            var mMember = msg.mentions.members.first()
            if(!mMember) {
                msg.channel.send(embeds.error(msg.member, 'Вы не указали пользователя для мута!'))
            }

            args.shift()
            args.shift()

            if(args.length == 0) { // If no settings were provided
                msg.channel.send(embeds.error(msg.member, 'Вы не указали время, на которое замутить человека!'))
                return
            }

            var reasonIndex = args.findIndex(r => r.startsWith('-'))
            if(reasonIndex == -1) {
                msg.channel.send(embeds.error(msg.member, 'Не указана причина мута!'))
                return
            }
            var reason = args.slice(reasonIndex, args.length).join(' ')
            reason = reason.slice(1)
            args = args.slice(0, reasonIndex)
            console.log(args)

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

            mMember.roles.add(constants.roles.muted)
            const rClient = redis.createClient(process.env.RURL)
            if(time == -1) {
                try {
                    rClient.set('muted-' + mMember.user.id, true)
                } finally {
                    rClient.quit()
                }
                msg.channel.send(embeds.permamute(mMember, msg.member, reason))
                // msg.reply(time)
            } else {

                var mmD = Math.floor(time / 60 / 60 / 24)
                var mmH = Math.floor(time / 60 / 60) - (mmD * 24)
                var mmM = Math.floor(time / 60) - (mmD * 60 * 24 + mmH * 60)
                var mmS = Math.floor(time - (mmD * 60 * 60 * 24 + mmH * 60 * 60 + mmM * 60))
                var muteMsg = ''

                if(mmD) muteMsg += '**' + mmD.toString() + '**' + "d "
                if(mmH) muteMsg += '**' + mmH.toString() + '**' + "h "
                if(mmM) muteMsg += '**' + mmM.toString() + '**' + "m "
                if(mmS) muteMsg += '**' + mmS.toString() + '**' + "s "

                // console.log(mmD, mmH, mmM, mmS)

                // Set shadow key
                rClient.set('muted-' + mMember.user.id, true)
                rClient.expire('muted-' + mMember.user.id, time)

                // Update user data accordingly 
                rClient.get(mMember.user.id, (err, res) => {
                    if(err) throw err
                    if(res) { // If user data exists already 
                        var userData = JSON.parse(res)
                        userData.mute = [msg.channel.id, reason]
                        rClient.set(mMember.user.id, JSON.stringify(userData), err => { if(err) throw err })
                        rClient.quit()
                    }
                    // If no user data
                    else {
                        rClient.set(mMember.user.id, JSON.stringify({ 'mute': [msg.channel.id, reason] }), err => { if(err) throw err })
                        rClient.quit()
                    }
                })

                msg.channel.send(embeds.mute(mMember, msg.member, muteMsg.trim(), reason))
            }
        } else {
            msg.channel.send(embeds.error(msg.member, 'У Вас нет прав для этой команды!'))
        }
    }
module.exports.allowedInGeneral = true