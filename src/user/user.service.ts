import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { prismaErrors } from 'prisma/errors';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  private readonly userSelect = {
    id: true,
    email: true,
    name: true,
    createdAt: true,
    password: true,
  };

  private handlePrismaError(error: any): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const handler = prismaErrors.get(error.code);
      if (handler) throw handler();
      throw new BadRequestException(`Prisma error: ${error.message}`);
    }

    throw new BadRequestException(`Unexpected error: ${error.message}`);
  }

  async findAll() {
    try {
      return await this.prisma.user.findMany({ select: this.userSelect });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async createUser(data: CreateUserDto) {
    if (data.password.length < 6)
      throw new BadRequestException('Password is Required');

    const { password, ...restData } = data;

    const saltRounds = await this.config.get('SALT_ROUNDS', 12);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      return await this.prisma.user.create({
        data: { ...restData, password: hashedPassword },
        select: this.userSelect,
      });
    } catch (error) {
      this.handlePrismaError(error);
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

  getCartItems() {
    const data = { sosok: 'sosok', porn: 'papka s porno' };

    return data;
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
