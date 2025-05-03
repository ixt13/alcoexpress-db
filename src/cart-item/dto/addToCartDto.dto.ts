import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddtoCartDto {
  @IsNotEmpty()
  @IsNumber()
  itemId: number;
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
