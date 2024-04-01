/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import history from 'connect-history-api-fallback'

import './passport/passport'
import brandsRouter from './routes/brands'
import storesRouter from './routes/stores'
import usersRouter from './routes/users'
import adminsRouter from './routes/admins'
import productsRouter from './routes/products'
import categoriesRouter from './routes/categories'
import newsRouter from './routes/news'
import ordersRouter from './routes/orders'
import outfitsRouter from './routes/outfits'
import ratingsRouter from './routes/ratings'

mongoose
  // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  .connect(process.env.DB_URL as string)
  .catch((error: any) => {
    console.log(error.message)
  })

const app = express()

// 配置靜態資源目錄，確保能夠存取打包後的前端資源文件
app.use(express.static(path.resolve(__dirname, 'dist')))

// 使用 HTML5 History 模式的中間件，確保在非首頁刷新時能夠正確路由到對應的頁面
app.use(
  history({
    verbose: true,
    index: '/'
  })
)

app.use(
  cors({
    origin(origin, callback) {
      // callback(錯誤訊息, 是否通過)
      // console.log(origin)
      if (
        origin === undefined ||
        origin.includes('https://my-clothing-store-front.vercel.app') ||
        origin.includes('localhost')
      ) {
        callback(null, true)
      } else {
        callback(new Error('Not Allowed'), false)
      }
    }
  })
)

app.use((_: any, req: any, res: any, next: any) => {
  res.status(400).send({ success: false, message: '請求被拒' })
})

app.use(express.json())

app.use((_: any, req: any, res: any, next: any) => {
  res.status(400).send({ success: false, message: '請求格式錯誤' })
})

app.use('/brands', brandsRouter)
app.use('/stores', storesRouter)
app.use('/users', usersRouter)
app.use('/admins', adminsRouter)
app.use('/products', productsRouter)
app.use('/categories', categoriesRouter)
app.use('/news', newsRouter)
app.use('/orders', ordersRouter)
app.use('/outfits', outfitsRouter)
app.use('/ratings', ratingsRouter)

app.all('*', (req: express.Request, res: express.Response) => {
  res.status(404).send({ success: false, message: '找不到' })
})

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
app.listen(process.env.PORT ?? 8080, () => {
  console.log('Server is running')
})
