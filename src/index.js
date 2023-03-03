import express from 'express'
import http from 'http'
import morgan from 'morgan'
import cors from 'cors'
import oracledb from 'oracledb'

import { logger, stream } from './utills'
import { cfgServer } from './config'
import router from './router'

global.log = logger

const app = express()
const port = cfgServer.port

app.use(cors())
app.use(express.json())
app.use(morgan('combined', { stream }))
app.use('/', router)

app.get('/', (req, res) => {
  res.send('명지병원 건강검진 태블릿 RELAY')
})
app.get('*', (req, res) => {
  res.send('명지병원 건강검진 태블릿 RELAY')
})

const server = http.createServer(app)
server.listen(port)

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    error && log.error(`Error for Server: ${error.message}`)
    throw error
  }

  const bind = typeof port === 'string' ? `${port} namepipe` : `${port} port`
  switch (error.code) {
    case 'EADDRINUSE':
      log.error(`ERROR for Server: ${bind} is already in use`)
      process.exit(1)
      break
  }
})

server.on('listening', () => {
  log.debug(`${port}로 서버가 실행중입니다.`)
})

// try {
//   const platform = process.platform.toString().trim()
//   const lib =
//     platform === 'darwin' ? 'src/lib/oracle_mac' : 'src/lib/oracle_win'
//   const libDir = __dirname.replace('src', lib)
//   oracledb.initOracleClient({ libDir })
//   log.info(`${tag} Oracle client library initialized!`)
// } catch (error) {
//   log.error(`${tag} Oracle client library error: %o`, error?.message || error)
// }
