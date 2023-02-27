import mssql from 'mssql'

const Visit = (req, res) => {
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
  mssql.connect(config, function (err) {
    if (err) {
      res.json({
        code: 'FAIL',
        message: '등원체크 데이터베이스 연동 오류',
        error: err.message,
      })
      return log.error(`ERROR : ${err}`)
    }
    log.debug(`MSSQL 연결 완료`)
    var request = new mssql.Request()
    request.stream = true

    const q =
      'SELECT A.PTNTINFO_DATE, A.PTNTINFO_IDNO, A.PTNTINFO_NAME, A.PTNTINFO_BITH, A.PTNTINFO_SEX, A.PTNTINFO_AGE, A.PTNTINFO_VIPF,A.PTNTINFO_PKNM, C.PKFGNAME, C.ZONE, C.BSTP FROM dbo.HCAV_PTNTINFO AS A LEFT OUTER JOIN dbo.HCAV_BSNS AS B ON A.PTNTINFO_IDNO = B.BSNS_IDNO AND A.PTNTINFO_DATE = B.BSNS_KEYD LEFT OUTER JOIN dbo.HCAV_PKFG AS C ON A.PTNTINFO_PKFG = C.PKFG WHERE A.PTNTINFO_DATE = convert(varchar(8), getdate(), 112)  AND B.BSNS_IDNO IS NULL'
    request.query(q, (err, recordset) => {
      if (err) {
        res.json({
          code: 'FAIL',
          message: '등원체크 중 오류가 발생하였습니다.',
          error: err.message,
        })
        return log.error('query error :', err.message)
      }
    })

    var result = []
    request
      .on('error', function (err) {
        log.error(`등원체크 중 오류가 발생하였습니다. : ${err.message}`)
        res.json({
          code: 'FAIL',
          message: '등원체크 중 오류가 발생하였습니다.',
          error: err.message,
        })
      })
      .on('row', (row) => {
        result.push(row)
      })
      .on('done', () => {
        log.debug('등원체크 데이터베이스 조회 %o', result)
        if (result?.length !== 0) {
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
      })
  })
}
const VisitController = {
  Visit,
}
export { VisitController }
