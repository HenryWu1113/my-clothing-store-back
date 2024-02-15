/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type express from 'express'

export default (
  req: any,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req?.admin?.role !== 'manager') {
    res.status(403).send({ success: false, message: '權限不足' })
  } else {
    next()
  }
}
