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
 * Handles multiple types of reactions in one function
 * @param {Discord.GuildMember} mMember
 * @param {Array} args - Build function parametrs
 */
const reactionHandle = (mMember, ...args) => {
    var msg = args.find(a => a.channel)
    if(mMember === null) {
        buildMessage(...args)
        return
    }
    var msg = args.find(a => a.channel)
    if(mMember != undefined && mMember.id != msg.author.id) {
        var dIndex = args.findIndex(a => typeof a == 'string')
        args[dIndex] = args[dIndex] + ` <@${mMember.id}>`
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
                reactionHandle(msg.mentions.members.first(), msg, reactions.angry, `разозлился(-ась) на`)
                break
            case 'hit':
                reactionHandle(msg.mentions.members.first(), msg, reactions.hit, `ударил(-а)`)
                break
            case 'hug':
                reactionHandle(msg.mentions.members.first(), msg, reactions.hug, `обнял(-а)`)
                break
            case 'sad':
                reactionHandle(null, msg, reactions.sad, 'грустит')
                break

            case 'slap':
                reactionHandle(msg.mentions.members.first(), msg, reactions.slap, `ударил(-а) по лицу`)
                break
            case 'poke':
                reactionHandle(msg.mentions.members.first(), msg, reactions.poke, `ткнул(-а)`)
                break
            case 'pat':
                reactionHandle(msg.mentions.members.first(), msg, reactions.pat, `погладил(-а)`)
                break
            case 'cuddle':
                reactionHandle(msg.mentions.members.first(), msg, reactions.cuddle, `тискает`)
                break

            case 'bite':
                reactionHandle(msg.mentions.members.first(), msg, reactions.bite, `укусил(-а)`)
                break
            case 'cheek':
                reactionHandle(msg.mentions.members.first(), msg, reactions.cheek, `поцеловал(-а) в щеку`)
                break
            case 'cry':
                reactionHandle(null, msg, reactions.cry, `плачет`)
                break
            case 'happy':
                reactionHandle(null, msg, reactions.happy, `радуется`)
                break

            case 'lick':
                reactionHandle(msg.mentions.members.first(), msg, reactions.lick, `лижет`)
                break
            case 'love':
                reactionHandle(msg.mentions.members.first(), msg, reactions.love, `признается в любви`)
                break
            case 'sleep':
                reactionHandle(null, msg, reactions.sleep, `спит`)
                break
            case 'smoke':
                reactionHandle(null, msg, reactions.smoke, `курит`)
                break

            case 'tea':
                reactionHandle(null, msg, reactions.tea, `наслаждается чаем`)
                break
            case 'virt':
                reactionHandle(msg.mentions.members.first(), msg, reactions.virt, `виртит с`)
                break

        }
    }
