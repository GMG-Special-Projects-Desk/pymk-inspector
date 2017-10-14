'use strict'

import { runScrape } from '../renderer/scripts/scrape'
import { initBackgroundScrape } from '../renderer/scripts/utils'
import menubar from 'menubar'
import {app, ipcMain, dialog} from 'electron'
const fs = require('fs')
const path = require('path')

// var app = require('electron')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let mb

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

ipcMain.on('fg-scrape', (event, arg) => {
  let config = {
    type: 'foreground',
    event: event,
    creds: arg,
    dbPath: app.getPath('userData')
  }
  runScrape(config)
})

ipcMain.on('get-db-path', (event, arg) => {
  event.returnValue = app.getPath('userData')
})

ipcMain.on('quit-app', (event, arg) => {
  app.quit()
})

ipcMain.on('export-data', (event, arg) => {
  // FIXME:Choosing dir instead of files from electron thing.
  dialog.showSaveDialog({title: 'Chose a folder to save the data to'}, (filepath) => {
    try {
      console.log(`Exporting data to ${filepath}`)
      const dirname = path.dirname(filepath)
      fs.writeFile(path.join(dirname, 'pymk-inspector-people.csv'), arg.exportData.pymk, (err) => {
        if (err) throw err
        console.log('Pymk file has been saved!')
        fs.writeFile(path.join(dirname, 'pymk-inspector-sessions.csv'), arg.exportData.session, (err) => {
          if (err) throw err
          console.log('Session file has been saved!')
        })
      })
    } catch (err) {
      console.log(`Error while exporting data ${err}`)
    }
  })
})

function createMenuBar () {
  let mb = menubar({icon: require('path').join(__static, 'facebook-inspector-dashboard.png'),
    index: winURL,
    width: 400,
    height: 500,
    preloadWindow: true,
    alwaysOnTop: true
  })

  mb.on('ready', function () {
    console.log('app is ready')
    initBackgroundScrape(app.getPath('userData'),
      (results) => {
        mb.window.webContents.send('bg-scrape', results)
      })
  })
}

createMenuBar()

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mb === null) {
    createMenuBar()
  }
})
// function createMenuBar () {
//   mb = menubar({icon: require('path').join(__static, 'facebook-inspector.png'),
//     index: winURL,
//     width: 400,
//     height: 500,
//     alwaysOnTop: true
//   })
//   mb.on('ready', function () {
//     console.log('app is ready')
//   })
//   initBackgroundScrape(app.getPath('userData'))
//   // setCronJob(() => {
//   //   let config = {
//   //     type: 'foreground',
//   //     event: event,
//   //     creds: arg,
//   //     dbPath: app.getPath('userData')
//   //   }
//   //   console.log(`Cron Job is running ${Date.now()}`)
//   // })
//   // mb.on('after-create-window', function () {
//   //   mb.window.webContents.openDevTools()
//   // })
// }
// import { app, BrowserWindow, ipcMain } from 'electron'
// let mainWindow
// function createWindow () {
//   /**
//    * Initial window options
//    */
//   mainWindow = new BrowserWindow({
//     height: 563,
//     useContentSize: true,
//     width: 1000
//   })

//   mainWindow.loadURL(winURL)
//   mainWindow.openDevTools()
//   mainWindow.on('closed', () => {
//     mainWindow = null
//   })
// }
// app.on('ready', createWindow)
// if (mainWindow === null) {
// createWindow()
// }
