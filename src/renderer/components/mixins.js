import {ipcRenderer} from 'electron'
import {initDB, save} from '../db'

export const dbmixin = {
  data () {
    return {
      Person: {},
      Session: {}
    }
  },
  created () {
    ipcRenderer.send('get-db')
    ipcRenderer.on('get-db-reply', (e, arg) => {
      console.log(e, arg)
      const {Person, Session} = initDB(arg)
      this.Person = Person
      this.Session = Session
    })
  },
  methods: {
    save: save,
    findPerson: function (query) {
      return new Promise((resolve, reject) => {
        console.log(this.Person)
        // try {
        //   this.db.Person.find(query).then(function (result) {
        //     resolve(result)
        //   })
        // } catch (e) {
        //   reject(e)
        // }
      })
    }
  }
}
