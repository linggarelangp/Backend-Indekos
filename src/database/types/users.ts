export interface Users {
    id: number
    roleId: number
    email: string
    name: string
    password: string
    status: boolean
    accessToken: string | null
    refreshToken: string | null
    createdAt: Date
    updatedAt: Date
}

export interface AddUser {
    roleId: number
    email: string
    name: string
    password: string
    status: boolean
    accessToken: string | null
    refreshToken: string | null
    createdAt: Date
    updatedAt: Date
}

export interface GetUser {
    id: number
    roleId: number
    email: string
    name: string
    status: boolean
    createdAt: Date
    updatedAt: Date
}

export interface UserToken {
    id: number
    roleId: number
    name: string
    email: string
    status: boolean
    createdAt: Date
    updatedAt: Date
}

export interface VerifyUserToken extends UserToken {
    iat: number | null
    exp: number | null
}