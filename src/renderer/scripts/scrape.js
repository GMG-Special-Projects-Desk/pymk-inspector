const { parsePymk } = require('./parse')
const notifier = require('node-notifier')
const path = require('path')
const { Browser, run, sleep } = require('automatonic')

const log = require('electron-log')
log.transports.file.level = 'info'
// added to .babelignore because transformation messes up the execute function for browser rendering
export const runScrape = (config) => {
  const I = new Browser({typingInterval: 200, width: 400, height: 400, x: 10, y: 10, sandbox: true})
  run(function*() {
    I.goto('https://www.facebook.com/friends/requests/')
    yield I.waitFor(1000)
    var isLoginPage = yield I.checkFor('#email')

    if (isLoginPage) {
      notifier.notify({
        title: 'PYMK-Inspector',
        icon: void 0,
        contentImage: path.join(__static, '128.png'),
        message: 'You need to log into Facebook in the browser window to your left.',
        sound: true, // Only Notification Center or Windows Toasters
        wait: false // Wait with callback, until user action is taken against notification
      })
      yield I.waitFor('div#fbSearchResultsBox', 600000)
      yield I.waitFor(1000)
    } else {

    }
    notifier.notify({
      title: 'PYMK-Inspector',
      icon: void 0,
      contentImage: path.join(__static, '128.png'),
      message: 'The app is now running - close the browser to cancel this session.',
      sound: true, // Only Notification Center or Windows Toasters
      wait: false // Wait with callback, until user action is taken against notification
    })
    yield sleep(1000)
    yield I.execute(function () {
      return new Promise((resolve, reject) => {
        var id = setInterval(() => {
          try {
            if (!((window.scrollY + window.innerHeight) + 200 > document.body.clientHeight)) {
              window.scrollBy(0, 500)
            } else {
              clearInterval(id)
              resolve('resolved!')
            }
          } catch (e) {
            clearInterval(id)
            reject(e)
          }
        }, 1000)
      })
    })

    var data = yield I.execute(function () {
      return document.getElementById('fbSearchResultsBox').innerHTML
    })

    try {
      const result = {
        dbPath: config.dbPath,
        data: parsePymk(data)
      }

      if (config.type === 'background') {
        log.info('[scrape] bg-scrape complete')
        config.cb(result)
      } else {
        log.info('[scrape] fg-scrape complete')
        config.event.sender.send('fg-scrape', result)
      }
    } catch (e) {
      const err = {
        dbPath: config.dbPath,
        error: e
      }
      if (config.type === 'background') {
        log.error(`[scrape] bg scrape ${err}`)
        config.cb(err)
      } else {
        log.error(`[scrape] fg scrape ${err}`)
        config.event.sender.send('fg-scrape', err)
      }
    }
    yield sleep(2000)
    I.close()
  }).then(null, err => {
    if (err) {
      log.error(`[scrape] ${err}`)
      I.close()
    }
  })
}
