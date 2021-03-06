import { apiservice } from 'txstate-node-utils'
import express from 'express'
import * as sapper from '@sapper/server'
import mongoose from 'mongoose'
import monhelp from 'txstate-node-utils/lib/mongoose'
import UAParser from 'ua-parser-js'
import appauthorization from './lib/appauthorization'
import scanner from './lib/scanner'
import './models/_index'
import fixtures from './fixtures/_index'
const app = apiservice.app

app.use(express.static('static'))
app.use(appauthorization())
app.use(sapper.middleware({
  session: (req, res) => ({
    useragent: new UAParser(req.headers['user-agent']).getResult()
  })
}))
app.use((error, req, res, next) => {
  if (error instanceof mongoose.Error.ValidationError) {
    res.status(422).json({ message: 'Validation failed.', validationerrors: monhelp.convertMongoErrors(error.errors) })
  } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
    res.status(409).json({ message: 'There was a concurrency conflict with your request. Perhaps another user was trying to take action at the same time on the same object.' })
    console.info('concurrency error', req.path)
  } else if (error.status) {
    res.status(error.status).json({ message: error.message })
  } else {
    console.error(error)
    res.status(500).json({ message: process.env.NODE_ENV !== 'production' ? error.stack : 'Internal Server Error.' })
  }
})

apiservice.start().then(async () => {
  if (process.env.NODE_ENV === 'development') await fixtures()
  await scanner()
}).catch(e => console.error('problem while scanning', e))
