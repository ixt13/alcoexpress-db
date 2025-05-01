import { IsNotEmpty } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  alcVol: number;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  photoUrl: string;
  @IsNotEmpty()
  category: string;
  @IsNotEmpty()
  volume: number;
  @IsNotEmpty()
  inStock: boolean;
  @IsNotEmpty()
  price: number;
}
