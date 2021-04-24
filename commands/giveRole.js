const Discord = require('discord.js')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .bal
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

        utl.db.createClient(process.env.MURL).then(db => {
            db.get(msg.guild.id, 'serverSettings').then(serverData => {
                // Doesnt have custom roles
                if(!serverData.customRoles.find(r => r.owner == msg.author.id)) {
                    utl.embed(msg, 'У Вас нет кастомных ролей!')
                    db.close()
                    return
                }

                // Role isn't custom
                if(!serverData.customRoles.find(r => r.id == mRole.id)) {
                    utl.embed(msg, 'Эта роль не является кастомной!')
                    db.close()
                    return
                }

                // Role doesn't belong to the user
                if(!serverData.customRoles.find(r => r.id == mRole.id).owner == msg.author.id) {
                    utl.embed(msg, 'Эта роль не Ваша!')
                    db.close()
                    return
                }

                console.log(serverData.customRoles)
                serverData.customRoles[serverData.customRoles.findIndex(r => r.id == mRole.id && r.owner == msg.author.id)].members += 1
                console.log(serverData.customRoles)

                var role = serverData.customRoles.find(r => r.id == mRole.id && r.owner == msg.author.id)

                utl.embed(msg, `Роль <@&${role.id}> была выдана <@${mMember.id}>`)

                db.update(msg.guild.id, mMember.id, { $push: { customInv: role.id } }).then(() => {
                    db.set(msg.guild.id, 'serverSettings', serverData).then(() => db.close())
                })
            })
        })
    }