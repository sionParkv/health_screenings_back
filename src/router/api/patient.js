import express from 'express'

const patient = express.Router()

import { PatientController } from '../../controllers/PatientController'

patient.get('/', PatientController.Patient)
patient.post('/click', PatientController.PatientClick)
patient.post('/change', PatientController.PatientChange)

export default patient
