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

const buildMessageRequest = (msg, reactions, desc, name) => {
    if(!msg.deleted) msg.delete()
    var rand = Math.floor(Math.random() * reactions.length)

    let request = require('request')
    request(`https://nekos.life/api/v2/img/${name}`,(err,res,body) =>{
    let arr = JSON.parse((body))

    msg.channel.send((new Discord.MessageEmbed()
        .setAuthor(`Реакция: ${name}`, "https://cdn.discordapp.com/attachments/810255515854569472/813821208670765057/photodraw.ru-35920.png")
        .setDescription(`<@${msg.member.id}> ${desc}`)
        .setImage(arr.url)
        .setColor('#2F3136')
        .setFooter(`${msg.author.tag}`, msg.author.avatarURL())
        .setTimestamp()
    ))
})
}

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Handles reaction commands
    */
    (args, msg, client) => {
        var mMember = msg.mentions.members.first()
        switch(args[0]) {
            case 'angry':
                if(mMember)
                    if(mMember.id != msg.member.id)
                        buildMessage(msg, reactions.angryReactions, `разозлился(-ась) на <@${mMember.id}>`, "Злость")
                    else {
                        msg.channel.send(embeds.error(msg.member, 'Не лучшая идея'))
                        msg.delete()
                    }
                break
            case 'hit':
                if(mMember)
                    if(mMember.id != msg.member.id)
                        buildMessage(msg, reactions.hitReactions, `ударил(-а) <@${mMember.id}>`, "Удар")
                    else {
                        msg.channel.send(embeds.error(msg.member, 'Не лучшая идея'))
                        msg.delete()
                    }
                break
            case 'hug':
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
        case 'pat':
            if(mMember)
                    if(mMember.id != msg.member.id)
                    buildMessageRequest(msg, "погладил(-а)", "Погладил(-а)")
            else {
                msg.channel.send(embeds.error(msg.member, 'Не лучшая идея'))
                msg.delete()
            }
                break
            
            case 'poke':
                if(mMember)
                    if(mMember.id != msg.member.id)
                    buildMessageRequest(msg, "ткнул(-а)", "Ткнул(-а)")
            else {
                msg.channel.send(embeds.error(msg.member, 'Не лучшая идея'))
                msg.delete()
            }
                break
                case 'slap':
                    if(mMember)
                    if(mMember.id != msg.member.id)
                    buildMessageRequest(msg, "ударил(-а)", "Ударил(-a)")
                    else {
                        msg.channel.send(embeds.error(msg.member, 'Не лучшая идея'))
                        msg.delete()
                    }
                        break
                case 'cuddle':
                    if(mMember)
                    if(mMember.id != msg.member.id)
                    buildMessageRequest(msg, "потискал(-а)", "Потискал(-a)")
                    else {
                        msg.channel.send(embeds.error(msg.member, 'Не лучшая идея'))
                        msg.delete()
                    }
                        break
        }
    }