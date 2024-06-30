import { type Request, type Response } from 'express'
import { jwtDecode } from 'jwt-decode'

import { UserToken, VerifyUserToken } from '../database/types/users'
import { generateAccessToken, verifyRefreshToken } from '../utils/token'

export const checkingToken = async (req: Request, res: Response): Promise<Response> => res.status(200).json({ status: 200, message: 'OK' })

export const verify = async (req: Request, res: Response): Promise<Response> => {
    const token: string | null = req.body.token ?? null

    try {
        if (token === null) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            })
        }

        const verify: VerifyUserToken | null = jwtDecode(token)

        const refreshTokenExpired: number | null = verify?.exp ?? null

        if (verify === null || refreshTokenExpired === null) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            })
        }

        const data: VerifyUserToken = {
            id: verify.id,
            roleId: verify.roleId,
            email: verify.email,
            name: verify.name,
            status: verify.status,
            createdAt: verify.createdAt,
            updatedAt: verify.updatedAt,
            iat: verify.iat,
            exp: verify.exp
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

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
        const refreshToken: string = req.cookies?.xyzrt ?? null

        if (refreshToken === null) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            })
        }

        const verify: VerifyUserToken | null = verifyRefreshToken(refreshToken)

        if (verify === null) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            })
        }

        const data: UserToken = {
            id: verify.id,
            roleId: verify.roleId,
            email: verify.email,
            name: verify.name,
            status: verify.status,
            createdAt: verify.createdAt,
            updatedAt: verify.updatedAt
        }

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