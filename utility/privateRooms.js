const Discord = require('discord.js')
const constants = require('../constants.json')

/**
 * @description Handles the room creation
 * @param {Discord.Client} client
 */
module.exports.createRoom = (client) => {
    // Create 'createRoom'
    var guild = client.guilds.cache.first()
    console.log(guild.name)
    /**@type {Discord.CategoryChannel} */
    // var privateRoomCategory = guild.channels.find(c => c.type == "category" && c.name.toLowerCase().includes("private rooms"))
    var privateRoomCategory = guild.channels.cache.find(c => c.type == "category" && c.name == "⌗                       Private                     ︰ 数字")
    /**@type {Discord.VoiceChannel} */
    var privateCreator = privateRoomCategory.children.find(c => c.type == 'voice' && c.name == "．create 部屋")
    if(!privateCreator)
        privateCreator = guild.channels.create('．create 部屋',
            {
                type: "voice",
                permissionOverwrites:
                    [
                        {
                            id: constants.roles.muted,
                            deny: ['VIEW_CHANNEL', "CONNECT"]
                        },
                        {
                            id: constants.roles.toxic,
                            deny: ['VIEW_CHANNEL', "CONNECT"]
                        },
                        {
                            id: constants.roles.localban,
                            deny: ['VIEW_CHANNEL', "CONNECT"]
                        },
                        {
                            id: guild.id,
                            allow: ['VIEW_CHANNEL', "CONNECT"]
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
module.exports.roomDeletion = async (oldState, newState, client) => {
    var oldMember = oldState.member
    var newMember = newState.member

    // Ignore if channel didn't change
    if(oldState.channelID == newState.channelID) {
        return
    }

    // Create private room
    if(newMember.voice.channel) {
        var creator = newMember.voice.channel
        if(creator.name == '．create 部屋' && creator.parent.name == '⌗                       Private                     ︰ 数字') {
            var guild = newMember.guild
            var category = guild.channels.cache.find(c => c.name == '⌗                       Private                     ︰ 数字')
            var c = await guild.channels.create(newMember.user.username,
                {
                    type: 'voice',
                    permissionOverwrites:
                        [
                            {
                                id: constants.roles.muted,
                                deny: ['VIEW_CHANNEL', "CONNECT"]
                            },
                            {
                                id: constants.roles.toxic,
                                deny: ['VIEW_CHANNEL', "CONNECT"]
                            },
                            {
                                id: constants.roles.localban,
                                deny: ['VIEW_CHANNEL', "CONNECT"]
                            },
                            {
                                id: newMember.user.id,
                                allow: ['VIEW_CHANNEL', 'CONNECT']
                            }
                        ],
                    parent: category
                })
            console.log(newMember.user)
            newMember.voice.setChannel(c.id)
            newMember.roles.add(constants.roles.owner)

        }
    }

    if(oldState.channel) {
        var channel = oldState.channel

        var role = oldState.member.roles.cache.get(constants.roles.owner)
        if(!role)
            role = newState.member.roles.cache.get(constants.roles.owner)

        // Delete if owner left
        if(role && channel.name != '．create 部屋' && channel.parent.name == "⌗                       Private                     ︰ 数字") {
            console.log('delete owner room cause dis')
            oldState.member.roles.remove(constants.roles.owner)
            if(!channel.deleted)
                channel.delete()
                    .catch(console.log('index.voiceStateUpdate: fail to delete after owner left'))
            return
        }

        // Delete empty room
        if(channel.members.size <= 0 && channel.name != '．create 部屋' && channel.parent.name == "⌗                       Private                     ︰ 数字") {
            console.log('delete empty room')
            if(!channel.deleted)
                channel.delete()
                    .catch(console.log('index.voiceStateUpdate: fail to delete after room empty'))
            return
        }
    }
}