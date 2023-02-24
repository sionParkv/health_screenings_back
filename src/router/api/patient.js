import express from 'express'

const patient = express.Router()

import { PatientController } from '../../controllers/PatientController'

patient.get('/', PatientController.Patient)
patient.post('/click', PatientController.PatientClick)

export default patient
