const Discord = require('discord.js')
var voiceActIntervals = new Map()
const utl = require('../utility')
const DB = require('../utility/db').DB
/**@type {DB} */
var db
const constants = require('../constants.json')

/**
 * Add an interval about a member
 * @param {Discord.GuildMember} member 
 */
const addInterval = (member) => {
    if(!voiceActIntervals.get(member.id)) {
        var inter = setInterval(voiceAct, interval, member)
        voiceActIntervals.set(member.id, inter)
    }
}

/** 
 * Here is the fuctionality that handles people getting money for being active on a server
 * @param {Discord.GuildMember} member
 */
var voiceAct = (member) => {
    // var id = member.id
    // db.get(member.guild.id, id).then(userData => {
    //     if(userData) { // If there was user data before
    //         userData.money ? userData.money += 1 : userData.money = 1
    //         userData.voiceTime ? userData.voiceTime += 1 : userData.voiceTime = 1

    //         var now = new Date(new Date(Date.now()).toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
    //         if(now.getHours() >= 9 && now.getHours() <= 16)
    //             parsedM.dayVoiceTime ? parsedM.dayVoiceTime += 1 : parsedM.dayVoiceTime = 1
    //         if(now.getHours() >= 0 && now.getHours() <= 6)
    //             parsedM.nightVoiceTime ? parsedM.nightVoiceTime += 1 : parsedM.nightVoiceTime = 1

    //         // if(parsedM.dayVoiceTime >= 300)
    //         //     !member.roles.cache.has(constants.roles.daylyActive) ? (member.roles.add(constants.roles.daylyActive), console.log("role")) : null
    //         // if(parsedM.nightVoiceTime >= 300)
    //         //     !member.roles.cache.has(constants.roles.nightActive) ? member.roles.add(constants.roles.nightActive) : null
    //         // console.log(parsedM)
    //         res[i] = JSON.stringify(parsedM)
    //     }
    //     var bigData = []
    //     for(i = 0; i < voiceActs.length; i++) {
    //         bigData.push(voiceActs[i])
    //         bigData.push(res[i] ? res[i] : JSON.stringify({}))
    //     }

    //     db.set(member.guild.id, id, userData)
    //     db.set(member.guild.id, id, { 'money': 1, 'voiceTime': 1 })
    // })
}

const interval = 60000
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
                addInterval(m)
            })
        } else if(newState.channel.members.size > 2)
            addInterval(newState.member)

    } else if(newState.channel === null) { // User left a voicechannel
        console.log('left')
        console.log(`[MG] '${newState.member.user.username}' left`)
        clearInterval(voiceActIntervals.get(newState.member.id))
        if(oldState.channel)
            if(oldState.channel.members.size == 1) {
                clearInterval(voiceActIntervals.get(oldState.channel.members.first().user.id))
            }
    }
}

/**
 * Give voice activity money when the bot restarts
 * @param {Discord.Client} client
 */
module.exports.voiceActivityInit = async (client) => {
    db = await utl.db.createClient(process.env.MURL)
    console.log(db instanceof DB)

    var guild = client.guilds.cache.first()
    var voiceChannels = guild.channels.cache.filter(c => c.type == 'voice')
    voiceChannels.forEach(v => {
        if(v.members.array().length > 1) {
            v.members.forEach(m => {
                addInterval(m)
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
                db.get(msg.guild.id, msg.author.id).then(userData => {
                    if(userData) { // If there was user data
                        userData.money ? userData.money += 1 : userData.money = 1
                        db.set(msg.guild.id, msg.author.id, userData)
                    } else
                        db.set(msg.guild.id, msg.author.id, { money: 1 })
                })
                return
            }
            chatActMessages.set(msg.author.id, msgCount)
        } else  // If user didn't send messages
            chatActMessages.set(msg.author.id, 1)
    }
}