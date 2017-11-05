import {test} from '@/db'
// import {data} from '../../../test-db.js'

describe('db', () => {
  it('should load data', () => {
    console.log(test)
    const d = test('TEST')
    expect(d.to.contain('TEST'))
  })
})
