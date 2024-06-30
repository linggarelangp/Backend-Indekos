import path from 'path'
import * as fs from 'fs'
import { type Request, type Response } from 'express'

import prisma from '../database/prisma/prisma'
import { AddRooms, Rooms } from '../database/types/rooms'
import { formatterDate } from '../utils/date'

export const add = async (req: Request, res: Response): Promise<any> => {
    const { ...body } = req.body
    const { ...file } = req.file

    console.log(body)


    try {
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: 'Bad Request'
            })
        }

        const data: AddRooms = {
            name: body.name,
            createdAt: new Date(new Date().toISOString()),
            updatedAt: new Date(new Date().toISOString()),
            amount: Number(body.amount) ?? 20,
            price: Number(body.price),
            image: file.filename
        }

        const room: Rooms = await prisma.rooms.create({ data })

        return res.status(201).json({
            status: 201,
            message: 'Created',
            data: room
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
        const imageUrl: string = path.join(process.cwd(), 'src/assets/img/')

        const room: Rooms[] = await prisma.rooms.findMany()

        const data: (object | undefined)[] = room.map((room) => {
            const imagePath = path.join(imageUrl, room.image)
            if (fs.existsSync(imagePath)) {

                const image = fs.readFileSync(imagePath, { encoding: 'base64' })

                return {
                    id: room.id,
                    name: room.name,
                    image: image,
                    amount: room.amount,
                    price: room.price,
                    createdAt: formatterDate(new Date(room.createdAt)),
                    updatedAt: formatterDate(new Date(room.updatedAt))
                }
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
    const id: string = req.params.id

    try {
        const roomId: number = Number(id)

        const room: Rooms | null = await prisma.rooms.findUnique({ where: { id: roomId } })

        if (room === null) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        const imagePath: string = path.join(process.cwd(), 'src/assets/img/', room.image)

        const image: string | null = fs.existsSync(imagePath) ? fs.readFileSync(imagePath, { encoding: 'base64' }) : null

        const data: object = {
            id: room.id,
            name: room.name,
            image: image,
            amount: room.amount,
            price: room.price,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt
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
    const id: string = req.params.id
    const { ...body } = req.body
    const { ...file } = req.file

    try {
        const roomId: number = Number(id)

        const room: Rooms | null = await prisma.rooms.findUnique({ where: { id: roomId } })

        if (room === null) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        console.log(body);


        const data: object = {
            name: body.name,
            image: file.filename,
            amount: Number(body.amount),
            price: Number(body.price),
            updatedAt: new Date(new Date().toISOString())
        }

        const update: Rooms = await prisma.rooms.update({ where: { id: room.id }, data: data })

        const imagePath: string = path.join(process.cwd(), 'src/assets/img/', room.image)

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
        }

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: update
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        })
    }
}

export const deleted = async (req: Request, res: Response): Promise<Response> => {
    const id: string = req.params.id

    try {
        const roomId: number = Number(id)

        const room: Rooms | null = await prisma.rooms.findUnique({ where: { id: roomId } })

        if (room === null) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        const imagePath: string = path.join(process.cwd(), 'src/assets/img/', room.image)

        await prisma.rooms.delete({ where: { id: room.id } })

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
        }

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