const Discord = require('discord.js')
const redis = require('redis')
const utl = require('../utility')
const emojies = ['⬅️', '➡️']
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .buy <pos>
    */
    async (args, msg, client) => {
        if(!args[1]) {
            utl.embed(msg, 'Не указан номер роли для покупки!')
            return
        }

        const rClient = redis.createClient(process.env.RURL)
        rClient.get('roles', (err, res) => {
            if(err) throw err
            if(res) {
                var rolesData = JSON.parse(res)
                var selectedRole = rolesData.find(r => r.pos == args[1])
                rClient.get(msg.author.id, (eerr, rres) => {
                    if(eerr) throw eerr
                    if(rres) {
                        var userData = JSON.parse(rres)
                        if(!userData.money) {
                            utl.embed(msg, 'Не достаточно средств для покупки роли!')
                            rClient.quit()
                            return
                        }
                        if(userData.money < selectedRole.price) {
                            utl.embed(msg, 'Не достаточно средств для покупки роли!')
                            rClient.quit()
                            return
                        }
                        msg.channel.send(utl.embed.build(msg.member, `Вы уверены, что хотите купить роль <@&${selectedRole.id}>?`))
                            .then(async m => {
                                await m.react('✅')
                                await m.react('❌')
                                const filter = (reaction, user) =>
                                    user.id == msg.author.id
                                m.awaitReactions(filter, { time: 5000, max: 1 })
                                    .then(reactions => {
                                        if(reactions.array().length == 0) {
                                            m.edit(new Discord.MessageEmbed()
                                                .setDescription(`Покупка отменена про причине истечения времени`)
                                                .setColor('#2F3136')
                                            )
                                            m.reactions.removeAll()
                                            return
                                        }
                                        if(reactions.first().emoji.name == '❌') {
                                            m.edit(new Discord.MessageEmbed()
                                                .setDescription(`Покупка отменена`)
                                                .setColor('#2F3136')
                                            )
                                            m.reactions.removeAll()
                                            return
                                        }
                                        if(reactions.first().emoji.name == '✅') {
                                            msg.member.roles.add(msg.guild.roles.cache.get(selectedRole.id))
                                            userData.money -= selectedRole.price
                                            if(!userData.inv)
                                                userData.inv = []
                                            userData.inv.push(selectedRole)
                                            rClient.set(msg.author.id, JSON.stringify(userData), err => { if(err) throw err })
                                            rClient.quit()

                                            m.edit(utl.embed.build(msg, `Вы успешно приобрели роль <@&${selectedRole.id}>. Зайдите в инвентарь командой \`${client.prefix}inv\`, чтобы посмотреть Ваши роли`))
                                            m.reactions.removeAll()
                                            return
                                        }
                                        m.reactions.removeAll()
                                    })
                            })
                    } else {
                        utl.embed(msg, 'Не достаточно средств для покупки роли!')
                        rClient.quit()
                        return
                    }
                })
            } else {
                utl.embed(msg, 'Не достаточно средств для покупки роли!')
                rClient.quit()
            }
        })
    }