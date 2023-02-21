import express from 'express'

import { testController } from '../../testController'
import { LoginController } from '../../LoginController'

const api = express.Router()

api.get('/', (req, res) => {
  res.send('명지병원 건강검진 태블릿 API')
})
api.get('/test', testController.testtest)
api.get('/login', LoginController.Login)

export default api
