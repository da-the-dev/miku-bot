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
                    var partnerID = userData.loveroom.partner
                    var id = userData.loveroom.id
                    member.guild.channels.cache.get(id).delete()
                    delete userData.loveroom
                    db.set(member.guild.id, member.id, userData).then(() => {
                        member.guild.member(partnerID).roles.remove(constants.roles.loveroom)

                        db.get(member.guild.id, partnerID).then(partnerData => {
                            if(partnerData) {
                                delete partnerData.loveroom
                                db.set(member.guild.id, partnerID, partnerData).then(() => {
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
