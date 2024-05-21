export interface Users {
    id: number
    roleId: number
    email: string
    name: string
    password: string
    status: boolean
    createdAt: Date
    updatedAt: Date
}

export interface AddUser {
    roleId: number
    email: string
    name: string
    password: string
    status: boolean
    createdAt: Date
    updatedAt: Date
}