const Discord = require('discord.js')
const redis = require('redis')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .timely
    */
    (args, msg, client) => {
        const rClient = redis.createClient(process.env.RURL)

        rClient.get(msg.author.id, (err, res) => {
            if(err) console.log(err)
            if(res) {
                var userData = JSON.parse(res)
                if(userData.rewardTime) { // Check if user can collect the reward
                    if(msg.createdTimestamp - userData.rewardTime >= 12 * 60 * 60 * 1000) { // If 12+ hours passed since last reward collection
                        if(msg.createdTimestamp - userData.rewardTime < 24 * 60 * 60 * 1000) { // And less than 24 
                            var reward = 20 + userData.streak * 10
                            userData.money += reward
                            userData.streak += 1
                            if(userData.streak = 14)
                                userData.streak = 1
                            userData.rewardTime = msg.createdTimestamp
                            rClient.set(msg.author.id, JSON.stringify(userData), err => { if(err) console.log(err) })
                            rClient.quit()
                            utl.embed(msg, `Вы успешно получили свою награду в размере **${reward}**<:__:813854413579354143> `)
                        } else {
                            utl.embed(msg, 'Вы пришли слишком поздно! Ваша серия призов обнулена! Вы получаете **20**<:__:813854413579354143>')
                            userData.money += 20
                            userData.streak = 1
                            userData.rewardTime = msg.createdTimestamp
                            rClient.set(msg.author.id, JSON.stringify(userData), err => { if(err) console.log(err) })
                            rClient.quit()
                        }
                    } else {
                        var time = (12 * 60 * 60 * 1000 - (msg.createdAt - userData.rewardTime)) / 1000
                        var mmD = Math.floor(time / 60 / 60 / 24)
                        var mmH = Math.floor(time / 60 / 60) - (mmD * 24)
                        var mmM = Math.floor(time / 60) - (mmD * 60 * 24 + mmH * 60)
                        var mmS = Math.floor(time - (mmD * 60 * 60 * 24 + mmH * 60 * 60 + mmM * 60))
                        var muteMsg = ''

                        if(mmD) muteMsg += `**${mmD.toString()}**д `
                        if(mmH) muteMsg += `**${mmH.toString()}**ч `
                        if(mmM) muteMsg += `**${mmM.toString()}**мин `
                        if(mmS) muteMsg += `**${mmS.toString()}**сек `

                        utl.embed(msg, `Вы пришли слишком рано! Приходите через ${muteMsg}`)
                        rClient.quit()
                    }
                } else { // If user never used .timely, but has some data
                    userData.rewardTime = msg.createdTimestamp
                    if(!userData.money) userData.money = 20
                    else userData.money += 20
                    utl.embed(msg, `Вы успешно получили свою награду в размере **20**<:__:813854413579354143> `)
                    rClient.set(msg.author.id, JSON.stringify(userData), err => { if(err) console.log(err) })
                    rClient.quit()
                }
            } else { // If user has no user data
                utl.embed(msg, `Вы успешно получили свою награду в размере **20**<:__:813854413579354143> `)
                rClient.set(msg.author.id, JSON.stringify({ 'rewardTime': msg.createdTimestamp, 'money': 20, 'streak': 1 }), err => { if(err) console.log(err) })
                rClient.quit()
            }
        })
    }