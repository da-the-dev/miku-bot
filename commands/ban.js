const Discord = require('discord.js')
const constants = require('../constants.json')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .ban <member>
    */
    (args, msg, client) => {
        var curatorRole = msg.guild.roles.cache.get(constants.roles.curator)
        if(msg.member.roles.cache.find(r => r.position >= curatorRole.position)) {
            var mMember = msg.mentions.members.first()
            if(!mMember) {
                utl.embed(msg, 'Не указан участник!')
                return
            }

            utl.db.createClient(process.env.MURL).then(db => {
                db.update(msg.guild.id, mMember.user.id, { $set: { ban: true } }).then(() => {
                    mMember.roles.remove(mMember.roles.cache)
                        .then(() => { mMember.roles.add(constants.roles.localban) })
                    utl.embed(msg, `Пользователю <@${mMember.user.id}> была выдана роль <@&${constants.roles.localban}>`)
                    db.close()
                })
            })
        } else
            utl.embed(msg, 'У Вас нет доступа к этой команде!')
    }
module.exports.allowedInGeneral = true