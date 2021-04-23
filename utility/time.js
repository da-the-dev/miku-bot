/**
 * 
 * @param {number} time - Time in minutes
 * @returns 
 */
module.exports.timeCalculator = (time) => {
    var mmD = Math.floor(time / 24 / 60)
    var mmH = Math.floor(time / 60) - (mmD * 24)
    var mmM = Math.floor(time) - (mmD * 60 * 24 + mmH * 60)
    var msg = ''

    if(mmD) msg += `**${mmD.toString()}**d `
    if(mmH) msg += `**${mmH.toString()}**h `
    if(mmM) msg += `**${mmM.toString()}**m`

    return msg
}