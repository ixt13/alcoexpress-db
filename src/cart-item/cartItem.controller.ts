import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { CartItemService } from './cartItem.service';
import { AddtoCartDto } from './dto/addToCartDto.dto';
import { UpdateCartItemDto } from './dto/updateItemDto.dto';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() data: AddtoCartDto, @Req() req: Request) {
    const userId = req.user?.sub;

    return this.cartItemService.addToCart(data, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateCartItemDto) {
    return this.cartItemService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartItemService.remove(+id);
  }
}
