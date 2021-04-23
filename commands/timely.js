const Discord = require('discord.js')
const constants = require('../constants.json')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .timely
    */
    (args, msg, client) => {
        utl.db.createClient(process.env.MURL).then(db => {
            db.get(msg.guild.id, msg.author.id).then(userData => {
                if(userData) {
                    if(userData.rewardTime) { // Check if user can collect the reward
                        var diff = Math.floor((msg.createdTimestamp - userData.rewardTime) / 1000)
                        if(diff >= 12 * 60 * 60) { // If 12+ hours passed since last reward collection
                            if(msg.createdTimestamp - userData.rewardTime < 24 * 60 * 60 * 1000) { // And less than 24 
                                var reward = 20 + userData.streak * 10
                                userData.money += reward
                                userData.streak += 1
                                if(userData.streak = 14)
                                    userData.streak = 1
                                userData.rewardTime = msg.createdTimestamp
                                db.set(msg.guild.id, msg.author.id, userData).then(() => { db.close() })
                                utl.embed(msg, `Вы успешно получили свою награду в размере **${reward}**<${constants.emojies.sweet}> `)
                            } else {
                                var reward = 20 + userData.streak * 10
                                userData.rewardTime = msg.createdTimestamp
                                db.set(msg.guild.id, msg.author.id, userData).then(() => { db.close() })
                                utl.embed(msg, `Вы пришли слишком поздно! Вы получаете **${reward}**<${constants.emojies.sweet}>`)
                            }
                        } else {
                            var time = 12 * 60 - Math.floor(((msg.createdAt - userData.rewardTime) / 1000) / 60)

                            utl.embed(msg, `Вы пришли слишком рано! Приходите через ${utl.time.timeCalculator(time)}`)
                            db.close()
                        }
                    } else { // If user never used .timely, but has some data
                        userData.rewardTime = msg.createdTimestamp
                        userData.streak = 1
                        userData.money ? userData.money += 20 : userData.money = 20

                        utl.embed(msg, `Вы успешно получили свою награду в размере **20**<${constants.emojies.sweet}> `)
                        db.set(msg.guild.id, msg.author.id, userData).then(() => db.close())
                    }
                } else { // If user has no user data
                    utl.embed(msg, `Вы успешно получили свою награду в размере **20**<${constants.emojies.sweet}> `)
                    db.set(msg.guild.id, msg.author.id, { 'rewardTime': msg.createdTimestamp, 'money': 20, 'streak': 1 }).then(() => db.close())
                }
            })
        })
    }