import express, { type Router } from 'express'
import { add, deleted, getAll, getById, update } from '../controllers/role.controller'
import { roleValidation } from '../middleware/validation'

const roles: Router = express.Router()

roles.post('/role/add', roleValidation, add)
roles.get('/role/getAll', getAll)
roles.get('/role/get/:id', getById)
roles.put('/role/update/:id', roleValidation, update)
roles.delete('/role/delete/:id', deleted)

export default roles