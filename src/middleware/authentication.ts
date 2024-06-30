import { type NextFunction, type Request, type Response } from 'express'
import { VerifyUserToken } from '../database/types/users'
import { verifyAccessToken } from '../utils/token'


export const authentication = (req: Request, res: Response, next: NextFunction): void | Response => {
    const authString: string | null = req.headers.authorization as string ?? null

    try {
        if (authString === null) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            })
        }

        const token: string | null = authString.split(' ')[1] ?? null

        if (token === null) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            })
        }

        const response: VerifyUserToken | null = verifyAccessToken(token)

        if (response === null) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            })
        }

        next()
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}