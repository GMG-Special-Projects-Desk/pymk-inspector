import { parsePymk } from './parse'
const { Browser, run, sleep } = require('automatonic')

// added to .babelignore because babels transformation fuck up the execute function for browser rendering
export const runScrape = (config) => {
  run(function*() {
    const I = new Browser({typingInterval: 200})
    I.goto('https://www.facebook.com/friends/requests/?fcref=jwl')
    yield I.waitFor(1000)
    var isLoginPage = yield I.checkFor('#email')

    if (isLoginPage) {
      I.type('#pass', config.creds.password)
      yield I.waitFor(1000)
      I.type('#email', config.creds.username)
      yield I.waitFor(1000)
      I.click('#loginbutton')
    }

    yield sleep(1000)
    yield I.execute(function () {
      return new Promise((resolve, reject) => {
        var count = 0
        var id = setInterval(() => {
          try {
            // TODO: Remove after debugging
            if (count > 2) {
              resolve('resolved!')
            }

            if (!((window.scrollY + window.innerHeight) + 200 > document.body.clientHeight)) {
              window.scrollBy(0, 500)
              count += 1
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
      // console.log(parsePymk(data))
      config.event.sender.send('async-reply', result)
    } catch (e) {
      const err = {
        dbPath: config.dbPath,
        error: e
      }
      config.event.sender.send('async-reply', err)
    }

    yield sleep(2000)
    I.close()
  }).then(null, err => {
    console.error('OH NOES!', err)
  })
}
