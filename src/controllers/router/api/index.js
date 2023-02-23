import express from 'express'

import { VisitController } from '../../VisitController'
import { LoginController } from '../../LoginController'
import { PatientController } from '../../PatientController'
import { InspectionController } from '../../InspectionController'
import { InspectionClickController } from '../../InspectionClickController'
import { PatientClickController } from '../../PatientClickController'

const api = express.Router()

api.get('/', (req, res) => {
  res.send('명지병원 건강검진 태블릿 API')
})
api.get('/visit', VisitController.Visit)
api.get('/login', LoginController.Login)
api.get('/inspection', InspectionController.Inspection)
api.get('/patient', PatientController.Patient)
api.get('/patient/click', PatientClickController.PatientClick)
api.get('/inspection/click', InspectionClickController.InspectionClick)

export default api
