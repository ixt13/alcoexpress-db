import { IsNotEmpty } from 'class-validator';

export class AddtoCartDto {
  @IsNotEmpty()
  userId: number;
  @IsNotEmpty()
  itemId: number;
  @IsNotEmpty()
  quantity: number;
}
