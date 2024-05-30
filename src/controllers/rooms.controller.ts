import path from 'path'
import * as fs from 'fs'
import { type Request, type Response } from 'express'

import prisma from '../database/prisma/prisma'
import { AddRooms, Rooms } from '../database/types/rooms'

export const add = async (req: Request, res: Response): Promise<any> => {
    const { ...body } = req.body
    const { ...file } = req.file

    try {
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: 'Bad Request'
            })
        }

        const data: AddRooms = {
            name: body.name,
            amount: Number(body.amount) ?? 20,
            image: file.filename,
            createdAt: new Date(new Date().toISOString()),
            updatedAt: new Date(new Date().toISOString())
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

        console.log(imageUrl);


        const room: Rooms[] = await prisma.rooms.findMany()

        const data: (Rooms | undefined)[] = room.map((room) => {
            const imagePath = path.join(imageUrl, room.image)
            if (fs.existsSync(imagePath)) {

                const image = fs.readFileSync(imagePath, { encoding: 'base64' })

                return {
                    id: room.id,
                    name: room.name,
                    amount: room.amount,
                    image: image,
                    createdAt: room.createdAt,
                    updatedAt: room.updatedAt,
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
            amount: room.amount,
            image: image,
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

    try {
        const roomId: number = Number(id)

        const room: Rooms | null = await prisma.rooms.findUnique({ where: { id: roomId } })

        if (room === null) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        const data: object = {
            name: body.room,
            amount: body.room,
            updatedAt: new Date(new Date().toISOString())
        }

        // const data: object = { name: body.name, amount: body.amount, image: 'images.jpg',updatedAt: new Date(new Date().toISOString()) }

        const update: Rooms = await prisma.rooms.update({ where: { id: room.id }, data: data })

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