import { readdir, stat } from 'fs/promises'
import { join } from 'path'

export default getCode

async function getCode(folder: string) {
  let { pathNameDic, routes } = await getMeta(folder), lines = [
    `import React, { lazy } from 'react'`,
    `import { Outlet } from 'react-router-dom'`,
    `export default ()=>{`
  ], json = JSON.stringify(routes)
  console.log(json)
  for (let [file, name] of pathNameDic.entries()) {
    console.log(JSON.stringify(file), json.indexOf(JSON.stringify(file)))
    lines.push(`let ${name} = lazy(()=>import(${JSON.stringify(file)}))`)
    json = json.replaceAll(JSON.stringify(file), `<${name} />`)
  }
  json = json.replaceAll(`"element":""`, `"element":<Outlet />`)
  lines.push(`return ${json}`)
  lines.push(`}`)
  return lines.join('\n')
}

type MetaItem = Partial<{
  path: string,
  element: string,
  index: boolean,
  children: MetaItem[]
}>

async function getMeta(folder: string) {
  let usedNames = new Set, pathNameDic = new Map
  let root = await loadRecursive(folder, '')

  return {
    pathNameDic,
    routes: root.element ? [root] : root.children
  }

  async function loadRecursive(folder: string, name: string): Promise<MetaItem> {
    let children = [], element = ''

    for (let file of await readdir(folder)) {
      let fullFile = join(folder, file)
      let fileStat = await stat(fullFile)
      let base = nameWithoutExt(file)
      if (fileStat.isFile()) { // file
        if (base === '_layout') {
          element = fullFile
          pathNameDic.set(fullFile, findName('Layout'))
        } else if (base === 'index') {
          pathNameDic.set(fullFile, findName('Index'))
          children.push({
            index: true,
            element: fullFile,
          })
        } else {
          let paramed = (base.startsWith('[') && base.endsWith(']'))
          pathNameDic.set(fullFile, findName(camelize(paramed ? base.substr(1, base.length - 2) : base)))
          children.push({
            path: paramed ? `:${base.substr(1, base.length - 2)}` : base,
            element: fullFile,
          })
        }
      } else { // folder
        children.push(await loadRecursive(join(folder, file), file))
      }
    }

    return {
      path: name,
      children,
      element
    }
  }

  function findName(name = '') {
    for (let i = 0; ; i++) {
      let name1 = name + i
      if (!usedNames.has(name1)) {
        usedNames.add(name1)
        return name1
      }
    }
  }

  function nameWithoutExt(file: string) {
    return file.substring(0, file.lastIndexOf('.'))
  }
}


function camelize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase()).replace(/\s+/g, '');
}