const Discord = require('discord.js')
const constants = require('../constants.json')
const utl = require('../utility')
/**
 * Scans the server to make sure that all nessesary channels/messages etc are in place
 * @param {Discord.Client} client - Bot client
 */
module.exports = (client) => {
    var server = client.guilds.cache.first()

    // Scan for private room creator channel
    /**@type {Discord.CategoryChannel} */
    var caterory = server.channels.cache.get(constants.categories.privateRooms)
    var creator = caterory.children.find(c => c.name.includes('create'))
    if(!creator)
        utl.privateRooms.createRoom(client)
    else
        client.creator = creator.id

    // Scan for verificaton message
    /**@type {Discord.TextChannel} */
    var verifyMsg = server.channels.cache.get(constants.channels.verify)
    verifyMsg.messages.fetch()
        .then(msgs => {
            if(!msgs.first()) {
                verifyMsg.send(
                    new Discord.MessageEmbed()
                        .setColor('#2F3136')
                        .setDescription('`ハイ` Чтобы открыть основной контент сервера, прожмите реакцию под этим сообщением.')
                ).then(m => {
                    m.react(`<${constants.emojies.sweet}>`)
                    client.verifyMsg = m.id
                })
            }
            else if(msgs.first().reactions.cache.array().length <= 0) {
                msgs.first().react(`<${constants.emojies.sweet}>`)
                    .then(m => {
                        client.verifyMsg = m.id
                    })
            } else {
                client.verifyMsg = msgs.first().id
            }

            console.log(client.verifyMsg)
        })
}