const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')

/**
 * Reacts to a message with 2 reactions and executes provided functions accordingly
 * @param {Discord.Message} msg - Messsage to react to
 * @param {string} id - ID of the only user who can react
 * @param {yes} yes - "Yes" funciton
 * @param {*} no - "No" function
 * @param {*} fail - If timer runs out
 */
module.exports.yesNo = async (msg, id, yes, no, fail) => {
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

/**
 * Reacts to a message with multiple reactions and executes provided functions accordingly
 * @param {Discord.Message} msg - Messsage to react to
 * @param {string} id - ID of the only user who can react
 * @param {Function} cancel - "No" function
 * @param {Function} fail - If timer runs out
 * @param {*} funcs - Functions
 */
module.exports.multiselector = async (msg, id, cancel, fail, ...funcs) => {
    var numbers = Object.values(constants.emojies).slice(1, 5)
    for(i = 0; i < funcs.length; i++)
        await msg.react(numbers[i])
    await msg.react(constants.emojies.escape)
    const filter = (reaction, user) => {
        console.log(user.username, user.id, reaction.emoji.identifier)
        console.log(reaction.emoji.identifier)
        console.log(numbers.includes(reaction.emoji.identifier) && user.id == id)
        return numbers.includes(reaction.emoji.identifier) && user.id == id
    }
    msg.awaitReactions(filter, { max: 1, time: 60000, errors: 'time' })
        .then(reactions => {
            var reaction = reactions.first()
            var index = numbers.findIndex(n => n == reaction.emoji.identifier && reaction.emoji.identifier != constants.emojies.escape)
            console.log(index)
            index >= 0 ? funcs[index]() : cancel()
        })
        .catch(err => {
            fail()
        })
}
