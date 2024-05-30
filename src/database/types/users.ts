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
    roleId: number
    email: string
    name: string
    status: boolean
    createdAt: Date
    updatedAt: Date
}

export interface UserToken {
    id: number
    name: string
    email: string
    status: boolean
    createdAt: Date
    updatedAt: Date
}