const Discord = require('discord.js')
const fs = require('fs')
const dotenv = require('dotenv').config()
const roles = require('./roles.json')
const embeds = require('./embeds')
const redis = require('redis')

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
    var guild = client.guilds.cache.find(g => g.name == 'noir. reserve')
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

    // Unmute muted
    const pub = redis.createClient(process.env.RURL)
    pub.send_command('config', ['set', 'notify-keyspace-events', 'Ex'], SubscribeExpired)
    function SubscribeExpired(e, r) {
        sub = redis.createClient(process.env.RURL)
        const expired_subKey = '__keyevent@0__:expired'
        sub.subscribe(expired_subKey, function() {
            console.log(' [i] Subscribed to "' + expired_subKey + '" event channel : ' + r)
            sub.on('message', function(chan, msg) {
                if(msg.startsWith('muted-')) {
                    var data = msg.split('-')
                    data.shift()
                    console.log(data)
                    var guild = client.guilds.cache.get(data[1])
                    var member = guild.members.cache.get(data[0])
                    member.roles.remove(roles.muted)
                    guild.channels.cache.get(data[2]).send(embeds.unmute(client, member, 'был размьючен'))
                }
            })
        })
    }
})

client.on('voiceStateUpdate', (oldState, newState) => {
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

        // Delete if owner left
        if(role && channel.name != 'createRoom' && channel.parent.name == "Chillzone") {
            console.log('delete owner room cause dis')
            oldState.member.roles.remove(client.ownerRole)
            channel.delete()
                .catch(console.log('fail to delete'))
            return
        }

        // Delete empty room
        if(channel.members.size <= 0 && channel.name != 'createRoom' && channel.parent.name == "Chillzone") {
            console.log('delete empty room')
            channel.delete()
                .catch(console.log('fail to delete'))
            return
        }
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