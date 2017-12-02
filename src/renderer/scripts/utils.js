const { runScrape } = require('./scrape')
// const scheduler = require('node-schedule')
const storage = require('electron-storage')
const keytar = require('keytar')
const moment = require('moment')

const log = require('electron-log')
var isScrapeRunning = false
log.transports.file.level = 'info'
var intervalId = null
const setCronJob = (cb) => {
  intervalId = setInterval(cb, 1000 * 60 * 60)
  log.info(`[utils] Starting timer at  ${moment().format('YYYY-MM-DD H:m:s')}`)
}

const clearCronJob = () => {
  if (intervalId) {
    log.info(`[utils] clearing timer`)
    clearInterval(intervalId)
  } else {
    log.error(`[utils] error clearing timer`)
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
    .catch((err) => {
      log.error(`[utils] [getConfig] ${err}`)
    })
}

const initBackgroundScrape = (dbPath, cb) => {
  return getConfig()
    .then((config) => {
      let frequency = 6
      if (config.hasOwnProperty('frequency') &&
            config.frequency > 0) {
        frequency = parseInt(config.frequency)
        log.info(`[utils] Setting scrape to check every ${frequency} hours`)
      } else {
        log.info(`[utils] Didn't find freq config, setting to default: ${frequency} hours`)
      }

      return setCronJob(() => {
        if (isScrapeRunning) {
          log.info('[utils] Scraper is already running.')
          return
        }

        const username = config.username
        if (config.hasOwnProperty('mostRecent') && config.mostRecent.length > 0) {
          log.info(`most recent: ${config.mostRecent}`)
          const mostRecent = moment(config.mostRecent)
          const now = moment()
          const timeSinceLastScrape = moment.duration(now.diff(mostRecent))
          log.info(`[utils] isScrapeRunning: ${isScrapeRunning} frequency: ${frequency} timeSinceLastScrape.hours: ${timeSinceLastScrape.hours()}  - mostRecent.fromNow ${mostRecent.fromNow()} - timeSinceLastScrape.days ${timeSinceLastScrape.days()}`)
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
              .catch((err) => {
                log.error(`[utils] [setCronJob] ${err}`)
              })
          }
        } else {
          log.info(`[utils] Couldn't find most recent so running scrape now.`)
          keytar.getPassword('pymkinspector', username)
            .then((password) => {
              const type = 'background'
              const creds = {username, password}
              const config = {creds, type, cb, dbPath}
              isScrapeRunning = true
              runScrape(config)
              isScrapeRunning = false
            })
            .catch((err) => {
              log.error(`[utils] [setCronJob] ${err}`)
            })
        }
      })
    })
    .catch((err) => {
      log.error(`[utils] [setCronJob] ${err}`)
    })
}

module.exports = {
  initBackgroundScrape,
  clearCronJob
}
