import express from 'express'

import { VisitController } from '../../controllers/VisitController'
import { VisitTicket } from '../../controllers/VisitTicket'
import inspection from './inspection'
import patient from './patient'
import login from './login'

const api = express.Router()

api.get('/', (req, res) => {
  res.send('명지병원 건강검진 태블릿 API')
})

api.use('/patient', patient)
api.use('/login', login)
api.use('/inspection', inspection)
api.get('/visit', VisitController.Visit)
api.post('/visit/ticket', VisitTicket.VisitTickets)

export default api
