const Discord = require('discord.js')
const utl = require('../utility')

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .profile
    */
    (args, msg, client) => {
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

        // Account creation date
        var createDate = new Date(pMember.user.createdAt.toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
        var joinedDate = new Date(pMember.joinedAt.toLocaleString("en-US", { timeZone: "Europe/Moscow" }))

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
                    "value": joinedDate.getDate().toString().padStart(2, '0') + '.' + joinedDate.getMonth().toString().padStart(2, '0') + '.' + joinedDate.getFullYear().toString(),
                    "inline": true
                },
                {
                    "name": "Аккаунт создан",
                    "value": createDate.getDate().toString().padStart(2, '0') + '.' + createDate.getMonth().toString().padStart(2, '0') + '.' + createDate.getFullYear().toString(),
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
            .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)}`, msg.author.avatarURL())

        msg.channel.send(embed)
    }