const { runScrape } = require('./scrape')
const scheduler = require('node-schedule')
const storage = require('electron-storage')
const keytar = require('keytar')

const setCronJob = (cb) => {
  return scheduler.scheduleJob(`0 */12 * * * *`, cb)
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

const initBackgroundScrape = (dbPath, cb) => {
  getConfig()
    .then((config) => {
      setCronJob(() => {
        const username = config.username
        console.log(`${Date.now()} - ${username}`)
        keytar.getPassword('pymkinspector', username)
          .then((password) => {
            const type = 'background'
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
