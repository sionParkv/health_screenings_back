const ora = {
  host: '192.168.10.53',
  password: 'MJH_MJHRFID#$',
  port: '1521',
  server: 'DEDICATED',
  serviceName: 'MJOCS',
  user: 'MJH_RFID',
}

// 오라클 데이터베이스 접속 문자열
let cs = ''
cs += '(DESCRIPTION='
cs += '(ADDRESS='
cs += '(PROTOCOL=TCP)'
cs += '(HOST=' + ora.host + ')'
cs += '(PORT=' + ora.port + ')'
cs += ')'
cs += '(CONNECT_DATA='
cs += '(SERVER=' + ora.server + ')'
cs += '(SERVICE_NAME=' + ora.serviceName + ')'
cs += ')'
cs += ')'

const cfgOracle = { ...ora, cs }

export { cfgOracle }
