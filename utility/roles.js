const redis = require('redis')
const constants = require('../constants.json')
const Discord = require('discord.js')

module.exports.reapplyRoles = (member) => {
    const rClient = redis.createClient(process.env.RURL)
    rClient.get(member.id, async (err, res) => {
        if(err) console.log(err)
        if(res) {
            var userData = JSON.parse(res)

            // Reapply roles
            if(userData.mute)
                await member.roles.add(constants.roles.muted)
            if(userData.toxic)
                await member.roles.add(constants.roles.toxic)
            if(userData.ban)
                await member.roles.add(constants.roles.localban)
            if(userData.pic)
                await member.roles.add(constants.roles.pics)
            console.log("might've reaplied")
        }
        rClient.quit()
    })
}

/**
 * Merges 2 string/number maps together
 * @param {Map} map1 - First map
 * @param {Map} map2 - Second map
 * @returns {Map} Merge result
 */
const mergeMaps = (map1, map2) => {
    var joinedArray = Array.from([...map1]).concat(Array.from([...map2]))
    for(i = 0; i < joinedArray.length; i++)
        for(j = 0; j < joinedArray.length; j++)
            if(joinedArray[i] != joinedArray[j])
                if(joinedArray[i][0] == joinedArray[j][0]) {
                    joinedArray[i][1] += joinedArray[j][1]
                    joinedArray.splice(j, 1)
                }
    joinedArray.sort((a, b) => {
        if(a > b) return 1
        if(a < b) return -1
        return 0
    })
    return new Map(joinedArray)
}

/**
 * Calculates and saves everything needed for day/night activity 
 * @param {Map} lastMessages - Map of last 'n' lastMessages
 * @param {string} activityName - Name of the activity field in db (day/night)
 * @param {Discord.Guild} guild - Guild where to look for members
 */
const activityCalculator = (lastMessages, activityName, guild) => {
    const rClient = redis.createClient(process.env.RURL)
    rClient.get(activityName, (err, res) => {
        var mergedMap
        if(err) console.log(err)
        if(res) { // If there is db info about activity type
            mergedMap = mergeMaps(lastMessages, new Map(JSON.parse(res)))
            rClient.set(activityName, JSON.stringify([...mergedMap]), (err, res) => { if(err) console.log(err) })
        } else { // If there's nothing, save last messsages
            mergedMap = lastMessages
            rClient.set(activityName, JSON.stringify([...lastMessages]), (err, res) => { if(err) console.log(err) })
        }

        var activies = [...mergedMap.entries()]  // Fitler for those who have 500+ messsages
            .filter(({ 1: v }) => v >= 500)
            .map(([k]) => k)

        activies.forEach(async a => { // Give users their respective roles
            var member = await guild.members.fetch(a)
            if(!member) {
                return
            }
        })
        lastMessages.clear()

        rClient.mget(membersIDs, (err, res) => {
            for(i = 0; members.length; i++)
                if(res[i].length > 0 && JSON.parse(res[i]).activity !== false)
                    !members[i].roles.cache.has(activityName == "day" ? constants.roles.daylyActive : constants.roles.nightActive) ? members[i].roles.add(activityName == "day" ? constants.roles.daylyActive : constants.roles.nightActive) : null
            rClient.quit()
        })
    })
}

const n = 10 - 1

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
            // console.log('[AC] Calculating day activity...')
            activityCalculator(lastDayMessages, 'day', msg.guild)
            dayCounter = 0
        }

}
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
            // console.log('[AC] Added message')
        }
        else { // If enough messages collected, calculate
            // console.log('[AC] Calculating night activity...')
            activityCalculator(lastNightMessages, 'night', msg.guild)
            nightCounter = 0
        }
}