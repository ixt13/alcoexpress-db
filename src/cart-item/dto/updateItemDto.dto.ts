import { IsNotEmpty } from 'class-validator';

export class UpdateCartItemDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  action: '+' | '-';
}
