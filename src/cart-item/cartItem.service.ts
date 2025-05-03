import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaErrorService } from 'prisma/prismaError.service';
import { PrismaService } from 'src/prisma.service';
import { AddtoCartDto } from './dto/addToCartDto.dto';
import { UpdateCartItemDto } from './dto/updateItemDto.dto';

@Injectable()
export class CartItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly prismaErrorService: PrismaErrorService,
  ) {}

  async addToCart(body: AddtoCartDto, userId) {
    try {
      const cartItem = await this.prisma.cartItem.findUnique({
        where: {
          userId_itemId: {
            itemId: userId,
            userId: userId,
          },
        },
      });

      if (cartItem) {
        const incrementQuantity = await this.prisma.cartItem.update({
          where: {
            userId_itemId: {
              itemId: body.itemId,
              userId: userId,
            },
          },
          data: {
            quantity: { increment: 1 },
          },
        });

        return incrementQuantity;
      }

      const addItemToCart = await this.prisma.cartItem.create({
        data: {
          itemId: body.itemId,
          userId: userId,
          quantity: body.quantity,
        },
      });

      return addItemToCart;
    } catch (error) {
      this.prismaErrorService.handlePrismaError(error);
    }
  }

  findAll() {
    return `This action returns all cartItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cartItem`;
  }

  async update(itemId: number, data: UpdateCartItemDto) {
    try {
      const item = await this.prisma.cartItem.findUnique({
        where: { id: itemId },
      });

      if (!item) {
        throw new BadRequestException(`Item with id:${itemId} is not found`);
      }

      const response = await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: data.quantity },
      });
      return response;
    } catch (error) {
      this.prismaErrorService.handlePrismaError(error);
    }
  }

  async remove(id: number) {
    try {
      const response = await this.prisma.cartItem.delete({ where: { id } });
      return response;
    } catch (error) {
      this.prismaErrorService.handlePrismaError(error);
    }
  }
}
