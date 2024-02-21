import { Request, Response } from "express"
import { AuthRepository, CustomError, RegisterUserDto } from "../../domain"
import { JwtAdapter } from "../../config"
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto"

export class AuthController {
  constructor(
    private readonly authRepository: AuthRepository
  ) {

  }

  private handleError = (error: unknown, res: Response) => {
    if(error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    return res.status(500).json({ error: 'Internal Server Error'})
  }

  registerUser = async (req: Request, res: Response) => {
    const [ error, registerUserDto ] = RegisterUserDto.create(req.body)

    if(error) return res.status(400).json({ error })

    try {
      const user = await this.authRepository.register(registerUserDto!)
      res.json({ user, token: await JwtAdapter.generateToken({ user })}) 
    } catch (error) {
      this.handleError(error, res)
    }
  }

  loginUser = async (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body)

    if(error) return res.status(400).json({ error })

    try {
      const user = await this.authRepository.login(loginUserDto!)
      const jwt = await JwtAdapter.generateToken({ user })
      res.json({ user, token: jwt })
    } catch (error) {
      this.handleError(error, res)
    }
  }
}