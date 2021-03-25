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
            embed.setDescription(`Аватар <@${msg.member.id}>`)
            embed.setImage(msg.author.avatarURL())
        } else {
            embed.setDescription(`Аватар <@${mMember.id}>`)
            embed.setImage(mMember.user.avatarURL())
        }

        msg.channel.send(embed)
    }
