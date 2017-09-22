import {curry, difference, intersection, sortBy, reverse, groupBy} from 'lodash/fp'
const LinvoDB = require('linvodb3')
const models = require('./models')
const Promise = require('bluebird')

const schema = {
  pymk: models.Person,
  session: models.Session
}

const initDB = curry((model, dbPath, data) => {
  LinvoDB.dbPath = dbPath
  let db = new LinvoDB(model, schema[model], {})
  return {db, data}
})

// DB Helpers
const insert = (task) => {
  return new Promise((resolve, reject) => {
    task.db.insert(task.data, (err, docs) => {
      if (err) reject(err)
      resolve(docs)
    })
  })
}

const find = (query, db) => {
  return new Promise((resolve, reject) => {
    db.find(query, (err, docs) => {
      if (err) reject(err)
      resolve(docs)
    })
  })
}

const removeMany = (query, db) => {
  return new Promise((resolve, reject) => {
    db.remove(query, { multi: true }, (err, numRemoved) => {
      if (err) reject(err)
      resolve(numRemoved)
    })
  })
}

// Session
const prepNewSession = (task) => {
  return new Promise((resolve, reject) => {
    const totalPymk = task.data.length
    const pymkIds = task.data.map((d) => { return parseInt(d.fbid) })
    const existingPymkIds = task.pymk.map((d) => { return parseInt(d.fbid) })
    const noMutual = task.data.filter((d) => {
      return d.mutualFriends < 1
    })
    const i = intersection(existingPymkIds, pymkIds)
    const numSeenBefore = i.length
    const numNoMutual = noMutual.length
    const timestamp = task.data[0].session
    const newData = {totalPymk, timestamp, numNoMutual, numSeenBefore, pymkIds}
    const d = Object.assign(task, {data: [newData]})
    resolve(d)
  })
}
const insertSession = ({dbPath, data}) => {
  const task = initDB('session', dbPath, data)
  return getAll('pymk', dbPath, data)
    .then((pymk) => prepNewSession(Object.assign(task, {pymk: pymk})))
    .then(insert)
    .then((d) => {
      console.log('New Session added', d)
      return {dbPath, data}
    })
}

// PYMK
export const removeFbids = (task) => {
  return new Promise((resolve, reject) => {
    try {
      const ids = task.data.map((d) => { return parseInt(d.fbid) })
      const query = {fbid: {$in: ids}}
      removeMany(query, task.db).then((numRemoved) => {
        resolve(numRemoved)
      })
    } catch (err) {
      reject(err)
    }
  })
}

export const getExistingPymk = (task, idsOnly = false) => {
  return new Promise((resolve, reject) => {
    try {
      const sessionPYMKIds = task.data.map((d) => {
        return parseInt(d.fbid)
      })
      const query = {'fbid': {$in: sessionPYMKIds}}
      find(query, task.db).then((docs) => {
        if (idsOnly) {
          resolve(docs.map((d) => { return d.fbid }))
        } else {
          resolve(docs)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

export const getNewPymk = (task) => {
  return getExistingPymk(task, true).then((existing) => {
    const allIds = task.data.map((d) => {
      return parseInt(d.fbid)
    })

    const newPymkIds = difference(allIds, existing)
    console.log(newPymkIds)
    const newStuff = task.data.filter((d) => {
      return newPymkIds.indexOf(parseInt((d.fbid))) > -1
    })
    return newStuff
  })
}

const prepNewPYMK = (newPymk) => {
  return newPymk.map((d) => {
    return Object.assign(d, {sessions: [d.session]})
  })
}

const updateExistingPerson = (db, person) => {
  return new Promise((resolve, reject) => {
    db.update({fbid: parseInt(person.fbid)}, {$addToSet: {sessions: person.session}}, {}, (err, num) => {
      if (err) { reject(err) }
      resolve(num)
    })
  })
}

const updateExistingMany = ({db, data}) => {
  return Promise.map(data, (p) => {
    return updateExistingPerson(db, p)
  })
}

export const insertPeople = ({dbPath, data}) => {
  const task = initDB('pymk', dbPath, data)
  return getNewPymk(task)
    .then((newPymk) => {
      const forDb = prepNewPYMK(newPymk)
      console.log(`Adding ${forDb.length} new people`)
      return {db: task.db, data: forDb}
    })
    .then(insert)
    .then((d) => {
      return {dbPath, data}
    })
}

export const updatePeople = ({dbPath, data}) => {
  const task = initDB('pymk', dbPath, data)
  return getExistingPymk(task, true)
    .then((d) => {
      const updatePymks = task.data.filter((e) => { return d.indexOf(parseInt(e.fbid)) > -1 })
      console.log(`Updating ${updatePymks.length} people`)
      return updateExistingMany({ db: task.db, data: updatePymks })
    })
    .then((d) => {
      const successful = d.filter((k) => { return k === 1 })
      const failed = d.length - successful.length
      console.log(`Updated ${successful.length} existing pymk. Failed updating ${failed}`)
      return {dbPath, data}
    })
}

export const updateDB = ({dbPath, data}) => {
  return insertSession({dbPath, data})
    .then(updatePeople)
    .then(insertPeople)
}

// All

export const getAll = (model, dbPath) => {
  const task = initDB(model, dbPath, {})
  return find({}, task.db)
}

export const removeAll = (model, dbPath, data) => {
  const task = initDB(model, dbPath, data)
  return new Promise((resolve, reject) => {
    try {
      removeMany({}, task.db).then((numRemoved) => {
        resolve(numRemoved)
      })
    } catch (err) {
      reject(err)
    }
  })
}

export const SessionsCount = (dbPath) => {
  const task = initDB('session', dbPath, {})
  console.log(task)
  return new Promise((resolve, reject) => {
    task.db.find({}, function (err, count) {
      if (err) reject(err)
      resolve(count.length)
    })
  })
}

export const PymkCount = (dbPath) => {
  const task = initDB('pymk', dbPath, {})
  return new Promise((resolve, reject) => {
    task.db.find({}).count(function (err, count) {
      if (err) reject(err)
      resolve(count)
    })
  })
}

export const getStartDate = (dbPath) => {
  const task = initDB('session', dbPath, {})
  return new Promise((resolve, reject) => {
    task.db.find({})
      .map(x => x.timestamp)
      .exec((err, res) => {
        if (err) reject(err)
        res.sort()
        resolve(res[0])
      })
  })
}

export const getCommonPymk = (dbPath) => {
  const task = initDB('pymk', dbPath, {})
  return new Promise((resolve, reject) => {
    task.db.find({}, (err, res) => {
      const common = sortBy([function (o) { return o.sessions.length }], res)
      if (err) { reject(err) }
      const names = reverse(common).map((d) => {
        return d.name
      })
      resolve(names.slice(0, 4))
    })
  })
}

export const getPopularWork = (dbPath) => {
  const task = initDB('pymk', dbPath, {})
  return new Promise((resolve, reject) => {
    task.db.find({}, (err, res) => {
      if (err) { reject(err) }
      const values = groupBy('job', res)
      let result = []
      for (let job in values) {
        if (job) {
          result.push({ name: job, count: values[job].length })
        }
      }
      const sorted = sortBy([function (o) { return o.count }], result)
      const all = reverse(sorted)
      const top = all.map((t) => { return t.name })
      resolve(top.slice(0, 4))
    })
  })
}
// TODO: Queries
// Most Common Work Places
// Avg PYMK per session
// Avergage new PYMK
// Average no mutual PYMK
