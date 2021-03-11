const Discord = require('discord.js')
const fs = require('fs')
const dotenv = require('dotenv').config()
const redis = require('redis')

const roles = require('./roles.json')
const embeds = require('./embeds')

const anticrash = require('./anti-crash')
const pRs = require('./privateRooms')
const moneyGet = require('./moneyGet')
const reactionHandler = require('./reactionHandler')
const reactions = require('./reactions')
const verify = require('./verify')

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
    const rClient = redis.createClient(process.env.RURL)
    rClient.get(member.id, (err, res) => {
        if(err) throw err
        if(res) {
            var userData = JSON.parse(res)

            if(userData.mute) // Mute if was muted prior to joining
                member.roles.add(roles.muted)
            if(userData.warns) // Add offeder role if was marked prior to joining
                member.roles.add(roles.offender)
        }
    })
    anticrash.monitorBotInvites(member)
    console.log('member add')
    verify.mark(member)
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
client.on('messageReactionAdd', async (reaction, user) => {
    if(reaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await reaction.fetch();
        } catch(error) {
            console.error('Something went wrong when fetching the message: ', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }

    const emojies = ['⬅️', '➡️']
    verify.verify(reaction, user)
    if(reaction.message.embeds[0].footer) {
        if(reaction.message.embeds[0].footer.text.includes('стр') && user.id != client.user.id) {
            var msg = reaction.message
            var footerUser = msg.embeds[0].footer.text.slice(0, msg.embeds[0].footer.text.indexOf('•') - 1)
            if(user.username != footerUser)
                return
            var footerURL = msg.embeds[0].footer.iconURL
            var footerPage = msg.embeds[0].footer.text.slice(msg.embeds[0].footer.text.indexOf('•'))
            // console.log(footerUser, footerPage)
            var index1 = footerPage.indexOf('1')

            if(reaction.emoji.name == '⬅️' && index1 == -1) { // Second page, flip to first
                var embed = new Discord.MessageEmbed()
                    .setColor('#2F3136')
                    .setFooter(`${footerUser} • стр 1/2`, footerURL)

                const rClient = require('redis').createClient(process.env.RURL)
                rClient.get('roles', (err, res) => {
                    if(err) throw err
                    if(res) {
                        /**@type {Array<object>} */
                        var rolesData = JSON.parse(res)
                        rolesData.sort((a, b) => {
                            if(a.pos > b.pos) return 1
                            if(a.pos < b.pos) return -1
                            return 0
                        })

                        var length = rolesData.slice(0, 9).length
                        for(i = 0; i < length; i++)
                            embed.addField(`⌗ ${rolesData[i].pos} — ${rolesData[i].price}<:__:813854413579354143>`, ` <@&${rolesData[i].id}>`, true)

                        rClient.quit()
                        msg.edit(embed)
                            .then(async m => {
                                await m.reactions.removeAll()
                                await m.react(emojies[1])
                            })
                    }
                })
                return
            }
            if(reaction.emoji.name == '➡️' && index1 != -1) { // First page, flip to second
                console.log('First page, flip to second')
                var embed = new Discord.MessageEmbed()
                    .setColor('#2F3136')
                    .setFooter(`${footerUser} • стр 2/2`, footerURL)

                const rClient = require('redis').createClient(process.env.RURL)
                rClient.get('roles', (err, res) => {
                    if(err) throw err
                    if(res) {
                        /**@type {Array<object>} */
                        var rolesData = JSON.parse(res)
                        rolesData.sort((a, b) => {
                            if(a.pos > b.pos) return 1
                            if(a.pos < b.pos) return -1
                            return 0
                        })

                        var length = rolesData.slice(9, 18).length + 9
                        for(i = 9; i < length; i++)
                            embed.addField(`⌗ ${rolesData[i].pos} — ${rolesData[i].price}<:__:813854413579354143>`, ` <@&${rolesData[i].id}>`, true)

                        rClient.quit()
                        msg.edit(embed)
                            .then(async m => {
                                await m.reactions.removeAll()
                                await m.react(emojies[0])
                            })
                    }
                })
                return
            }
        }
    }
})

client.once('ready', () => {
    console.log("miku online")

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
                    /**@type {Array<string>} */
                    var data = msg.split('-')
                    data.shift()
                    var guild = client.guilds.cache.find(c => c.name == "Hoteru")
                    var member = guild.members.cache.get(data[0])
                    const rClient = redis.createClient(process.env.RURL)
                    rClient.get(data[0], (err, res) => {
                        if(err) throw err
                        var userData = JSON.parse(res)
                        var channel = guild.channels.cache.get(userData.mute[0])
                        delete userData.mute

                        rClient.set(member.user.id, JSON.stringify(userData), err => { if(err) throw err })
                        rClient.quit()

                        channel.send(embeds.unmute(member, client))
                    })
                    member.roles.remove(roles.muted)
                }
            })
        })
    }
})

client.on('voiceStateUpdate', (oldState, newState) => {
    pRs.roomDeletion(oldState, newState, client)
    moneyGet.voiceActivity(oldState, newState)
})

client.on('message', msg => {
    // Bot commands
    if(!msg.author.bot) {
        moneyGet.chatActivity(msg)
        if(msg.content[0] == prefix) {
            var args = msg.content.slice(1).split(" ")

            // Regular commands
            for(i = 0; i < client.commands.length; i++) {
                var c = client.commands[i]
                if(c.name == args[0]) {
                    c.foo(args, msg, client)
                    msg.delete()
                        .catch(err => console.log('regular', err))
                    return
                }
            }

            // say exeption
            if(msg.content.startsWith(`${prefix}say`)) {
                client.commands.find(c => c.name == "say").foo(args, msg, client)
                msg.delete()
                    .catch(err => console.log('say exeption', err))
                return
            }

            // Reactions
            reactionHandler(args, msg, client)
        }
        // Selfy moderation
        if(msg.channel.id == '810876164960813086') {
            if(msg.attachments.array().length == 0 || (!msg.attachments.array()[0].name.endsWith('.png') && !msg.attachments.array()[0].name.endsWith('.gif')) && !msg.attachments.array()[0].name.endsWith('.mp4') && !msg.attachments.array()[0].name.endsWith('.jpeg') && !msg.attachments.array()[0].name.endsWith('.jpg'))
                msg.delete()
                    .catch(err => console.log('selfy exeption', err))
            else
                msg.react('<:__:810458743934156870>')
        }
    }
})