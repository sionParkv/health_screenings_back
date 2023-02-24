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

const PatientClick = (req, res) => {
  const { patno } = req.body
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

    const q = `SELECT distinct db.PTNTEXAM_DATE, db.PTNTEXAM_STAT, db.PTNTEXAM_STEP, db.PTNTEXAM_RMCD, db.PTNTEXAM_RMNM, ISNULL(db.PTNTEXAM_RMNUM, '1') as PTNTEXAM_RMNUM,
      convert(CHAR(5), db.PTNTEXAM_STTM, 108) as PTNTEXAM_STTM, convert(CHAR(5), db.PTNTEXAM_EDTM, 108) as PTNTEXAM_EDTM,
      ae.PTNTINFO_IDNO, ae.PTNTINFO_NAME, ex.EXAMRMINFO_WTTM, case when ex.EXAMRMINFO_PKFG = 'R' then 'R' else '1' end as EXAMRMINFO_PKFG,
      CASE db.PTNTEXAM_RMNUM WHEN '15'
      THEN (SELECT TOP 1 row FROM (SELECT b.PTNTINFO_IDNO, row_number() OVER (ORDER BY case a.PTNTEXAM_STAT WHEN 'W' THEN 1 ELSE 2 END,ISNULL(a.PTNTEXAM_TGTM, GETDATE()) ASC) AS row
      FROM hcav_ptntexam a,hcav_ptntinfo b
      WHERE a.PTNTEXAM_IDNO = b.PTNTINFO_IDNO
      AND b.ptntinfo_date = convert(varchar, getdate(), 112)
      AND a.ptntexam_date=convert(varchar, getdate(), 112)
      AND a.PTNTEXAM_STAT = 'W'
      AND db.PTNTEXAM_RMNUM = a.PTNTEXAM_RMNUM) c WHERE c.PTNTINFO_IDNO = db.PTNTEXAM_IDNO)
      ELSE (SELECT row FROM (SELECT b.PTNTINFO_IDNO, row_number() OVER (ORDER BY case a.PTNTEXAM_STAT WHEN 'W' THEN 1 ELSE 2 END,ISNULL(a.PTNTEXAM_TGTM, GETDATE()) ASC) AS row
      FROM hcav_ptntexam a,hcav_ptntinfo b
      WHERE a.PTNTEXAM_IDNO = b.PTNTINFO_IDNO
      AND b.ptntinfo_date = convert(varchar, getdate(), 112)
      AND a.ptntexam_date=convert(varchar, getdate(), 112)
      AND a.PTNTEXAM_STAT = 'W'
      AND a.PTNTEXAM_RMCD = db.PTNTEXAM_RMCD
      AND db.PTNTEXAM_RMNUM = a.PTNTEXAM_RMNUM) c WHERE c.PTNTINFO_IDNO = db.PTNTEXAM_IDNO) END AS row
      FROM hcav_ptntexam db, HCAV_EXAMRMINFO ex, HCAV_PTNTINFO ae
      WHERE db.PTNTEXAM_IDNO  = '${patno}'
      AND db.PTNTEXAM_DATE = convert(varchar, getdate(), 112)
      AND db.PTNTEXAM_IDNO = ae.PTNTINFO_IDNO
      AND ex.EXAMRMINFO_RMCD = db.PTNTEXAM_RMCD
      AND ae.PTNTINFO_DATE = convert(varchar, getdate(), 112)`
    request.query(q, (err, recordset) => {
      if (err) {
        return console.log('query error :', err)
      }
    })

    var result = []
    request
      .on('error', function (err) {
        log.error(
          `[PatientController] 검사현황 조회 중 오류가 발생하였습니다. : ${err}`
        )
      })
      .on('row', (row) => {
        result.push(row)
      })
      .on('done', () => {
        // 마지막에 실행되는 부분
        res.json({
          code: 'OK',
          message: '명지병원 태블릿 검사현황 클릭 이벤트 테스트',
          data: result,
        })
        log.debug('종합건강진단 검사현황 조회 성공 %o', result)
      })
  })
}
const PatientController = {
  Patient,
  PatientClick,
}
export { PatientController }
