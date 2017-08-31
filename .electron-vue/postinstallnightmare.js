'use strict'

const path = require('path')
const ncp = require('ncp')

const source = path.join(__dirname, '../build/mac/pymk-inspector.app/Contents/Resources/appShadow/node_modules/electron-nightmare')
const dest = path.join(__dirname, '../build/mac/pymk-inspector.app/Contents/Resources/app/node_modules/electron-nightmare')

ncp(source, dest, function (err) {
  if (err) {
    return console.error(err)
  }
    console.log('done!')
})
