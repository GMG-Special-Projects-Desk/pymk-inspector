import {sum, curry, difference, intersection, sortBy, reverse, groupBy} from 'lodash/fp'
const LinvoDB = require('linvodb3')
const models = require('./models')
const Promise = require('bluebird')

const schema = {
  pymk: models.Person,
  session: models.Session
}

const initDB = curry((model, dbPath, data) => {
  LinvoDB.defaults.store = { db: require('level-js') }
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
      console.log('New Session added')
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
    db.update({fbid: parseInt(person.fbid)}, {$addToSet: {sessions: person.session}, $set: {imgSrc: person.imgSrc}}, {}, (err, num) => {
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

// Summary Queries
export const SessionsCount = ({dbPath, current}) => {
  const task = initDB('session', dbPath, {})
  return new Promise((resolve, reject) => {
    task.db.find({}, function (err, count) {
      if (err) reject(err)
      const updatedOutput = {...current, ...{sessionCount: count.length}}
      resolve({dbPath: dbPath, current: updatedOutput})
    })
  })
}

export const PymkCount = ({dbPath, current}) => {
  const task = initDB('pymk', dbPath, {})
  return new Promise((resolve, reject) => {
    task.db.find({}).count(function (err, count) {
      if (err) reject(err)
      const updatedOutput = {...current, ...{pymkCount: count}}
      resolve({dbPath: dbPath, current: updatedOutput})
    })
  })
}

export const getStartDate = ({dbPath, current}) => {
  const task = initDB('session', dbPath, {})
  return new Promise((resolve, reject) => {
    task.db.find({})
      .map(x => x.timestamp)
      .exec((err, res) => {
        if (err) reject(err)
        res.sort(function (x, y) {
          const date1 = new Date(x)
          const date2 = new Date(y)
          return date1 - date2
        })
        // FIXME: For momentjs
        const updatedOutput = {...current, ...{startDate: res[0]}}
        resolve({dbPath: dbPath, current: updatedOutput})
      })
  })
}

export const findMostRecentSession = ({dbPath, current}) => {
  const task = initDB('session', dbPath, {})
  return new Promise((resolve, reject) => {
    task.db.find({})
      .map(x => x.timestamp)
      .exec((err, res) => {
        if (err) reject(err)
        res.sort(function (x, y) {
          const date1 = new Date(x)
          const date2 = new Date(y)
          return date1 - date2
        })
        const updatedOutput = {...current, ...{lastSession: res.pop()}}
        resolve({dbPath: dbPath, current: updatedOutput})
      })
  })
}

export const getSession = ({dbPath, timestamp}) => {
  const task = initDB('session', dbPath, {})
  return find({timestamp: timestamp}, task.db)
}

export const getCommonPymk = ({dbPath, current}) => {
  const task = initDB('pymk', dbPath, {})
  return new Promise((resolve, reject) => {
    task.db.find({}, (err, res) => {
      const common = sortBy([function (o) { return Array.isArray(o.sessions) ? o.sessions.length : 0 }], res)
      if (err) { reject(err) }
      const names = reverse(common).map((d) => {
        return d.name
      })
      const updatedOutput = {...current, ...{commonPymk: names.slice(0, 4)}}
      resolve({dbPath: dbPath, current: updatedOutput})
    })
  })
}

export const getAveragePymk = ({dbPath, current}) => {
  const task = initDB('session', dbPath, {})
  return new Promise((resolve, reject) => {
    task.db.find({})
      .map(x => x.totalPymk)
      .exec((err, res) => {
        if (err) reject(err)
        // res.sort()
        const total = sum(res)
        const average = Math.floor(total / res.length)
        const updatedOutput = {...current, ...{avgPymk: average}}
        resolve({dbPath: dbPath, current: updatedOutput})
      })
  })
}

export const getAverageNew = ({dbPath, current}) => {
  const task = initDB('session', dbPath, {})
  return new Promise((resolve, reject) => {
    task.db.find({})
      .map(x => x.numNew)
      .exec((err, res) => {
        if (err) reject(err)
        const total = sum(res)
        const average = Math.floor(total / res.length)
        const updatedOutput = {...current, ...{avgNewPymk: average}}
        resolve({dbPath: dbPath, current: updatedOutput})
      })
  })
}

export const getAverageNoMutual = ({dbPath, current}) => {
  const task = initDB('session', dbPath, {})
  return new Promise((resolve, reject) => {
    task.db.find({})
      .map(x => x.numNoMutual)
      .exec((err, res) => {
        if (err) reject(err)
        const total = sum(res)
        const average = Math.floor(total / res.length)
        const updatedOutput = {...current, ...{avgNoMutualPymk: average}}
        resolve({dbPath: dbPath, current: updatedOutput})
      })
  })
}

export const getPopularWork = ({dbPath, current}) => {
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
      const jobs = all.map((t) => { return t.name })
      const updatedOutput = {...current, ...{commonWork: jobs.slice(0, 4)}}
      resolve({dbPath: dbPath, current: updatedOutput})
    })
  })
}

export const getSummary = (dbPath) => {
  return SessionsCount({dbPath, current: {}})
    .then(PymkCount)
    .then(getCommonPymk)
    .then(getPopularWork)
    .then(getStartDate)
    .then(getAveragePymk)
    .then(getAverageNew)
    .then(getAverageNoMutual)
}

export const getMostRecentSession = (dbPath) => {
  return findMostRecentSession({dbPath, current: {}})
    .then((data) => {
      return {dbPath: data.dbPath, timestamp: data.current.lastSession}
    })
    .then(getSession)
}
