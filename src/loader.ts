import { join } from 'path'
import { getOptions } from 'loader-utils'
import getCode from './get-code'

export = function (this: any) {
  this.cacheable && this.cacheable(true)

  const {
    folder = 'pages',
  } = getOptions(this)

  const { rootContext } = this

  let callback = this.async()
  getCode(join(rootContext, folder as string)).then(code => callback(null, code))
}

