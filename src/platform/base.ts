import childProcess from 'child_process'
import once from 'one-time'

export default class SayPlatformBase{
  child:any
  baseSpeed:number

  constructor () {
    this.child = null
    this.baseSpeed = 0
  }

  /**
   * Uses system libraries to speak text via the speakers.
   * @param text Text to be spoken
   * @param voice Name of voice to be spoken with
   * @param speed Speed of text (e.g. 1.0 for normal, 0.5 half, 2.0 double)
   * @param callback A callback of type function(err) to return.
   */
  speak (text:string, voice:string | null, speed:number | null, callback:Function | null) {
    if (typeof callback !== 'function') {
      callback = () => {}
    }

    callback = once(callback)

    if (!text) {
      return setImmediate(() => {
        callback!(new TypeError('say.speak(): must provide text parameter'))
      })
    }
    //@ts-ignore
    let { command, args, pipedData, options } = this.buildSpeakCommand({ text, voice, speed })

    this.child = childProcess.spawn(command, args, options)

    this.child.stdin.setEncoding('ascii')
    this.child.stderr.setEncoding('ascii')

    if (pipedData) {
      this.child.stdin.end(pipedData)
    }

    this.child.stderr.once('data', (data:any) => {
      // we can't stop execution from this function
      callback!(new Error(data))
    })

    this.child.addListener('exit', (code:any, signal:any) => {
      if (code === null || signal !== null) {
        return callback!(new Error(`say.speak(): could not talk, had an error [code: ${code}] [signal: ${signal}]`))
      }

      this.child = null

      callback!(null)
    })
  }

  /**
   * Uses system libraries to speak text via the speakers.
   * @param text Text to be spoken
   * @param voice Name of voice to be spoken with
   * @param speed Speed of text (e.g. 1.0 for normal, 0.5 half, 2.0 double)
   * @param filename Path to file to write audio to, e.g. "greeting.wav"
   * @param callback A callback of type function(err) to return.
   */
  export (text:string, voice:string | null, speed:number | null, filename:string, callback:Function | null) {
    if (typeof callback !== 'function') {
      callback = () => {}
    }

    callback = once(callback)

    if (!text) {
      return setImmediate(() => {
        callback!(new TypeError('say.export(): must provide text parameter'))
      })
    }

    if (!filename) {
      return setImmediate(() => {
        callback!(new TypeError('say.export(): must provide filename parameter'))
      })
    }

    try {
      //@ts-ignore
      var { command, args, pipedData, options } = this.buildExportCommand({ text, voice, speed, filename })
    } catch (error) {
      return setImmediate(() => {
        callback!(error)
      })
    }

    this.child = childProcess.spawn(command, args, options)

    this.child.stdin.setEncoding('ascii')
    this.child.stderr.setEncoding('ascii')

    if (pipedData) {
      this.child.stdin.end(pipedData)
    }

    this.child.stderr.once('data', (data:any) => {
      // we can't stop execution from this function
      callback!(new Error(data))
    })

    this.child.addListener('exit', (code:any, signal:any) => {
      if (code === null || signal !== null) {
        return callback!(new Error(`say.export(): could not talk, had an error [code: ${code}] [signal: ${signal}]`))
      }

      this.child = null

      callback!(null)
    })
  }

  /**
   * Stops currently playing audio. There will be unexpected results if multiple audios are being played at once
   * TODO: If two messages are being spoken simultaneously, childD points to new instance, no way to kill previous
   * @param callback A callback of type function(err) to return.
   */
  stop (callback:Function | null) {
    if (typeof callback !== 'function') {
      callback = () => {}
    }

    callback = once(callback)

    if (!this.child) {
      return setImmediate(() => {
        callback!(new Error('say.stop(): no speech to kill'))
      })
    }

    //@ts-ignore
    this.runStopCommand()

    this.child = null

    callback(null)
  }

  convertSpeed (speed:number) {
    return Math.ceil(this.baseSpeed * speed)
  }

  getInstalledVoices (callback:Function) {
    if (typeof callback !== 'function') {
      callback = () => {}
    }
    callback = once(callback)

    //@ts-ignore
    let { command, args } = this.getVoices()
    var voices:any = []
    this.child = childProcess.spawn(command, args)

    this.child.stdin.setEncoding('ascii')
    this.child.stderr.setEncoding('ascii')

    this.child.stderr.once('data', (data:any) => {
      // we can't stop execution from this function
      callback(new Error(data))
    })
    this.child.stdout.on('data', function (data:any) {
      voices += data
    })

    this.child.addListener('exit', (code:any, signal:any) => {
      if (code === null || signal !== null) {
        return callback(new Error(`say.getInstalledVoices(): could not get installed voices, had an error [code: ${code}] [signal: ${signal}]`))
      }
      if (voices.length > 0) {
        voices = voices.split('\r\n')
        voices = (voices[voices.length - 1] === '') ? voices.slice(0, voices.length - 1) : voices
      }
      this.child = null

      callback(null, voices)
    })

    this.child.stdin.end()
  }

}
