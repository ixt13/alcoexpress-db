import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsNumber()
  alcVol?: number;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  photoUrl?: string;
  @IsOptional()
  @IsString()
  category?: string;
  @IsOptional()
  @IsNumber()
  volume?: number;
  @IsOptional()
  @IsBoolean()
  inStock?: boolean;
  @IsOptional()
  @IsNumber()
  price?: number;
}
