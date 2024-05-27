import { ZodError } from 'zod'
import multer from 'multer'
import { type Request, type Response, type NextFunction, type RequestHandler } from 'express'

import handleZodError from '../utils/handleZodError'
import { schemaRoles, schemaRooms, schemaUsers } from '../schemas/object.schemas'
import { fileFilter, fileLimits, fileStorage } from '../utils/multer'

export const roleValidation = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    const { name } = req.body

    try {
        await schemaRoles.parseAsync(name)

        next()
    } catch (err: any) {
        if (err instanceof ZodError) {
            const data: object[] = handleZodError(err)

            return res.status(400).json({
                status: 400,
                meesage: 'Bad Request',
                data: data
            })
        }

        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}

export const userValidation = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    const { ...body } = req.body

    try {
        const data: object = {
            name: body.name,
            password: body.password
        }

        await schemaUsers.parseAsync(data)

        next()
    } catch (err: any) {
        if (err instanceof ZodError) {
            const data: object[] = handleZodError(err)

            return res.status(400).json({
                status: 400,
                meesage: 'Bad Request',
                data: data
            })
        }

        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}

const upload: RequestHandler = multer({ storage: fileStorage, fileFilter: fileFilter, limits: fileLimits }).single('image')

export const roomValidation = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    const { ...body } = req.body

    try {
        const data: object = {
            name: body.name,
            amount: body.amount
        }

        await schemaRooms.parseAsync(data)

        upload(req, res, (err: any): void | Response => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    status: 400,
                    message: err.message ?? 'Bad Request While Uploading Images'
                })
            } else if (err) {
                return res.status(500).json({
                    status: 500,
                    message: 'An error occurred while uploading the file'
                })
            }

            next()
        })
    } catch (err: any) {
        if (err instanceof ZodError) {
            const data: object[] = handleZodError(err)

            return res.status(400).json({
                status: 400,
                meesage: 'Bad Request',
                data: data
            })
        }

        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}