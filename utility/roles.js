const redis = require('redis')
const constants = require('../constants.json')
module.exports.reapplyRoles = (member) => {
    const rClient = redis.createClient(process.env.RURL)
    rClient.get(member.id, (err, res) => {
        if(err) throw err
        if(res) {
            var userData = JSON.parse(res)

            // Reapply roles
            if(userData.mute)
                member.roles.add(constants.roles.muted)
            if(userData.toxic)
                member.roles.add(constants.roles.toxic)
            if(userData.ban)
                member.roles.add(constants.roles.localban)
        }
    })
}