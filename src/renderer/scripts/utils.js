const { runScrape } = require('./scrape')
const scheduler = require('node-schedule')
const storage = require('electron-storage')
const keytar = require('keytar')
const moment = require('moment')
let isScrapeRunning = false
const setCronJob = (cb) => {
  // return scheduler.scheduleJob(`0 0 */${freq} * * *`, cb)
  return scheduler.scheduleJob(`0 0 * * * *`, cb)
}

const clearCronJob = (cronJob) => {
  if (cronJob.cancel()) {
    console.log(`cancelled cronjob ${cronJob.name}`)
  } else {
    console.log(`error cancelling cronjob ${cronJob.name}`)
  }
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
  return getConfig()
    .then((config) => {
      let frequency = 6
      if (config.hasOwnProperty('frequency') &&
            config.frequency > 0) {
        frequency = parseInt(config.frequency)
        console.log(`Setting scrape to check every ${frequency} hours`)
      } else {
        console.log(`Didn't find freq config, setting to default: ${frequency} hours`)
      }

      return setCronJob(() => {
        if (isScrapeRunning) {
          console.log('Scraper is already running.')
          return
        }

        const username = config.username
        if (config.hasOwnProperty('mostRecent') && config.mostRecent.length > 0) {
          const mostRecent = moment(config.mostRecent)
          const now = moment()
          const timeSinceLastScrape = moment.duration(now.diff(mostRecent))
          console.log(`${timeSinceLastScrape.hours()}  - ${mostRecent.fromNow()} - ${timeSinceLastScrape.days()}`)
          if (timeSinceLastScrape.hours() >= frequency ||
              timeSinceLastScrape.days() > 0) {
            keytar.getPassword('pymkinspector', username)
              .then((password) => {
                const type = 'background'
                const creds = {username, password}
                const config = {creds, type, cb, dbPath}
                isScrapeRunning = true
                runScrape(config)
                isScrapeRunning = false
              })
          }
        } else {
          console.log(`Couldn't find most recent so running scrape now.`)
          keytar.getPassword('pymkinspector', username)
            .then((password) => {
              const type = 'background'
              const creds = {username, password}
              const config = {creds, type, cb, dbPath}
              isScrapeRunning = true
              runScrape(config)
              isScrapeRunning = false
            })
        }
      })
    })
}

module.exports = {
  initBackgroundScrape,
  clearCronJob
}
