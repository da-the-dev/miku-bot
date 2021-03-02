const Discord = require('discord.js')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .p
    */
    async (args, msg, client) => {
        // Parse roles
        var parsedRoles = []
        msg.member.roles.cache.forEach(r => {
            if(r.id != msg.guild.id)
                parsedRoles += `<@&${r.id}> `
        })

        // Activities
        var act = ""
        var actNumber = msg.member.user.presence.activities.length
        if(actNumber == 0)
            act = "-"

        msg.member.user.presence.activities.forEach(a => {
            if(a.type == "CUSTOM_STATUS") {
                act += a.state + '\n'
            } else {
                var type = a.type.toString()
                switch(type) {
                    case 'PLAYING':
                        type = 'Играет в'
                        break
                    case 'STREAMING':
                        type = 'Стримит'
                        break
                    case 'LISTENING':
                        type = 'Слушает'
                        break
                    case 'WATCHING':
                        type = 'Смотрит'
                        break
                    case 'COMPETING':
                        type = 'Соревнуется'
                        break
                }
                act += type + ' ' + a.name + '\n'
            }
        })
        var nickname = msg.member.nickname
        if(!nickname)
            nickname = msg.member.user.username
        var embed = new Discord.MessageEmbed()
            .setAuthor(`Информация о ${nickname}`, 'https://cdn.discordapp.com/attachments/810255515854569472/813821208670765057/photodraw.ru-35920.png')
            // .setDescription(`Информация о ${msg.member.user.tag}`)
            .addFields([
                {
                    name: "Полное имя",
                    value: msg.member.user.tag,
                    inline: true
                },
                {
                    "name": "ID пользователя",
                    "value": msg.member.user.id,
                    "inline": true
                },
                {
                    "name": "Присоединился к серверу",
                    "value": msg.member.joinedAt.getDate().toString().padStart(2, '0') + '.' + msg.member.joinedAt.getMonth().toString().padStart(2, '0') + '.' + msg.member.joinedAt.getFullYear().toString().slice(2),
                    "inline": true
                },
                {
                    "name": "Аккаунт создан",
                    "value": msg.member.user.createdAt.getDate().toString().padStart(2, '0') + '.' + msg.member.user.createdAt.getMonth().toString().padStart(2, '0') + '.' + msg.member.user.createdAt.getFullYear().toString().slice(2),
                    "inline": true
                },
                {
                    "name": "Последнее сообщение",
                    "value": msg.member.lastMessage,
                    "inline": true
                },
                {
                    "name": `Активности (${actNumber})`,
                    "value": act,
                    "inline": true
                },
                {
                    "name": "⠀",
                    "value": `**Список ролей:** ${parsedRoles}`,
                    "inline": false
                }
            ])
            .setColor('#2F3136')
            .setFooter(`Запросил(-а) ${msg.member.user.tag}`, msg.member.user.avatarURL())
        msg.channel.send(embed)
        // console.log(msg.member.user.presence)
    }
// {
//     "author": {
//         "name": "Информация о r8d#0001",
//             "icon_url": "https://cdn.discordapp.com/attachments/810255515854569472/813821208670765057/photodraw.ru-35920.png"
//     },
//     "color": 3092790,
//         "footer": {
//         "text": "Запросил(-а) r8d#0001",
//             "icon_url": "https://cdn.discordapp.com/avatars/793038961588961300/a_71a7c0a89df91db5267c8262ff988747.gif?size=2048"
//     },
//     "fields": [
//         {
//             "name": "Полное имя",
//             "value": "r8d#0001",
//             "inline": true
//         },
//         {
//             "name": "ID пользователя",
//             "value": "793038961588961300",
//             "inline": true
//         },
//         {
//             "name": "Присоединился к серверу",
//             "value": "15.02.21",
//             "inline": true
//         },
//         {
//             "name": "Аккаунт создан",
//             "value": "28.12.20",
//             "inline": true
//         },
//         {
//             "name": "Последнее сообщение",
//             "value": ".p",
//             "inline": true
//         },
//         {
//             "name": "Активности (1)",
//             "value": "Слушает Spotify",
//             "inline": true
//         },
//         {
//             "name": "⠀",
//             "value": "Список ролей: @𝚛𝚘𝚝𝚝𝚎𝚗 𝚒𝚗𝚜𝚒𝚍𝚎 @Ⲙⲓ𝓵ⲕⲩ Ⲱⲁⲩ @verify.",
//             "inline": false
//         }
//     ]
// }