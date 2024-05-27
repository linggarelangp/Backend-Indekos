import path from 'path'
import { type Request } from 'express'
import multer, { FileFilterCallback, MulterError } from 'multer'

type callback = (error: Error | null, destination: string) => void | null

export const fileStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, callback: callback): void | null => {
        callback(null, './src/assets/img')
    },

    filename: (req: Request, file: Express.Multer.File, callback: callback): void | null => {
        const roomImage = Date.now() + '-room-image' + path.extname(file.originalname)
        callback(null, roomImage)
    }
})

export const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
    try {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
            callback(null, true)
        else
            throw new MulterError('LIMIT_UNEXPECTED_FILE', 'Only extension .png, .jpg, .jpeg are Allowed')

    } catch (err: any) {
        callback(err, false)
    }

}

export const fileLimits = { fileSize: 3 * 1024 * 1024 } // Setting MAX file 2MB