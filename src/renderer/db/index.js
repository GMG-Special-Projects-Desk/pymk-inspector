import {sum, curry, difference, intersection, sortBy, reverse, groupBy} from 'lodash/fp'
const json2csv = require('json2csv')
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

// const removeMany = (query, db) => {
//   return new Promise((resolve, reject) => {
//     db.remove(query, { multi: true }, (err, numRemoved) => {
//       if (err) reject(err)
//       resolve(numRemoved)
//     })
//   })
// }

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

// const updateExistingManySessions = ({db, data}) => {
//   return Promise.map(data, (p) => {
//     return updateExistingPerson(db, p)
//   })
// }
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

export const getSession = ({dbPath, timestamp}) => {
  const task = initDB('session', dbPath, {})
  return find({timestamp: timestamp}, task.db)
}

export const getSessionNew = ({dbPath, timestamp}) => {
  return getSession({dbPath, timestamp})
    .then((result) => {
      return getPymkById({dbPath, ids: result[0].pymkIds})
    })
    .then((pymk) => {
      return pymk.filter((p) => {
        // need to do it like this because the timestamps may differ by seconds (ms/1000)
        const diff = (new Date(p.created) - new Date(timestamp)) / 1000
        return Math.abs(diff) < 60
      })
    })
}

export const getSessionNoMutual = ({dbPath, timestamp, numNoMutual}) => {
  return getSession({dbPath, timestamp})
    .then((result) => {
      return getPymkById({dbPath, ids: result[0].pymkIds})
    })
    .then((pymks) => {
      const fromDb = pymks.filter((p) => {
        return p.mutualFriends < 1
      })
      if (fromDb.length !== numNoMutual) {
        console.log(`numNoMutual has changed! updating ${timestamp}  from ${numNoMutual}to ${fromDb.length}`)
        return updateSessionDbNoMutual({dbPath})
          .then((results) => {
            console.log(`numNoMutual has changed! updating ${timestamp} to ${fromDb.length}`)
            return fromDb
          })
      } else {
        return fromDb
      }
    })
}
// {dbPath, timestamp, numNoMutual}
export const updateSessionDbNoMutual = ({dbPath}) => {
  return getAll('session', dbPath, {})
    .then((sessions) => {
      return Promise.map(sessions, (s) => {
        const numNoMutal = s.numNoMutual
        const timestamp = s.timestamp
        return getPymkById({dbPath, ids: s.pymkIds})
          .then((pymks) => {
            const fromDb = pymks.filter((p) => {
              return p.mutualFriends < 1
            })
            if (fromDb.length !== numNoMutal) {
              console.log(fromDb)
              return {timestamp, newNumNoMutual: fromDb.length}
            } else {
              return false
            }
          })
      })
    })
    .then((sessionInfo) => {
      const sessionsToUpdate = sessionInfo.filter((s) => {
        return s
      })
      console.log(`${sessionsToUpdate.length} sessions to update`)
      const task = initDB('session', dbPath, {})
      return Promise.map(sessionsToUpdate, (sessionData) => {
        return updateSession(task.db, sessionData)
      })
    })
}
const updateSession = (db, sessionData) => {
  return new Promise((resolve, reject) => {
    db.update({timestamp: sessionData.timestamp}, {$set: {numNoMutual: sessionData.newNumNoMutual}}, {}, (err, num) => {
      if (err) { reject(err) }
      resolve(`updating ${sessionData.timestamp} to ${sessionData.newNumNoMutual} no mutual friends`)
    })
  })
}
// PYMK
export const getPymkById = ({dbPath, ids}) => {
  const task = initDB('pymk', dbPath, {})
  return new Promise((resolve, reject) => {
    try {
      const query = {'fbid': {$in: ids}}
      find(query, task.db).then((docs) => {
        resolve(docs)
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
    db.update({fbid: parseInt(person.fbid)}, {$addToSet: {sessions: person.session}, $set: {imgSrc: person.imgSrc, mutualFriends: person.mutualFriends}}, {}, (err, num) => {
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

export const removeAll = (current) => {
  const task = initDB(current.model, current.dbPath, {})
  return new Promise((resolve, reject) => {
    task.db.remove({}, { multi: true }, (err, numRemoved) => {
      if (err) reject(err)
      resolve({...current, ...{data: numRemoved}})
    })
  })
}

export const getAllExport = (current) => {
  const task = initDB(current.model, current.dbPath, {})
  return new Promise((resolve, reject) => {
    task.db.find({}, (err, docs) => {
      if (err) reject(err)
      const updated = {...current, ...{data: docs}}
      resolve(updated)
    })
  })
}

export const deleteAllData = (dbPath) => {
  return removeAll({model: 'pymk', dbPath})
    .then((current) => {
      return removeAll(...current, {model: 'session', dbPath: dbPath, pymk: current.data})
    })
    .then((current) => {
      const result = {...current, session: current.data}
      delete result.data
      return result
    })
}

export const getAllData = (dbPath) => {
  return getAllExport({model: 'pymk', dbPath})
    .then((current) => {
      return getAllExport(...current, {model: 'session', dbPath: dbPath, pymk: current.data})
    })
    .then((current) => {
      const result = {...current, session: current.data}
      delete result.data
      return result
    })
}

export const getCsvData = (dbPath) => {
  return getAllData(dbPath)
    .then((results) => {
      const pymk = json2csv({data: results.pymk, fields: Object.keys(results.pymk[0])})
      const session = json2csv({data: results.session, fields: Object.keys(results.session[0])})
      return {pymk, session}
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

export const getCommonPymk = ({dbPath, current}) => {
  const task = initDB('pymk', dbPath, {})
  return new Promise((resolve, reject) => {
    task.db.find({}, (err, res) => {
      const common = sortBy([function (o) { return Array.isArray(o.sessions) ? o.sessions.length : 0 }], res)
      if (err) { reject(err) }
      const commonSorted = reverse(common).map((d) => {
        return d
      })
      const updatedOutput = {...current, ...{commonPymk: commonSorted.slice(0, 4)}}
      resolve({dbPath: dbPath, current: updatedOutput})
    })
  })
}

export const getCommonNoMutualPymk = ({dbPath, current}) => {
  const task = initDB('pymk', dbPath, {})
  return new Promise((resolve, reject) => {
    task.db.find({}, (err, res) => {
      const commonNoMutual = res.filter((d) => {
        return d.mutualFriends < 1
      })
      const common = sortBy([function (o) { return Array.isArray(o.sessions) ? o.sessions.length : 0 }], commonNoMutual)
      if (err) { reject(err) }
      const commonSorted = reverse(common).map((d) => {
        return d
      })
      if (commonSorted.length > 0) {
        const numToSlice = commonSorted.length > 4 ? 4 : commonSorted.length
        const updatedOutput = {...current, ...{commonPymkNoMutual: commonSorted.slice(0, numToSlice)}}
        resolve({dbPath: dbPath, current: updatedOutput})
      } else {
        const updatedOutput = {...current, ...{commonPymkNoMutual: []}}
        resolve({dbPath: dbPath, current: updatedOutput})
      }
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
      const jobs = all.map((t) => { return t })
      const updatedOutput = {...current, ...{commonWork: jobs.slice(0, 4)}}
      resolve({dbPath: dbPath, current: updatedOutput})
    })
  })
}

export const getSummary = (dbPath) => {
  return SessionsCount({dbPath, current: {}})
    .then(PymkCount)
    .then(getCommonPymk)
    .then(getCommonNoMutualPymk)
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
