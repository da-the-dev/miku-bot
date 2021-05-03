const Discord = require('discord.js')
const utl = require('../utility')
const sMsg = 'Экипировка роли'

/**
 * Equips a role
 * @param {Discord.GuildMember} member - Member who wants to equip a role
 * @param {number} index - Index of the role
 * @param {boolean} isCustom - If the role is custom
 * @param {Discord.Message} msg - Original message
 */
const equipRole = (member, index, isCustom, msg) => {
    utl.db.createClient(process.env.MURL).then(db => {
        db.get(member.guild.id, member.id).then(userData => {
            if(userData) {
                if((!userData.inv || userData.inv.length <= 0) && (!userData.customInv || userData.customInv <= 0)) {
                    utl.embed.ping(msg, sMsg, 'к сожалению, Ваш инвентарь пуст')
                    db.close()
                    return
                }

                var field = isCustom ? 'customInv' : 'inv'

                if(!userData[field][index - 1]) {
                    utl.embed.ping(msg, sMsg, 'у Вас нет такой роли!')
                    db.close()
                    return
                }

                member.roles.add(userData[field][index - 1])
                    .then(() => {
                        utl.embed(msg, sMsg, `Роль <@&${userData[field][index - 1]}> успешно надета`)
                        db.close()
                    })
            } else {
                utl.embed.ping(msg, sMsg, 'к сожалению, Ваш инвентарь пуст')
                db.close()
            }
        })
    })
}
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .equip <rolePos>
    */
    (args, msg, client) => {
        if(!args[1]) {
            utl.embed(msg, sMsg, 'Не указан индекс роли!!')
            return
        }
        console.log(args[1])
        if(!args[1].startsWith('c'))
            equipRole(msg.member, Number(args[1]), false, msg)
        else
            equipRole(msg.member, Number(args[1].slice(1)), true, msg)
    }

