const LinvoDB = require('linvodb3')
const models = require('./models')
const Promise = require('bluebird')
// LinvoDB.defaults.store = {db: require('level-js')}

// const options = { filename: store: require("level-js") }
// Set dbPath to -> app.getPath("userData")

export const initDB = (path) => {
  LinvoDB.dbPath = path
  let Person = new LinvoDB('pymk', models.Person, {})
  let Session = new LinvoDB('session', models.Session, {})
  // Promise.promisifyAll(Person.find().__proto__)
  // Promise.promisifyAll(Session.find().__proto__)
  return { Person, Session }
}

export const save = (db, docs) => {
  return new Promise((resolve, reject) => {
    try {
      db.save(docs).execAsync().then(function (docs) {
        resolve(docs)
      })
    } catch (e) {
      reject(e)
    }
  })
}

export const find = (db, query) => {
  return new Promise((resolve, reject) => {
    try {
      db.find(query).execAsync().then(function (docs) {
        resolve(docs)
      })
    } catch (e) {
      reject(e)
    }
  })
}
