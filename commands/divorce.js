const Discord = require('discord.js')
const utl = require('../utility')
const util = require('util')
const constants = require('../constants.json')

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .divorce
    */
    async (args, msg, client) => {
        const rClient = require('redis').createClient(process.env.RURL)
        const get = util.promisify(rClient.get).bind(rClient)
        const set = util.promisify(rClient.set).bind(rClient)

        get(msg.author.id)
            .then(res => {
                if(!res) {
                    utl.embed(msg, 'У Вас нет пары!')
                    rClient.quit()
                    return
                }
                var userData = JSON.parse(res)
                if(!userData.loveroom) {
                    utl.embed(msg, 'У Вас нет пары!')
                    rClient.quit()
                    return
                }

                c = msg.guild.channels.cache.get(userData.loveroom.id)
                c ? c.delete() : null

                var partnerID = userData.loveroom.partner
                delete userData.loveroom
                console.log(userData)
                msg.member.roles.remove(constants.roles.loveroom)
                msg.guild.members.cache.get(partnerID).roles.remove(constants.roles.loveroom)
                set(msg.author.id, JSON.stringify(userData))

                get(partnerID)
                    .then(ress => {
                        var partnerData = JSON.parse(ress)
                        delete partnerData.loveroom
                        console.log(JSON.stringify(partnerData))
                        set(partnerID, JSON.stringify(partnerData)).then(() => rClient.quit())
                        const embed = utl.embed.build(msg, 't')
                            .setDescription(`\`💔\` <@${msg.member.id}> и <@${partnerID}> больше не пара :(`)
                            .setImage('https://cdn.discordapp.com/attachments/819932384375734292/827578839168581633/1506858016_tenor.gif')
                        msg.channel.send(embed)
                    })
            })

    }