import Razorpay from 'razorpay'

const keyId = process.env.NODE_ENV === 'production' 
  ? process.env.RAZORPAY_KEY_ID_LIVE 
  : process.env.RAZORPAY_KEY_ID_TEST

const keySecret = process.env.NODE_ENV === 'production'
  ? process.env.RAZORPAY_KEY_SECRET_LIVE
  : process.env.RAZORPAY_KEY_SECRET_TEST

export const razorpay = new Razorpay({
  key_id: keyId!,
  key_secret: keySecret!,
})

export const RAZORPAY_KEY_ID = keyId!
