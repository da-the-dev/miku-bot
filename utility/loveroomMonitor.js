const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')

/**
 * Monitors when a loveroom member left the server
 * @param {Discord.GuildMember} member 
 */
module.exports.roomDeletion = async (member) => {
    if(member.roles.cache.has(constants.roles.loveroom)) {
        console.log('valid loveroom deletion')
        utl.db.createClient(process.env.MURL).then(db => {
            db.get(member.guild.id, member.id).then(userData => {
                if(userData) {
                    var partner = userData.loveroom.partner
                    var id = userData.loveroom.id
                    member.guild.channels.cache.get(id).delete()
                    delete userData.loveroom
                    db.set(member.guild.id, member.id, userData).then(() => {
                        member.guild.members.cache.get(partner).roles.remove(constants.roles.loveroom)

                        db.get(member.guild.id, partner).then(partnerData => {
                            if(partnerData) {
                                delete partner.loveroom
                                db.set(member.guild.id, partner, partnerData).then(() => {
                                    db.close()
                                })
                            }
                        })
                    })
                }
            })
        })
    }
}
