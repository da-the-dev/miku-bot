// const dotenv = require('dotenv').config()
// const newRClient = require('redis').createClient(process.env.RURL)
// const oldRClient = require('redis').createClient(process.env.OLDRURL)
// var bigData = []

// // oldRClient.keys('*', (err, res) => {
// //     if(err) throw err
// //     if(res) {
// //         var keys = res
// //         oldRClient.mget(keys, (eerr, rres) => {
// //             if(eerr) throw eerr
// //             if(rres) {
// //                 for(i = 0; i < keys.length; i++) {
// //                     bigData.push(keys[i])
// //                     bigData.push(rres[i])
// //                 }
// //                 console.log(bigData)
// //                 newRClient.mset(bigData, (err, res) => {
// //                     console.log('setting...')
// //                     if(err) throw err
// //                     if(res) console.log(res)
// //                     oldRClient.quit()
// //                     newRClient.quit()
// //                 })
// //             }
// //         })
// //     }
// // })

// newRClient.keys('*', (err, res) => {
//     if(err) throw err
//     console.log(res)
// })

// newRClient.get('botautokick', (err, res) => {
//     if(err) throw err
//     console.log(res)
// })