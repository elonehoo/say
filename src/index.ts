import SayPlatformDarwin from './platform/darwin'
import SayPlatformLinux from './platform/linux'
import SayPlatformWin32 from './platform/win32'

const MACOS = 'darwin'
const LINUX = 'linux'
const WIN32 = 'win32'

class Say {

  constructor (platform?:string | null) {
    if (!platform) {
      platform = process.platform
    }

    if (platform === MACOS) {
      return new SayPlatformDarwin()
    } else if (platform === LINUX) {
      return new SayPlatformLinux()
    } else if (platform === WIN32) {
      return new SayPlatformWin32()
    }

    throw new Error(`new Say(): unsupported platorm! ${platform}`)
  }

}

export {
  Say,
  MACOS,
  LINUX,
  WIN32,
}

export default new Say()
