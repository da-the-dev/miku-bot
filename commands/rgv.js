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

        utl.customRoles.checkIfOwner(msg.guild.id, msg.author.id, mRole.id).then(res => {
            if(res) {
                utl.db.createClient(process.env.MURL).then(db => {
                    db.get(guildID, 'serverSettings').then(serverData => {
                        serverData.customRoles[serverData.customRoles.findIndex(r => r.id == mRole.id && r.owner == msg.author.id)].members += 1

                        var role = serverData.customRoles.find(r => r.id == mRole.id && r.owner == msg.author.id)

                        utl.embed(msg, `Роль <@&${role.id}> была выдана <@${mMember.id}>`)

                        db.update(msg.guild.id, mMember.id, { $push: { customInv: role.id } }).then(() => {
                            db.set(msg.guild.id, 'serverSettings', serverData).then(() => db.close())
                        })
                    })
                })
            }
        })
    }