/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import passport from 'passport'
import passportJWT from 'passport-jwt'
import passportLocal from 'passport-local'
import bcrypt from 'bcrypt'
import users from '../models/users'
import admins from '../models/admins'

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// done(錯誤 ,傳出去的內容, 可以放驗證成功或失敗的訊息)
// done 的內容傳入 auth.ts 的 authenticate callback function 參數

passport.use(
  'login',
  new LocalStrategy(
    {
      // req body 的欄位名稱
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // 允許下方 callback 中取得 req
    },
    // 因為上面有註明 passReqToCallback: true，所以第一個參數會是 req
    // 驗證完執行下面 function (?
    async (req, email, password, done: any) => {
      try {
        const user: any = await users.findOne({ email })

        if (!user) {
          return done(null, false, { message: '帳號不存在' })
        }
        if (!bcrypt.compareSync(password, user.hashedPassword)) {
          return done(null, false, { message: '密碼錯誤' })
        }
        return done(null, user, { message: '一般使用者登入' })
      } catch (error) {
        return done(error, false, { message: '錯誤' })
      }
    }
  )
)

passport.use(
  'adminLogin',
  new LocalStrategy(
    {
      // req body 的欄位名稱
      usernameField: 'account',
      passwordField: 'password',
      passReqToCallback: true // 允許下方 callback 中取得 req
    },
    // 因為上面有註明 passReqToCallback: true，所以第一個參數會是 req
    // 驗證完執行下面 function (?
    async (req, account, password, done: any) => {
      try {
        const admin: any = await admins.findOne({ account })

        if (!admin) {
          return done(null, false, { message: '帳號不存在' })
        }
        if (!bcrypt.compareSync(password, admin.hashedPassword)) {
          return done(null, false, { message: '密碼錯誤' })
        }
        return done(null, admin, { message: '管理者登入' })
      } catch (error) {
        return done(error, false, { message: '錯誤' })
      }
    }
  )
)

// 幫忙 decode jwt，讓我們可以直接取得 payload 解譯後的值(物件)
passport.use(
  'jwt',
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),

      secretOrKey: process.env.SECRET as string,
      passReqToCallback: true,
      ignoreExpiration: true // 忽略 jwt 過期，因為要自己寫延長機制 所以 callback 自行判斷過期回傳
    },
    async (req, payload, done) => {
      // 判斷過期
      const expired = payload.exp * 1000 < Date.now()
      // jwt 過期而且從延長或是登出以外來的路徑請求就跳登入逾期
      if (
        expired &&
        req.originalUrl !== '/users/extend' &&
        req.originalUrl !== '/users/logout'
      ) {
        done(null, false, { message: '登入逾期' })
        return
      }

      const token: string = req.headers.authorization.split(' ')[1]

      try {
        // 應該是 jwt 用 _id 當作值組成的內容
        const user = await users.findById(payload._id)

        if (!user) {
          done(null, false, { message: '使用者不存在' })
          return
        }
        if (!user.tokens.includes(token)) {
          done(null, false, { message: '驗證錯誤' })
          return
        }
        done(null, { user, token }, { message: '使用者JWT' })
      } catch (error) {
        done(error, false, { message: '錯誤' })
      }
    }
  )
)

// 幫忙 decode jwt，讓我們可以直接取得 payload 解譯後的值(物件)
passport.use(
  'adminJwt',
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),

      secretOrKey: process.env.SECRET as string,
      passReqToCallback: true,
      ignoreExpiration: true // 忽略 jwt 過期，因為要自己寫延長機制 所以 callback 自行判斷過期回傳
    },
    async (req, payload, done) => {
      // 判斷過期
      const expired = payload.exp * 1000 < Date.now()
      // jwt 過期而且從延長或是登出以外來的路徑請求就跳登入逾期
      if (
        expired &&
        req.originalUrl !== '/admins/extend' &&
        req.originalUrl !== '/admins/logout'
      ) {
        done(null, false, { message: '登入逾期' })
        return
      }

      const token: string = req.headers.authorization.split(' ')[1]

      try {
        // 應該是 jwt 用 _id 當作值組成的內容
        const admin = await admins.findById(payload._id)

        if (!admin) {
          done(null, false, { message: '管理者不存在' })
          return
        }
        if (!admin.tokens.includes(token)) {
          done(null, false, { message: '驗證錯誤' })
          return
        }
        done(null, { admin, token }, { message: '管理者JWT' })
      } catch (error) {
        done(error, false, { message: '錯誤' })
      }
    }
  )
)
