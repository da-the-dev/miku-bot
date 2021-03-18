const redis = require('redis')
const constants = require('../constants.json')
const Discord = require('discord.js')

module.exports.reapplyRoles = (member) => {
    const rClient = redis.createClient(process.env.RURL)
    rClient.get(member.id, (err, res) => {
        if(err) throw err
        if(res) {
            var userData = JSON.parse(res)

            // Reapply roles
            if(userData.mute)
                member.roles.add(constants.roles.muted)
            if(userData.toxic)
                member.roles.add(constants.roles.toxic)
            if(userData.ban)
                member.roles.add(constants.roles.localban)
        }
    })
}

/**
 * Calculate message activity stuff
 * @param {Array} lastNMessages
 */
const activityCalculator = (lastNMessages, msg, role, name) => {
    if(lastNMessages.length < n) {
        lastNMessages.push(msg.author.id)
        console.log("pushed", lastNMessages.length)
    }
    else {
        const rClient = redis.createClient(process.env.RURL)
        rClient.get(name, (err, res) => {
            if(err) throw err
            if(res) {
                var bigData = new Map(JSON.parse(res))
                lastNMessages.forEach(x => { bigData.set(x, (bigData.get(x) || 0) + 1) })
                rClient.set(name, JSON.stringify([...bigData]), err => { if(err) throw err })

                var keys = Array.from(bigData.keys())
                var values = Array.from(bigData.values())

                var daylyActivesIDs = []

                for(var i = 0; i < keys.length; i++) {
                    console.log('i:', i, "key:", keys[i])
                    if(values[i] >= awardAmount) {
                        console.log('more or is awardAmount')
                        daylyActivesIDs.push(keys[i])
                    }
                }
                lastNMessages = []

                daylyActivesIDs.forEach(a => {
                    rClient.get(a, (err, res) => {
                        if(err) throw err
                        if(res) {
                            var userData = JSON.parse(res)
                            userData.daylyActive = true
                            msg.guild.members.cache.get(a).roles.add(role)
                            rClient.set(a, JSON.stringify(userData), err => { if(err) throw err })
                            rClient.quit()
                        } else {
                            rClient.set(a, { 'daylyActive': true }, err => { if(err) throw err })
                            msg.guild.members.cache.get(a).roles.add(role)
                            rClient.quit()
                        }
                    })
                })
            } else {
                var bigData = new Map()
                lastNMessages.forEach(x => { bigData.set(x, (bigData.get(x) || 0) + 1) })
                console.log([...bigData])
                rClient.set(name, JSON.stringify([...bigData]), err => { if(err) throw err })
                rClient.quit()
                lastNMessages = []
            }
        })
    }
}

const n = 10
const awardAmount = 500

var lastNDayMessages = []
/**
 * If user sent 500+ messages during the day give a role
 * @param {Discord.Message} msg
 */
module.exports.daylyTextActivity = (msg) => {
    var timezonedDate = new Date(msg.createdAt.toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
    if(timezonedDate.getHours() >= 9 && timezonedDate.getHours() <= 16 && msg.channel.id == constants.channels.general)
        activityCalculator(lastNDayMessages, msg, constants.roles.daylyActive, 'activity')
}
var lastNNightMessage = []
/**
 * If user sent 500+ messages during the NIGHT give a role
 * @param {Discord.Message} msg
 */
module.exports.nightTextActivity = (msg) => {
    var timezonedDate = new Date(msg.createdAt.toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
    if(timezonedDate.getHours() >= 0 && timezonedDate.getHours() <= 6 && msg.channel.id == constants.channels.general)
        activityCalculator(lastNNightMessage, msg, constants.roles.nightActive, 'nightActivity')
}