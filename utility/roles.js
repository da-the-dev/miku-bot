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
 * @param {Map<string,number>} lastMessages - Map of last 'n' lastMessages
 * @param {string} activityName - Name of the activity field in db (day/night)
 * @param {Discord.Guild} guild - Guild where to look for members
 */
const activityCalculator = (lastMessages, activityName, guild) => {
    // utl.db.createClient(process.env.MURL).then(db => {
    //     db.get(guild.id, activityName).then(d => {
    //         var data = new Map(d.data)

    //         var newMap = mergeMaps(lastMessages, data)
    //         db.set(guild.id, activityName, [...newMap]).then(() => db.close())

    //         var filteredMap = new Map(([...newMap.entries()]).filter(([k, v]) => v >= 500))

    //         filteredMap.forEach(async f => {
    //             console.log(f, f[0])
    //             var member = await guild.members.fetch(f[0])
    //             if(member)
    //                 member.roles.add(activityName == 'day' ? constants.roles.daylyActive : constants.roles.nightActive)
    //         })
    //     })
    // })
}

const n = 3 - 1

/**@type {Map<string,number>} */
var lastDayMessages = new Map()
var dayCounter = 0
/**
 * If user sent 500+ messages during the day give a role
 * @param {Discord.Message} msg
 */
module.exports.daylyTextActivity = (msg) => {
    var timezonedDate = new Date(msg.createdAt.toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
    if(timezonedDate.getHours() >= 9 && timezonedDate.getHours() <= 16 && msg.channel.id == constants.channels.dev && !msg.author.bot)
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
            // console.log('[AC] Added message')
        }
        else { // If enough messages collected, calculate
            // console.log('[AC] Calculating night activity...')
            activityCalculator(lastNightMessages, 'night', msg.guild)
            nightCounter = 0
        }
}