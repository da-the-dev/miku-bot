const Discord = require('discord.js')
const redis = require('redis')
const constants = require('../constants.json')
const utl = require('../utility')
const util = require('util')
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
            const get = util.promisify(rClient.get).bind(rClient)
            const set = util.promisify(rClient.set).bind(rClient)
            get(mMember.user.id)
                .then(res => {
                    if(res) {
                        var userData = JSON.parse(res)
                        if(!userData.toxic) {
                            userData.toxic = true
                            set(mMember.user.id, JSON.stringify(userData))
                            mMember.roles.add(constants.roles.toxic)
                            utl.embed(msg, `Пользователю <@${mMember.user.id}> была выдана роль <@&${constants.roles.toxic}>`)
                            rClient.quit()
                        }
                    } else {
                        set(mMember.user.id, JSON.stringify({ "toxic": true }))
                        mMember.roles.add(constants.roles.toxic)
                        utl.embed(msg, `Пользователю <@${mMember.user.id}> была выдана роль <@&${constants.roles.toxic}>`)
                        rClient.quit()
                    }
                })
        } else
            utl.embed(msg, 'У Вас нет доступа к этой команде!')
    }
module.exports.allowedInGeneral = true