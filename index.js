// Libraries
const Discord = require('discord.js')
const fs = require('fs')
const dotenv = require('dotenv').config()
const redis = require('redis')

// Constants
const constants = require('./constants.json')

// Utilities
const embeds = require('./embeds')
const utl = require('./utility')

// Client
const prefix = "."
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
client.prefix = prefix

// Commands
var commandNames = fs.readdirSync(__dirname + '/commands')
client.commands = new Array()
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

client.on('guildMemberAdd', (member) => {
    utl.anticrash.monitorBotInvites(member)
    utl.verify.mark(member)
    utl.roles.reapplyRoles()
})

client.on('roleUpdate', (oldRole, newRole) => {
    utl.anticrash.monitorRoleAdminPriviligeUpdate(oldRole, newRole)
})
client.on('guildBanAdd', (guild, member) => {
    utl.anticrash.monitorBans(guild, member)
})
client.on('guildMemberRemove', member => {
    utl.anticrash.monitorKicks(member)
})
client.on('messageReactionAdd', async (reaction, user) => {
    utl.fetch.fetchReactions(reaction)
    utl.verify.verify(reaction, user)
    utl.shop(reaction, user, client)
})

client.once('ready', () => {
    console.log("BETA online")
    utl.privateRooms.createRoom(client)
    utl.redisUnmute()
})

client.on('voiceStateUpdate', (oldState, newState) => {
    utl.privateRooms.roomDeletion(oldState, newState, client)
    utl.moneyGet.voiceActivity(oldState, newState)
})

client.on('message', msg => {
    // Bot commands
    if(!msg.author.bot) {
        utl.moneyGet.chatActivity(msg)
        if(msg.content[0] == prefix) {
            var args = msg.content.slice(1).split(" ")

            // Say command
            if(args[0].includes('\n'))
                if(args[0].slice(0, args[0].indexOf('\n')) == "say") {
                    client.commands.find(c => c.name == "say").foo(args, msg, client)
                    msg.delete()
                        .catch(err => console.log('say exeption', err))
                    return
                }

            // Regular commands
            for(i = 0; i < client.commands.length; i++) {
                var c = client.commands[i]
                if(c.name == args[0]) {
                    if(msg.channel.id == constants.channels.general && c.allowedInGeneral) {
                        c.foo(args, msg, client)
                        msg.delete().catch(err => console.log('regular', err))
                    }
                    else if(msg.channel.id == constants.channels.general && !c.allowedInGeneral)
                        msg.delete().catch(err => console.log('regular', err))
                    else {
                        c.foo(args, msg, client)
                        msg.delete().catch(err => console.log('regular', err))
                    }
                    return
                }
            }

            // Reactions
            utl.reactionHandler(args, msg, client)
        }
        // Selfy moderation
        if(msg.channel.id == '810876164960813086') {
            if(msg.attachments.array().length == 0 || (!msg.attachments.array()[0].name.endsWith('.png') && !msg.attachments.array()[0].name.endsWith('.gif')) && !msg.attachments.array()[0].name.endsWith('.mp4') && !msg.attachments.array()[0].name.endsWith('.jpeg') && !msg.attachments.array()[0].name.endsWith('.jpg'))
                msg.delete()
                    .catch(err => console.log('selfy exeption', err))
            else
                msg.react('<a:__:819566414368473098>')
        }
    }
})