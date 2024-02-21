import express, { Router } from 'express'
import { AppRoutes } from './routes'

interface Options {
  port?: number,
  routes: Router
}

export class Server {
  public readonly app = express()
  public readonly port: number
  public readonly routes: Router

  constructor(options: Options) {
    const { port = 3000, routes } = options
    this.port = port
    this.routes = routes
  }

  async start() {
    this.app.use(express.json())
    this.app.use(this.routes)

    this.app.listen(this.port, () => {
      console.log(`server listening on port http://localhost:${this.port}`)
    })
  }
}