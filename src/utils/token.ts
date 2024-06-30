import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

import { UserToken, VerifyUserToken } from '../database/types/users'

dotenv.config()

export const generateAccessToken = (data: UserToken): string => {
    const jwtsk: string = process.env.SECRET_ACCESS_TOKEN as string
    const generate: string = jwt.sign(data, jwtsk, { expiresIn: '3h' })

    return generate
}

export const generateRefreshToken = (data: UserToken): string => {
    const jwtsk: string = process.env.SECRET_ACCESS_TOKEN as string
    const generate: string = jwt.sign(data, jwtsk, { expiresIn: '12h' })

    return generate
}

export const verifyAccessToken = (token: string): VerifyUserToken | null => {
    const jwtsk: string = process.env.SECRET_ACCESS_TOKEN as string

    let verify: VerifyUserToken | null | undefined

    jwt.verify(token, jwtsk, (err: jwt.VerifyErrors | null, decode: string | jwt.JwtPayload | undefined): void => {
        if (err) {
            verify = undefined
        } else {
            verify = decode as VerifyUserToken | undefined
        }
    })

    return verify ?? null
}

export const verifyRefreshToken = (token: string): VerifyUserToken | null => {
    const jwtsk: string = process.env.SECRET_ACCESS_TOKEN as string

    let verify: VerifyUserToken | null | undefined

    jwt.verify(token, jwtsk, (err: jwt.VerifyErrors | null, decode: string | jwt.JwtPayload | undefined): void => {
        if (err) {
            verify = undefined
        } else {
            verify = decode as VerifyUserToken | undefined
        }
    })

    return verify ?? null
}