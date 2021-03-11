const Discord = require('discord.js')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .profile
    */
    async (args, msg, client) => {
        // Member to get the profile of
        var pMember = msg.member
        var mMember = msg.mentions.members.first()
        if(mMember)
            pMember = mMember

        // Parse roles
        var parsedRoles = []
        var cachedRoles = pMember.roles.cache
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
        var actNumber = pMember.user.presence.activities.length
        if(actNumber == 0)
            act = "-"

        pMember.user.presence.activities.forEach(a => {
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

        // Getting the nickname
        var nickname = pMember.nickname
        if(!nickname)
            nickname = pMember.user.username

        // Constructing the embed
        var embed = new Discord.MessageEmbed()
            .setAuthor(`Информация о ${nickname}`, 'https://cdn.discordapp.com/attachments/810255515854569472/813821208670765057/photodraw.ru-35920.png')
            .addFields([
                {
                    name: "Полное имя",
                    value: pMember.user.tag,
                    inline: true
                },
                {
                    "name": "ID пользователя",
                    "value": pMember.user.id,
                    "inline": true
                },
                {
                    "name": "Присоединился к серверу",
                    "value": pMember.joinedAt.getDate().toString().padStart(2, '0') + '.' + pMember.joinedAt.getMonth().toString().padStart(2, '0') + '.' + pMember.joinedAt.getFullYear().toString().slice(2),
                    "inline": true
                },
                {
                    "name": "Аккаунт создан",
                    "value": pMember.user.createdAt.getDate().toString().padStart(2, '0') + '.' + pMember.user.createdAt.getMonth().toString().padStart(2, '0') + '.' + pMember.user.createdAt.getFullYear().toString().slice(2),
                    "inline": true
                },
                {
                    "name": "Последнее сообщение",
                    "value": pMember.lastMessage,
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
    }