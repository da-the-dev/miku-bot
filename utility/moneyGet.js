const Discord = require('discord.js')
var voiceActs = []
const utl = require('../utility')
const constants = require('../constants.json')

/**
 * Increments money and time fields for all current active members every minute
 */
const voiceAct = () => {
    setInterval(() => {
        utl.db.createClient(process.env.MURL).then(db => {
            var prepedVoiceActs = voiceActs.map(a => { return { id: a } })
            var update = { $inc: { money: 1, voiceTime: 1 } }

            var now = new Date(new Date(Date.now()).toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
            if(now.getHours() >= 9 && now.getHours() <= 16)
                update.$inc.dayVoiceTime = 1
            if(now.getHours() >= 0 && now.getHours() <= 6)
                update.$inc.nightVoiceTime = 1

            db.updateMany('718537792195657798', { $or: prepedVoiceActs }, update).then(() => {
                db.close()
            })
        })
    }, 60000)
}

/**
 * @desctiption Give user points every 1 minute in voicechat
 * @param {Discord.VoiceState} oldState
 * @param {Discord.VoiceState} newState
 */
module.exports.voiceActivity = (oldState, newState) => {
    // console.log(newState.channelID == oldState.channelID)
    if(newState.channelID == oldState.channelID)
        return

    // User joined a voicechannel
    if(newState.channel) {
        console.log(`[MG] '${newState.member.user.username}' joined`)

        if(newState.channel.members.size == 2) {
            newState.channel.members.forEach(m => {
                voiceActs.push(m.id)
            })
        } else if(newState.channel.members.size > 2)
            voiceActs.push(newState.member.id)

    } else if(newState.channel === null) { // User left a voicechannel
        console.log(`[MG] '${newState.member.user.username}' left`)
        voiceActs.splice(voiceActs.indexOf(newState.member.id), 1)
        if(oldState.channel)
            if(oldState.channel.members.size == 1)
                voiceActs.splice(voiceActs.indexOf(oldState.channel.members.first().id), 1)
    }
}

/**
 * Give voice activity money when the bot restarts
 * @param {Discord.Client} client
 */
module.exports.voiceActivityInit = async (client) => {
    var guild = client.guilds.cache.first()
    var voiceChannels = guild.channels.cache.filter(c => c.type == 'voice')
    voiceChannels.forEach(v => {
        if(v.members.array().length > 1) {
            v.members.forEach(m => {
                voiceActs.push(m.id)
            })
        }
    })
    voiceAct()
}

var chatActMessages = new Map()
/**
 * @description Give user 1 point every 5 messages
 * @param {Discord.Message} msg
 */
module.exports.chatActivity = (msg) => {
    if(msg.channel.id == constants.channels.general && !msg.author.bot) { // Register only if in general
        var msgCount = chatActMessages.get(msg.author.id)
        if(msgCount) { // If user sent messages
            if(++msgCount >= 5) {
                chatActMessages.delete(msg.author.id)
                utl.db.createClient(process.env.MURL).then(db => {
                    db.update(msg.guild.id, msg.author.id, { $inc: { money: 1 } }).then(() => db.close())
                })
                return
            }
            chatActMessages.set(msg.author.id, msgCount)
        } else  // If user didn't send messages
            chatActMessages.set(msg.author.id, 1)
    }
}