const Person = {
  name: String,
  fbid: Number,
  created: Date,
  work: String,
  sessions: {type: [String], index: true},
  firstName: { get: function () { return this.name.split(' ')[0] } }
}

const Session = {
  _id: String,
  timestamp: Date,
  totalPymk: Number,
  numSeenBefore: Number,
  numNoMutual: Number,
  created: Date,
  pymkIds: {type: [String], index: true}
}

module.exports = {
  Person,
  Session
}
