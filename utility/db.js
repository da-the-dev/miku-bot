const MongoClient = require('mongodb').MongoClient
class DB {
    /**@type {MongoClient} */
    __connection
    /**
     * Connect to DB
     * @param {string} url - URL to DB
     * @returns Return 'OK' if connected
     */
    connect = async (url) => {
        this.__connection = await new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true }).connect()
        return 'OK'
    }
    /**
     * Closes connection to current DB
     * @returns Returns 'OK' once disconnected
     */
    close = async () => {
        await this.__connection.close()
        return 'OK'
    }
    /**
     * Gets data about a key from a guild
     * @param {string} guildID - Guild ID
     * @param {string} uniqueID - Unique ID
     * @return {Promise<any>} Info about the key
     */
    get = (guildID, uniqueID) => {
        return new Promise((resolve, reject) => {
            if(!guildID) reject('No guild ID [get]!')
            if(!uniqueID) reject('No unique ID [get]!')

            var res = this.__connection.db('hoteru').collection(guildID).findOne({ id: uniqueID })
                .then(res => {
                    res ? (
                        res._id ? delete res._id : null,
                        res.id ? delete res.id : null
                    ) : null
                    resolve(res)
                })
        })
    }

    /**
     * Gets data about many keys from a guild
     * @param {string} guildID - Guild ID
     * @param {object} query - Query to use as a filter
     * @return {Promise<any>} Info about the keys
     */
    getMany(guildID, query) {
        return new Promise((resolve, reject) => {
            this.__connection.db('hoteru').collection(guildID).find(query).toArray()
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    /**
     * Updates data about many keys from a guild
     * @param {string} guildID - Guild ID
     * @param {object} filter - Query to use as a filter
     * @param {object} update - Query to update documents with
     * @return {Promise<any>} Info about the keys
     */
    updateMany(guildID, filter, update) {
        return new Promise((resolve, reject) => {
            this.__connection.db('hoteru').collection(guildID).updateMany(filter, update, { upsert: true })
                .then(() => resolve('OK'))
                .catch(err => reject(err))
        })
    }

    /**
     * Set data about a key from a guild
     * @param {string} guildID - Guild ID
     * @param {string} uniqueID - Unique ID
     * @param {object} data - Data to set
     * @returns {Promise<string>} Returns 'OK' if set succesfully
     */
    set = async (guildID, uniqueID, data) => {
        return new Promise((resolve, reject) => {
            if(!guildID) reject('No guild ID [set]!')
            if(!uniqueID) reject('No unique ID [set]!')
            if(!data) reject('No data to set [set]!')

            this.get(guildID, uniqueID).then(res => {
                const newData = { ...{ id: uniqueID }, ...data }
                if(res) {
                    this.__connection.db('hoteru').collection(guildID).findOneAndReplace({ id: uniqueID }, newData).then(() => {
                        resolve('OK')
                    })
                } else {
                    this.__connection.db('hoteru').collection(guildID).insertOne(newData).then(() => {
                        resolve('OK')
                    })
                }
            })
        })
    }

    /**
     * Update data about a key from a guild
     * @param {string} guildID - Guild ID
     * @param {string} uniqueID - Unique ID
     * @param {object} query - Queries to update
     * @returns {Promise<string>} Returns 'OK' if update succesfully
     */
    update(guildID, uniqueID, query) {
        return new Promise((resolve, reject) => {
            if(!guildID) reject('No guild ID [update]!')
            if(!uniqueID) reject('No unique ID [update]!')
            if(!query) reject('No query to update [update]!')

            this.__connection.db('hoteru').collection(guildID).updateOne({ id: uniqueID }, query, { upsert: true })
                .then(() => resolve('OK'))
                .catch(err => reject(err))
        })
    }

    /**
      * Gets data about a guild
      * @param {string} guildID - Guild ID
      * @returns {Promise<any[]>}
      */
    getGuild = (guildID) => {
        return new Promise(async (resolve, reject) => {
            if(!guildID) reject('No guild ID! [getGuild]')
            var cursor = this.__connection.db('hoteru').collection(guildID).find({})
            var data = []
            cursor.forEach(r => {
                let newR = r
                newR._id ? delete newR._id : null
                data.push(newR)
            }).then(() => {
                resolve(data)
            })
        })
    }

    /**
     * Deletes a document
     * * @param {string} guildID - Guild ID
     * @param {string} uniqueID - Unique ID
     * @return {Promise<string>} 'OK' if deleted succesfully 
     */
    delete = (guildID, uniqueID) => {
        return new Promise((resolve, reject) => {
            if(!guildID) reject('No guild ID [delete]!')
            if(!uniqueID) reject('No unique ID [delete]!')

            this.__connection.db('hoteru').collection(guildID).deleteOne({ id: uniqueID })
                .then(() => resolve('OK'))
                .catch(err => reject(err))
        })
    }
}

/**
 * Creates a connection to DB
 * @param {string} url - URL to DB
 * @returns {Promise<DB>}
 */
module.exports.createClient = (url) => {
    return new Promise((resolve, reject) => {
        var db = new DB()
        db.connect(url).then(() => resolve(db))
    })
}

module.exports.DB = DB