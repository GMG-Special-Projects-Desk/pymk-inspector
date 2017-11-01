const { runScrape } = require('./scrape')
const scheduler = require('node-schedule')
const storage = require('electron-storage')
const keytar = require('keytar')
const moment = require('moment')
const setCronJob = (cb) => {
  // return scheduler.scheduleJob(`0 0 */${freq} * * *`, cb)
  return scheduler.scheduleJob(`0 43 * * * *`, cb)
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
            config.frequency > 0) {
        frequency = parseInt(config.frequency)
        console.log(`Setting scrape to check every ${frequency} hours`)
      } else {
        console.log(`Didn't find freq config, setting to default: ${frequency} hours`)
      }

      setCronJob(() => {
        const username = config.username
        if (typeof config.mostRecent !== 'undefined') {
          const mostRecent = moment(config.mostRecent)
          const now = moment()
          const timeSinceLastScrape = moment.duration(now.diff(mostRecent))
          console.log(`${timeSinceLastScrape.hours()}  - ${mostRecent.fromNow()} - ${timeSinceLastScrape.days()}`)
          if (timeSinceLastScrape.hours() >= frequency ||
              timeSinceLastScrape.days() > 0) {
            keytar.getPassword('pymkinspector', username)
              .then((password) => {
                const type = 'background'
                const config = {username, password, type, cb, dbPath}
                runScrape(config)
              })
          }
        } else {
          console.log(`Couldn't find most recent so running scrape now.`)
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
