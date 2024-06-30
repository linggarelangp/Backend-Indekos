import { type Request, type Response } from 'express'

import prisma from '../database/prisma/prisma'
import { formatterDate, getDateNow } from '../utils/date'

export const add = async (req: Request, res: Response): Promise<Response> => {
    const { ...body } = req.body
    console.log({ body })


    try {
        const data: any = {
            userId: body.userId,
            name: body.name,
            email: body.email,
            roomId: body.roomId,
            roomName: body.room,
            amount: Number(body.amount),
            price: Number(body.price),
            status: true,
            createdAt: new Date(getDateNow()),
            updatedAt: new Date(getDateNow())
        }

        console.log(data)


        const resident = await prisma.residents.create({ data })

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: resident
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        })
    }
}

export const getAll = async (req: Request, res: Response): Promise<Response> => {

    try {
        const residents = await prisma.residents.findMany()

        const data: any = residents.map(resident => {
            return {
                id: resident.id,
                userId: resident.userId,
                name: resident.name,
                email: resident.email,
                roomId: resident.roomId,
                room: resident.roomName,
                amount: resident.amount,
                price: resident.price,
                status: resident.status,
                createdAt: formatterDate(new Date(resident.createdAt)),
                updatedAt: formatterDate(new Date(resident.updatedAt))
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
        const residentId: number = Number(id)

        const resident = await prisma.residents.findUnique({ where: { id: residentId } })

        if (!resident) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        const data: any = {
            id: resident.id,
            userId: resident.userId,
            name: resident.name,
            email: resident.email,
            roomId: resident.roomId,
            room: resident.roomName,
            amount: resident.amount,
            price: resident.price,
            status: resident.status,
            createdAt: formatterDate(new Date(resident.createdAt)),
            updatedAt: formatterDate(new Date(resident.updatedAt))
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
        const residentId: number = Number(id)

        const data: any = {
            userId: body.userId,
            name: body.name,
            email: body.email,
            roomId: body.roomId,
            roomName: body.room,
            amount: Number(body.amount),
            price: Number(body.price),
            updatedAt: new Date(getDateNow())
        }

        const resident = await prisma.residents.update({ where: { id: residentId }, data: data })

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: 'resident'
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
        const residentId: number = Number(id)

        const resident = await prisma.residents.findUnique({ where: { id: residentId } })


        if (!resident) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        await prisma.residents.delete({ where: { id: residentId } })

        return res.status(200).json({
            status: 200,
            message: 'OK'
        })
    } catch (erre: any) {
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        })
    }
}