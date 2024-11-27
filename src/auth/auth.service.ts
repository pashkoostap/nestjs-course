import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { ModelType } from 'typegoose';
import { UserModel } from './user.model';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser({ login, password }: AuthDto) {
    const salt = genSaltSync(10);
    const user = new this.userModel({
      email: login,
      passwordHash: hashSync(password, salt),
    });

    return user.save();
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email'>> {
    const user = await this.findUser(email);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const isPasswordCorrect = compareSync(password, user.passwordHash);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }

    return { email: user.email };
  }

  async login(email: string) {
    const payload = { email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
