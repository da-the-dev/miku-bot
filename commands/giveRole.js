const Discord = require('discord.js')
const util = require('util')
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

        const rClient = require('redis').createClient(process.env.RURL)
        const get = util.promisify(rClient.get).bind(rClient)
        const set = util.promisify(rClient.set).bind(rClient)

        get(msg.member.id)
            .then(res => {
                if(res) {
                    var userData = JSON.parse(res)
                    if(!userData.customRoles) {
                        utl.embed(msg, 'У Вас нет своих кастомных ролей!')
                        rClient.quit()
                        return
                    }
                    if(!userData.customRoles.includes(mRole.id)) {
                        utl.embed(msg, 'Эта роль Вам не принадлежит!')
                        rClient.quit()
                        return
                    }
                    console.log(userData.customRoles)
                    console.log(mRole.id)
                    console.log(userData.customRoles.find(r => r == mRole.id))
                    mMember.roles.add(userData.customRoles.find(r => r == mRole.id))
                        .then(() => {
                            utl.embed(msg, `Успешно выдана роль <@&${mRole.id}> пользователю <@${mMember.id}>`)
                            rClient.quit()
                        })

                } else {
                    utl.embed(msg, 'У Вас нет своих кастомных ролей!')
                    rClient.quit()
                }
            })
    }