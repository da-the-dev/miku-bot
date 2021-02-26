const Discord = require('discord.js')
const fs = require('fs')
const dotenv = require('dotenv').config()

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