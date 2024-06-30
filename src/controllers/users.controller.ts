import { type Request, type Response } from 'express'

import prisma from '../database/prisma/prisma'
import { Users, AddUser, UserToken, GetUser } from '../database/types/users'
import { compare, hashing } from '../utils/hash'
import { generateAccessToken, generateRefreshToken } from '../utils/token'
import { formatterDate, getDateNow } from '../utils/date'

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
            roleId: Number(body.roleId ?? 3),
            email: body.email,
            name: body.name,
            password: passwordHashed,
            status: true,
            accessToken: null,
            refreshToken: null,
            createdAt: new Date(getDateNow()),
            updatedAt: new Date(getDateNow())
        }

        const user: Users = await prisma.users.create({ data })

        console.log(data);

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
        const user: GetUser[] = await prisma.users.findMany({
            where: {
                roleId: 3
            },
            select: {
                id: true,
                name: true,
                roleId: true,
                email: true,
                status: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: {
                roleId: 'asc'
            }
        })

        const response: object[] = user.map(user => {
            return {
                id: user.id,
                name: user.name,
                roleId: user.roleId,
                email: user.email,
                status: user.status,
                createdAt: formatterDate(new Date(user.createdAt)),
                updatedAt: formatterDate(new Date(user.updatedAt))
            }
        })

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: response
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        })
    }
}

export const getWorkers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const workers: GetUser[] = await prisma.users.findMany({
            where: {
                OR: [
                    { roleId: 1 },
                    { roleId: 2 }
                ]
            },
            orderBy: {
                roleId: 'asc'
            }
        })

        const response: object[] = workers.map(worker => {
            return {
                id: worker.id,
                name: worker.name,
                roleId: worker.roleId,
                email: worker.email,
                status: worker.status,
                createdAt: formatterDate(new Date(worker.createdAt)),
                updatedAt: formatterDate(new Date(worker.updatedAt))
            }
        })

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: response
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
        const user: GetUser | null = await prisma.users.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                roleId: true,
                email: true,
                name: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        })
        console.log({ data: user })

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

        if (body.email !== user.email) {
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
        }

        let data: object = {
            email: body.email,
            name: body.name,
            updatedAt: new Date(new Date().toISOString())
        }

        if (body.roleId) {
            data = { ...data, roleId: Number(body.roleId) }
        }

        await prisma.users.update({ where: { id: user.id }, data: { ...data } })

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

        const del = await prisma.users.delete({ where: { id: user.id } })
        console.log({ del })

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
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        const passwordCompare: boolean = await compare(body.password, user.password)

        if (!passwordCompare) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        const data: UserToken = {
            id: user.id,
            roleId: user.roleId,
            name: user.name,
            email: user.email,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }

        const accessToken: string = generateAccessToken(data)
        const refreshToken: string = generateRefreshToken(data)

        await prisma.users.update({
            where: { id: user.id },
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        })

        res.cookie('xyzrt', refreshToken, {
            maxAge: 24 * 7 * 60 * 60 * 1000
        })

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: { ...data, accessToken }
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        })
    }
}

export const logout = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id
    try {
        const useId: number = Number(id)

        const user: Users | null = await prisma.users.findUnique({ where: { id: useId } })

        if (user === null) {
            res.clearCookie('xyzrt')

            return res.status(200).json({
                status: 200,
                message: 'OK'
            })
        }

        await prisma.users.update({
            where: {
                id: user.id
            },
            data: {
                accessToken: null,
                refreshToken: null
            }
        })

        res.clearCookie('xyzrt')

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