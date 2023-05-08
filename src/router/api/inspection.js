import express from 'express'

const inspection = express.Router()

import { InspectionController } from '../../controllers/InspectionController'

inspection.get('/', InspectionController.Inspection)
inspection.post('/click', InspectionController.InspectionClick)
inspection.post('/change', InspectionController.InspectionChange)

export default inspection
