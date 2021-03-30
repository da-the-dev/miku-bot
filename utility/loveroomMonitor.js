const Discord = require('discord.js')
const redis = require('redis')
const constants = require('../constants.json')

/**
 * Monitors when a loveroom member left the server
 * @param {Discord.GuildMember} member 
 */
module.exports.roomDeletion = async (member) => {
    if(member.roles.cache.has(constants.roles.loveroom)) {
        const rClient = redis.createClient(process.env.RURL)
        rClient.get(member.id, async (err, res) => {
            if(err) console.log(err)
            if(res) {
                var userData = JSON.parse(res)
                var partner = userData.loveroom.partner
                var id = userData.loveroom.id
                member.guild.channels.cache.get(id).delete()
                delete userData.loveroom
                rClient.set(member.id, JSON.stringify(userData), err => { if(err) console.log(err) })

                console.log(member.id, partner)

                await member.guild.members.cache.get(partner).roles.remove(constants.roles.loveroom)
                    .catch(err => {
                        console.log(err)
                    })
                console.log('lover 1')
                rClient.get(partner, (err, res2) => {
                    if(err) console.log(err)
                    if(res2) {
                        var userData2 = JSON.parse(res2)
                        delete userData2.loveroom
                        rClient.set(partner, JSON.stringify(userData2), err => { if(err) console.log(err) })
                        rClient.quit()
                    }
                })
            }
        })
    }
}
