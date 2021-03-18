const Discord = require('discord.js')
const utl = require('../utility')
const constants = require('../constants.json')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
     * @description Usage: .test <args>
     */
    async (args, msg, client) => {
        const Fetcher = require('discord-fetch-messages')
        if(msg.author.id == process.env.MYID) {
            const fetcher = new Fetcher.Fetcher(client);

            fetcher.on('fetchChannel', async channel => {
                console.log(`Fetching <#${channel.id}>.`);
            });

            // await fetcher.fetchGuild(guildID);
            console.log((await fetcher.fetchChannel(msg.channel)).array().length)
        }
    }

module.exports.allowedInGeneral = true