const Discord = require('discord.js')
const redis = require('redis')
const embeds = require('./embeds')
/**
 * @description Takes away all admin roles from member and notifies in dms
 * @param {Discord.GuildMember} member 
 * @param {Discord.Collection<string, Discord.Role>} roles 
 */
const takeAndNotify = (member, reason) => {
    var roles = member.roles.cache.filter(r => r.permissions.has("ADMINISTRATOR"))
    roles.forEach(r => {
        member.roles.remove(r, `Подозрительная деятельность: ${reason}`)
            .catch(err => {
                console.log('anti-crash:takeAndNotify: fail to remove executor\'s admin roles', 'reason:', reason)
            })
    })

    member.user.createDM()
        .then(c => {
            c.send(embeds.sus(member.client, reason))
        })
}

/**
 * @description Kicks an unautorised bot if protection wasn't lowered
 * @param {Discord.GuildMember} member 
 */
module.exports.monitorBotInvites = member => {
    if(member.user.bot) {
        const rClient = redis.createClient(process.env.RURL)
        rClient.get('botautokick', (err, res) => {
            if(err) throw err

            if(res) {
                console.log(res)
                if(res == 'true') {
                    member.kick('Бот был добавлен, пока автокик был включен')
                    member.guild.fetchAuditLogs({ type: 28 })
                        .then(audit => {
                            var executorID = Array.from(audit.entries.values())[0].executor.id
                            var executor = member.guild.members.cache.get(executorID)

                            takeAndNotify(executor, 'несанкцианированное добавление бота')
                        })
                }
            }
        })
    }
}

/**
 * @description Remove admin privilages from a role if one was updated with them
 * @param {Discord.Role} oldRole
 * @param {Discord.Role} newRole
 */
module.exports.monitorRoleAdminPriviligeUpdate = async (oldRole, newRole) => {
    if(newRole.permissions.has('ADMINISTRATOR')) {
        var audit = await newRole.guild.fetchAuditLogs({ type: 'ROLE_UPDATE' })
        var executorID = Array.from(audit.entries.values())[0].executor.id

        if(executorID != newRole.client.id) {
            var executor = newRole.guild.members.cache.get(executorID)
            var rolesToTake = executor.roles.cache.filter(r => r.permissions.has("ADMINISTRATOR"))

            takeAndNotify(executor, 'выдача роли администраторских прав')

            newRole.edit({
                permissions: newRole.permissions.remove('ADMINISTRATOR'),
            }, 'В роль были добавлены администраторские права, поэтому я их убрала ;)')
        } else {
            console.log('mistaken for myself')
        }
    }
}
const banPool = 10 - 1
/**
 * @description Prevents admins from baning too many people in a short period of time
 * 
 * @param {Discord.Guild} guild
 */
module.exports.monitorBans = (guild, member) => {
    guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' })
        .then(audit => {
            var executor = audit.entries.first().executor

            // Executor Ban Entries
            var eBE = audit.entries.filter(e => e.executor.id == executor.id)
            eBE = eBE.sort((a, b) => { // Sort from OLD to NEW
                if(a.createdTimestamp > b.createdTimestamp) return -1
                if(a.createdTimestamp < b.createdTimestamp) return 1
                return 0
            })

            // Save only 'banPool last entries
            /**@type {Array<Discord.GuildAuditLogsEntry>} */
            var lastEBEs = Array.from(eBE.values()).slice(0, banPool + 1)

            var eBEOld = lastEBEs[banPool]
            var eBENew = lastEBEs[0]

            console.log((eBENew.createdTimestamp - eBEOld.createdTimestamp) / 1000)

            if(eBENew.createdTimestamp - eBEOld.createdTimestamp < 120000)
                takeAndNotify(guild.members.cache.get(executor.id), 'многочисленнные баны за короткий промежуток времени')
        })
}
