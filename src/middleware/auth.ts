/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import passport from 'passport'
import jsonwebtoken from 'jsonwebtoken'
import express from 'express'
/*
解釋: passport.authenticate(XXXX) 會回傳一個 function，然後把 middleware 執行 login 拿到的三個參數去執行這個 function
步驟
1. 執行 middleware auth.login
2. 使用 passport.ts 的 login 驗證方法(基本上驗證方法都自己判斷的，疑似 passport local 驗證沒太大用處?)
3. done 回傳的參數會在這裡的 callback 接收
4. 判斷 done 回傳結果決定回傳失敗訊息或是進入下一個 middleware
*/

export const login = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  passport.authenticate(
    'login',
    { session: false },
    // 從 passport.ts done 傳果來的參數
    (err: any, user: any, info: any) => {
      if (err || !user) {
        if (info.message === 'Missing credentials') info.message = '驗證錯誤'
        return res.status(401).send({ success: false, message: info.message })
      }
      req.user = user
      next()
    }
  )(req, res, next)
}

export const jwt = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: any, data: any, info: any) => {
      if (err || !data) {
        if (info instanceof jsonwebtoken.JsonWebTokenError) {
          return res.status(401).send({ success: false, message: '驗證錯誤' })
        } else {
          return res.status(401).send({ success: false, message: info.message })
        }
      }
      req.user = data.user
      // @ts-ignore
      req.token = data.token
      next()
    }
  )(req, res, next)
}
