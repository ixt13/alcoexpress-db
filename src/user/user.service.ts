import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';

import { PrismaService } from 'src/prisma.service';

import { PrismaErrorService } from 'prisma/prismaError.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prismaErrorService: PrismaErrorService,
  ) {}

  private readonly userSelect = {
    id: true,
    email: true,
    name: true,
  };

  async findUser(request: Request) {
    console.log(request.user);

    const userId = request.user?.sub;
    try {
      return await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          cart: { include: { item: true } },
        },
      });
    } catch (error) {
      this.prismaErrorService.handlePrismaError(error);
    }
  }

  async createUser(data: CreateUserDto) {
    const { password, ...restData } = data;

    const saltRounds = +this.config.get<number>('SALT_ROUNDS', 12);
    console.log(typeof saltRounds);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      return await this.prisma.user.create({
        data: { ...restData, password: hashedPassword },
        select: this.userSelect,
      });
    } catch (error) {
      this.prismaErrorService.handlePrismaError(error);
    }
  }

  async userLogin(loginData: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginData.email,
      },
      select: { password: true, email: true, id: true },
    });

    if (!user) throw new BadRequestException('This Email is not regostered');

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password,
    );

    if (!isPasswordValid) throw new UnauthorizedException();
    const payload = { sub: user.id, username: user.email };

    const token = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
    });

    return {
      token: `Bearer ${token}`,
      refreshToken: `Bearer ${refreshToken}`,
      statusCode: 200,
    };
  }

  async getNewToken(request: Request) {
    const { cookies } = request;

    if (!cookies) throw new UnauthorizedException();

    const [type, refreshToken] = cookies.refreshToken.split(' ');

    if (type !== 'Bearer') throw new UnauthorizedException();

    const payload = this.jwtService.verify(refreshToken);

    if (!payload) throw new UnauthorizedException();

    const newToken = await this.jwtService.signAsync({
      sub: payload.sub,
      username: payload.username,
    });

    const newRefreshToken = await this.jwtService.signAsync(
      { sub: payload.sub, username: payload.username },
      {
        expiresIn: '30d',
      },
    );

    return {
      newToken: `Bearer ${newToken}`,
      newRefreshToken: `Bearer ${newRefreshToken}`,
    };
  }
}
