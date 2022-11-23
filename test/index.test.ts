import { describe, it } from 'vitest'
import say from '../src/'

describe('should', () => {
  it('exported', () => {
    //@ts-ignorea
    say.speak('whats up, dog?', 'Alex')
    //@ts-ignore
    say.stop()
    //@ts-ignore
    say.speak("What's up, dog?", 'Alex', 0.5)
  })

  // it('demo',()=>{

  // })
})
