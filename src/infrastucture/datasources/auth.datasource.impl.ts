import { BcryptAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { AuthDatasource, CustomError, RegisterUserDto, User } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { UserMapper } from "../mappers/user.mapper";

type HashFunction = (password: string) => string
type CompareFunction = (password: string, hashed: string) => boolean

export class AuthDataSourceImpl implements AuthDatasource {
  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare
  ) {

  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { name, email, password } = registerUserDto

    try {
      const emailExists = await UserModel.findOne({ email })

      if(emailExists) throw CustomError.badRequest('Email already exists')

      const user = await UserModel.create({
        name: name,
        email: email,
        password: this.hashPassword(password)
      })

      await user.save()

      return UserMapper.userEntityFromObject(user)
    } catch (error) {
      if(error instanceof CustomError) {
        throw error
      }

      throw CustomError.internalServer()
    } 

    throw new Error("Method not implemented.");
  }

  async login(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto

    try {
      const user = await UserModel.findOne({ email })

      if(!user) throw CustomError.badRequest('Email is not registered')

      const authorized = this.comparePassword(password, user.password)

      if(!authorized) throw CustomError.badRequest('Email or password are incorrect')

      return UserMapper.userEntityFromObject(user)
    } catch (error) {
      if(error instanceof CustomError) {
        throw error
      }

      throw CustomError.internalServer()
    }
  }
}