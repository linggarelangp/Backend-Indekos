import express, { type Router } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import users from './users.router'
import roles from './roles.router'
import rooms from './rooms.router'

const router: Router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

router.use(cookieParser())

router.use(cors({
    credentials: true,
    origin: true
}))

router.use(roles)
router.use(users)
router.use(rooms)

export default router