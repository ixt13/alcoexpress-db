import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  alcVol: number;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsString()
  @IsNotEmpty()
  photoUrl: string;
  @IsNotEmpty()
  @IsString()
  category: string;
  @IsNotEmpty()
  @IsNumber()
  volume: number;
  @IsNotEmpty()
  @IsBoolean()
  inStock: boolean;
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
