const Discord = require('discord.js')
const roles = require('./roles.json')
/**
 * @description Handles the room creation
 * @param {Discord.Client} client
 */
module.exports.createRoom = (client) => {
    // Create 'createRoom'
    var guild = client.guilds.cache.find(g => g.name == 'miku Bot Community')
    client.ownerRole = guild.roles.cache.find(r => r.name == "^")
    /**@type {Discord.CategoryChannel} */
    // var privateRoomCategory = guild.channels.find(c => c.type == "category" && c.name.toLowerCase().includes("private rooms"))
    var privateRoomCategory = guild.channels.cache.find(c => c.type == "category" && c.name == "Chillzone")
    /**@type {Discord.VoiceChannel} */
    var privateCreator = privateRoomCategory.children.find(c => c.type == 'voice' && c.name == "createRoom")
    if(!privateCreator)
        privateCreator = guild.channels.create('createRoom',
            {
                type: "voice",
                permissionOverwrites:
                    [
                        {
                            id: roles.star,
                            allow: ['VIEW_CHANNEL', 'CONNECT']
                        },
                        {
                            id: roles.muted,
                            deny: ['VIEW_CHANNEL', "CONNECT"]
                        }
                    ],
                parent: privateRoomCategory
            })
}

/**
 * @description Handles private room deletion
 * @param {Discord.VoiceState} oldState 
 * @param {Discord.VoiceState} newState  
 * @param {Discord.Client} client  
 */
module.exports.roomDeletion = (oldState, newState, client) => {
    var oldMember = oldState.member
    var newMember = newState.member

    // Ignore if channel didn't change
    if(oldState.channelID == newState.channelID) {
        return
    }

    // Create private room
    if(newMember.voice.channel) {
        var creator = newMember.voice.channel
        if(creator.name == 'createRoom' && creator.parent.name == 'Chillzone') {
            var guild = newMember.guild
            var category = guild.channels.cache.find(c => c.name == 'Chillzone')
            guild.channels.create(newMember.user.username,
                {
                    type: 'voice',
                    permissionOverwrites:
                        [
                            {
                                id: roles.star,
                                deny: ['CONNECT']
                            },
                            {
                                id: newMember.user.id,
                                allow: ['CONNECT']
                            }
                        ],
                    parent: category
                }).then(c => {
                    newMember.voice.setChannel(c)
                    newMember.roles.add(client.ownerRole.id)
                })
        }
    }

    if(oldState.channel) {
        var channel = oldState.channel

        var role = oldState.member.roles.cache.get(client.ownerRole.id)
        if(!role)
            role = newState.member.roles.cache.get(client.ownerRole.id)

        // Delete empty room
        if(channel.members.size <= 0 && channel.name != 'createRoom' && channel.parent.name == "Chillzone") {
            console.log('delete empty room')
            if(channel)
                channel.delete()
                    .catch(console.log('index.voiceStateUpdate: fail to delete after room empty'))
            return
        }

        // Delete if owner left
        if(role && channel.name != 'createRoom' && channel.parent.name == "Chillzone") {
            console.log('delete owner room cause dis')
            oldState.member.roles.remove(client.ownerRole)
            if(channel)
                channel.delete()
                    .catch(console.log('index.voiceStateUpdate: fail to delete after owner left'))
            return
        }

    }
}