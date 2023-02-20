import express from 'express'
import http from 'http'
import morgan from 'morgan'
import mssql from 'mssql'

import { logger, stream } from './utills'
import { cfgServer } from './config'
import router from './router'

global.log = logger

const app = express()
const port = cfgServer.port

app.use('/', router)
app.use(express.json())
app.use(morgan('combined', { stream }))

app.get('/', (req, res) => {
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
var config = {
  user: 'nss',
  password: 'nss2109',
  server: '192.168.1.100',
  database: 'HealthCheck_MJH',
  steram: true,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
}

server.on('listening', () => {
  log.debug(`${port}로 서버가 실행중입니다.`)
  mssql.connect(config, function (err) {
    if (err) {
      return log.error(`ERROR : ${err}`)
    }
    log.debug(`MSSQL 연결 완료`)
    var request = new mssql.Request()
    request.stream = true

    const q = 'SELECT  '
    request.query(q, (err, recordset) => {
      if (err) {
        return console.log('query error :', err)
      }
    })

    var result = []
    request
      .on('error', function (err) {
        console.log(err)
      })
      .on('row', (row) => {
        result.push(row)
      })
      .on('done', () => {
        // 마지막에 실행되는 부분
        console.log('result :', result)
      })
  })
})
