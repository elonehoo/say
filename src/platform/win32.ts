import childProcess from 'child_process'
import SayPlatformBase from './base'

const BASE_SPEED = 0 // Unsupported
const COMMAND = 'powershell'

export default class SayPlatformWin32 extends SayPlatformBase {
  constructor () {
    super()
    this.baseSpeed = BASE_SPEED
  }

  buildSpeakCommand (value:{ text:string, voice:string | null, speed:number | null }) {
    let args = []
    let pipedData = ''
    let options:any = {}

    let psCommand = `Add-Type -AssemblyName System.speech;$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer;`

    if (value.voice) {
      psCommand += `$speak.SelectVoice('${value.voice}');`
    }

    if (value.speed) {
      let adjustedSpeed = this.convertSpeed(value.speed || 1)
      psCommand += `$speak.Rate = ${adjustedSpeed};`
    }

    psCommand += `$speak.Speak([Console]::In.ReadToEnd())`

    pipedData += value.text
    args.push(psCommand)
    options.shell = true

    return { command: COMMAND, args, pipedData, options }
  }

  buildExportCommand (value:{ text:string, voice:string | null, speed:number | null, filename:string }) {
    let args = []
    let pipedData = ''
    let options:any = {}

    let psCommand = `Add-Type -AssemblyName System.speech;$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer;`

    if (value.voice) {
      psCommand += `$speak.SelectVoice('${value.voice}');`
    }

    if (value.speed) {
      let adjustedSpeed = this.convertSpeed(value.speed || 1)
      psCommand += `$speak.Rate = ${adjustedSpeed};`
    }

    if (!value.filename) throw new Error('Filename must be provided in export();')
    else {
      psCommand += `$speak.SetOutputToWaveFile('${value.filename}');`
    }

    psCommand += `$speak.Speak([Console]::In.ReadToEnd());$speak.Dispose()`

    pipedData += value.text
    args.push(psCommand)
    options.shell = true

    return { command: COMMAND, args, pipedData, options }
  }

  runStopCommand () {
    this.child.stdin.pause()
    childProcess.exec(`taskkill /pid ${this.child.pid} /T /F`)
  }

  convertSpeed (speed:number) {
    // Overriden to map playback speed (as a ratio) to Window's values (-10 to 10, zero meaning x1.0)
    return Math.max(-10, Math.min(Math.round((9.0686 * Math.log(speed)) - 0.1806), 10))
  }

  getVoices () {
    let args = []
    let psCommand = 'Add-Type -AssemblyName System.speech;$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer;$speak.GetInstalledVoices() | % {$_.VoiceInfo.Name}'
    args.push(psCommand)
    return { command: COMMAND, args }
  }
}
