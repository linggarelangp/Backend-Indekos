import express, { type Router } from 'express'

import { roomValidation } from '../middleware/validation'
import { add, getAll, getById, update, deleted } from '../controllers/rooms.controller'
import { authentication } from '../middleware/authentication'

const rooms: Router = express.Router()

rooms.post('/room/add', authentication, roomValidation, add)
rooms.get('/room/getAll', authentication, getAll)
rooms.get('/room/get/:id', authentication, getById)
rooms.put('/room/update/:id', authentication, roomValidation, update)
rooms.delete('/room/delete/:id', authentication, deleted)

export default rooms