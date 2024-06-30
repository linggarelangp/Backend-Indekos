import express, { type Router } from 'express'
import { authentication } from '../middleware/authentication'

import { add, deleted, getAll, getById, printCSV, printXlsx, update } from '../controllers/transactions.controller'
import { transactionValidation } from '../middleware/validation'

const transactions: Router = express.Router()

transactions.post('/transaction/add', transactionValidation, add)
transactions.get('/transaction/getAll', getAll)
transactions.get('/transaction/get/:id', getById)
transactions.put('/transaction/update/:id', update)
transactions.delete('/transaction/delete/:id', deleted)
transactions.get('/transaction/csv', printCSV)
transactions.get('/transaction/excel', printXlsx)

export default transactions