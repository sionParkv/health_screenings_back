import moment from 'moment'
import mssql from 'mssql'

const VisitTickets = async (req, res) => {
  const { NAME, IDNO, BSTP, ZONE, TEMP } = req.body
  console.log('[VisitTicket.VisitTickets] request body: ', req.body)
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

    console.log('[VisitTickets] Procedure: ', 'P_Issue_1')
    console.log('[VisitTickets] Parameters - BSNS_IDNO: ', `${IDNO}`)
    console.log('[VisitTickets] Parameters - BSNS_NAME: ', `${NAME}`)
    console.log('[VisitTickets] Parameters - BSNS_ISID: ', `ISMC0001`)
    console.log('[VisitTickets] Parameters - BSNS_ZONE: ', `${ZONE}`)
    console.log('[VisitTickets] Parameters - BSNS_BSTP: ', BSTP)
    console.log('[VisitTickets] Parameters - SUGI_NUMB: ', 500)
    console.log('[VisitTickets] Parameters - ISSUE_GB: ', `A`)
    console.log('[VisitTickets] Parameters - BSNS_TEMP: ', `${TEMP}`)
    const rslt = await new mssql.Request()
      .input('BSNS_IDNO', `${IDNO}`)
      .input('BSNS_NAME', `${NAME}`)
      .input('BSNS_ISID', `ISMC0001`)
      .input('BSNS_ZONE', `${ZONE}`)
      .input('BSNS_BSTP', BSTP)
      .input('SUGI_NUMB', 500)
      .input('ISSUE_GB', `A`)
      .input('BSNS_TEMP', `${TEMP}`)
      .execute('P_Issue_1')
      .then((result) => {
        console.debug(
          `[VisitController] procedure result recordsets : %o`,
          result.recordsets[0][0]
        )
        console.debug(`[VisitController] procedure result : %o`, result)
        res.json({
          code: 'OK',
          Wait_Count: result?.recordsets[0][0]?.Wait_Count,
          Issue_Count: result?.recordsets[0][0]?.Issue_Count,
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
