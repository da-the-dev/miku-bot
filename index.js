const Discord = require('discord.js')
const fs = require('fs')
const dotenv = require('dotenv').config()
const redis = require('redis')

const roles = require('./roles.json')
const embeds = require('./embeds')

const anticrash = require('./anti-crash')
const pRs = require('./privateRooms')
const reactionHandler = require('./reactionHandler')
const reactions = require('./reactions')

// Client
const prefix = "$"
const client = new Discord.Client()
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
    const rClient = redis.createClient(process.env.RURL)
    rClient.get(member.id, (err, res) => {
        if(err)
            console.error(err)
        if(res) {
            var userData = JSON.parse(res)

            if(userData[member.guild.id].mute) // Mute if was muted prior to joining
                member.roles.add(roles.muted)
            if(userData[member.guild.id].warns) // Mute if was muted prior to joining
                member.roles.add(roles.offender)
        }
    })
    anticrash.monitorBotInvites(member)
})

client.on('roleUpdate', (oldRole, newRole) => {
    anticrash.monitorRoleAdminPriviligeUpdate(oldRole, newRole)
})
client.on('guildBanAdd', (guild, member) => {
    anticrash.monitorBans(guild, member)
})
client.on('guildMemberRemove', member => {
    anticrash.monitorKicks(member)
})

client.once('ready', () => {
    console.log("beta online")

    pRs.createRoom(client)

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
                    var guild = client.guilds.cache.get(data[1])
                    var member = guild.members.cache.get(data[0])

                    member.roles.remove(roles.muted)

                    const rClient = redis.createClient(process.env.RURL)
                    rClient.get(member.user.id, (err, res) => {
                        if(err)
                            console.error(err)
                        var userData = JSON.parse(res)
                        var channel = guild.channels.cache.get(userData[guild.id].mute)
                        delete userData[guild.id].mute

                        rClient.set(member.user.id, JSON.stringify(userData), err => {
                            if(err)
                                console.error(err)
                            rClient.quit()
                        })
                        rClient.quit()

                        channel.send(embeds.unmute(client, member))
                    })
                }
            })
        })
    }
})

client.on('voiceStateUpdate', (oldState, newState) => {
    pRs.roomDeletion(oldState, newState, client)
})

client.on('message', msg => {
    // Bot commands
    if(!msg.author.bot && msg.content[0] == prefix) {
        var args = msg.content.slice(1).split(" ")

        // Regular commands
        for(i = 0; i < client.commands.length; i++) {
            var c = client.commands[i]
            if(c.name == args[0]) {
                c.foo(args, msg, client)
                msg.delete()
                return
            }
        }

        // say exeption
        if(msg.content.startsWith(`${prefix}say`)) {
            client.commands.find(c => c.name == "say").foo(args, msg, client)
            msg.delete()
            return
        }

        // Reactions
        reactionHandler(args, msg, client)
    }
    // Selfy moderation
    if(msg.channel.id == '817329624228560937') {
        if(msg.attachments.array().length == 0 || (!msg.attachments.array()[0].name.endsWith('.png') && !msg.attachments.array()[0].name.endsWith('.gif')) && !msg.attachments.array()[0].name.endsWith('.mp4') && !msg.attachments.array()[0].name.endsWith('.jpeg') && !msg.attachments.array()[0].name.endsWith('.jpg'))
            msg.delete()
        else
            msg.react('👍')
    }
})