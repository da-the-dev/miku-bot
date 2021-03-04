const Discord = require('discord.js')
const redis = require('redis')
const embeds = require('./embeds')
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
                            executor.roles.remove(executor.roles.cache.find(r => r.permissions.has("ADMINISTRATOR")), 'Подозрительная деятельность: несанкцианированное добавление бота')
                                .then(m => {
                                    m.user.createDM()
                                        .then(c => {
                                            c.send(embeds.susBotAdd(member.client))
                                        })
                                })
                                .catch(err => {
                                    console.log('catch here fail to take a role bot invite')
                                })
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
        await newRole.guild.fetchAuditLogs({ type: 'ROLE_UPDATE' })
            .then(audit => {
                var executorID = Array.from(audit.entries.values())[0].executor.id
                var executor = newRole.guild.members.cache.get(executorID)
                executor.roles.remove(executor.roles.cache.find(r => r.permissions.has("ADMINISTRATOR")), 'Подозрительная деятельность: выдача роли администраторских прав')
                    .then(m => {
                        m.user.createDM()
                            .then(c => {
                                c.send(embeds.susAdminPrivilages(newRole.client))
                            })
                    })
                    .catch(err => {
                        console.log('catch here')
                    })
            })

        newRole.edit({
            permissions: newRole.permissions.remove('ADMINISTRATOR'),
        }, 'В роль были добавлены администраторские права, поэтому я их убрала ;)')
            .catch(err => {
                console.log(err)
            })

    }
}

/**
 * @description Prevents admins from baning too many people in a short period of time
 * @param {Discord.Guild} guild
 * @param {Discord.GuildMember} member 
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
                if(banEntries[0].createdTimestamp - suspiciousBanner.lastestTimestamp < 120000 && suspiciousBanner.bans >= 4) {
                    console.log(suspiciousBanners[0].executor.id)
                } else {
                    var newInfo = suspiciousBanner
                    newInfo.bans += 1
                    suspiciousBanners.indexOf(suspiciousBanner) = suspiciousBanner
                }
            } else {
                suspiciousBanners
            }

            /*
            [
             {
                "bannerID": executor.id,
                "bans": 2,
                "latestTimestamp": 12345432
             }
            ]
            */
        })
}