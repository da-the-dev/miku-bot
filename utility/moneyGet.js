const Discord = require('discord.js')
var voiceActs = []
const redis = require('redis')
const constants = require('../constants.json')

const interval = 60000

setInterval(() => {
    const rClient = redis.createClient(process.env.RURL)
    rClient.mget(voiceActs, (err, res) => {
        if(err) console.log(err)
        if(res) { // If there was user data before
            console.log(res)
            for(i = 0; i < res.length; i++)
                if(res[i]) {
                    var parsedM = JSON.parse(res[i])
                    // console.log(parsedM)
                    parsedM.money ? parsedM.money += 1 : parsedM.money = 1
                    parsedM.voiceTime ? parsedM.voiceTime += 1 : parsedM.voiceTime = 1

                    var now = new Date(new Date(Date.now()).toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
                    if(now.getHours() >= 9 && now.getHours() <= 16)
                        parsedM.dayVoiceTime ? parsedM.dayVoiceTime += 1 : parsedM.dayVoiceTime = 1
                    if(now.getHours() >= 0 && now.getHours() <= 6)
                        parsedM.nightVoiceTime ? parsedM.nightVoiceTime += 1 : parsedM.nightVoiceTime = 1

                    // if(parsedM.dayVoiceTime >= 300)
                    //     !member.roles.cache.has(constants.roles.daylyActive) ? (member.roles.add(constants.roles.daylyActive), console.log("role")) : null
                    // if(parsedM.nightVoiceTime >= 300)
                    //     !member.roles.cache.has(constants.roles.nightActive) ? member.roles.add(constants.roles.nightActive) : null
                    // console.log(parsedM)
                    res[i] = JSON.stringify(parsedM)
                }
            console.log(res)
            console.log()
            var bigData = []
            for(i = 0; i < voiceActs.length; i++) {
                bigData.push(voiceActs[i])
                bigData.push(res[i] ? res[i] : JSON.stringify({}))
            }
            console.log(bigData)
            rClient.mset(bigData, err => { if(err) console.log(err); console.log('money given') })
            rClient.quit()
        }
    })
}, interval)

/**@type {Discord.Client} */
var client
/**
 * @desctiption Give user points every 1 minute in voicechat
 * @param {Discord.VoiceState} oldState
 * @param {Discord.VoiceState} newState
 */
module.exports.voiceActivity = (oldState, newState) => {
    if(newState.channelID == oldState.channelID)
        return

    // User joined a voicechannel
    if(newState.channel) {
        // console.log(`[MG] '${newState.member.user.username}' joined`)
        if(newState.channel.members.size > 1) { // If there's more than member in a voice channel, give act money
            // console.log(`[MG] '${newState.member.user.username}' joined in a populated channel`)
            if(!voiceActs.includes(newState.member.id))
                voiceActs.push(newState.member.id)
        }
        if(newState.channel.members.size == 2) { // If there's 2 members in a voice channel, give the old member act money as well
            var oldMember = newState.channel.members.find(m => m.user.id != newState.member.user.id)
            // console.log(`[MG] give '${oldMember.user.username}' money`)
            if(!voiceActs.includes(oldMember.id))
                voiceActs.push(oldMember.id)
        }
    } else { // User left a voicechannel
        // console.log(`[MG] '${newState.member.user.username}' left`)
        voiceActs.splice(voiceActs.includes(newState.member.id), 1)
        if(oldState.channel)
            if(oldState.channel.members.size == 1) {
                voiceActs.splice(voiceActs.includes(oldState.channel.members.first().user.id), 1)
            }
    }
}

/**
 * Give voice activity money when the bot restarts
 * @param {Discord.Client} client
 */
module.exports.voiceActivityInit = (client) => {
    var guild = client.guilds.cache.first()
    var voiceChannels = guild.channels.cache.filter(c => c.type == 'voice')
    voiceChannels.forEach(v => {
        if(v.members.array().length > 1) {
            v.members.forEach(m => {
                voiceActs.push(m.id)
            })
        }
    })
}

var chatActMessages = new Map()
/**
 * @description Give user 1 point every 10 messages
 * @param {Discord.Message} msg
 */
module.exports.chatActivity = (msg) => {
    if(msg.channel.id == constants.channels.general && !msg.author.bot) { // Register only if in general
        var msgCount = chatActMessages.get(msg.author.id)
        if(msgCount) { // If user sent messages
            if(++msgCount >= 10) {
                chatActMessages.delete(msg.author.id)
                const rClient = redis.createClient(process.env.RURL)
                rClient.get(msg.author.id, (err, res) => {
                    if(err) console.log(err)
                    if(res) { // If there was user data
                        var userData = JSON.parse(res)
                        userData.money ? userData.money += 1 : userData.money = 1

                        rClient.set(msg.author.id, JSON.stringify(userData), err => { if(err) console.log(err) })
                        rClient.quit()
                    } else {
                        rClient.set(msg.author.id, JSON.stringify({ 'money': 1 }), err => { if(err) console.log(err) })
                        rClient.quit()
                    }
                })
                chatActMessages.delete(msg.author.id)
                return
            }
            chatActMessages.set(msg.author.id, msgCount)
        } else  // If user didn't send messages
            chatActMessages.set(msg.author.id, 1)
    }
}