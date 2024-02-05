/* eslint-disable @typescript-eslint/space-before-function-paren */
import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import './passport/passport'
import usersRouter from './routes/users'

mongoose
  // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  .connect(process.env.DB_URL as string)
  .catch((error: any) => {
    console.log(error.message)
  })

const app = express()

app.use(
  cors({
    origin(origin, callback) {
      // callback(錯誤訊息, 是否通過)
      console.log(origin)
      if (
        origin === undefined ||
        origin.includes('github') ||
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

app.use('/users', usersRouter)

app.all('*', (req, res) => {
  res.status(404).send({ success: false, message: '找不到' })
})

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
app.listen(process.env.PORT ?? 8080, () => {
  console.log('Server is running')
})
