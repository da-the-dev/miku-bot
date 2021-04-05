const Discord = require('discord.js')
const { promisify } = require('util')
const constants = require('../constants.json')
const utl = require('../utility')
var reward = false
var currentTimeout = null
/**
 * 
 * @param {Discord.Message} msg
 * @param {Discord.Client} client 
 */
module.exports = async (msg, client) => {
    if(msg.channel.type == 'dm') {
        if(msg.content.length < 6) {

        }
        const rClient = require('redis').createClient(process.env.RURL)
        const get = promisify(rClient.get).bind(rClient)
        const set = promisify(rClient.set).bind(rClient)
        const del = promisify(rClient.del).bind(rClient)
        get('verify-' + msg.author.id)
            .then(async res => {
                console.log(res)
                if(res) {
                    if(msg.content == res) {
                        takeRole(client, msg.author.id)
                        del('verify-' + msg.author.id).then(() => rClient.quit())
                        msg.channel.messages.fetch()
                            .then(msgs => {
                                msgs.forEach(m => {
                                    if(m.author.id == client.user.id)
                                        m.delete()
                                })
                            })
                    }
                    else {
                        const captcha = await formCaptcha()
                        set('verify-' + msg.author.id, captcha.text).then(() => rClient.quit())
                        msg.channel.send(new Discord.MessageEmbed().setDescription('<:__:827599506928959519> **Неверно введена капча, генерирую новую** . . . ').setColor('#2F3136'))
                        msg.channel.send(captcha.obj)
                    }
                }
                rClient.quit()
            })
    }
}

/**
 * 
 * @param {Discord.Client} client 
 */
const takeRole = async (client, id) => {
    var member = await client.guilds.cache.first().members.fetch(id)
    console.log(member.user.username)
    await member.roles.remove(client.verify)
        .catch(err => console.log(err))

    console.log(`[VR] Verified user '${member.user.tag}'`)
    reward = true

    const emb = new Discord.MessageEmbed()
        .setDescription(`**Тепло приветствуем** ${member.user.username} <:__:827851416886312970>\nНадеемся, что тебе понравится у нас и ты останешься.\nЧтобы легче было ориентироваться, прочитай <#810202155079696414> <a:__:827590350083194930>`)
        .setImage("https://cdn.discordapp.com/attachments/826131659333042256/827862202488848394/00.gif")
        .setColor('#2F3136')
        .setFooter(`${member.user.username} • ${utl.embed.calculateTime(member)}`, member.user.avatarURL())

    client.guilds.cache.first().channels.cache.get(constants.channels.general).send(`<@${member.user.id}>`, { embed: emb })
        .then(m => {
            currentTimeout ? clearTimeout(currentTimeout) : null
            setTimeout(() => {
                reward = false
                m.delete()
                    .catch(e => { })
            }, 60000, m)
        })
}

/**
 * Return an array with text and message object with CAPTCHA
 */
const formCaptcha = async () => {
    const { createCanvas, loadImage, registerFont } = require('canvas')
    const path = require('path')
    const canvas = createCanvas(1920, 1080)
    const ctx = canvas.getContext('2d')

    const img = await loadImage(path.resolve(path.join('./', 'imgs', 'captcha.png')))
    ctx.drawImage(img, 0, 0, img.width, img.height)

    function makeid(length) {
        var result = '';
        var characters = '0123456789';
        var charactersLength = characters.length;
        for(var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    const text = makeid(4)
    const font = 'bold 150px "Sans"'
    const args = [text, img.width / 5 + 10, img.height / 2]

    ctx.fillStyle = '#e5b6de'
    ctx.font = font
    ctx.textAlign = 'center'
    ctx.fillText(...args)

    ctx.fillStyle = 'black'
    ctx.font = font
    ctx.textAlign = 'center'
    ctx.lineWidth = 2
    ctx.strokeText(...args)

    return {
        text: text,
        obj: { content: '<a:__:825834909146415135> **Напишите указанный код на картинке**', files: [canvas.toBuffer()] }
    }
}

/**
 * Leaves reaction on users' welcome messages
 * @param {Discord.Message} msg - Message to react to
 * @param {Discord.Client} client - Client to check for perms to react
 */
const welcomeWords = ['добр', 'прив', 'хай', 'welcome', 'hi', 'салам']
module.exports.welcomeReward = (msg, client) => {
    if(reward) {
        var c = msg.content.toLocaleLowerCase()

        if(welcomeWords.find(w => c.includes(w)))
            msg.react('<:__:824359401895886908>')
    }
}

/**
 * Marks new users for verification
 * @param {Discord.GuildMember} member
 */
module.exports.mark = async (member, client) => {
    await member.roles.add(constants.roles.verify)
    console.log(`[VR] Marked user '${member.user.username}'`)
    const captcha = await formCaptcha()
    member.send(captcha.obj)

    const rClient = require('redis').createClient(process.env.RURL)
    const set = promisify(rClient.set).bind(rClient)
    set('verify-' + member.id, captcha.text).then(() => rClient.quit())

}