const Discord = require('discord.js')
const utl = require('../utility')
const util = require('util')
const constants = require('../constants.json')

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .divorce
    */
    async (args, msg, client) => {
        utl.db.createClient(process.env.MURL).then(db => {
            db.get(msg.guild.id, msg.author.id).then(userData => {
                if(!userData && userData.loveroom) {
                    utl.embed(msg, 'У Вас нет пары!')
                    db.close()
                    return
                }

                var c = msg.guild.channels.cache.get(userData.loveroom.id)
                c ? c.delete() : null

                var partnerID = userData.loveroom.partner
                delete userData.loveroom

                msg.member.roles.remove(constants.roles.loveroom)
                msg.guild.members.cache.get(partnerID).roles.remove(constants.roles.loveroom)
                db.set(msg.guild.id, msg.author.id, userData).then(() => {
                    db.get(msg.guild.id, partnerID).then(partnerData => {
                        delete partnerData.loveroom
                        db.set(msg.guild.id, partnerID, partnerData).then(() => db.close())
                        const embed = utl.embed.build(msg, 't')
                            .setDescription(`\`💔\` <@${msg.member.id}> и <@${partnerID}> больше не пара :(`)
                            .setImage('https://cdn.discordapp.com/attachments/819932384375734292/827578839168581633/1506858016_tenor.gif')
                        msg.channel.send(embed)
                    })
                })
            })
        })
    }