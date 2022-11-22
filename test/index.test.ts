import { describe, it } from 'vitest'
import say from '../src/'

describe('should', () => {
  it('exported', () => {
    //@ts-ignorea
    // say.speak('whats up, dog?', 'Alex')
    //@ts-ignore
    say.speak('Hello, World!', undefined, undefined, (error:any) => {
      if (error) {
        return console.error(error)
      }
      console.log('done')
    })
  })

  // it('demo',()=>{

  // })
})
