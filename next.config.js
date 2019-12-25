const withCSS = require('@zeit/next-css')

const { parsed: localEnv } = require('dotenv').config()
const webpack = require('webpack')

module.exports = withCSS({
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv))
    return config
  },
  env: {
    "FIREBASE_API_KEY": process.env.FIREBASE_API_KEY,
    "FIREBASE_AUTH_DOMAIN": process.env.FIREBASE_AUTH_DOMAIN,
    "FIREBASE_DATABASE_URL": process.env.FIREBASE_DATABASE_URL,
    "FIREBASE_PROJECT_ID": process.env.FIREBASE_PROJECT_ID,
    "FIREBASE_STORAGE_BUCKET": process.env.FIREBASE_STORAGE_BUCKET,
    "FIREBASE_MESSAGING_SENDER_ID": process.env.FIREBASE_MESSAGING_SENDER_ID,
    "FIREBASE_APP_ID": process.env.FIREBASE_APP_ID,
    "GOOGLE_CLIENT_ID": process.env.GOOGLE_CLIENT_ID,
    "GOOGLE_API_KEY": process.env.GOOGLE_API_KEY
  }
})