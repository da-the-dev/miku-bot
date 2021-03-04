const Discord = require('discord.js')
const redis = require('redis')
const redisScan = require('node-redis-scan')
const schedule = require('node-schedule')

/**
 * @description Give every avalible member money 
 * @param {Discord.Client} client
 * */
module.exports.daylyAward = (client) => {
    // schedule.scheduleJob('0 0 * * *', () => {
    console.log('scaning...')
    const rClient = redis.createClient(process.env.RURL)
    const scanner = new redisScan(rClient)

    // For those who "ARE" in the database already
    scanner.scan('*', (err, keys) => {
        if(err)
            console.error(err)

        rClient.mget(keys, (err, res) => {
            if(err) throw err
            if(res) {
                var bigData = new Map()

                for(i = 0; i < keys.length; i++)
                    bigData.set(keys[i], JSON.parse(res[i]))

                keys.forEach(k => {
                    var userData = Object.entries(bigData.get(k))
                    for(j = 0; j < userData.length; j++) {
                        if(userData[j][1].money)
                            userData[j][1].money += 60
                        else
                            userData[j][1].money = 60
                    }
                    bigData.set(k, Object.fromEntries(userData))
                })

                var sendArray = []
                Array.from(bigData.entries()).forEach(e => {
                    sendArray.push(e[0])
                    sendArray.push(JSON.stringify(e[1]))
                })

                // Updating database values
                rClient.mset(sendArray, (err, rep) => {
                    if(err) throw err
                    console.log(rep)
                })

                bigData = new Map() // Empty the map so it doesnt consume the 
                // For those who "ARE NOT" in the database
                rClient.quit()
            }
        })
    })
    // })
}