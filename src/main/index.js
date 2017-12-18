'use strict'

import { runScrape } from '../renderer/scripts/scrape'
import { initBackgroundScrape, clearCronJob } from '../renderer/scripts/utils'
import menubar from 'menubar'
import {app, ipcMain, dialog, Menu} from 'electron'
import log from 'electron-log'
const fs = require('fs')
const path = require('path')
let cronJob = null
let mb = null
app.log = log

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

app.log.transports.file.level = 'info' // process.env.NODE_ENV === 'development' ? 'info' : 'warn'
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createMenuBar () {
  mb = menubar({icon: require('path').join(__static, 'inspector-dashboard-transparent.png'),
    index: winURL,
    width: 440,
    height: 560,
    preloadWindow: true,
    alwaysOnTop: true
  })

  mb.on('ready', function () {
    initBackgroundScrape(app.getPath('userData'),
      (results) => {
        mb.window.webContents.send('bg-scrape', results)
        app.log.info(`[main][ready] app is ready`)
        mb.showWindow()
      })
    mb.showWindow()
  })

  mb.on('after-show', function () {
    mb.window.webContents.send('refresh-data')
  })

  mb.on('after-create-window', function () {
    const contextMenu = Menu.buildFromTemplate([
      {label: 'Restart', click: () => { mb.app.quit(); mb.app.relaunch() }},
      {type: 'separator'},
      {label: 'Quit', click: () => { mb.app.quit() }}
    ])
    mb.tray.on('right-click', () => {
      mb.tray.popUpContextMenu(contextMenu)
    })
  })

  const shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
    if (mb) {
      mb.showWindow()
    }
    if (shouldQuit) {
      app.quit()
    }
  })

  ipcMain.on('settings-updated', (event, arg) => {
    app.log.warn(`[main][settings-updated] Re-initializng bg scrape with settings from ${app.getPath('userData')}`)
    clearCronJob(cronJob)
    initBackgroundScrape(app.getPath('userData'),
      (results) => {
        mb.showWindow()
        mb.window.webContents.send('bg-scrape', results)
        app.log.info(`[main][settings-updated] app is ready`)
      })
  })

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
    dialog.showSaveDialog({title: 'Chose a folder to save the data to', defaultPath: 'pymk-inspector.csv'}, (filepath) => {
      try {
        const dirname = path.dirname(filepath)
        const filename = path.basename(filepath, path.extname(filepath))
        app.log.info(`[export-data] ${path.join(dirname, `${filename}-people.csv`)}`)
        fs.writeFile(path.join(dirname, `${filename}-people.csv`), arg.exportData.pymk, (err) => {
          if (err) throw err
          app.log.info(`[export-data] ${path.join(dirname, `${filename}-people.csv`)}`)
          fs.writeFile(path.join(dirname, `${filename}-sessions.csv`), arg.exportData.session, (err) => {
            if (err) throw err
            app.log.info(`[export-data] ${path.join(dirname, `${filename}-people.csv`)}`)
          })
        })
      } catch (err) {
        app.log.error(`[export-data] ${err}`)
      }
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
