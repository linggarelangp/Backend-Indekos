import { ZodError } from 'zod'

const handleZodError = (error: ZodError): object[] => {
    const data: object[] = error.issues.map((err: any) => {
        return { path: err.path.join('.'), message: err.message }
    })

    return data
}

export default handleZodError