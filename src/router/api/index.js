import express from 'express'

import { VisitController } from '../../controllers/VisitController'
import { LoginController } from '../../controllers/LoginController'
import inspection from './inspection'

import patient from './patient'

const api = express.Router()

api.get('/', (req, res) => {
  res.send('명지병원 건강검진 태블릿 API')
})
api.use('/patient', patient)
api.get('/visit', VisitController.Visit)
api.get('/login', LoginController.Login)
api.use('/inspection', inspection)

export default api
