import mssql from 'mssql'

const Inspection = (req, res) => {
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
  mssql.connect(config, function (err) {
    if (err) {
      res.json({
        code: 'FAIL',
        message: '수진자조회 데이터베이스 연결 오류',
        error: err.message,
      })
      return log.error(`[InspectionController] connect ERROR : ${err.message}`)
    }
    log.debug(`MSSQL 연결 완료`)
    var request = new mssql.Request()
    request.stream = true

    const q = `SELECT A.EXAMRMINFO_RMNM as EXAMRMNM, B.PTNTEXAM_RMCD, A.EXAMRMINFO_RMCD, A.EXAMRMINFO_WTTM, ISNULL(e.CLMC_CLNO,'1') as CLMC_CLNO,
      Case WHEN(A.EXAMRMINFO_PKFG = 'O') THEN '종합' WHEN(A.EXAMRMINFO_PKFG = 'B') THEN '일반' ELSE '외부' END AS PKFGNAME,
      (SELECT COUNT(*) FROM HCAV_PTNTEXAM C, HCAV_PTNTINFO d
      WHERE (C.PTNTEXAM_RMCD=a.EXAMRMINFO_RMCD OR C.PTNTEXAM_RMCD=a.EXAMRMINFO_SUBRMCD)
       and C.PTNTEXAM_STAT='W' AND Convert(varchar(8), C.PTNTEXAM_DATE,112) = Convert(varchar(8), getdate(),112)
      AND d.PTNTINFO_DATE = Convert(varchar(8), getdate(),112)  AND d.PTNTINFO_IDNO = C.PTNTEXAM_IDNO AND C.PTNTEXAM_RMNUM = e.CLMC_CLNO) AS W_CNT,
      (SELECT COUNT(*) FROM HCAV_PTNTEXAM C, HCAV_PTNTINFO d
      WHERE (C.PTNTEXAM_RMCD=a.EXAMRMINFO_RMCD OR C.PTNTEXAM_RMCD=a.EXAMRMINFO_SUBRMCD)
       and C.PTNTEXAM_STAT='I' AND Convert(varchar(8), C.PTNTEXAM_DATE,112) = Convert(varchar(8), getdate(),112)
      AND d.PTNTINFO_DATE = Convert(varchar(8), getdate(),112)  AND d.PTNTINFO_IDNO = C.PTNTEXAM_IDNO AND C.PTNTEXAM_RMNUM = e.CLMC_CLNO) AS P_CNT,
      (SELECT COUNT(*) FROM HCAV_PTNTEXAM C, HCAV_PTNTINFO d
      WHERE (C.PTNTEXAM_RMCD=a.EXAMRMINFO_RMCD OR C.PTNTEXAM_RMCD=a.EXAMRMINFO_SUBRMCD)
       and C.PTNTEXAM_STAT='F' AND Convert(varchar(8), C.PTNTEXAM_DATE,112) = Convert(varchar(8), getdate(),112)
      AND d.PTNTINFO_DATE = Convert(varchar(8), getdate(),112)  AND d.PTNTINFO_IDNO = C.PTNTEXAM_IDNO AND C.PTNTEXAM_RMNUM = e.CLMC_CLNO) AS F_CNT,
      (SELECT COUNT(*) FROM HCAV_PTNTEXAM C, HCAV_PTNTINFO d
      WHERE (C.PTNTEXAM_RMCD=a.EXAMRMINFO_RMCD OR C.PTNTEXAM_RMCD=a.EXAMRMINFO_SUBRMCD) AND C.PTNTEXAM_STAT='N' AND Convert(varchar(8), C.PTNTEXAM_DATE,112) = Convert(varchar(8), getdate(),112)
      AND d.PTNTINFO_DATE = Convert(varchar(8), getdate(),112)  AND d.PTNTINFO_IDNO = C.PTNTEXAM_IDNO) AS N_CNT
      FROM HCAV_EXAMRMINFO A left join HCAV_PTNTEXAM B on A.EXAMRMINFO_RMCD = B.PTNTEXAM_RMCD AND B.PTNTEXAM_DATE = Convert(varchar(8), getdate(),112)
      left join HCAV_CLMC e ON A.EXAMRMINFO_RMCD = e.CLMC_ZONE
      
      GROUP BY EXAMRMINFO_RMNM, B.PTNTEXAM_RMCD, A.EXAMRMINFO_RMCD, A.EXAMRMINFO_PKFG, A.EXAMRMINFO_WTTM, e.CLMC_CLNO, a.EXAMRMINFO_SUBRMCD`

    request.query(q, (err, recordset) => {
      if (err) {
        res.json({
          code: 'FAIL',
          message: '수진자 조회중 오류가 발생하였습니다.',
          error: err.message,
        })
        return log.error(`[InspectionController] query error : ${err.message}`)
      }
    })

    var result = []
    request
      .on('error', function (err) {
        res.json({
          code: 'FAIL',
          message: '수진자 조회중 오류가 발생하였습니다.',
          error: err.message,
        })
        log.debug(`InspectionController] query ERROR "${err.message}`)
      })
      .on('row', (row) => {
        result.push(row)
      })
      .on('done', () => {
        if (result?.length !== 0) {
          res.json({
            code: 'OK',
            message: '수진자조회에 성공하였습니다.',
            data: result,
          })
        } else {
          res.json({
            code: 'FAIL',
            message: '수진자 조회 데이터가 없습니다.',
          })
        }
      })
  })
}

