import express, { type Router } from 'express'
import { add, deleted, getAll, getById, update } from '../controllers/users.controller'

const users: Router = express.Router()

users.post('/user/add', add)
users.get('/user/getAll', getAll)
users.get('/user/get/:id', getById)
users.put('/user/update/:id', update)
users.delete('/user/delete/:id', deleted)

export default users