const Discord = require('discord.js')
const constants = require('../constants.json')
/**
 * Handles report assignment with reactions
 * @param {Discord.MessageReaction} reaction - Reaction
 * @param {Discord.User} user - Reaction's user
 * @param {Discord.Client} client - Bot client
 */
module.exports.reportAssignmentHandler = (reaction, user, client) => {
    if(reaction.message.channel.id == constants.channels.reports) {
        if(reaction.emoji.name == "☑️" && user.id != client.user.id) {
            var oldMessage = reaction.message
            var attachments = oldMessage.attachments
            var embed = oldMessage.embeds[0]
            var description = `**Репорт забрал ${user.tag}!**\n\n` + embed.description
            embed.setDescription(description)
            reaction.message.edit('', { embed: embed, files: Array.from(attachments.values()) })
                .then(m => {
                    m.reactions.removeAll()
                        .then(async m => {
                            await m.react('✅')
                            await m.react('❌')
                        })
                })
        }
    }
}