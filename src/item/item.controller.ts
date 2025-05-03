import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateItemDto } from './dto/createItem.dto';

import { UpdateItemDto } from './dto/updateItemDto.dto';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @Post('/create')
  async create(@Body() body: CreateItemDto) {
    const imageUrl = await this.itemService.uploadImage(body.photoUrl);

    if (!imageUrl) throw new ServiceUnavailableException('');

    body.photoUrl = imageUrl;

    return this.itemService.create(body);
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() body: UpdateItemDto) {
    return this.itemService.update(+id, body);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }
}
