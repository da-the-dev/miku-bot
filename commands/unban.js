const Discord = require('discord.js')
const redis = require('redis')
const constants = require('../constants.json')
const utl = require('../utility')
const { promisify } = require('util')

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .unban <member>
    */
    (args, msg, client) => {
        var curatorRole = msg.guild.roles.cache.get(constants.roles.curator)
        if(msg.member.roles.cache.find(r => r.position >= curatorRole.position)) {
            var mMember = msg.mentions.members.first()
            if(!mMember) {
                utl.embed(msg, 'Не указан участник!')
                return
            }

            const rClient = redis.createClient(process.env.RURL)
            const get = promisify(rClient.get).bind(rClient)
            const set = promisify(rClient.set).bind(rClient)
            get(mMember.user.id)
                .then(res => {
                    if(res) {
                        var userData = JSON.parse(res)
                        if(userData.ban) {
                            delete userData.ban
                            set(mMember.user.id, JSON.stringify(userData)).then(() => rClient.quit())
                            mMember.roles.remove(constants.roles.localban)
                                .then(() => utl.embed(msg, `У пользователя <@${mMember.user.id}> была убрана роль <@&${constants.roles.localban}>`))
                        }
                    }
                })
        } else
            utl.embed(msg, 'У Вас нет доступа к этой команде!')
    }
module.exports.allowedInGeneral = true