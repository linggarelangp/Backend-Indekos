export interface Rooms {
    id: number
    name: string
    amount: number
    image: string
    createdAt: Date
    updatedAt: Date
}

export interface AddRooms {
    name: string
    amount: number
    image: string
    createdAt: Date
    updatedAt: Date
}