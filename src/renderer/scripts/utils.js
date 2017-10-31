const { runScrape } = require('./scrape')
const scheduler = require('node-schedule')
const storage = require('electron-storage')
const keytar = require('keytar')
const moment = require('moment')
const setCronJob = (cb) => {
  // return scheduler.scheduleJob(`0 0 */${freq} * * *`, cb)
  return scheduler.scheduleJob(`0 1 * * * *`, cb)
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
      let frequency = 6
      if (typeof config.frequency !== 'undefined' &&
            config.frequency.length > 0) {
        frequency = parseInt(config.frequency)
        console.log(`Setting scrape to check every ${frequency} hours`)
      } else {
        console.log(`Didn't find freq config, setting to default: ${frequency} hours`)
      }

      setCronJob(() => {
        const username = config.username
        const mostRecent = moment(config.mostRecent)
        const now = moment()
        const timeSinceLastScrape = moment.duration(now.diff(mostRecent))
        console.log(`${Date.now()} - ${timeSinceLastScrape.hours()} - ${timeSinceLastScrape.minutes()}  - ${mostRecent.fromNow()}`)
        if (timeSinceLastScrape.hours() >= frequency) {
          keytar.getPassword('pymkinspector', username)
            .then((password) => {
              const type = 'background'
              const config = {username, password, type, cb, dbPath}
              runScrape(config)
            })
        }
      })
    })
}

module.exports = {
  initBackgroundScrape
}
