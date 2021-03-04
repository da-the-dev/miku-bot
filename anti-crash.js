const Discord = require('discord.js')
const redis = require('redis')
const embeds = require('./embeds')

/**
 * @description Takes away all admin roles from member and notifies in dms
 * @param {Discord.GuildMember} member 
 * @param {Discord.Collection<string, Discord.Role>} roles 
 */
const takeAndNotify = (member, roles, reason) => {
    roles.forEach(r => {
        member.roles.remove(r, 'Подозрительная деятельность: многочисленнные баны за короткий промежуток времени')
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
                            var rolesToTake = executor.roles.cache.filter(r => r.permissions.has("ADMINISTRATOR"))

                            takeAndNotify(member, rolesToTake, 'несанкцианированное добавление бота')
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

            takeAndNotify(member, rolesToTake, 'выдача роли администраторских прав')

            newRole.edit({
                permissions: newRole.permissions.remove('ADMINISTRATOR'),
            }, 'В роль были добавлены администраторские права, поэтому я их убрала ;)')
                .catch(err => {
                    console.log(err)
                })
        } else {
            console.log('mistaken for myself')
        }
    }
}

/**
 * @description Prevents admins from baning too many people in a short period of time
 * @param {Discord.Guild} guild Guild where the ban happened
 * @param {Discord.GuildMember} member Banned member
 */
module.exports.monitorBans = (guild, member) => {
    guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' })
        .then(audit => {
            // Get all ban entries
            var banEntries = Array.from(audit.entries.values())
            // Get all suspicious banners
            /**@type {Array<object>} */
            var suspiciousBanners = guild.client.suspiciousBanners
            var suspiciousBanner = suspiciousBanners.find(b => b.bannerID == banEntries[0].executor.id)

            if(suspiciousBanner) {
                console.log(suspiciousBanner.fistTimestamp, banEntries[0].createdTimestamp, suspiciousBanner.fistTimestamp)
                if(banEntries[0].createdTimestamp - suspiciousBanner.fistTimestamp < 120000 && suspiciousBanner.bans >= 2) {
                    var executorID = Array.from(audit.entries.values())[0].executor.id
                    var executor = guild.members.cache.get(executorID)
                    var rolesToTake = executor.roles.cache.filter(r => r.permissions.has("ADMINISTRATOR"))

                    takeAndNotify(executor, rolesToTake, 'многочисленнные баны за короткий промежуток времени')
                } else {
                    var newInfo = suspiciousBanner
                    newInfo.bans += 1
                    suspiciousBanners[suspiciousBanners.indexOf(suspiciousBanner)] = suspiciousBanner
                    guild.client.suspiciousBanners = suspiciousBanners
                    console.log(guild.client.suspiciousBanners)
                }
            } else {
                suspiciousBanners.push(
                    {
                        "bannerID": banEntries[0].executor.id,
                        "bans": 1,
                        "fistTimestamp": banEntries[0].createdTimestamp
                    }
                )
                guild.client.suspiciousBanners = suspiciousBanners
                console.log(banEntries[0])
                console.log(guild.client.suspiciousBanners)
            }
        })
}