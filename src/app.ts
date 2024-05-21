import express, { type Express, type Request, type Response } from 'express'
import * as dotenv from 'dotenv'
import router from './routes/router'

dotenv.config()

const app: Express = express()

const host: string = process.env.HOST_URL as string || 'localhost'
const port: number = Number(process.env.PORT_URL) || 3000

app.get('/', (req: Request, res: Response): void => {
    res.send('Indekos API is Running')
})

app.use(router)

app.listen(port, () => {
    console.log(`app running at http://${host}:${port}`)
})

export default app