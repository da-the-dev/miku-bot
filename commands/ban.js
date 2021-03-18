const Discord = require('discord.js')
const redis = require('redis')
const constants = require('../constants.json')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .ban <member>
    */
    async (args, msg, client) => {
        var curatorRole = msg.guild.roles.cache.get(constants.roles.curator)
        if(msg.member.roles.cache.find(r => r.position >= curatorRole.position)) {
            var mMember = msg.mentions.members.first()
            if(!mMember) {
                utl.embed(msg, 'Не указан участник!')
                return
            }

            const rClient = redis.createClient(process.env.RURL)
            rClient.get(mMember.user.id, async (err, res) => {
                if(err) throw err
                if(res) {
                    var userData = JSON.parse(res)
                    if(userData.ban) {
                        delete userData.ban
                        rClient.set(mMember.user.id, JSON.stringify(userData), err => { if(err) throw err })
                        await mMember.roles.remove(constants.roles.localban)
                        utl.embed(msg, `У пользователя <@${mMember.user.id}> была убрана роль <@&${constants.roles.localban}>`)
                        rClient.quit()
                    } else {
                        userData.ban = true
                        rClient.set(mMember.user.id, JSON.stringify(userData), err => { if(err) throw err })
                        await mMember.roles.remove(mMember.roles.cache)
                        await mMember.roles.add(constants.roles.localban)
                        utl.embed(msg, `Пользователю <@${mMember.user.id}> была выдана роль <@&${constants.roles.localban}>`)
                        rClient.quit()
                    }
                } else {
                    rClient.set(mMember.user.id, JSON.stringify({ "ban": true }), err => { if(err) throw err })
                    await mMember.roles.remove(mMember.roles.cache)
                    await mMember.roles.add(constants.roles.localban)
                    utl.embed(msg, `Пользователю <@${mMember.user.id}> была выдана роль <@&${constants.roles.localban}>`)
                    rClient.quit()
                }
            })
        } else
            utl.embed(msg, 'У Вас нет доступа к этой команде!')
    }
module.exports.allowedInGeneral = true