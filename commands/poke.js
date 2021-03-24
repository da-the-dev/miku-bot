const Discord = require('discord.js')
const utl = require('../utility')

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .poke <member>
    */
    (args, msg, client) => {
        var mMember = msg.mentions.members.first()
        if(!mMember)
            return
        if(mMember.id == msg.member.id)
            return

        let request = require('request')
        request('https://nekos.life/api/v2/img/poke', (err, res, body) => {
            let arr = JSON.parse((body))
            var firstEmbed = new Discord.MessageEmbed()
                .setDescription(`<@${msg.member.id}> тыкает <@${mMember.id}>`)
                .setColor('#2F3136')
                .setTimestamp()
                .setImage(arr.url)
            msg.channel.send(firstEmbed)
        })
    }
module.exports.allowedInGeneral = true