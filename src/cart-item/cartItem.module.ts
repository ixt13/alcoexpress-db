import { Module } from '@nestjs/common';
import { PrismaErrorService } from 'prisma/prismaError.service';
import { PrismaService } from 'src/prisma.service';
import { CartItemController } from './cartItem.controller';
import { CartItemService } from './cartItem.service';

@Module({
  controllers: [CartItemController],
  providers: [CartItemService, PrismaService, PrismaErrorService],
})
export class CartItemModule {}
