const Discord = require('discord.js')
var voiceActIntervals = new Map()
const redis = require('redis')

/*
 * Here is the fuctionality that handles people getting money for being active on a server
 */

var voiceAct = (newState) => {
    rClient.get(newState.member.user.id, (err, res) => {
        if(err) throw err
        if(res) { // If there was user data before
            console.log('voice activity +2')
            var userData = JSON.parse(res)
            userData.money += 2
            rClient.set(newState.member.user.id, JSON.stringify(userData), err => { if(err) throw err })
        } else {
            console.log('no data voice activity +2')
            rClient.set(newState.member.user.id, JSON.stringify({ 'money': 2 }), err => { if(err) throw err })
        }
    })
}

const rClient = redis.createClient(process.env.RURL)
const interval = 60000
/**
 * @desctiption Give user 2 points every active minute in voicechat
 * @param {Discord.VoiceState} oldState
 * @param {Discord.VoiceState} newState
 */
module.exports.voiceActivity = (oldState, newState) => {
    if(newState.channelID == oldState.channelID)
        return
    // User joined a voicechannel
    if(newState.channelID) {
        var channel = newState.channel

        // If there's more than member in a voice channel, give act money
        if(newState.channel.members.size > 1) {
            var inter = setInterval(voiceAct, interval, newState)
            if(!voiceActIntervals.get(newState.member.id))
                voiceActIntervals.set(newState.member.id, inter)
        }

        // If there's 2 members in a voice channel, give the old member act money as well
        if(newState.channel.members.size == 2) {
            var oldMember = newState.channel.members.find(m => m.user.id != newState.member.user.id)
            console.log('given act money', oldMember.user.username)
            var inter = setInterval(voiceAct, interval, newState)
            if(!voiceActIntervals.get(oldMember.user.id))
                voiceActIntervals.set(oldMember.user.id, inter)
        }
    }
    // } else { // User left a voicechannel
    //     console.log(newState.member.user.username, 'left')
    //     clearInterval(voiceActIntervals.get(newState.member.id))
    //     if(oldState.channel.members.size == 1) {
    //         clearInterval(voiceActIntervals.get(oldState.channel.members.first().user.id))
    //     }
}

var chatActMessages = new Map()
/**
 * @description Give user 1 point every 3 messages
 * @param {Discord.Message} msg
 */
module.exports.chatActivity = (msg) => {
    if(msg.guild.name == "Hoteru")
        if(msg.channel.id == '809147078353748039' && !msg.author.bot) { // Register only if in general
            var msgCount = chatActMessages.get(msg.author.id)
            if(msgCount) { // If user sent messages
                if(++msgCount >= 3) {
                    chatActMessages.delete(msg.author.id)
                    rClient.get(msg.author.id, (err, res) => {
                        if(err) throw err
                        if(res) { // If there was user data
                            var userData = JSON.parse(res)
                            userData.money += 1
                            rClient.set(msg.author.id, JSON.stringify(userData), err => { if(err) throw err })
                        } else {
                            rClient.set(msg.author.id, JSON.stringify({ 'money': 1 }), err => { if(err) throw err })
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