import { Module } from '@nestjs/common';
import { PrismaErrorService } from 'prisma/prismaError.service';
import { PrismaService } from 'src/prisma.service';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  controllers: [ItemController],
  providers: [ItemService, PrismaService, PrismaErrorService],
})
export class ItemModule {}
