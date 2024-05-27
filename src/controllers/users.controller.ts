import { type Request, type Response } from 'express'

import prisma from '../database/prisma/prisma'
import { Users, AddUser } from '../database/types/users'
import { compare, hashing } from '../utils/hash'
import { emitWarning } from 'process'

export const add = async (req: Request, res: Response): Promise<Response> => {
    const { ...body } = req.body

    try {
        const email: Users | null = await prisma.users.findUnique({ where: { email: body.email } })

        if (email !== null) {
            return res.status(400).json({
                status: 400,
                message: 'Bad Request',
                data: [
                    {
                        'path': 'email',
                        'message': 'Email address has already taken'
                    }
                ]
            })
        }

        const passwordHashed: string = await hashing(body.password)

        const data: AddUser = {
            roleId: body.roleId ?? 3,
            email: body.email,
            name: body.name,
            password: passwordHashed,
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

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { ...body } = req.body

    try {
        const user: Users | null = await prisma.users.findUnique({ where: { email: body.email } })

        if (user === null) {
            return res.status(400).json({
                status: 404,
                message: 'Not Found'
            })
        }

        const passwordCompare: boolean = await compare(body.password, user.password)

        if (!passwordCompare) {
            return res.status(400).json({
                status: 404,
                message: 'Not Found'
            })
        }

        const data: object = {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
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