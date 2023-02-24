import express from 'express'

import { LoginController } from '../../controllers/LoginController'

const login = express.Router()

login.post('/', LoginController.Login)

export default login
