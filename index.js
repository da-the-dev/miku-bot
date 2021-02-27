const Discord = require('discord.js')
const fs = require('fs')
const dotenv = require('dotenv').config()
const roles = require('./roles.json')

// Bumbers
var bumpers = Array()
const tokens = [process.env.TOKEN1, process.env.TOKEN2, process.env.TOKEN3]

for(i = 0; i < 3; i++) {
    /**@type {Discord.Client} */
    var b = bumpers[i]
    b = new Discord.Client()

    b.login(tokens[i])
    b.on('ready', () => {
        console.log(`Bot bumper${i} ready`)
    })

    b.on('message', msg => {
        if(msg.content.includes('пора продвигать сервер в топы! Пропиши') && (msg.author.id == process.env.PINGERID || msg.author.id == process.env.MYID)) {
            var index = msg.content.indexOf('Пропиши') + 10
            var command = msg.content.slice(index, msg.content.length - 1)
            if(command)
                msg.channel.send(command)
        }
    })
}

// Client
const prefix = "$"
const client = new Discord.Client()
var commandNames = fs.readdirSync(__dirname + '/commands')
client.commands = new Array()
client.prefix = prefix
commandNames.forEach(c => {
    client.commands.push({
        'name': c.slice(0, c.length - 3),
        'foo': require(__dirname + '/commands/' + c)
    })
    console.log({
        'name': c.slice(0, c.length - 3),
        'foo': require(__dirname + '/commands/' + c)
    })
})

client.login(process.env.BOTTOKEN)
client.once('ready', () => {
    console.log("beta online")

    // Create 'createRoom'
    var guild = client.guilds.find(g => g.name == 'noir. reserve')
    /**@type {Discord.CategoryChannel} */
    // var privateRoomCategory = guild.channels.find(c => c.type == "category" && c.name.toLowerCase().includes("private rooms"))
    var privateRoomCategory = guild.channels.find(c => c.type == "category" && c.name == "Chillzone")
    /**@type {Discord.VoiceChannel} */
    var privateCreator = privateRoomCategory.children.find(c => c.type == 'voice' && c.name == "createRoom")
    if(!privateCreator)
        privateCreator = guild.createChannel('createRoom',
            {
                type: "voice",
                permissionOverwrites:
                    [
                        {
                            id: roles.star,
                            allow: ['VIEW_CHANNEL', 'CONNECT']
                        }
                    ],
                parent: privateRoomCategory
            })
})

client.on('voiceStateUpdate', (oldMember, newMember) => {
    // Create private room
    if(newMember.voiceChannel) {
        var creator = newMember.voiceChannel
        if(creator.name == 'createRoom' && creator.parent.name == 'Chillzone') {
            var guild = newMember.guild
            var category = guild.channels.find(c => c.name == 'Chillzone')
            guild.createChannel(newMember.user.username,
                {
                    type: 'voice',
                    permissionOverwrites:
                        [
                            {
                                id: roles.star,
                                deny: ['CONNECT', 'CREATE_INSTANT_INVITE']
                            },
                            {
                                id: newMember.user.id,
                                allow: ['VIEW_CHANNEL', 'CONNECT', 'CREATE_INSTANT_INVITE']
                            }
                        ],
                    parent: category
                }).then(c => {
                    newMember.setVoiceChannel(c)
                })
        }
    }

    // Ignore if channel didn't change
    if(oldMember.voiceChannelID == newMember.voiceChannelID) {
        return
    }

    // Delete empty room
    if(oldMember.voiceChannel) {
        console.log('old room')
        var room = oldMember.voiceChannel
        category = oldMember.guild.channels.find(c => c.name == 'Chillzone')
        if(category)
            if(room.parentID == category.id && room.name != 'createRoom' && room.members.array().length <= 0)
                room.delete()
    }
})

client.on('message', msg => {
    // Bot commands
    if(!msg.author.bot && msg.content[0] == prefix) {
        var args = msg.content.slice(1).split(" ")

        client.commands.forEach(c => {
            if(c.name == args[0])
                c.foo(args, msg, client)
            return
        })
    }
})