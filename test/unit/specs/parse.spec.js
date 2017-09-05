import {load} from '@/scripts/parse'
import {html} from '../test-html.js'

describe('parse.js', () => {
  it('should load html', () => {
    const d = load(html)
    expect(d.to.contain('Welcome to your new project!'))
  })
})
