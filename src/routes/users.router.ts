import express, { type Router } from 'express'
import { add, deleted, getAll, getById, update, login, logout, getWorkers } from '../controllers/users.controller'
import { userValidation } from '../middleware/validation'
import { authentication } from '../middleware/authentication'

const users: Router = express.Router()

users.post('/user/login', login)
users.post('/user/register', userValidation, add)
users.get('/user/logout/:id', logout)

users.post('/user/add', userValidation, authentication, add)
users.get('/user/getAll', authentication, getAll)
users.get('/workers/getAll', getWorkers)
users.get('/user/get/:id', authentication, getById)
users.put('/user/update/:id', authentication, update)
users.delete('/user/delete/:id', deleted)

export default users