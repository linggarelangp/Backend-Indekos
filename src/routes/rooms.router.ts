import express, { type Router } from 'express'

import { roomValidation } from '../middleware/validation'
import { add, getAll, getById, update, deleted } from '../controllers/rooms.controller'

const rooms: Router = express.Router()

rooms.post('/room/add', roomValidation, add)
rooms.get('/room/getAll', getAll)
rooms.get('/room/get/:id', getById)
rooms.put('/room/update/:id', update)
rooms.delete('/room/delete/:id', deleted)

export default rooms