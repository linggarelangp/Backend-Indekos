import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

import { UserToken } from '../database/types/users'

dotenv.config()

export const generateAccessToken = (data: UserToken): string => {
    const jwtsk: string = process.env.SECRET_ACCESS_TOKEN as string
    const generate: string = jwt.sign(data, jwtsk, { expiresIn: '1h' })

    return generate
}

export const generateRefreshToken = (data: UserToken): string => {
    const jwtsk: string = process.env.SECRET_ACCESS_TOKEN as string
    const generate: string = jwt.sign(data, jwtsk, { expiresIn: '12h' })

    return generate
}

export const verifyAccessToken = (token: string): UserToken | null => {
    const jwtsk: string = process.env.SECRET_ACCESS_TOKEN as string

    let verify: UserToken | null | undefined

    jwt.verify(token, jwtsk, (err: jwt.VerifyErrors | null, decode: string | jwt.JwtPayload | undefined): void => {
        if (err) {
            verify = undefined
        } else {
            verify = decode as UserToken | undefined
        }
    })

    return verify ?? null
}

export const verifyRefreshToken = (token: string): UserToken | null => {
    const jwtsk: string = process.env.SECRET_ACCESS_TOKEN as string

    let verify: UserToken | null | undefined

    jwt.verify(token, jwtsk, (err: jwt.VerifyErrors | null, decode: string | jwt.JwtPayload | undefined): void => {
        if (err) {
            verify = undefined
        } else {
            verify = decode as UserToken | undefined
        }
    })

    return verify ?? null
}