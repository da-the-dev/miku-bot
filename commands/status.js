const Discord = require('discord.js')
const constants = require('../constants.json')
const utl = require('../utility')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .status <status>
    */
    (args, msg, client) => {
        args.shift()

        if(args.length <= 0) {
            utl.db.createClient(process.env.MURL).then(db => {
                db.update(msg.guild.id, msg.author.id, { $unset: { status: '' } })
                    .then(() => {
                        utl.embed(msg, 'Статус успешно удален')
                        db.close()
                    })
            })
            return
        }

        var state = args.join(' ')
        state = state.slice(0, state.length <= 60 ? state.length : 60)
        state = state.replace(/[\S]+(.com|.ru|.org|.net|.info)[\S]+/g, '')

        utl.db.createClient(process.env.MURL).then(db => {
            db.update(msg.guild.id, msg.author.id, { $set: { status: state } })
                .then(() => {
                    utl.embed(msg, 'Успешно установлен статус')
                    db.close()
                })
        })
    }