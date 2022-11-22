import SayPlatformBase from './base'

const BASE_SPEED = 100
const COMMAND = 'festival'

export default class SayPlatformLinux extends SayPlatformBase {
  constructor () {
    super()
    this.baseSpeed = BASE_SPEED
  }

  buildSpeakCommand (value:{ text:string, voice:string | null, speed:number | null }) {
    let args = []
    let pipedData = ''
    let options = {}

    args.push('--pipe')

    if (value.speed) {
      pipedData += `(Parameter.set 'Audio_Command "aplay -q -c 1 -t raw -f s16 -r $(($SR*${this.convertSpeed(value.speed)}/100)) $FILE") `
    }

    if (value.voice) {
      pipedData += `(${value.voice}) `
    }

    pipedData += `(SayText "${value.text}")`

    return { command: COMMAND, args, pipedData, options }
  }

  buildExportCommand (value:{ text:string, voice:string | null, speed:number | null, filename:string }) {
    //@ts-ignore
    throw new Error(`say.export(): does not support platform ${this.platform}`)
  }

  runStopCommand () {
    // TODO: Need to ensure the following is true for all users, not just me. Danger Zone!
    // On my machine, original childD.pid process is completely gone. Instead there is now a
    // childD.pid + 1 sh process. Kill it and nothing happens. There's also a childD.pid + 2
    // aplay process. Kill that and the audio actually stops.
    process.kill(this.child.pid + 2)
  }

  getVoices () {
    //@ts-ignore
    throw new Error(`say.export(): does not support platform ${this.platform}`)
  }
}
