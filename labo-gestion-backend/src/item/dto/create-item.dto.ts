import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  Min,
  IsNumber,
} from 'class-validator';

export class CreateItemDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly internalRef?: string;

  @IsString()
  readonly supplierRef?: string;

  @IsNumber()
  @IsOptional()
  readonly price?: number;

  @IsInt()
  @Min(0)
  readonly quantity: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  readonly stockMax?: number;

  @IsBoolean()
  @IsOptional()
  readonly isP2?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  readonly lowStockThreshold?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  readonly supplierId?: number;
}
