import express from 'express'

import { testController } from '../../controllers/testController'
import { LoginController } from '../../controllers/LoginController'

const api = express.Router()

api.get('/', (req, res) => {
  res.send('명지병원 건강검진 태블릿 API')
})
api.get('/test', testController.testtest)
api.get('/login', LoginController.Login)

export default api
