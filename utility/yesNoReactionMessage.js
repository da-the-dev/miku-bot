const Discord = require('discord.js')
const utl = require('../utility')

/**
 * Reacts to a message with 2 reactions and executes provided functions accordingly
 * @param {Discord.Message} msg - Messsage to react to
 * @param {yes} yes - "Yes" funciton
 * @param {*} no - "No" function
 * @param {*} fail - If timer runs out
 */
module.exports = async (msg, yes, no, fail) => {
    await msg.react('✅')
    await msg.react('❌')

    const filter = (reaction, user) => {
        return ['✅', '❌'].includes(reaction.emoji.name) || user.id == msg.author
    }
    msg.awaitReactions(filter, { max: 1, time: 60000, errors: 'time' })
        .then(reactions => {
            var reaction = reactions.first()
            switch(reaction.emoji.name) {
                case '✅':
                    yes()
                    break
                case '❌':
                    no()
                    break
            }
        })
        .catch(err => {
            fail()
        })
}
