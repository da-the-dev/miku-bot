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
                    "value": `Роли: ${parsedRoles}`,
                    "inline": false
                }
            ])
            .setColor('#2F3136')
            .setFooter(`Запросил(-а) ${msg.member.user.tag}`, msg.member.user.avatarURL())
        msg.channel.send(embed)
        // console.log(msg.member.user.presence)
    }