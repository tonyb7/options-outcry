/** @type {import('next').NextConfig} */

// https://medium.com/courtly-intrepid/environmental-variables-in-next-js-with-dotenv-599c5bbfdf74
const webpack = require('webpack')
const { parsed: myEnv } = require('dotenv').config()

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(myEnv))
    return config
  }
}

module.exports = nextConfig
