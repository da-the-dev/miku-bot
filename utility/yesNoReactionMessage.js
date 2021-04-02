const Discord = require('discord.js')
const utl = require('../utility')

/**
 * Reacts to a message with 2 reactions and executes provided functions accordingly
 * @param {Discord.Message} msg - Messsage to react to
 * @param {string} id - ID of the only user who can react
 * @param {yes} yes - "Yes" funciton
 * @param {*} no - "No" function
 * @param {*} fail - If timer runs out
 */
module.exports = async (msg, id, yes, no, fail) => {
    await msg.react('✅')
    await msg.react('❌')

    const filter = (reaction, user) => {
        console.log(user.username, user.id, id)
        return ['✅', '❌'].includes(reaction.emoji.name) && user.id == id
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
