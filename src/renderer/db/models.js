// FIXME: Add sessions string array to person schema if linvodb fix their shit
// TODO: Add photo urls
const Person = {
  name: String,
  fbid: Number,
  created: Date,
  job: String,
  mfStr: String,
  imgSrc: String,
  mutualFriends: Number,
  firstName: { get: function () { return this.name.split(' ')[0] } }
}
// FIXME: Add pymkIds number array to Session schema if linvodb fix their shit
const Session = {
  timestamp: Date,
  totalPymk: Number,
  numSeenBefore: Number,
  numNoMutual: Number,
  numNew: { get: function () { return (this.totalPymk - this.numSeenBefore) } }
}

module.exports = {
  Person,
  Session
}
