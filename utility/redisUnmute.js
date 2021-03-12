const redis = require('redis')

/**
 * Listens to expired "mute" keys in database and unmutes members accordingly
 */
module.exports = () => {
    // Unmute muted
    const pub = redis.createClient(process.env.RURL)
    pub.send_command('config', ['set', 'notify-keyspace-events', 'Ex'], SubscribeExpired)
    function SubscribeExpired(e, r) {
        sub = redis.createClient(process.env.RURL)
        const expired_subKey = '__keyevent@0__:expired'
        sub.subscribe(expired_subKey, function() {
            console.log(' [i] Subscribed to "' + expired_subKey + '" event channel : ' + r)
            sub.on('message', function(chan, msg) {
                if(msg.startsWith('muted-')) {
                    /**@type {Array<string>} */
                    var data = msg.split('-')
                    data.shift()
                    var guild = client.guilds.cache.first()
                    var member = guild.members.cache.get(data[0])
                    const rClient = redis.createClient(process.env.RURL)
                    rClient.get(data[0], (err, res) => {
                        if(err) throw err
                        var userData = JSON.parse(res)
                        var channel = guild.channels.cache.get(userData.mute[0])
                        delete userData.mute

                        rClient.set(member.user.id, JSON.stringify(userData), err => { if(err) throw err })
                        rClient.quit()

                        channel.send(embeds.unmute(member, client))
                    })
                    member.roles.remove(constants.roles.muted)
                }
            })
        })
    }
}