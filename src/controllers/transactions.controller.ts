import { type Request, type Response } from 'express'
import { nanoid } from 'nanoid'
import { createObjectCsvWriter } from 'csv-writer'
import ExcelJS from 'exceljs'
import * as fs from 'fs'

import { formatterDate, getDateNow } from '../utils/date'
import prisma from '../database/prisma/prisma'

export const add = async (req: Request, res: Response): Promise<Response> => {
    const { ...body } = req.body
    try {
        const data: any = {
            transactionId: nanoid(16),
            userId: body.userId,
            roomId: body.roomId,
            name: body.name,
            email: body.email,
            status: true,
            roomName: body.room,
            amount: Number(body.amount),
            price: Number(body.amount) * Number(body.price),
            createdAt: new Date(getDateNow()),
            updatedAt: new Date(getDateNow())
        }

        const transaction = await prisma.transactions.create({ data })

        return res.status(200).json({
            status: 201,
            message: 'Created',
            data: transaction
        })
    } catch (err: any) {
        console.log(err)

        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        })
    }
}

export const getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
        const transactions: any = await prisma.transactions.findMany()

        const data: object[] = transactions.map((transaction: any) => {
            return {
                id: transaction.id,
                transactionId: transaction.transactionId,
                email: transaction.email,
                name: transaction.name,
                room: transaction.roomName,
                amount: transaction.amount,
                price: transaction.price,
                createdAt: formatterDate(new Date(transaction.createdAt)),
                updatedAt: formatterDate(new Date(transaction.updatedAt))
            }
        })

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: data
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        })
    }
}

export const getById = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id
    try {
        const isTransactionId = Number(id)
        const transaction = await prisma.transactions.findUnique({ where: { id: isTransactionId } })

        if (!transaction) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        const data: any = {
            id: transaction.id,
            transactionId: transaction.transactionId,
            userId: transaction.userId,
            email: transaction.email,
            name: transaction.name,
            roomId: transaction.roomId,
            room: transaction.roomName,
            amount: transaction.amount,
            price: transaction.price,
            createdAt: formatterDate(new Date(transaction.createdAt)),
            updatedAt: formatterDate(new Date(transaction.updatedAt))
        }

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: data
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        })
    }
}

export const update = async (req: Request, res: Response): Promise<Response> => {
    const { ...body } = req.body
    const id = req.params.id

    try {
        const isTransactionId = Number(id)
        console.log(id)


        const transaction = await prisma.transactions.findUnique({ where: { id: isTransactionId } })

        if (!transaction) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        const data: any = {
            userId: body.userId,
            roomId: body.roomId,
            name: body.name,
            email: body.email,
            roomName: body.room,
            amount: Number(body.amount),
            price: Number(body.amount) * Number(body.price),
            updatedAt: new Date(getDateNow())
        }

        await prisma.transactions.update({ where: { id: isTransactionId }, data: data })

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: data
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        })
    }
}

export const deleted = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id

    try {
        const isTransactionId = Number(id)

        const transaction = await prisma.transactions.findUnique({ where: { id: isTransactionId } })

        if (!transaction) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        await prisma.transactions.delete({ where: { id: isTransactionId } })

        return res.status(200).json({
            status: 200,
            message: 'OK'
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        })
    }
}

export const printCSV = async (req: Request, res: Response): Promise<void | Response> => {

    try {
        const transaction = await prisma.transactions.findMany()

        if (transaction.length === 0) {
            return res.status(200).json({
                status: 200,
                message: 'OK'
            })
        }

        const data: any = transaction.map(txn => {
            return {
                transactionId: txn.transactionId,
                email: txn.email,
                name: txn.name,
                roomName: txn.roomName,
                amount: txn.amount,
                price: txn.price
            }
        })

        const date = new Date().toDateString()
        const fileName = 'transactions' + '-' + date + '.csv'

        const csvWriter = createObjectCsvWriter({
            path: fileName,
            header: [
                { id: 'transactionId', title: 'Transaction ID' },
                { id: 'email', title: 'Email' },
                { id: 'name', title: 'Name' },
                { id: 'roomName', title: 'Room Name' },
                { id: 'amount', title: 'Amount' },
                { id: 'price', title: 'Price' },
            ]
        })

        const csv = await csvWriter.writeRecords(data)

        res.setHeader('Content-Type', 'text/csv')
        res.download(fileName, fileName, (err: any) => {
            if (err) {
                console.error('Error While Sending CSV:', err)
                res.status(500).send({ status: 500, message: 'Error While Sending CSV' })
            } else {
                console.log('CSV File Sent Successfully')
                fs.unlinkSync(fileName)
            }
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        })
    }

}

export const printXlsx = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        const transaction = await prisma.transactions.findMany()

        if (transaction.length === 0) {
            return res.status(200).json({
                status: 200,
                message: 'OK'
            })
        }

        const workbook: ExcelJS.Workbook = new ExcelJS.Workbook()
        const fileName = 'transactions' + '-' + new Date().toDateString().slice(0, 10) + '.xlsx'
        const worksheet = workbook.addWorksheet('Transaction Month')

        worksheet.columns = [
            { key: 'transactionId', header: 'Transaction ID', width: 18 },
            { key: 'email', header: 'Email', width: 23 },
            { key: 'name', header: 'Name' },
            { key: 'roomName', header: 'Room Name' },
            { key: 'amount', header: 'Amount' },
            { key: 'price', header: 'Price' },
        ]

        transaction.forEach((txn, index) => {
            const rowNumber = index + 2

            const row = worksheet.addRow({
                transactionId: txn.transactionId,
                email: txn.email,
                name: txn.name,
                roomName: txn.roomName,
                amount: txn.amount,
                price: txn.price,
            })

            if (rowNumber % 2 !== 0) {
                row.eachCell((cell) => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '739BD0' }
                    }
                })
            }
        })

        const lastRowNumber = worksheet.rowCount
        worksheet.mergeCells(`A${lastRowNumber + 1}:E${lastRowNumber + 1}`)
        worksheet.getCell(`A${lastRowNumber + 1}`).value = 'Income'
        worksheet.getCell(`F${lastRowNumber + 1}`).value = { formula: `SUM(F2:F${lastRowNumber})` }

        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }
            })
        })

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader("Content-Disposition", "attachment; filename=" + fileName)
        await workbook.xlsx.write(res)
        res.end()
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        })
    }
}