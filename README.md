# @shack-js/auto-routes-loader
loader that can auto generate routes for react and react-router, inspired by Next.JS

# basic usage

put page component files inside folder `pages`, each file has default export 


in `webpack.config.js`
```
module.exports = {
  module:{
    rules:[
      ...,
      {
        test: /shack-get-routes\.js$/,
        exclude: /(node_modules|bower_components)/,
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

## details

change pages folder: use `folder` option in webpack config

```
      {
        test: /shack-get-routes\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: '@shack-js/auto-routes-loader',
          options: {
            folder: 'src/pages'
          }
        }
      }
```

use layouts: put a `_layout.js` file in a folder, all files under the folder will share the layout, child pages shall appear where `Outlet` locates, example code:

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

