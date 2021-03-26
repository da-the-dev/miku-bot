const Discord = require('discord.js')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .av <?member>
    */
    (args, msg, client) => {
        var embed = new Discord.MessageEmbed()
            .setColor('#2F3136')
            .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)}`, msg.author.avatarURL())
        var mMember = msg.mentions.members.first()
        if(!mMember) {
            embed.setDescription(`:white_small_square: Аватар пользователя <@${msg.member.id}>`)
            embed.setImage(msg.author.displayAvatarURL({ dynamic: true }))
        } else {
            embed.setDescription(`:white_small_square: Аватар пользователя <@${mMember.id}>`)
            embed.setImage(mMember.user.displayAvatarURL({ dynamic: true }))
        }

        msg.channel.send(embed)
    }
