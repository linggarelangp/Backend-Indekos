import bcrypt from 'bcrypt'

export const hashing = async (password: string): Promise<string> => {
    const hash = await bcrypt.hash(password, 10)

    return hash
}

export const compare = async (password: string, hash: string): Promise<boolean> => {
    const compare = await bcrypt.compare(password, hash)

    return compare
}