const InspectionChange = async (req, res) => {
  const { RMCD, IDNO, STAT, RMNUM, USERID } = req.body
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
        message: '수진자조회 데이터베이스 연결 오류',
        error: err.message,
      })
      return
    }

    const rslt = await new mssql.Request()
      .input('PTNT_RMCD', `${RMCD}`)
      .input('PTNT_IDNO', `${IDNO}`)
      .input('PTNT_STAT', `${STAT}`)
      .input('PTNT_RMNUM', `${RMNUM}`)
      .input('USER_ID', `${USERID}`)
      .output('PTNT_RSLT')
      .output('PTNT_MESG')
      .execute('SP_AH_HCAV_PTNT_RESERVE')
      .then((result) => {
        console.debug(
          `[InspectionController] procedure result : %o`,
          result.recordsets[0][0]
        )
        res.json({
          code: 'OK',
          result: result.recordsets[0][0].PTNT_RSLT || '',
          message: result.recordsets[0][0].PTNT_MESG || '',
        })
      })
      .catch((err) => {
        console.error(`[InspectionController] procedure ERROR : %o`, err)
        res.json({ code: 'ERROR', error: err.message || '' })
      })
  })
}

const InspectionClick = (req, res) => {
  const { room } = req.body
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
  mssql.connect(config, function (err) {
    if (err) {
      res.json({
        code: 'FAIL',
        message: '수진자조회 데이터베이스 연결 오류',
        error: err.message,
      })
      return log.error(
        `[InspectionController] 수진자 조회 중 오류가 발생하였습니다. : ${err.message}`
      )
    }
    log.debug(`MSSQL 연결 완료`)
    var request = new mssql.Request()
    request.stream = true

    const q = `SELECT a.PTNTEXAM_DATE, a.PTNTEXAM_IDNO, a.PTNTEXAM_RMCD, a.PTNTEXAM_RMNM, a.PTNTEXAM_RMNUM,
    a.PTNTEXAM_STAT, convert(CHAR(5), a.PTNTEXAM_STTM, 108) as PTNTEXAM_STTM, convert(CHAR(5), a.PTNTEXAM_EDTM, 108) as PTNTEXAM_EDTM,
    a.PTNTEXAM_WTTM, a.PTNTEXAM_STEP, b.PTNTINFO_BITH,
    b.PTNTINFO_SEX, b.PTNTINFO_AGE, b.PTNTINFO_PKNM, b.PTNTINFO_VIPF, b.PTNTINFO_IDNO, b.PTNTINFO_NAME, b.PTNTINFO_PKFG,
    row_number() OVER (ORDER BY case a.PTNTEXAM_STAT WHEN 'W' THEN 1 ELSE 2 END,ISNULL(a.PTNTEXAM_TGTM, GETDATE()) ASC) AS row
 FROM hcav_ptntexam a,hcav_ptntinfo b, HCAV_EXAMRMINFO D
WHERE a.PTNTEXAM_IDNO = b.PTNTINFO_IDNO
  AND b.ptntinfo_date=convert(varchar, getdate(), 112)
   AND a.PTNTEXAM_RMCD='${room}' 
  AND (a.PTNTEXAM_RMNUM ='22' OR a.PTNTEXAM_RMNUM IS NULL)
  AND a.ptntexam_date=convert(varchar, getdate(), 112)
  
  AND D.EXAMRMINFO_RMCD = A.PTNTEXAM_RMCD
GROUP by a.PTNTEXAM_DATE,a.PTNTEXAM_IDNO, a.PTNTEXAM_RMCD, a.PTNTEXAM_RMNM, a.PTNTEXAM_RMNUM, a.PTNTEXAM_STAT,a.PTNTEXAM_STTM,a.PTNTEXAM_EDTM,
a.PTNTEXAM_WTTM, a.PTNTEXAM_STEP, b.PTNTINFO_BITH,  b.PTNTINFO_SEX, b.PTNTINFO_AGE, b.PTNTINFO_PKNM, b.PTNTINFO_VIPF, b.PTNTINFO_IDNO, b.PTNTINFO_NAME, b.PTNTINFO_PKFG,a.PTNTEXAM_TGTM

   ORDER BY case a.PTNTEXAM_STAT WHEN 'I' THEN 1 WHEN 'W' THEN 2 WHEN 'N' THEN 3 WHEN 'D' THEN 4 WHEN 'F' THEN 5 END,case a.PTNTEXAM_RMCD when 'Z2016' then 1 else 2 end, b.PTNTINFO_NAME ASC
`
    request.query(q, (err, recordset) => {
      if (err) {
        res.json({
          code: 'FAIL',
          message: '수진자조회 데이터베이스 쿼리 오류',
          error: err.message,
        })
        return console.log(
          `[InspectionController] query error : ${err.message}`
        )
      }
    })

    var result = []
    request
      .on('error', function (err) {
        res.json({
          code: 'FAIL',
          message: '수진자 조회 중 오류가 발생하였습니다.',
          error: err.message,
        })
        log.error(
          `[InspectionController] 수진자 조회 중 오류가 발생하였습니다. : ${err.message}`
        )
      })
      .on('row', (row) => {
        result.push(row)
      })
      .on('done', () => {
        log.debug('종합건강진단 수진자 조회 성공 %o', result)
        if (result?.length !== 0) {
          res.json({
            code: 'OK',
            message: '수진자조회 조회에 성공하였습니다.',
            data: result,
          })
        } else {
          res.json({
            code: 'FAIL',
            message: '수진자조회 데이터가 없습니다.',
          })
        }
      })
  })
}

const InspectionController = {
  Inspection,
  InspectionChange,
  InspectionClick,
}
export { InspectionController }
