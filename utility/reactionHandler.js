const Discord = require('discord.js')
const utl = require('../utility')
const reactions = require('./reactions')

/**
 * @description Constructs an embed to send
 * @param {Discord.Message} msg - Message to reply to
 * @param {Array<string>} reactions - Reaction's GIF array
 * @param {string} description - Embed's description
 */
const buildMessage = (msg, reactions, description) => {
    console.log(msg)
    if(!msg.deleted) msg.delete()
    var rand = Math.floor(Math.random() * reactions.length)

    msg.channel.send((new Discord.MessageEmbed()
        .setDescription(`<@${msg.member.id}> ${description}`)
        .setImage(reactions[rand])
        .setColor('#2F3136')
        .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)}`, msg.author.avatarURL())
    ))
}

/**
 * @description Constructs an embed to send, but using request
 * @param {Discord.Message} msg - Message to reply to
 * @param {Array<string>} name - Reaction name for the API
 * @param {string} description - Embed's description
 */

const buildMessageRequest = (msg, name, description) => {
    if(!msg.deleted) msg.delete()

    let request = require('request')
    console.log(`https://nekos.life/api/v2/img/${name}`)
    request(`https://nekos.life/api/v2/img/${name}`, (err, res, body) => {

        // console.log('err', err, 'body', body, 'res', res)
        let arr = JSON.parse((body))

        msg.channel.send((new Discord.MessageEmbed()
            .setDescription(`<@${msg.member.id}> ${description}`)
            .setImage(arr.url)
            .setColor('#2F3136')
            .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)}`, msg.author.avatarURL())
        ))
    })
}

/**
 * Handles multiple types of reactions in one function
 * @param {Discord.GuildMember} mMember
 * @param {Array} args - Build function parametrs
 */
const reactionHandle = (mMember, ...args) => {
    var msg = args.find(a => a.channel)
    var description = args.find(a => typeof a == 'string')
    var dIndex = args.findIndex(a => typeof a == 'string')

    args[dIndex]

    if(mMember != null && mMember.id != msg.author.id) {
        buildMessage(...args)
    } else {
        utl.embed(msg, 'Не лучшая идея')
        msg.delete()
    }
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
            // buildMessage reactions
            case 'angry':
                var mMember = msg.mentions.members.first()
                // console.log(mMember)
                reactionHandle(null, msg, reactions.angryReactions, `разозлился(-ась) на`, `Злость`)
                break
            case 'hit':
                var mMember = msg.mentions.members.first()
                if(mMember)
                    if(mMember.id != msg.member.id)
                        buildMessage(msg, reactions.hitReactions, `ударил(-а)`, `Удар`)
                    else {
                        utl.embed(msg, 'Не лучшая идея')
                        msg.delete()
                    }
                break
            case 'hug':
                var mMember = msg.mentions.members.first()
                reactionHandle(mMember, msg, reactions.hugReactions, `обнял(-а) <@${mMember.id}>`)
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

            case 'bite':
                var mMember = msg.mentions.members.first()
                if(mMember)
                    if(mMember.id != msg.member.id)
                        buildMessage(msg, reactions.biteReactions, `укусил(-а) <@${mMember.id}>`)
                    else {
                        utl.embed(msg, 'Не лучшая идея')
                        msg.delete()
                    }
                break

            // buildMessageRequest reactions
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
