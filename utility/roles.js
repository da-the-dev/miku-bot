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
 */
const activityCalculator = () => {

}

/**
 * If user sent 500+ messages during the day give a role
 * @param {Discord.Message} msg
 */
module.exports.daylyTextActivity = (msg) => {
    var timezonedDate = new Date(msg.createdAt.toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
    if(timezonedDate.getHours() >= 9 && timezonedDate.getHours() <= 16 && msg.channel.id == "819932384375734292")
        activityCalculator(lastNDayMessages, msg, constants.roles.daylyActive, 'activity')
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