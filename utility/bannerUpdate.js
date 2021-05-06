const Discord = require('discord.js')

/**
 * Updated the banner every hour
 * @param {Discord.Guild} guild
 */
module.exports.updateBanner = async guild => {
    const { createCanvas, loadImage, registerFont } = require('canvas')
    const path = require('path')

    const img = await loadImage(path.resolve(path.join('./', 'imgs', 'banner.png')))
    const canvas = createCanvas(img.width, img.height)

    const ctx = canvas.getContext('2d')

    ctx.drawImage(img, 0, 0, img.width, img.height)

    var members = 0
    guild.channels.cache.filter(c => c.type == 'voice')
        .forEach(c => {
            members += c.members.size
        })
    const text = members.toString()
    const font = 'bold 25px "Sans"'
    const args = [text, img.width / 2, img.height - 21]

    ctx.fillStyle = '#ffffff'
    ctx.font = font
    ctx.textAlign = 'left'
    ctx.fillText(...args)

    guild.setBanner(canvas.toBuffer())
        .then(() => console.log('set banner'))
}

/**
 * Updated the banner every hour
 * @param {Discord.Guild} guild 
 */
module.exports = (guild) => {
    updateBanner(guild)
    setInterval((guild) => {
        updateBanner(guild)
    }, 60 * 1000, guild)
}