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
        var cachedRoles = msg.member.roles.cache
        cachedRoles.sort((a, b) => {
            if(b.position > a.position) return 1
            if(b.position < a.position) return -1
            return 0
        })
        cachedRoles.forEach(r => {
            if(r.id != msg.guild.id)
                parsedRoles += `<@&${r.id}> `
        })

        // Activities
        var act = ""
        var actNumber = msg.author.presence.activities.length
        if(actNumber == 0)
            act = "-"

        msg.author.presence.activities.forEach(a => {
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
            nickname = msg.author.username
        var embed = new Discord.MessageEmbed()
            .setAuthor(`Информация о ${nickname}`, 'https://cdn.discordapp.com/attachments/810255515854569472/813821208670765057/photodraw.ru-35920.png')
            .addFields([
                {
                    name: "Полное имя",
                    value: msg.author.tag,
                    inline: true
                },
                {
                    "name": "ID пользователя",
                    "value": msg.author.id,
                    "inline": true
                },
                {
                    "name": "Присоединился к серверу",
                    "value": msg.member.joinedAt.getDate().toString().padStart(2, '0') + '.' + msg.member.joinedAt.getMonth().toString().padStart(2, '0') + '.' + msg.member.joinedAt.getFullYear().toString().slice(2),
                    "inline": true
                },
                {
                    "name": "Аккаунт создан",
                    "value": msg.author.createdAt.getDate().toString().padStart(2, '0') + '.' + msg.author.createdAt.getMonth().toString().padStart(2, '0') + '.' + msg.author.createdAt.getFullYear().toString().slice(2),
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
                    "value": `Роли: ${parsedRoles}`,
                    "inline": false
                }
            ])
            .setColor('#2F3136')
            .setFooter(`Запросил(-а) ${msg.author.tag}`, msg.author.avatarURL())
        msg.channel.send(embed)
        // console.log(msg.author.presence)
    }