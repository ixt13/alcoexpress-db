import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaErrorService {
  private prismaErrors = new Map<string, any>([
    ['P2002', () => new ConflictException('This Value is Already Taken')],
    ['P2001', () => new NotFoundException('Record not found')],
    [
      'P2025',
      () => new NotFoundException('Record to update/delete does not exist'),
    ],
    ['P2003', () => new BadRequestException('Foreign key constraint failed')],
    ['P2010', () => new InternalServerErrorException('Raw query failed')],
  ]);

  handlePrismaError(error: any): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const handler = this.prismaErrors.get(error.code);
      if (handler) throw handler();
      throw new BadRequestException(`Prisma error: ${error.message}`);
    }
    throw new BadRequestException(`Unexpected error: ${error.message}`);
  }
}
