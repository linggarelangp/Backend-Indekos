import { type Request, type Response } from 'express'

import prisma from '../database/prisma/prisma'
import { Users, AddUser, UserToken, GetUser } from '../database/types/users'
import { compare, hashing } from '../utils/hash'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token'

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
        const user: GetUser[] = await prisma.users.findMany({
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

        const data: UserToken = {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
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

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
        const refreshToken: string = req.cookies?.xyzrt ?? null

        if (refreshToken === null) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            })
        }

        const verify: UserToken | null = verifyRefreshToken(refreshToken)

        if (verify === null) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            })
        }

        const data: UserToken = { ...verify }

        const newAccessToken: string = generateAccessToken(data)

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: { ...data, accessToken: newAccessToken }
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        })
    }
}