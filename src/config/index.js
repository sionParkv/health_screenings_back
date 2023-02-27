const ENV = process.env.NODE_ENV || 'production'

const PATH = {
  prodection: { LOG: `/app/logs/relay/prod` },
  development: { LOG: `/app/logs/relay/dev` },
  local: { LOG: `${process.cwd()}/logs` },
  LOG: `${process.cwd()}/logs`,
}

const PORT = {
  prodection: 4000,
  development: 4011,
  local: 4000,
}

const cfgServer = {
  env: ENV,
  path: PATH,
  port: PORT[ENV],
}
export { cfgServer }
