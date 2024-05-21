import express, { type Router } from 'express'
import cookieParser from 'cookie-parser'

import users from './users.router'

const router: Router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

router.use(cookieParser())

router.use(users)

export default router