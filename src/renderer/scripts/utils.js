const scheduler = require('node-schedule')

const setCronJob = (cb) => {
  return scheduler.scheduleJob(`* */5 * * * *`, cb)
}

module.exports = {
  setCronJob
}
