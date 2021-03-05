const Discord = require('discord.js')
const reactions = require('./reactions')


/**
 * @description Constructs an embed to send
 * @param {Discord.Message} msg
 * @param {Array<string>} reactions
 * @param {string} desc
 */
const buildMessage = async (msg, reactions, desc) => {
    msg.delete()
    var rand = Math.floor(Math.random() * reactions.length)

    console.log(reactions.length, rand)
    msg.channel.send((new Discord.MessageEmbed()
        .setDescription(`<@${msg.member.id}> ${desc}`)
        .setImage(reactions[rand])
        .setColor('#2F3136')
    ))
}

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Handles reaction commands
    */
    async (args, msg, client) => {
        var mMember = msg.mentions.members.first()
        switch(args[0]) {
            case 'angry':
                buildMessage(msg, reactions.angryReactions, 'злой(-ая)')
                break
            case 'hit':
                if(mMember)
                    buildMessage(msg, reactions.hitReactions, `ударяет <@${mMember.id}>`)
                break
            case 'hug':
                buildMessage(msg, reactions.hugReactions, `обнимает <@${mMember.id}>`)
                break
            case 'sad':
                buildMessage(msg, reactions.sadReactions, 'грустит')
                break
        }
    }