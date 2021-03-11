const Discord = require('discord.js')
const redis = require('redis')
const embeds = require('../embeds')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .addRole <role> <positon> <price>
    */
    async (args, msg, client) => {
        if(msg.member.roles.cache.find(r => r.permissions.has('ADMINISTRATOR'))) {
            var mRole = msg.mentions.roles.first()
            if(!mRole) {
                msg.channel.send(embeds.error(msg.member, 'Не указана роль!'))
                return
            }
            var pos = Number(args[2])
            if(!pos || !Number.isInteger(pos)) {
                msg.channel.send(embeds.error(msg.member, 'Не указана позиция роли!'))
                return
            }
            var price = Number(args[3])
            if(!price || !Number.isInteger(price)) {
                msg.channel.send(embeds.error(msg.member, 'Не указана цена роли!'))
                return
            }

            const rClient = redis.createClient(process.env.RURL)
            rClient.get('roles', (err, res) => {
                if(err) throw err
                if(res) {
                    /**@type {Array<object>} */
                    var rolesData = JSON.parse(res)
                    var index = rolesData.findIndex(r => r.pos == pos)
                    if(index == -1)
                        rolesData.push({ 'id': mRole.id, 'pos': pos, 'price': price })
                    else {
                        rolesData.splice(index, 1)
                        rolesData.push({ 'id': mRole.id, 'pos': pos, 'price': price })
                    }

                    rClient.set('roles', JSON.stringify(rolesData), err => { if(err) throw err })
                    rClient.quit()
                } else {
                    rClient.set('roles', JSON.stringify([{ 'id': mRole.id, 'pos': pos, 'price': price }]), err => { if(err) throw err })
                    rClient.quit()
                }
            })
        }
    }
module.exports.allowedInGeneral = true