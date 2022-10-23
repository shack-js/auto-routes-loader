#!/usr/bin/env node

import { writeFile } from "fs/promises"
import { dirname } from "path"
import getCode from "./get-code"

let args = process.argv.slice(2)

if (args.length != 2) throw 'only two arguments allowed, `npx @shack-js/auto-routes-loader <pages-folder> <generate-target>`'

let [folder, target] = args

getCode(folder, dirname(target))
  .then(code => writeFile(target, code, 'utf-8'))
  .then(() => console.log(`file ${target} generated!`))
  .catch(e => console.error(e))