import { type Request, type Response } from 'express'

import prisma from '../database/prisma/prisma'
import { Users, AddUser } from '../database/types/users'

export const add = async (req: Request, res: Response): Promise<Response> => {
    const { ...body } = req.body

    try {

        const data: AddUser = {
            roleId: body.roleId ?? 3,
            email: body.email,
            name: body.name,
            password: body.password,
            status: body.status ?? true,
            createdAt: new Date(new Date().toISOString()),
            updatedAt: new Date(new Date().toISOString())
        }

        const user: Users = await prisma.users.create({ data })

        return res.status(201).json({
            status: 201,
            message: 'Created',
            data: user
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
        const user: Users[] = await prisma.users.findMany()

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: user
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        })
    }
}

export const getById = async (req: Request, res: Response): Promise<Response> => {
    const id: string = req.params.id as string

    try {
        const user: Users | null = await prisma.users.findUnique({ where: { id: Number(id) } })

        if (user === null) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: user
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
    const id: string = req.params.id
    try {
        const userId: number = Number(id)

        const user: Users | null = await prisma.users.findUnique({ where: { id: userId } })

        if (user === null) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        const data: object = {
            email: body.email,
            name: body.name,
            updatedAt: new Date(new Date().toISOString())
        }

        const update = await prisma.users.update({ where: { id: user.id }, data: { ...data } })
        console.log(update)

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: data
        })
    } catch (err: any) {
        console.error(err)
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        })
    }
}

export const deleted = async (req: Request, res: Response): Promise<Response> => {
    const id: string = req.params.id

    try {
        const userId = Number(id)

        const user: Users | null = await prisma.users.findUnique({ where: { id: userId } })

        if (user === null) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        await prisma.users.delete({ where: { id: user.id } })

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