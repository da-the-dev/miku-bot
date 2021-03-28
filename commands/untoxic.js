const Discord = require('discord.js')
const redis = require('redis')
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

            const rClient = redis.createClient(process.env.RURL)
            rClient.get(mMember.user.id, (err, res) => {
                if(err) throw err
                if(res) {
                    var userData = JSON.parse(res)
                    if(userData.toxic) {
                        delete userData.toxic
                        rClient.set(mMember.user.id, JSON.stringify(userData), err => { if(err) throw err })
                        mMember.roles.remove(constants.roles.toxic)
                        utl.embed(msg, `У пользователя <@${mMember.user.id}> была убрана роль <@&${constants.roles.toxic}>`)
                        rClient.quit()
                    }
                }
            })
        } else
            utl.embed(msg, 'У Вас нет доступа к этой команде!')
    }
module.exports.allowedInGeneral = true