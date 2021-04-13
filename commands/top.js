const Discord = require('discord.js')
const utl = require('../utility')

const topAmount = 5
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
     * @description Usage: .top
     */
    async (args, msg, client) => {
        utl.db.createClient(process.env.MURL).then(db => {
            db.getGuild('718537792195657798').then(async data => {
                db.close()

                data = data.filter(d => d.money)
                data.sort((a, b) => {
                    if(a.money > b.money) return -1
                    if(a.money < b.money) return 1
                    return 0
                })

                var embed = new Discord.MessageEmbed()
                    .setAuthor('Топ пользователей по балансу', 'https://media.discordapp.net/attachments/810255515854569472/813821208670765057/photodraw.ru-35920.png')
                    .setColor('#2F3136')
                    .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)}`, msg.author.avatarURL())

                var desciption = embed.description + '\n\n'
                var counter = 0

                for(i = 0; i < data.length; i++) {
                    if(counter < topAmount) {
                        var member = await msg.guild.members.fetch(data[counter].id)
                            .catch(() => { console.log('no member') })

                        if(member) {
                            var name = member.nickname ? member.nickname : member.user.username

                            embed.addField('\`#.⠀\`', `\`\`\`${counter + 1}.\`\`\``, true)
                            embed.addField("`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Ник⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`", `\`\`\`${name}\`\`\``, true)
                            embed.addField("`⠀⠀⠀⠀ Баланс⠀⠀⠀⠀ `", `\`\`\`${data[counter].money}\`\`\``, true)
                        }
                        counter++
                    }
                }
                msg.reply(embed)
            })
        })
    }
