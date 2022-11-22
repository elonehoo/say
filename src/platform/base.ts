import childProcess from 'child_process'
import one from 'one-time'

export default class SayPlatformBase{
  private child:any
  private baseSpeed:number

  constructor () {
    this.child = null
    this.baseSpeed = 0
  }


}
