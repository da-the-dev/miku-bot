const Discord = require('discord.js')
const utl = require('../utility')
const reactions = require('./reactions')

/**
 * @description Constructs an embed to send
 * @param {Discord.Message} msg
 * @param {Array<string>} reactions
 * @param {string} desc
 */
const buildMessage = (msg, reactions, desc, name) => {
    if(!msg.deleted) msg.delete()
    var rand = Math.floor(Math.random() * reactions.length)

    msg.channel.send((new Discord.MessageEmbed()
        .setAuthor(`Реакция: ${name}`, "https://cdn.discordapp.com/attachments/810255515854569472/813821208670765057/photodraw.ru-35920.png")
        .setDescription(`<@${msg.member.id}> ${desc}`)
        .setImage(reactions[rand])
        .setColor('#2F3136')
        .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)}`, msg.author.avatarURL())
    ))
}

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Handles reaction commands
    */
    (args, msg, client) => {
        switch(args[0]) {
            case 'angry':
                var mMember = msg.mentions.members.first()
                if(mMember)
                    if(mMember.id != msg.member.id)
                        buildMessage(msg, reactions.angryReactions, `разозлился(-ась) на <@${mMember.id}>`, "Злость")
                    else {
                        msg.channel.send(embeds.error(msg.member, 'Не лучшая идея'))
                        msg.delete()
                    }
                break
            case 'hit':
                var mMember = msg.mentions.members.first()
                if(mMember)
                    if(mMember.id != msg.member.id)
                        buildMessage(msg, reactions.hitReactions, `ударил(-а) <@${mMember.id}>`, "Удар")
                    else {
                        msg.channel.send(embeds.error(msg.member, 'Не лучшая идея'))
                        msg.delete()
                    }
                break
            case 'hug':
                var mMember = msg.mentions.members.first()
                if(mMember)
                    if(mMember.id != msg.member.id)
                        buildMessage(msg, reactions.hugReactions, `обнял(-а) <@${mMember.id}>`, "Объятие")
                    else {
                        msg.channel.send(embeds.error(msg.member, 'Не лучшая идея'))
                        msg.delete()
                    }
                break
            case 'sad':
                buildMessage(msg, reactions.sadReactions, 'грустит', "Грусть")
                break
        }
    }