import mssql from 'mssql'
import oracledb from 'oracledb'
import moment from 'moment'

import { cfgOracle } from '../config/oracle.config'

const Visit = (req, res) => {
  // 오라클 DB
  const optionOutFormat = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    resultSet: true,
  }
  oracledb.autoCommit = true

  log.debug(`Oracle connectString: %o`, cfgOracle.cs)
  oracledb.getConnection(
    {
      connectString: cfgOracle.cs,
      password: cfgOracle.password,
      user: cfgOracle.user,
    },
    async (error, connection) => {
      // 오라클DB 연결 오류
      if (error) {
        log.error('[oracle.connect] error: %o', error)
        res.json({ code: 'ERROR', error: error.message || '' })
        return
      }

      // 오라클DB 연결 성공
      const query = `SELECT PMSSPTCNO, PMSSPTNAM, PMSSBIRDT, PMSSFTIME , '종합' as GUBUN
                                      FROM MJH_RFID.PMSSUVIEW_JONG 
                                      WHERE PMSSFDATE ='${moment().format("YYYYMMDD")}'
union all                                                                          
SELECT PMSSPTCNO, PMSSPTNAM, PMSSBIRDT, PMSSFTIME , '일반' as GUBUN
                                      FROM MJH_RFID.PMSSUVIEW_GONG
                                       WHERE PMSSFDATE ='${moment().format("YYYYMMDD")}'`
      console.log(query)
      let result = await connection.execute(query, [], optionOutFormat)
      log.info('[oracle.query] result: %o', result)
      log.info('[oracle.query] result: %o', result.resultSet)
      log.info('[oracle.query] result: %o', result.rows)

      if (result.rows) {
        result = result.rows
      }

      connection && (await connection.close())

      if (result?.length > 0) {
        res.json({
          code: 'OK',
          message: '등원체크 조회에 성공 하였습니다.',
          data: result,
        })
      } else {
        res.json({
          code: 'FAIL',
          message: '등원체크 데이터가 없습니다.',
        })
      }
    }
  )

  // --------------------------------------------------------------------- //
  // ns DB
  // var config = {
  //   user: 'nss',
  //   password: 'nss2109',
  //   server: '192.168.1.100',
  //   database: 'HealthCheck_MJH',
  //   steram: true,
  //   pool: {
  //     max: 10,
  //     min: 0,
  //     idleTimeoutMillis: 30000,
  //   },
  //   options: {
  //     encrypt: true,
  //     trustServerCertificate: true,
  //   },
  // }

  // mssql.connect(config, function (err) {
  //   if (err) {
  //     res.json({
  //       code: 'FAIL',
  //       message: '등원체크 데이터베이스 연동 오류',
  //       error: err.message,
  //     })
  //     return log.error(`ERROR : ${err}`)
  //   }
  //   log.debug(`MSSQL 연결 완료`)
  //   var request = new mssql.Request()
  //   request.stream = true

  //   const q =
  //     'SELECT A.PTNTINFO_DATE, A.PTNTINFO_IDNO, A.PTNTINFO_NAME, A.PTNTINFO_BITH, A.PTNTINFO_SEX, A.PTNTINFO_AGE, A.PTNTINFO_VIPF,A.PTNTINFO_PKNM, C.PKFGNAME, C.ZONE, C.BSTP FROM dbo.HCAV_PTNTINFO AS A LEFT OUTER JOIN dbo.HCAV_BSNS AS B ON A.PTNTINFO_IDNO = B.BSNS_IDNO AND A.PTNTINFO_DATE = B.BSNS_KEYD LEFT OUTER JOIN dbo.HCAV_PKFG AS C ON A.PTNTINFO_PKFG = C.PKFG WHERE A.PTNTINFO_DATE = convert(varchar(8), getdate(), 112)  AND B.BSNS_IDNO IS NULL'
  //   request.query(q, (err, recordset) => {
  //     if (err) {
  //       res.json({
  //         code: 'FAIL',
  //         message: '등원체크 중 오류가 발생하였습니다.',
  //         error: err.message,
  //       })
  //       return log.error('query error :', err.message)
  //     }
  //   })

  //   var result = []
  //   request
  //     .on('error', function (err) {
  //       log.error(`등원체크 중 오류가 발생하였습니다. : ${err.message}`)
  //       res.json({
  //         code: 'FAIL',
  //         message: '등원체크 중 오류가 발생하였습니다.',
  //         error: err.message,
  //       })
  //     })
  //     .on('row', (row) => {
  //       result.push(row)
  //     })
  //     .on('done', () => {
  //       log.debug('등원체크 데이터베이스 조회 %o', result)
  //       if (result?.length !== 0) {
  //         res.json({
  //           code: 'OK',
  //           message: '등원체크 조회에 성공 하였습니다.',
  //           data: result,
  //         })
  //       } else {
  //         res.json({
  //           code: 'FAIL',
  //           message: '등원체크 데이터가 없습니다.',
  //         })
  //       }
  //     })
  // })
}

const VisitController = { Visit }

export { VisitController }
