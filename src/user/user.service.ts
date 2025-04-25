import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prismaErrors } from 'prisma/errors';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly userSelect = {
    id: true,
    email: true,
    name: true,
    createdAt: true,
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

    try {
      return await this.prisma.user.create({
        data,
        select: this.userSelect,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
}
