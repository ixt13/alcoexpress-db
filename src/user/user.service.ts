import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
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

  private readonly saltRounds = 11;

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

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

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
    console.log(this.config.get<string>('DATABASE_URL'));
    return {
      Token: `Bearer ${await this.jwtService.signAsync(payload)}`,

      statusCode: 200,
    };
  }
}
