const Discord = require('discord.js')
const dotenv = require('dotenv').config()

const client = new Discord.Client()
client.login(process.env.BOTTOKEN)
client.once('ready', () => {
    console.log("client online")
})
client.on('message', msg => {
    // Bot commands

})