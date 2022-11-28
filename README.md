# @shack-js/auto-routes-loader
loader that can auto generate routes for react and react-router, inspired by Next.JS

给 react + react-router 项目自动生成路由信息的 loader，灵感来源于 Next.JS

## basic usage | 基本使用

put `page` component files inside folder `pages`, each file has default export 

把 `页面` 组件文件放到 `pages` 文件夹，每个文件都使用 default 导出

### use cli | 使用命令行

`npx @shack-js/auto-routes-loader <pages-folder> <target-file>`

```
npx @shack-js/auto-routes-loader src/pages src/test-get-routes.js

```

and then import default function from the file and it will return routes

然后从生成文件引入导出的函数，运行生成路由信息并使用

```
...

import { useRoutes } from "react-router-dom"
import getRoutes from './test-get-routes'
let routes = getRoutes()
const App = () => {
  return useRoutes(routes)
}
...
```

### use loader | 以 webpack loader 方式使用

```
npm i @shack-js/auto-routes-loader -D
```

in `webpack.config.js`
```
module.exports = {
  module:{
    rules:[
      ...,
      {
        test: /\.m?js$/,
        /* important: shack-get-routes needs to be compiled if you target more browsers */
        exclude: /(node_modules|bower_components).*(?<!shack-get-routes\.js)$/, 
        use: {
          loader: 'babel-loader',
          options: {
            ...
          }
        }
      },
      {
        test: /shack-get-routes\.js$/,
        use: {
          loader: '@shack-js/auto-routes-loader',
        }
      }
    ]
  }
}
```

in your code

```
import { createRoot } from 'react-dom/client'
import {  BrowserRouter, useRoutes } from "react-router-dom"
// ** import this function and **
import getRoutes from '@shack-js/auto-routes-loader/dist/shack-get-routes'
import { Suspense } from 'react'
...

// ** auto get routes you can use **
let routes = getRoutes()

const App = () => {
  return useRoutes(routes)
}

// ** pages are lazy loaded, so remember to wrap with `Suspense` **
createRoot(el).render(<BrowserRouter>
  <Suspense fallback={'page loading...'}>
    <App />
  </Suspense>
</BrowserRouter>)

```

## details | 细节 

change pages folder: use `folder` option in webpack config

调整存放页面的文件夹路径： 修改 loader 的 `folder` 参数

```
      {
        test: /\.m?js$/,
        /* important: shack-get-routes needs to be compiled */
        /* 重要: shack-get-routes 需要走 babel */
        exclude: /(node_modules|bower_components).*(?<!shack-get-routes\.js)$/, 
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      /* use this loader */
      {
        test: /shack-get-routes\.js$/,
        use: {
          loader: '@shack-js/auto-routes-loader',
          options: {
            folder: 'src/pages'
          }
        }
      }
```

use layouts: put a `_layout.js` file in a folder, all files under the folder will share the layout, child pages shall appear where `Outlet` locates, example code:

使用模板： 在 `_layout.js` 中导出模板，模板中使用 `Outlet` 指定页面内容的位置

```
// pages/_layout.js

import { Link, Outlet, useLocation } from "react-router-dom"

export default ({ }) => {
  let location = useLocation()
  if (location.pathname.startsWith('/login')) return <Outlet />
  return <div>
    <p>layout for all pages except login</p>
    <div> <Outlet /> </div>
  </div>
}
```

