const Discord = require('discord.js')
var voiceActIntervals = new Map()
const redis = require('redis')
const constants = require('../constants.json')

/** 
 * Here is the fuctionality that handles people getting money for being active on a server
 * @param {Discord.GuildMember} member
 */
var voiceAct = (member) => {
    var id = member.id
    const rClient = redis.createClient(process.env.RURL)
    rClient.get(id, (err, res) => {
        if(err) console.log(err)
        if(res) { // If there was user data before
            var userData = JSON.parse(res)
            userData.money ? userData.money += 1 : userData.money = 1
            userData.voiceTime ? userData.voiceTime += 1 : userData.voiceTime = 1

            if(userData.activity !== false) {
                var now = new Date(new Date(Date.now()).toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
                if(now.getHours() >= 9 && now.getHours() <= 16)
                    userData.dayVoiceTime ? userData.dayVoiceTime += 1 : userData.dayVoiceTime = 1
                if(now.getHours() >= 0 && now.getHours() <= 6)
                    userData.nightVoiceTime ? userData.nightVoiceTime += 1 : userData.nightVoiceTime = 1

                if(userData.dayVoiceTime >= 300)
                    !member.roles.cache.has(constants.roles.daylyActive) ? (member.roles.add(constants.roles.daylyActive), console.log("role")) : null
                if(userData.nightVoiceTime >= 300)
                    !member.roles.cache.has(constants.roles.nightActive) ? member.roles.add(constants.roles.nightActive) : null
            }

            rClient.set(id, JSON.stringify(userData), err => { if(err) console.log(err) })
            rClient.quit()
        } else {
            rClient.set(id, JSON.stringify({ 'money': 1, 'voiceTime': 1 }), err => { if(err) console.log(err) })
            rClient.quit()
        }
    })
}

const interval = 60000
/**@type {Discord.Client} */
var client
/**
 * @desctiption Give user points every 1 minute in voicechat
 * @param {Discord.VoiceState} oldState
 * @param {Discord.VoiceState} newState
 */
module.exports.voiceActivity = (oldState, newState) => {
    // if(newState.channelID == oldState.channelID)
    //     return

    // // User joined a voicechannel
    // if(newState.channel) {
    //     // console.log(`[MG] '${newState.member.user.username}' joined`)
    //     if(newState.channel.members.size > 1) { // If there's more than member in a voice channel, give act money
    //         // console.log(`[MG] '${newState.member.user.username}' joined in a populated channel`)
    //         var inter = setInterval(voiceAct, interval, newState.member)
    //         if(!voiceActIntervals.get(newState.member.id))
    //             voiceActIntervals.set(newState.member.id, inter)
    //     }
    //     if(newState.channel.members.size == 2) { // If there's 2 members in a voice channel, give the old member act money as well
    //         var oldMember = newState.channel.members.find(m => m.user.id != newState.member.user.id)
    //         // console.log(`[MG] give '${oldMember.user.username}' money`)
    //         var inter = setInterval(voiceAct, interval, newState.member)
    //         if(!voiceActIntervals.get(oldMember.user.id))
    //             voiceActIntervals.set(oldMember.user.id, inter)
    //     }
    // } else { // User left a voicechannel
    //     // console.log(`[MG] '${newState.member.user.username}' left`)
    //     clearInterval(voiceActIntervals.get(newState.member.id))
    //     if(oldState.channel)
    //         if(oldState.channel.members.size == 1) {
    //             clearInterval(voiceActIntervals.get(oldState.channel.members.first().user.id))
    //         }
    // }
}

/**
 * Give voice activity money when the bot restarts
 * @param {Discord.Client} client
 */
module.exports.voiceActivityInit = (client) => {
    // var guild = client.guilds.cache.first()
    // var voiceChannels = guild.channels.cache.filter(c => c.type == 'voice')
    // voiceChannels.forEach(v => {
    //     if(v.members.array().length > 1) {
    //         v.members.forEach(m => {
    //             var inter = setInterval(voiceAct, interval, m)
    //             if(!voiceActIntervals.get(m.id))
    //                 voiceActIntervals.set(m.id, inter)
    //         })
    //     }
    // })
}

var chatActMessages = new Map()
/**
 * @description Give user 1 point every 10 messages
 * @param {Discord.Message} msg
 */
module.exports.chatActivity = (msg) => {
    // if(msg.channel.id == constants.channels.general && !msg.author.bot) { // Register only if in general
    //     var msgCount = chatActMessages.get(msg.author.id)
    //     if(msgCount) { // If user sent messages
    //         if(++msgCount >= 10) {
    //             chatActMessages.delete(msg.author.id)
    //             const rClient = redis.createClient(process.env.RURL)
    //             rClient.get(msg.author.id, (err, res) => {
    //                 if(err) console.log(err)
    //                 if(res) { // If there was user data
    //                     var userData = JSON.parse(res)
    //                     userData.money ? userData.money += 1 : userData.money = 1

    //                     rClient.set(msg.author.id, JSON.stringify(userData), err => { if(err) console.log(err) })
    //                     rClient.quit()
    //                 } else {
    //                     rClient.set(msg.author.id, JSON.stringify({ 'money': 1 }), err => { if(err) console.log(err) })
    //                     rClient.quit()
    //                 }
    //             })
    //             chatActMessages.delete(msg.author.id)
    //             return
    //         }
    //         chatActMessages.set(msg.author.id, msgCount)
    //     } else  // If user didn't send messages
    //         chatActMessages.set(msg.author.id, 1)
    // }
}