const redis = require('redis')
module.exports.expire = callback => {
    const SubscribeExpired = (e, r) => {
        sub = redis.createClient(process.env.RURL)
        sub.subscribe('__keyevent@0__:expired', () => {
            sub.on('message', function(chan, msg) {
                callback(msg)
            })
        })
    }

    // Activate expire monitoring



}