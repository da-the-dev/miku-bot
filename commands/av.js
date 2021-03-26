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
            embed.setImage(msg.author.displayAvatarURL({ dynamic: true }) + "?size=2048")
            embed.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        } else {
            embed.setImage(mMember.user.displayAvatarURL({ dynamic: true }) + "?size=2048")
            embed.setAuthor(mMember.user.tag, mMember.user.displayAvatarURL())
        }

        msg.channel.send(embed)
    }
