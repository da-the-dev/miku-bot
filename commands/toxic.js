const Discord = require('discord.js')
const constants = require('../constants.json')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .toxic <member>
    */
    (args, msg, client) => {
        var chatCRole = msg.guild.roles.cache.get(constants.roles.chatControl)
        if(msg.member.roles.cache.find(r => r.position >= chatCRole.position)) {
            var mMember = msg.mentions.members.first()
            if(!mMember) {
                utl.embed(msg, 'Не указан участник!')
                return
            }

            utl.db.createClient(process.env.MURL).then(db => {
                db.update(msg.member.id, mMember.user.id, 'toxic', true)
                    .then(() => {
                        mMember.roles.add(constants.roles.toxic)
                        utl.embed(msg, `Пользователю <@${mMember.user.id}> была выдана роль <@&${constants.roles.toxic}>`)
                        db.close()
                    })
            })
        } else
            utl.embed(msg, 'У Вас нет доступа к этой команде!')
    }
module.exports.allowedInGeneral = true