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
    * @description Usage: .createRole <hex> <name>
    */
    (args, msg, client) => {
        var hex = args[1]
        if(!hex) {
            utl.embed(msg, 'Не указан цвет роли!')
            return
        }
        if(!hex.startsWith('#')) {
            utl.embed(msg, 'Цвет роли должен быть в формате **HEX** и начинаться с `#`!')
            return
        }
        if(hex.length != 7) {
            utl.embed(msg, 'Цвет роли должен быть в формате **HEX** и состоять в общей сложности из **7** символов!\n```#FFFFFF - Белый\n#000000 - Черный```')
            return
        }
        hex = hex.toUpperCase()

        args.shift()
        args.shift()

        var name = args.join(' ')
        if(!name) {
            utl.embed(msg, 'Не указано название роли!')
            return
        }

        const fetch = require('node-fetch');
        fetch(`https://www.thecolorapi.com/id?hex=${hex.slice(1)}`)
            .then(res => {
                res.text()
                    .then(res => {
                        console.log(JSON.parse(res))
                        utl.embed(msg, `Вы уверены что хотите создать роль \`${name}\` с цветом \`${hex}\` *(${JSON.parse(res).name.value})*?`)
                            .then(async m => {
                                await m.react('✅')
                                await m.react('❌')

                                const filter = (reaction, user) => {
                                    return ['✅', '❌'].includes(reaction.emoji.name) || user.id == msg.author
                                }
                                m.awaitReactions(filter, { max: 1, time: 60000, errors: 'time' })
                                    .then(reactions => {
                                        var reaction = reactions.first()

                                        switch(reaction.emoji.name) {
                                            case '✅':
                                                const rClient = require('redis').createClient(process.env.RURL)
                                                const get = util.promisify(rClient.get).bind(rClient)
                                                const set = util.promisify(rClient.set).bind(rClient)



                                                msg.guild.roles.create({
                                                    data: {
                                                        name: name,
                                                        color: hex,
                                                        position: 28
                                                    },
                                                    reason: `${msg.author.tag} создал(-а) эту роль командой .createRole`
                                                })
                                                    .then(r => {
                                                        console.log(r.id)
                                                        msg.member.roles.add(r)
                                                            .then(() => {
                                                                m.edit(utl.embed.build(msg, `Вы успешно создали роль <@&${r.id}>!`))
                                                                m.reactions.removeAll()
                                                            })
                                                    })
                                                break
                                            case '❌':
                                                m.delete()
                                                break
                                        }
                                    })
                                    .catch()
                            })
                    })
            })
    }