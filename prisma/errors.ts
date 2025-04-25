import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export const prismaErrors = new Map<string, any>([
  ['P2002', () => new ConflictException('This Email is Already Taken')],
  ['P2001', () => new NotFoundException('Record not found')],
  [
    'P2025',
    () => new NotFoundException('Record to update/delete does not exist'),
  ],
  ['P2003', () => new BadRequestException('Foreign key constraint failed')],
  ['P2010', () => new InternalServerErrorException('Raw query failed')],
]);
