const utl = require('../utility')
/**
* Check if the ID is the owner of the role
* @param {string} guildID - ID of the guild
* @param {string} id - ID of the member/user
* @param {string} roleID - ID of the role
* @returns {Promise<true>} True if is the owner, false otherwise
*/
module.exports.checkIfOwner = (guildID, id, roleID) => {
    return new Promise((resolve, reject) => {
        utl.db.createClient(process.env.MURL).then(db => {
            db.get(guildID, 'serverSettings').then(serverData => {

                // Doesnt have custom roles
                if(!serverData.customRoles.find(r => r.owner == id)) {
                    utl.embed(msg, 'У Вас нет кастомных ролей!')
                    db.close()
                    reject(false)
                }

                // Role isn't custom
                if(!serverData.customRoles.find(r => r.id == roleID)) {
                    utl.embed(msg, 'Эта роль не является кастомной!')
                    db.close()
                    reject(false)
                }

                // Role doesn't belong to the user
                if(!serverData.customRoles.find(r => r.id == roleID).owner == id) {
                    utl.embed(msg, 'Эта роль не Ваша!')
                    db.close()
                    reject(false)
                }

                db.close()
                resolve(true)
            })
        })
    })
}