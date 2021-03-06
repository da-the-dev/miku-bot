const Discord = require('discord.js')
const reactions = require('./reactions')


/**
 * @description Constructs an embed to send
 * @param {Discord.Message} msg
 * @param {Array<string>} reactions
 * @param {string} desc
 */
const buildMessage = async (msg, reactions, desc, name) => {
    if(msg) msg.delete()
    var rand = Math.floor(Math.random() * reactions.length)

    msg.channel.send((new Discord.MessageEmbed()
        .setAuthor(`Реакция: ${name}`, "https://cdn.discordapp.com/attachments/810255515854569472/813821208670765057/photodraw.ru-35920.png")
        .setDescription(`<@${msg.member.id}> ${desc}`)
        .setImage(reactions[rand])
        .setColor('#2F3136')
        .setFooter(`Cегодня, в ${msg.createdAt.getHours()}:${msg.createdAt.getMinutes()}`)
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
                if(mMember)
                    buildMessage(msg, reactions.angryReactions, `разозлился(-ась) на <@${mMember.id}>`, "Злость")
                break
            case 'hit':
                if(mMember)
                    buildMessage(msg, reactions.hitReactions, `ударил(-а) <@${mMember.id}>`, "Удар")
                break
            case 'hug':
                buildMessage(msg, reactions.hugReactions, `обнял(-а) <@${mMember.id}>`, "Объятие")
                break
            case 'sad':
                buildMessage(msg, reactions.sadReactions, 'грустит', "Грусть")
                break
        }
    }