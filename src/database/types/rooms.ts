export interface Rooms {
    id: number
    name: string
    image: string
    amount: number
    price: number
    createdAt: Date
    updatedAt: Date
}

export interface AddRooms {
    name: string
    image: string
    amount: number
    price: number
    createdAt: Date
    updatedAt: Date
}