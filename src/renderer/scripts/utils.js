const { runScrape } = require('./scrape')
const scheduler = require('node-schedule')
const storage = require('electron-storage')
const keytar = require('keytar')

const setCronJob = (freq, cb) => {
  return scheduler.scheduleJob(`0 0 */${freq} * * *`, cb)
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
      const frequency = config.frequency
      console.log(`Setting cron to every ${frequency} hours`)
      setCronJob(frequency, () => {
        const username = config.username
        console.log(`${Date.now()} - ${username}`)
        keytar.getPassword('pymkinspector', username)
          .then((password) => {
            const type = 'background'
            const config = {username, password, type, cb, dbPath}
            runScrape(config)
          })
      })
    })
}

module.exports = {
  initBackgroundScrape
}
