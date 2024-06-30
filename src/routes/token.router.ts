import express, { type Router } from 'express'
import { checkingToken, refreshToken, verify } from '../controllers/token.controller'
import { authentication } from '../middleware/authentication'

const token: Router = express.Router()

token.get('/my-token', authentication, checkingToken)
token.post('/verify-token', verify)
token.get('/refresh-token', refreshToken)

export default token