import SayPlatformBase from './base'

const BASE_SPEED = 175
const COMMAND = 'say'

export default class SayPlatformDarwin extends SayPlatformBase {

  baseSpeed:number

  constructor () {
    super()
    this.baseSpeed = BASE_SPEED
  }

  buildSpeakCommand (value:{ text:string, voice:string | null, speed:number | null }) {
    let args = []
    let pipedData = ''
    let options = {}

    if (!value.voice) {
      args.push(value.text)
    } else {
      args.push('-v', value.voice, value.text)
    }

    if (value.speed) {
      args.push('-r', this.convertSpeed(value.speed))
    }

    return { command: COMMAND, args, pipedData, options }
  }

  buildExportCommand (value:{ text:string, voice:string | null, speed:number | null, filename:string }) {
    let args = []
    let pipedData = ''
    let options = {}

    if (!value.voice) {
      args.push(value.text)
    } else {
      args.push('-v', value.voice, value.text)
    }

    if (value.speed) {
      args.push('-r', this.convertSpeed(value.speed))
    }

    if (value.filename) {
      args.push('-o', value.filename, '--data-format=LEF32@32000')
    }

    return { command: COMMAND, args, pipedData, options }
  }

  runStopCommand () {
    this.child.stdin.pause()
    this.child.kill()
  }

  getVoices () {
    //@ts-ignore
    throw new Error(`say.export(): does not support platform ${this.platform}`)
  }

}
