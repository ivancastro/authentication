import { AuthDatasource, AuthRepository, RegisterUserDto, User } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private readonly authDatasource: AuthDatasource
  ) {
    
  }
  login(loginUserDto: LoginUserDto): Promise<User> {
    return this.authDatasource.login(loginUserDto)
  }

  register(registerUserDto: RegisterUserDto): Promise<User> {
    return this.authDatasource.register(registerUserDto)
  }
}
