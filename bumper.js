const Discord = require('discord.js')
const dotenv = require('dotenv')
dotenv.config()

var bumpers = Array()

const tokens = [process.env.TOKEN1, process.env.TOKEN2, process.env.TOKEN3]

const init = async () => {
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
}

init()