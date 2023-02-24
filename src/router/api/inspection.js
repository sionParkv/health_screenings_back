import express from 'express'

const inspection = express.Router()

import { InspectionController } from '../../controllers/InspectionController'

inspection.get('/', InspectionController.Inspection)
inspection.get('/click', InspectionController.InspectionClick)

export default inspection
