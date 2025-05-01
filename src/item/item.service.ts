import { Injectable } from '@nestjs/common';
import { PrismaErrorService } from 'prisma/prismaError.service';
import { PrismaService } from 'src/prisma.service';
import { CreateItemDto } from './dto/createItem.dto';

@Injectable()
export class ItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly prismaErrorService: PrismaErrorService,
  ) {}

  async create(data: CreateItemDto) {
    try {
      const created = await this.prisma.item.create({ data: { ...data } });

      return created;
    } catch (error) {
      return this.prismaErrorService.handlePrismaError(error);
    }
  }

  async findAll() {
    try {
      const response = await this.prisma.item.findMany({});
      return response;
    } catch (error) {
      this.prismaErrorService.handlePrismaError(error);
    }
  }

  async findOne(id: string) {
    try {
      const response = await this.prisma.item.findUnique({
        where: { id: parseInt(id) },
      });
      return response;
    } catch (error) {
      this.prismaErrorService.handlePrismaError(error);
    }
  }

  update(id: number, updateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
