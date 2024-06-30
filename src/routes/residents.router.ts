import express, { type Router } from 'express'
import { roleValidation } from '../middleware/validation'
import { add, deleted, getAll, getById, update } from '../controllers/residents.controller'

const residents: Router = express.Router()

residents.post('/resident/add', add)
residents.get('/resident/getAll', getAll)
residents.get('/resident/get/:id', getById)
residents.put('/resident/update/:id', update)
residents.delete('/resident/delete/:id', deleted)

export default residents