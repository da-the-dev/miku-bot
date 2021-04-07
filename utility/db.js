const MongoClient = require('mongodb').MongoClient;

class db {
    /**@type {MongoClient} */
    static __connection
    /**
     * Connect to DB
     * @param {string} url - URL to DB
     * @returns Return 'OK' if connected
     */
    static connect = async (url) => {
        db.__connection = await new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true }).connect()
        return 'OK'
    }

    static close = async () => {
        await db.__connection.close()
        return 'OK'
    }
    /**
     * Gets data about a user from a guild
     * @param {string} guildID - Guild ID
     * @param {string} userID - User ID
     */
    static get = async (guildID, userID) => {
        if(!guildID) throw new Error('No guild ID!')
        if(!userID) throw new Error('No user ID!')

        var res = await db.__connection.db('hoteru').collection(guildID).findOne({ id: userID })
        res ? (
            res._id ? delete res._id : null,
            res.id ? delete res.id : null
        ) : null
        return res
    }
    /**
     * Set data about a user from a guild
     * @param {string} guildID - Guild ID
     * @param {string} userID - User ID
     * @param {object} data - Data to set
     */
    static set = async (guildID, userID, data) => {
        if(!guildID) throw new Error('No guild ID!')
        if(!userID) throw new Error('No user ID!')
        if(!data) throw new Error('No data to set!')

        const res = await db.get(guildID, userID)
        const newData = { ...{ id: userID }, ...data }
        if(res) {
            await db.__connection.db('hoteru').collection(guildID).findOneAndReplace({ id: userID }, newData)
        } else {
            await db.__connection.db('hoteru').collection(guildID).insertOne({ id: userID }, newData)
        }

        return 'OK'
    }

    /**
     * Set data about a user from a guild
     * @param {string} guildID - Guild ID
     * @param {string} userID - User ID
     * @param {object} data - Data to set
     */
    static insertMany = async (guildID, userID, data) => {
        if(!guildID) throw new Error('No guild ID!')
        if(!userID) throw new Error('No user ID!')
        if(!data) throw new Error('No data to set!')

        const res = await db.get(guildID, userID)
        const newData = { ...{ id: userID }, ...data }
        if(res) {
            await db.__connection.db('hoteru').collection(guildID).findOneAndReplace({ id: userID }, newData)
        } else {
            await db.__connection.db('hoteru').collection(guildID).insertOne({ id: userID }, newData)
        }

        return 'OK'
    }

    static update = async (guildID, userID, field, data) => {
        if(!guildID) throw new Error('No guild ID!')
        if(!userID) throw new Error('No user ID!')
        if(!field) throw new Error('No filed to update!')
        if(!data) throw new Error('No data to set!')

        const res = await db.get(guildID, userID)

        if(res) {
            res[field] = data
        } else {
            throw new Error('No data found')
        }
        await db.set(guildID, userID, res)
        return 'OK'
    }
}

module.exports = db