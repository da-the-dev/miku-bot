const Discord = require(`discord.js`)
const constants = require(`../constants.json`)
const utl = require(`../utility`)
const sMsg = `Приватные комнаты`

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .vban <member> 
    */
    async (args, msg, client) => {
        if(msg.member.voice.channel.parentID != constants.categories.privateRooms)
            return

        if(!msg.member.permissionsIn(msg.member.voice.channel).has(`CREATE_INSTANT_INVITE`)) {
            utl.embed(msg, sMsg, `<@${msg.author.id}>, у Вас нет прав на эту команду!`)
            return
        }

        /**@type {Discord.VoiceChannel} */
        var room = msg.member.voice.channel

        if(!room) {
            utl.embed(msg, sMsg, `<@${msg.author.id}>, у Вас нет приватной комнаты!`)
            return
        }

        var mMember = msg.mentions.members.first()

        if(mMember) {
            room.createOverwrite(mMember.id, {
                "CONNECT": false
            })
            room.members.forEach(m => {
                if(m.id == mMember.id)
                    m.voice.setChannel(null)
            })
            utl.embed(msg, sMsg, `<@${msg.author.id}>, Вы **закрыли доступ** в комнату <@${mMember.user.id}>`)
        } else
            utl.embed(msg, sMsg, `<@${msg.author.id}>, Вы не указали пользователя!`)
    }