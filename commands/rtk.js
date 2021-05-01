const Discord = require('discord.js')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .rgv <role> <member>
    */
    (args, msg, client) => {
        var mRole = msg.mentions.roles.first()
        var mMember = msg.mentions.members.first()

        if(!mRole) {
            utl.embed(msg, 'Не указана роль!')
            return
        }
        if(!mMember) {
            utl.embed(msg, 'Не указан пользователь!')
            return
        }

        utl.cRoles.checkIfOwner(msg.guild.id, msg.author.id, mRole.id).then(res => {
            if(res) {
                utl.db.createClient(process.env.MURL).then(db => {
                    db.get(msg.guild.id, 'serverSettings').then(serverData => {
                        db.get(msg.guild.id, msg.author.id).then(userData => {
                            if(!userData || !userData.customInv || userData.customInv.findIndex(r => r == mRole.id) == -1) {
                                utl.embed(msg, `У <@${mMember.id}> нет роли <@&${mRole.id}>!`)
                                db.close()
                                return
                            }

                            serverData.customRoles[serverData.customRoles.findIndex(r => r.id == mRole.id && r.owner == msg.author.id)].members -= 1

                            var role = serverData.customRoles.find(r => r.id == mRole.id && r.owner == msg.author.id)

                            utl.embed(msg, `Роль <@&${role.id}> была забрана у <@${mMember.id}>`)

                            db.update(msg.guild.id, mMember.id, { $pull: { customInv: role.id } }).then(() => {
                                db.set(msg.guild.id, 'serverSettings', serverData).then(() => db.close())
                            })
                        })
                    })
                })
            }
        })
    }