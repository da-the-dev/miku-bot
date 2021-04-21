const constants = require('../constants.json')
const Discord = require('discord.js')
const utl = require('../utility')

/**
 * Reapply roles on server entry
 * @param {Discord.GuildMember} member 
 */
module.exports.reapplyRoles = (member) => {
    utl.db.createClient(process.env.MURL).then(db => {
        db.get(member.guild.id, member.id).then(userData => {
            db.close()
            if(userData) {
                var collectedRoles = []
                // Reapply roles
                if(userData.mute)
                    collectedRoles.push(constants.roles.muted)
                if(userData.toxic)
                    collectedRoles.push(constants.roles.toxic)
                if(userData.ban)
                    collectedRoles.push(constants.roles.localban)
                if(userData.pic)
                    collectedRoles.push(constants.roles.pics)

                member.roles.add(collectedRoles).then(() => {
                    console.log(member.displayName, 'applied roles:', collectedRoles != [] ? collectedRoles : 'none')
                })
            }
        })
    })
}

/**
 * Calculates and saves everything needed for day/night activity 
 * @param {Map<string,number>} lastMessages - Map of last 'n' lastMessages
 * @param {string} activityName - Name of the activity field in db (day/night)
 * @param {Discord.Guild} guild - Guild where to look for members
 */
const activityCalculator = (lastMessages, activityName, guild) => {
    utl.db.createClient(process.env.MURL).then(async db => {
        lastMessages = Array.from(lastMessages.entries())
        for(i = 0; i < lastMessages.size; i++) {
            await db.update('718537792195657798', lastMessages[i][0], { $inc: { [activityName == 'day' ? 'dayMsgs' : 'nightMsgs']: lastMessages[i][1] } })
        }
        lastMessages = new Map()

        db.getMany('718537792195657798', {
            $or: [
                { dayMsgs: { $exists: true } },
                { nightMsgs: { $exists: true } }
            ]
        }).then(validData => {
            validData.forEach(d => {
                if(!d.notActivity) {
                    var member = guild.member(d.id)
                    if(member)
                        member.roles.cache.has(activityName == 'day' ? constants.roles.daylyActive : constants.roles.nightActive) ? member.roles.add(activityName == 'day' ? constants.roles.daylyActive : constants.roles.nightActive) : null
                }
            })
            db.close()
        })

    })
}

const n = 10 - 1

/**@type {Map<string,number>} */
var lastDayMessages = new Map()
var dayCounter = 0
/**
 * If user sent 500+ messages during the day give a role
 * @param {Discord.Message} msg
 */
module.exports.daylyTextActivity = (msg) => {
    var timezonedDate = new Date(msg.createdAt.toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
    if(timezonedDate.getHours() >= 9 && timezonedDate.getHours() <= 16 && msg.channel.id == constants.channels.general && !msg.author.bot)
        if(dayCounter < n) { // If not enough messages has been collected, keep collecting
            lastDayMessages.set(msg.author.id, (lastDayMessages.get(msg.author.id) || 0) + 1)
            dayCounter++
            // console.log('[AC] Added message')
        }
        else { // If enough messages collected, calculate and reset the counter
            activityCalculator(lastDayMessages, 'day', msg.guild)
            dayCounter = 0
        }

}
/**@type {Map<string,number>} */
var lastNightMessages = new Map()
var nightCounter = 0
/**
 * If user sent 500+ messages during the NIGHT give a role
 * @param {Discord.Message} msg
 */
module.exports.nightTextActivity = (msg) => {
    var timezonedDate = new Date(msg.createdAt.toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
    if(timezonedDate.getHours() >= 0 && timezonedDate.getHours() <= 6 && msg.channel.id == constants.channels.general && !msg.author.bot)
        if(nightCounter <= n) { // If not enough messages has been collected, keep collecting
            lastNightMessages.set(msg.author.id, (lastNightMessages.get(msg.author.id) || 0) + 1)
            nightCounter++
        }
        else { // If enough messages collected, calculate
            activityCalculator(lastNightMessages, 'night', msg.guild)
            nightCounter = 0
        }
}