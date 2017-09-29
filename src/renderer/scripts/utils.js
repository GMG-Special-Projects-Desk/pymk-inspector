const { runScrape } = require('./scrape')
const {updateDB} = require('../db')
const scheduler = require('node-schedule')
const storage = require('electron-storage')
const keytar = require('keytar')

const setCronJob = (cb) => {
  return scheduler.scheduleJob(`0 */22 * * * *`, cb)
}

const getConfig = () => {
  return storage.isPathExists('pymkinspector.json')
    .then(itDoes => {
      if (itDoes) {
        return storage
          .get('pymkinspector.json')
          .then((d) => {
            return d
          })
      } else {
        return {'username': ''}
      }
    })
}

const initBackgroundScrape = (dbPath) => {
  getConfig()
    .then((config) => {
      setCronJob(() => {
        const username = config.username
        console.log(`${Date.now()} - ${username}`)
        keytar.getPassword('pymkinspector', username)
          .then((password) => {
            const type = 'background'
            const cb = (results) => {
              console.log(results.dbPath)
              console.log(results.data.length)
              updateDB({dbPath: results.dbPath, data: results.data})
                .then((d) => { console.log('done') })
                .catch(err => { console.log(err) })
            }
            const config = {username, password, type, cb, dbPath}
            console.log(config)
            runScrape(config)
          })
      })
    })
}

module.exports = {
  initBackgroundScrape
}
