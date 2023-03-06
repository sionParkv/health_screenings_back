import mssql from 'mssql'

const VisitTickets = async (req, res) => {
  const { NAME, IDNO, ISID, ZONE, BSTP, NUMB, GB, TEMP } = req.body
  console.log(req.body)
  var config = {
    user: 'nss',
    password: 'nss2109',
    server: '192.168.1.98',
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
  mssql.connect(config, async (err) => {
    if (err) {
      log.error(`[InspectionController] connect ERROR : ${err.message}`)
      res.json({
        code: 'FAIL',
        message: '등원체크 데이터베이스 연결 오류',
        error: err.message,
      })
      return
    }

    const rslt = await new mssql.Request()
      .input('BSNS_IDNO', `"${IDNO}"`)
      .input('BSNS_NAME', `"${NAME}"`)
      .input('BSNS_ISID', `"${ISID}"`)
      .input('BSNS_ZONE', `"${ZONE}"`)
      .input('BSNS_BSTP', `${parseInt(BSTP)}`)
      .input('SUGI_NUMB', `${parseInt(NUMB)}`)
      .input('ISSUE_GB', `"${GB}"`)
      .input('BSNS_TEMP', `"${TEMP}"`)
      .execute('P_Issue_1')
      .then((result) => {
        console.debug(
          `[VisitController] procedure result : %o`,
          result.recordsets[0][0]
        )
        res.json({
          code: 'OK',
        })
      })
      .catch((err) => {
        console.error(`[VisitController] procedure ERROR : %o`, err)
        res.json({ code: 'ERROR', error: err.message || '' })
      })
  })
}

const VisitTicket = { VisitTickets }

export { VisitTicket }
