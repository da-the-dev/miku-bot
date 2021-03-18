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
 * Calculates and saves everything needed for dayly activity 
 * @param {Array} lastMessages - Array of last 'n' lastMessages
 * @param {string} role - Role ID to give to those who earned it
 * @param {string} activityName - Name of the activity field in db (day/night)
 * @param {Discord.Guild} guild - Guild where to look for members
 */
const activityCalculator = (lastMessages, role, activityName, guild) => {
    var bigData = new Map()
    lastMessages.forEach(m => bigData.set(m, (bigData.get(x) || 0) + 1))
    lastMessages.length = 0

    let activies = [...bigData.entries()]
        .filter(({ 1: v }) => v >= 500)
        .map(([k]) => k)
    console.log(activies)

    activies.forEach(a => {
        guild.members.fetch(a).then(m => m.roles.add(activityName == 'day' ? constants.roles.daylyActive : constants.roles.nightActive))
    })

    // lastNMessages.forEach(x => { bigData.set(x, (bigData.get(x) || 0) + 1) })
    // rClient.set(name, JSON.stringify([...bigData]), err => { if(err) throw err })

}

var lastDayMessages = []
/**
 * If user sent 500+ messages during the day give a role
 * @param {Discord.Message} msg
 */
module.exports.daylyTextActivity = (msg) => {
    var timezonedDate = new Date(msg.createdAt.toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
    if(timezonedDate.getHours() >= 9 && timezonedDate.getHours() <= 16 && msg.channel.id == "819932384375734292")
        if(lastDayMessages.length <= n)
            lastDayMessages.push(msg.author.id)
        else
            activityCalculator(lastNDayMessages, constants.roles.daylyActive, 'activity')
}
var lastNNightMessage = []
/**
 * If user sent 500+ messages during the NIGHT give a role
 * @param {Discord.Message} msg
 */
module.exports.nightTextActivity = (msg) => {
    var timezonedDate = new Date(msg.createdAt.toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
    if(timezonedDate.getHours() >= 0 && timezonedDate.getHours() <= 6 && msg.channel.id == "819932384375734292")
        activityCalculator(lastNNightMessage, msg, constants.roles.nightActive, 'nightActivity')
}