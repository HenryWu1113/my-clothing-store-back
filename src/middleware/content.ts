/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
export default (type: string) => {
  return (req: any, res: any, next: any) => {
    if (
      !req.headers['content-type'] ||
      !req.headers['content-type'].includes(type)
    ) {
      return res.status(400).send({ success: false, message: '資料格式錯誤' })
    }
    next()
  }
}
