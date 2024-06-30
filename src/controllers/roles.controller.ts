import { type Request, type Response } from 'express'

import prisma from '../database/prisma/prisma'
import { Roles, AddRoles } from '../database/types/roles'
import { formatterDate } from '../utils/date'

export const add = async (req: Request, res: Response): Promise<Response> => {
    const { ...body } = req.body

    try {
        const data: AddRoles = {
            name: body.name,
            createdAt: new Date(new Date().toISOString()),
            updatedAt: new Date(new Date().toISOString()),
        }

        const role: Roles = await prisma.roles.create({ data })

        return res.status(201).json({
            status: 201,
            message: 'Created',
            data: role
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
        const roles: Roles[] = await prisma.roles.findMany()

        const data: object[] = roles.map((role) => {
            return {
                id: role.id,
                name: role.name,
                createdAt: formatterDate(new Date(role.createdAt)),
                updatedAt: formatterDate(new Date(role.updatedAt))
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
        const roleId: number = Number(id)

        const role: Roles | null = await prisma.roles.findUnique({ where: { id: roleId } })

        if (role === null) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: role
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
        const roleId: number = Number(id)

        const role: Roles | null = await prisma.roles.findUnique({ where: { id: roleId } })

        if (role === null) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        const data: object = {
            name: body.name,
            updatedAt: new Date(new Date().toISOString())
        }

        const update: Roles = await prisma.roles.update({ where: { id: role.id }, data: data })

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
        const roleId: number = Number(id)

        const role: Roles | null = await prisma.roles.findUnique({ where: { id: roleId } })

        if (role === null) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        const deleted: Roles = await prisma.roles.delete({ where: { id: role.id } })

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