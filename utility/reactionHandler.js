const Discord = require('discord.js')
const utl = require('../utility')
const reactions = require('./reactions')
const request = require('request')
/**
 * @description Constructs an embed to send
 * @param {Discord.Message} msg - Message to reply to
 * @param {Array<string>} reactions - Reaction's GIF array
 * @param {string} desc - Embed's description
 */
const buildMessage = (msg, reactions, desc) => {
    if(!msg.deleted) msg.delete()
    var rand = Math.floor(Math.random() * reactions.length)

    msg.channel.send((new Discord.MessageEmbed()
        .setDescription(`<@${msg.member.id}> ${desc}`)
        .setImage(reactions[rand])
        .setColor('#2F3136')
        .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)}`, msg.author.avatarURL())
    ))
}

/**
 * @description Constructs an embed to send, but using request
 * @param {Discord.Message} msg - Message to reply to
 * @param {Array<string>} name - Reaction name for the API
 * @param {string} desc - Embed's description
 */
const buildMessageRequest = (msg, name, desc) => {
    if(!msg.deleted) msg.delete()

    let request = require('request')
    console.log(`https://nekos.life/api/v2/img/${name}`)
    request(`https://nekos.life/api/v2/img/${name}`, (err, res, body) => {

        console.log('err', err, 'body', body, 'res', res)
        let arr = JSON.parse((body))

        msg.channel.send((new Discord.MessageEmbed()
            .setDescription(`<@${msg.member.id}> ${desc}`)
            .setImage(arr.url)
            .setColor('#2F3136')
            .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)}`, msg.author.avatarURL())
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
        switch(args[0]) {
            case 'angry':
                var mMember = msg.mentions.members.first()
                if(mMember)
                    if(mMember.id != msg.member.id)
                        buildMessage(msg, reactions.angryReactions, `разозлился(-ась) на <@${mMember.id}>`, `Злость`)
                    else {
                        utl.embed(msg, 'Не лучшая идея')
                        msg.delete()
                    }
                break
            case 'hit':
                var mMember = msg.mentions.members.first()
                if(mMember)
                    if(mMember.id != msg.member.id)
                        buildMessage(msg, reactions.hitReactions, `ударил(-а) <@${mMember.id}>`, `Удар`)
                    else {
                        utl.embed(msg, 'Не лучшая идея')
                        msg.delete()
                    }
                break
            case 'hug':
                var mMember = msg.mentions.members.first()
                if(mMember)
                    if(mMember.id != msg.member.id)
                        buildMessage(msg, reactions.hugReactions, `обнял(-а) <@${mMember.id}>`, `Объятие`)
                    else {
                        utl.embed(msg, 'Не лучшая идея')
                        msg.delete()
                    }
                break
            case 'sad':
                buildMessage(msg, reactions.sadReactions, 'грустит', `Грусть`)
                break

            case 'pat':
                var mMember = msg.mentions.members.first()
                if(mMember)
                    if(mMember.id != msg.member.id)
                        buildMessageRequest(msg, 'pat', `погладил(-а) <@${mMember.id}>`)
                    else {
                        utl.embed(msg, 'Не лучшая идея')
                        msg.delete()
                    }
                break

            case 'poke':
                var mMember = msg.mentions.members.first()
                if(mMember)
                    if(mMember.id != msg.member.id)
                        buildMessageRequest(msg, 'poke', `ткнул(-а) <@${mMember.id}>`)
                    else {
                        utl.embed(msg, 'Не лучшая идея')
                        msg.delete()
                    }

                break
            case 'slap':
                var mMember = msg.mentions.members.first()
                if(mMember)
                    if(mMember.id != msg.member.id)
                        buildMessageRequest(msg, 'slap', `шлепнул(-а) <@${mMember.id}>`)
                    else {
                        msg.channel.send(embeds.error(msg.member, 'Не лучшая идея'))
                        msg.delete()
                    }
                break
            case 'cuddle':
                var mMember = msg.mentions.members.first()
                if(mMember)
                    if(mMember.id != msg.member.id)
                        buildMessageRequest(msg, 'cuddle', `потискал(-а) <@${mMember.id}>`)
                    else {
                        utl.embed(msg, 'Не лучшая идея')
                        msg.delete()
                    }
                break
        }
    }
