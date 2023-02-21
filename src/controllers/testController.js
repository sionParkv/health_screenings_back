import mssql from 'mssql'

const testtest = (req, res) => {
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
      return log.error(`ERROR : ${err}`)
    }
    log.debug(`MSSQL 연결 완료`)
    var request = new mssql.Request()
    request.stream = true

    const q =
      'SELECT A.PTNTINFO_DATE, A.PTNTINFO_IDNO, A.PTNTINFO_NAME, A.PTNTINFO_BITH, A.PTNTINFO_SEX, A.PTNTINFO_AGE, A.PTNTINFO_VIPF,A.PTNTINFO_PKNM, C.PKFGNAME, C.ZONE, C.BSTP FROM dbo.HCAV_PTNTINFO AS A LEFT OUTER JOIN dbo.HCAV_BSNS AS B ON A.PTNTINFO_IDNO = B.BSNS_IDNO AND A.PTNTINFO_DATE = B.BSNS_KEYD LEFT OUTER JOIN dbo.HCAV_PKFG AS C ON A.PTNTINFO_PKFG = C.PKFG WHERE A.PTNTINFO_DATE = convert(varchar(8), getdate(), 112)  AND B.BSNS_IDNO IS NULL'
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
        res.json({
          code: 'OK',
          message: '명지병원 태블릿 백엔드 연결 테스트',
          data: result,
        })
      })
  })
}
const testController = {
  testtest,
}
export { testController }
