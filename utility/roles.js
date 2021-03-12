const redis = require('redis')
const constants = require('../constants.json')
module.exports.reapplyRoles = () => {
    const rClient = redis.createClient(process.env.RURL)
    rClient.get(member.id, (err, res) => {
        if(err) throw err
        if(res) {
            var userData = JSON.parse(res)

            if(userData.mute) // Mute if was muted prior to joining
                member.roles.add(constants.roles.muted)
            // if(userData.warns) // Add offeder role if was marked prior to joining
            //     member.roles.add(constants.roles.offender)
        }
    })
}