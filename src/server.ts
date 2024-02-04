import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'

const app = express()

mongoose
  // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  .connect(process.env.DB_URL as string)
  .catch((error: any) => {
    console.log(error.message)
  })

app.use(express.json())

app.use((_: any, req: any, res: any, next: any) => {
  res.status(400).send({ success: false, message: '請求格式錯誤' })
})

app.all('*', (req, res) => {
  res.status(404).send({ success: false, message: '找不到' })
})

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
app.listen(process.env.PORT ?? 8080, () => {
  console.log('Server is running')
})
