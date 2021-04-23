const Discord = require('discord.js')
const utl = require('../utility')

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .profile
    */
    (args, msg, client) => {
        // Member to get the profile of
        var pMember = msg.member
        var mMember = msg.mentions.members.first()
        if(mMember)
            pMember = mMember


        var act = pMember.user.presence.activities.find(a => a.type == 'CUSTOM_STATUS')
        var state = 'Не установлен'
        if(act)
            state = act.state
        state = state.slice(0, state.length <= 60 ? state.length : 60)
        state = state.replace(/[\S]+(.com|.ru|.org|.net|.info)[\S]+/g, '')

        state ? state = state : state = 'Не установлен'

        utl.db.createClient(process.env.MURL).then(db => {
            db.get(msg.guild.id, pMember.id).then(userData => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(`<a:__:825834909146415135> Профиль — ${pMember.user.tag}`)
                    .setDescription(`> **Статус:**\n\`\`\`${state}\`\`\``)
                    .setColor('#2F3136')
                    .addFields([
                        {
                            "name": "> Голосовой онлайн:",
                            "value": ` \`🕓\` — ${utl.time.timeCalculator(userData.voiceTime || 0)}`,
                            "inline": true
                        },
                        {
                            "name": "> Текстовый онлайн:",
                            "value": ` \`💭\` — **${userData.dayMsgs || 0 + userData.nightMsgs || 0}**`,
                            "inline": true
                        },
                        {
                            "name": "> Возлюбленная(-ный):",
                            "value": ` \`💕\` — ${userData.loveroom ? `<@${userData.loveroom.partner}>` : 'Не установлен'}`,
                            "inline": true
                        }
                    ])
                    .setFooter(`${msg.member.displayName} • ${utl.embed.calculateTime(msg)}`, msg.author.avatarURL())

                msg.channel.send(embed)
                db.close()
            })
        })
    }