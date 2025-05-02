import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaErrorService } from 'prisma/prismaError.service';
import { PrismaService } from 'src/prisma.service';
import { CreateItemDto } from './dto/createItem.dto';
import { UpdateItemDto } from './dto/updateItemDto.dto';

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

  async findOne(id: number) {
    try {
      const response = await this.prisma.item.findUnique({
        where: { id: id },
      });
      if (!response) throw new BadRequestException('Not found');
      return response;
    } catch (error) {
      this.prismaErrorService.handlePrismaError(error);
    }
  }

  async remove(id: number) {
    try {
      const response = await this.prisma.item.delete({ where: { id: id } });

      if (!response) throw new BadRequestException('err');

      return response;
    } catch (error) {
      this.prismaErrorService.handlePrismaError(error);
    }
  }

  async update(id: number, data: UpdateItemDto) {
    try {
      const item = await this.prisma.item.findUnique({
        where: { id: id },
      });

      if (!item)
        throw new BadRequestException(`Item with id:${id} doesn't exist `);

      const filteredData = this.removeUndefined(data);

      const response = await this.prisma.item.update({
        where: { id: id },
        data: {
          ...filteredData,
        },
      });

      return response;
    } catch (error) {
      this.prismaErrorService.handlePrismaError(error);
    }
  }

  private removeUndefined(obj: Record<string, any>) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== undefined),
    );
  }
}
