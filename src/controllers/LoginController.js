import mssql from 'mssql'

const Login = (req, res) => {
  const { account_id, account_pass } = req.body
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
        message: '데이터베이스 연동 오류',
        error: err.message,
      })
      return log.error(`ERROR : ${err}`)
    }
    log.debug(`MSSQL 연결 완료`)
    var request = new mssql.Request()
    request.stream = true

    const q = `SELECT account_id, account_pass, account_name FROM hcav_account WHERE ACCOUNT_AUTH = '3' and account_id='${account_id}' and account_pass='${account_pass}'`
    request.query(q, (err, recordset) => {
      if (err) {
        res.json({
          code: 'FAIL',
          message: '명지병원 태블릿 로그인 연결 실패',
          error: err.message,
        })
        return log.error(
          `로그인 쿼리 입력 오류가 발생 하였습니다. : ${err.message}`
        )
      }
    })

    var result = []
    request
      .on('error', function (err) {
        log.error(
          `로그인 쿼리 입력 중 오류가 발생 하였습니다. : ${err.message}`
        )
        res.json({
          code: 'FAIL',
          message: '로그인 쿼리 입력 중 오류가 발생 하였습니다.',
          error: err.message,
        })
      })
      .on('row', (row) => {
        result.push(row)
      })
      .on('done', () => {
        log.debug('로그인 쿼리 데이터 조회 %o', result)
        if (result?.length !== 0) {
          res.json({
            code: 'OK',
            message: '명지병원 태블릿 로그인 연결 성공',
            data: result,
          })
        } else {
          res.json({
            code: 'FAIL',
            message: '아이디 또는 비밀번호가 일치하지 않습니다.',
          })
        }
      })
  })
}
const LoginController = {
  Login,
}
export { LoginController }
