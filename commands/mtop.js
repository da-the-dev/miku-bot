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
     * @description Usage: .mtop
     */
    async (args, msg, client) => {
        const rClient = redis.createClient(process.env.RURL)
        const util = require('util')
        const scaner = new redisScan(rClient)
        const scan = util.promisify(scaner.scan).bind(scaner)
        const mget = util.promisify(rClient.mget).bind(rClient)
        const get = util.promisify(rClient.get).bind(rClient)

        var bigData = new Map()
        /**@type {Array<string>} */

        get('day')
            .then(async res => {
                bigData = new Map(JSON.parse(res))

                bigData = new Map([...bigData.entries()].sort((a, b) => {
                    if(a[1] > b[1]) return -1
                    if(a[1] < b[1]) return 1
                    return 0
                }))

                var embed = new Discord.MessageEmbed()
                    .setAuthor('Топ пользователей по текстовому активу', 'https://media.discordapp.net/attachments/810255515854569472/813821208670765057/photodraw.ru-35920.png')
                    .setColor('#2F3136')
                    .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)}`, msg.author.avatarURL())


                var bKeys = Array.from(bigData.keys())
                var bValues = Array.from(bigData.values())

                var counter = 0

                for(i = 0; i < bKeys.length; i++) {
                    if(counter < topAmount) {
                        console.log(bKeys[counter])
                        var member = await msg.guild.members.fetch(bKeys[counter])
                            .catch(() => { console.log('no member') })

                        if(member) {
                            var name = member.nickname ? member.nickname : member.user.username

                            embed.addField('\`#.⠀\`', `\`\`\`${counter + 1}.\`\`\``, true)
                            embed.addField("`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Ник⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`", `\`\`\`${name}\`\`\``, true)
                            embed.addField("`⠀⠀⠀⠀ Кол-во сообщений⠀⠀⠀⠀ `", `\`\`\`${bValues[counter]}\`\`\``, true)
                        }
                        counter++
                    }
                }

                msg.reply(embed)
                rClient.quit()
            })
    }
