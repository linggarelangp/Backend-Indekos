import express, { type Router } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import users from './users.router'
import roles from './roles.router'
import rooms from './rooms.router'
import token from './token.router'
import transactions from './transactions.router'
import residents from './residents.router'

const router: Router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

router.use(cookieParser())

// router.use(cors({
//     credentials: true,
//     origin: function (origin, callback) {
//         if (origin && /^http:\/\/localhost(:\d+)?$/.test(origin)) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }))

router.use(cors({
    credentials: true
}))

// router.use((req, res, next) => {
//     const allowedOrigins = ['https://8v164461-5173.asse.devtunnels.ms', 'https://da7a-27-124-95-67.ngrok-free.app', 'http://localhost:3000']
//     const origin: string = req.headers.origin as string
//     if (allowedOrigins.includes(origin)) {
//         res.setHeader('Access-Control-Allow-Origin', origin)
//     }
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
//     res.header('Access-Control-Allow-Credentials', 'true')
//     next()
// })

router.use(roles)
router.use(users)
router.use(rooms)
router.use(residents)
router.use(token)
router.use(transactions)

export default router