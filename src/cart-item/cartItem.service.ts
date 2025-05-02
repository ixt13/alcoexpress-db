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

  async addToCart(body: AddtoCartDto) {
    try {
      const cartItem = await this.prisma.cartItem.findUnique({
        where: {
          userId_itemId: {
            itemId: body.itemId,
            userId: body.userId,
          },
        },
      });

      if (cartItem) {
        const incrementQuantity = await this.prisma.cartItem.update({
          where: {
            userId_itemId: {
              itemId: body.itemId,
              userId: body.userId,
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
          userId: body.userId,
          quantity: 1,
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

  async update(data: UpdateCartItemDto) {
    try {
      const item = await this.prisma.cartItem.findUnique({
        where: { id: data.id },
      });

      if (!item) {
        throw new BadRequestException(`Item with id:${data.id} is not found`);
      }

      const response = await this.prisma.cartItem.update({
        where: { id: data.id },
        data: {},
      });
    } catch (error) {}
  }

  remove(id: number) {
    return `This action removes a #${id} cartItem`;
  }
}
