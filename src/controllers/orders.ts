/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express from 'express'
import users from '../models/users'
import orders from '../models/orders'
import products from '../models/products'
import brands from '../models/brands'

export const createOrder = async (req: any, res: express.Response) => {
  try {
    /** 把購物車商品 populate 的使用者資訊 */
    const user = await users
      .findById(req.user._id, 'cart')
      .populate('cart.product')

    /** 所有商品 */
    const allProducts = await products.find()

    if (!user || user.cart.length === 0) {
      return res.status(400).send({ success: false, message: '購物車不得為空' })
    }

    for (const item of user.cart as any) {
      if (!item.product.sell) {
        return res.status(400).send({ success: false, message: '包含下架商品' })
      }
      if (item.product.stockQuantity < item.quantity) {
        return res.status(400).send({ success: false, message: '庫存不足' })
      }

      console.log(item.product._id)
      // 扣除庫存
      // 用 mongoose equals 方法來比較兩者是否相等
      const idx = allProducts.findIndex((product) =>
        product._id.equals(item.product._id)
      )
      if (idx === -1) {
        return res.status(400).send({ success: false, message: '商品不存在' })
      }

      allProducts[idx].stockQuantity -= item.quantity
      allProducts[idx].soldQuantity += item.quantity
    }

    /** 取得商城資訊(運費、免運金額) */
    let brandFee = {
      deliveryFee: 0,
      freeDeliveryFee: 0
    }
    const AllBrand = await brands.find()

    if (AllBrand.length > 0) {
      const brand = AllBrand[0]
      const { deliveryFee, freeDeliveryFee } = brand
      brandFee = {
        deliveryFee,
        freeDeliveryFee
      }
    }

    /** 總金額(數量乘金額乘打折) */
    let amount = user.cart.reduce(
      (acc, cur: any) =>
        acc +
        cur.quantity *
          cur.product.price *
          ((100 - cur.product.discountRate) / 100),
      0
    )

    // 如果總金額比免運錢少 加上運費
    if (amount < brandFee.freeDeliveryFee) {
      amount += brandFee.deliveryFee
    }
    // 建立訂單 products 物件陣列儲存當前商品售價，之後商品售價改變不會影響訂單的價格
    const result = await orders.create({
      ...req.body,
      products: user.cart.map((item: any) => ({
        ...item,
        price: item.product.price * ((100 - item.product.discountRate) / 100)
      })),
      deliveryFee: amount < brandFee.freeDeliveryFee ? brandFee.deliveryFee : 0,
      totalAmount: amount
    })

    // 清空購物車
    await users.findByIdAndUpdate(
      req.user._id,
      { $set: { cart: [] } },
      { new: true }
    )

    // 儲存經過扣掉庫存後的商品
    for (const product of allProducts) {
      await product.save()
    }

    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getOrders = async (req: any, res: express.Response) => {
  try {
    const result = await orders
      .find({ user: req.user._id })
      .populate('products.product')
      .sort({ createdAt: -1 })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getOrder = async (req: express.Request, res: express.Response) => {
  try {
    const result = await orders
      .findById(req.params.id)
      .populate('products.product')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllOrders = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await orders
      .find()
      .populate('products.product')
      .sort({ createdAt: -1 })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editOrder = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await orders
      .findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body
        },
        { new: true }
      )
      .populate('products.product')

    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const deleteOrder = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    await orders.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
