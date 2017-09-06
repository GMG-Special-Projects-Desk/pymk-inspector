const LinvoDB = require('linvodb3')
const models = require('./models')
// LinvoDB.defaults.store = {db: require('level-js')}

// const options = { filename: store: require("level-js") }

// Set dbPath - this should be done explicitly and will be the dir where each model's store is saved
// Set dbPath to -> app.getPath("userData")
// LinvoDB.dbPath = process.cwd()

const Doc = new LinvoDB('pymk', models.Person, {})

module.exports = { Doc }
