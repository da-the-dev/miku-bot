const Discord = require('discord.js')
const redis = require('redis')
const utl = require('../utility')
const redisScan = require('node-redis-scan')

const topAmount = 5
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
     * @description Usage: .ttop
     */
    async (args, msg, client) => {
        const rClient = redis.createClient(process.env.RURL)
        const util = require('util')
        const scaner = new redisScan(rClient)
        const scan = util.promisify(scaner.scan).bind(scaner)
        const mget = util.promisify(rClient.mget).bind(rClient)

        var bigData = new Map()
        /**@type {Array<string>} */
        scan('*')
            .then(keys => {
                mget(keys)
                    .then(data => {
                        for(i = 0; i < keys.length; i++) {
                            if(JSON.parse(data[i]).voiceTime)
                                bigData.set(keys[i], JSON.parse(data[i]).voiceTime)
                        }
                        console.log(bigData)
                        bigData = new Map([...bigData.entries()].sort((a, b) => {
                            if(a[1] > b[1]) return -1
                            if(a[1] < b[1]) return 1
                            return 0
                        }))

                        bigData = new Map(Array.from([...bigData]).slice(0, topAmount))

                        var embed = new Discord.MessageEmbed()
                            .setAuthor('Топ пользователей по голосовому онлайну', 'https://media.discordapp.net/attachments/810255515854569472/813821208670765057/photodraw.ru-35920.png')
                            .setColor('#2F3136')
                            .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)}`, msg.author.avatarURL())

                        var bKeys = Array.from(bigData.keys())
                        var bValues = Array.from(bigData.values())

                        console.log(bKeys, bValues)

                        var desciption = embed.description + '\n\n'
                        var counter = 0
                        var successCounter = 0

                        while(successCounter < topAmount) {
                            var member = msg.guild.members.cache.get(bKeys[counter])
                            if(member) {
                                var name = member.nickname ? member.nickname : member.user.username

                                var time = bValues[counter] // Minutes
                                console.log(time)
                                var mmD = Math.floor(time / 24 / 60)
                                var mmH = Math.floor(time / 60) - (mmD * 24)
                                var mmM = Math.floor(time) - (mmD * 60 * 24 + mmH * 60)
                                var muteMsg = ''

                                if(mmD) muteMsg += mmD.toString() + "d "
                                if(mmH) muteMsg += mmH.toString() + "h "
                                if(mmM) muteMsg += mmM.toString() + "m "

                                embed.addField('\`#.⠀\`', `\`\`\`${successCounter + 1}.\`\`\``, true)
                                embed.addField("`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Ник⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`", `\`\`\`${name}\`\`\``, true)
                                embed.addField("`⠀⠀⠀⠀ Время⠀⠀⠀⠀ `", `\`\`\`${muteMsg}\`\`\``, true)
                                successCounter++
                            }
                            counter++
                        }

                        msg.reply(embed)
                        rClient.quit()
                    })
            })
    }
