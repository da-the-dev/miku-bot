const Discord = require('discord.js')
const redis = require('redis')
const constants = require('../constants.json')

/**
 * Monitors when a loveroom member left the server
 * @param {Discord.GuildMember} member 
 */
module.exports.roomDeletion = (member) => {
    if(member.roles.cache.has(constants.roles.loveroom)) {
        member.roles.remove(constants.roles.loveroom)

        const rClient = redis.createClient(process.env.RURL)
        rClient.get(member.id, (err, res) => {
            if(err) throw err
            if(res) {
                var userData = JSON.parse(res)
                var partner = userData.loveroom.partner
                var id = userData.loveroom.id
                member.guild.channels.cache.get(id).delete()
                delete userData.loveroom
                rClient.set(member.id, JSON.parse(userData), err => { if(err) throw err })

                console.log(member.id, partner)


                member.guild.members.cache.get(partner).roles.remove(constants.roles.loveroom)
                rClient.get(partner, (err, res) => {
                    if(res) throw err
                    if(res) {
                        var userData = JSON.parse(res)
                        delete userData.loveroom
                        rClient.set(member.id, JSON.parse(userData), err => { if(err) throw err })
                        rClient.quit()
                    }
                })
            }
        })
    }
}
