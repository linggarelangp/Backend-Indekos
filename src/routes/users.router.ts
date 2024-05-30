import express, { type Router } from 'express'
import { add, deleted, getAll, getById, update, login, refreshToken } from '../controllers/users.controller'
import { userValidation } from '../middleware/validation'

const users: Router = express.Router()

users.post('/user/login', login)
users.post('/user/register', userValidation, add)

users.post('/user/add', add)
users.get('/user/getAll', getAll)
users.get('/user/get/:id', getById)
users.put('/user/update/:id', update)
users.delete('/user/delete/:id', deleted)
users.get('/refresh-token', refreshToken)

export default users