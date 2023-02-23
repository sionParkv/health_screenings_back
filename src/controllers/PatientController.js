import mssql from 'mssql'

const Patient = (req, res) => {
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
      'SELECT a.PTNTINFO_IDNO, a.PTNTINFO_NAME, a.PTNTINFO_SEX, a.PTNTINFO_AGE, A.PTNTINFO_BITH,a.PTNTINFO_VIPF, a.PTNTINFO_PKNM, B.PKFGNAME AS PTNTINFO_PKFG, A.PTNTINFO_CKFG FROM HCAV_PTNTINFO a, HCAV_PKFG B WHERE a.ptntinfo_date = convert(varchar, getdate(), 112) AND A.PTNTINFO_PKFG = B.PKFG      '
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
const PatientController = {
  Patient,
}
export { PatientController }
